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

import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { join } from "node:path";

const [scenario, arm, runArg] = process.argv.slice(2);
const run = Number(runArg);
if (!scenario || !["sapiens", "baseline"].includes(arm) || !Number.isInteger(run)) {
  console.error("usage: node benchmarks/generate.mjs <scenario> <sapiens|baseline> <run>");
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
const facts = fixture.slice(fixture.indexOf("## Raw facts"));

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
