#!/usr/bin/env node
// Generates benchmark replies by driving the Claude CLI in headless mode.
//
//   node benchmarks/generate.mjs <scenario> <arm> <run>
//   node benchmarks/generate.mjs pr-orientation sapiens 1
//
// <scenario>  a name from benchmarks/scenarios/, without .md
// <arm>       sapiens (skill text appended to the system prompt) or baseline
// <run>       run number, recorded in the output
//
// Output lands in benchmarks/runs/, one file per reply, with metadata in
// frontmatter: model, skill version, date, arm, run. benchmarks/results/ is
// frozen evidence and is never written by this script.
//
// The sapiens arm appends the full SKILL.md to the system prompt and states
// that the mode is active. That is what "skill loaded" means operationally,
// and it does not depend on skills-directory discovery in headless mode.

// Batch modes:
//   node benchmarks/generate.mjs --all 3    every scenario, both arms, runs 1..3
//                                           (files that already exist are kept,
//                                           so an interrupted batch resumes)
//   node benchmarks/generate.mjs --score    score everything in benchmarks/runs/

import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { join } from "node:path";
import { analyse } from "../scripts/measure.mjs";
import { recall } from "../scripts/lib/recall.mjs";

const argv = process.argv.slice(2);
const SCENARIOS = ["pr-review", "ci-triage", "pr-orientation"];

if (argv[0] === "--score") {
  const files = readdirSync("benchmarks/runs").filter((f) => f.endsWith(".md")).sort();
  const pad = (s, n) => String(s).padEnd(n);
  const num = (s, n) => String(s).padStart(n);
  console.log(
    pad("run", 44) + num("words", 7) + num("grade", 7) + num(">25w", 6) +
    num("off-list%", 11) + num("idioms", 8) + num("recall", 8)
  );
  console.log("-".repeat(91));
  for (const f of files) {
    const raw = readFileSync(join("benchmarks/runs", f), "utf8");
    const scenario = (raw.match(/^scenario: (\S+)$/m) || [])[1];
    const m = analyse(raw);
    const r = recall(join("benchmarks/scenarios", scenario + ".md"), raw);
    console.log(
      pad(f.replace(/\.md$/, ""), 44) + num(m.words, 7) + num(m.grade.toFixed(1), 7) +
      num(m.longSentences, 6) + num(m.offListShare, 11) + num(m.idioms, 8) +
      num(`${r.found}/${r.total}`, 8)
    );
    if (r.missing.length) console.log(`  missing: ${r.missing.join(", ")}`);
  }
  process.exit(0);
}

if (argv[0] === "--all") {
  const runs = Number(argv[1] ?? 3);
  for (const sc of SCENARIOS) {
    for (const a of ["baseline", "sapiens"]) {
      for (let r = 1; r <= runs; r++) {
        const stamp = new Date().toISOString().slice(0, 10);
        const file = join("benchmarks/runs", `${stamp}--${sc}--${a}--r${r}.md`);
        if (existsSync(file)) { console.log(`skip ${file} (exists)`); continue; }
        execFileSync("node", ["benchmarks/generate.mjs", sc, a, String(r)], {
          stdio: "inherit",
          timeout: 15 * 60 * 1000,
        });
      }
    }
  }
  process.exit(0);
}

const [scenario, arm, runArg] = argv;
const run = Number(runArg);
if (!scenario || !["sapiens", "baseline"].includes(arm) || !Number.isInteger(run)) {
  console.error("usage: node benchmarks/generate.mjs <scenario> <sapiens|baseline> <run>");
  console.error("       node benchmarks/generate.mjs --all [runs]");
  console.error("       node benchmarks/generate.mjs --score");
  process.exit(1);
}

const scenarioPath = join("benchmarks/scenarios", scenario + ".md");
if (!existsSync(scenarioPath)) {
  console.error(`${scenarioPath} not found. Run from the repo root.`);
  process.exit(1);
}
const fixture = readFileSync(scenarioPath, "utf8");
const skill = readFileSync("skills/sapiens/SKILL.md", "utf8");
const skillVersion = (skill.match(/^\s*version:\s*(\S+)/m) || [])[1] || "unknown";

const question = (fixture.match(/^>\s*(.+)$/m) || [])[1] || "(question not found)";
// The whole fixture is the context, minus the findings checklist: leaking the
// scoring key into the prompt would make every recall number worthless.
const facts = fixture.split(/^## Findings checklist$/m)[0].trim();
if (/checklist/i.test(facts)) {
  console.error("refusing to run: checklist text leaked into the prompt");
  process.exit(1);
}

const prompt = [
  "You are an AI coding assistant in a working session. The research phase is",
  "already complete. The facts below were gathered by tools and are all you know.",
  "Do not invent detail beyond them. Answer the user's question as you would in",
  "the session, as a chat reply. Do not use tools.",
  "",
  "=== GATHERED FACTS ===",
  facts,
  "=== END FACTS ===",
  "",
  `The user asks: ${question}`,
].join("\n");

const cliArgs = ["-p", "--output-format", "json", "--max-turns", "1"];
if (arm === "sapiens") {
  cliArgs.push(
    "--append-system-prompt",
    skill + "\n\nSapiens mode is active for this conversation, at the dev level."
  );
}

const started = new Date().toISOString();
const out = execFileSync("claude", cliArgs, {
  input: prompt,
  encoding: "utf8",
  maxBuffer: 16 * 1024 * 1024,
  timeout: 10 * 60 * 1000,
});
const json = JSON.parse(out);
const reply = json.result ?? "";
const model =
  json.modelUsage ? Object.keys(json.modelUsage).join("+") : json.model ?? "unknown";

mkdirSync("benchmarks/runs", { recursive: true });
const stamp = started.slice(0, 10);
const file = join("benchmarks/runs", `${stamp}--${scenario}--${arm}--r${run}.md`);
writeFileSync(
  file,
  [
    "---",
    `scenario: ${scenario}`,
    `arm: ${arm}`,
    `run: ${run}`,
    `model: ${model}`,
    `skill_version: ${arm === "sapiens" ? skillVersion : "n/a"}`,
    `generated: ${started}`,
    `generator: benchmarks/generate.mjs`,
    "---",
    "",
    reply.trim(),
    "",
  ].join("\n")
);
console.log(`${file}  (${reply.trim().split(/\s+/).length} words, model ${model})`);
