#!/usr/bin/env node
// Validates skills/* against the Agent Skills specification.
// https://agentskills.io/specification.md
//
// Checks every documented constraint, plus the two "recommended" budgets, which are
// reported as warnings rather than failures.

import { readFileSync, readdirSync, existsSync, statSync } from "node:fs";
import { join } from "node:path";

const SKILLS_DIR = "skills";
const ALLOWED_KEYS = new Set([
  "name", "description", "license", "compatibility", "metadata", "allowed-tools",
]);
const NAME_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const MAX_NAME = 64;
const MAX_DESCRIPTION = 1024;
const MAX_COMPATIBILITY = 500;
const REC_MAX_LINES = 500;
const REC_MAX_TOKENS = 5000;

const c = {
  red: (s) => `\x1b[31m${s}\x1b[0m`,
  green: (s) => `\x1b[32m${s}\x1b[0m`,
  yellow: (s) => `\x1b[33m${s}\x1b[0m`,
  dim: (s) => `\x1b[2m${s}\x1b[0m`,
  bold: (s) => `\x1b[1m${s}\x1b[0m`,
};

let errors = 0;
let warnings = 0;
const fail = (m) => { console.log(`  ${c.red("✗")} ${m}`); errors++; };
const warn = (m) => { console.log(`  ${c.yellow("!")} ${m}`); warnings++; };
const pass = (m) => console.log(`  ${c.green("✓")} ${m}`);

// Minimal frontmatter reader. The spec only needs top-level scalars plus a nested
// `metadata` map, so a full YAML parser would be a dependency we don't need.
function parseFrontmatter(text) {
  if (!text.startsWith("---\n")) return null;
  const end = text.indexOf("\n---", 3);
  if (end === -1) return null;
  const block = text.slice(4, end);
  const body = text.slice(end + 4);
  const keys = [];
  const values = {};
  for (const line of block.split("\n")) {
    const m = /^([A-Za-z][\w-]*):\s?(.*)$/.exec(line);
    if (m) { keys.push(m[1]); values[m[1]] = m[2].trim(); }
  }
  return { keys, values, body, raw: block };
}

// Rough token estimate. Good enough to catch a SKILL.md drifting well past the budget;
// not a substitute for a real tokenizer.
const estimateTokens = (s) => Math.round(s.length / 4);

function validateSkill(dir) {
  const name = dir.split("/").pop();
  console.log(`\n${c.bold(dir)}`);

  const skillPath = join(dir, "SKILL.md");
  if (!existsSync(skillPath)) return fail("SKILL.md is missing");

  const text = readFileSync(skillPath, "utf8");
  const fm = parseFrontmatter(text);
  if (!fm) return fail("no YAML frontmatter found (file must start with ---)");

  // name
  const declared = fm.values.name;
  if (!declared) fail("`name` is required");
  else if (declared.length > MAX_NAME) fail(`\`name\` is ${declared.length} chars (max ${MAX_NAME})`);
  else if (!NAME_RE.test(declared)) fail(`\`name\` "${declared}" must be lowercase alphanumeric with single hyphens, not leading or trailing`);
  else if (declared !== name) fail(`\`name\` is "${declared}" but the directory is "${name}" — they must match`);
  else pass(`name: ${declared}`);

  // description
  const desc = fm.values.description;
  if (!desc) fail("`description` is required");
  else if (desc.length > MAX_DESCRIPTION) fail(`\`description\` is ${desc.length} chars (max ${MAX_DESCRIPTION})`);
  else {
    pass(`description: ${desc.length}/${MAX_DESCRIPTION} chars`);
    if (desc.length > MAX_DESCRIPTION * 0.97) warn("description is within 3% of the limit — little room to add trigger phrases");
  }

  // compatibility
  const compat = fm.values.compatibility;
  if (compat && compat.length > MAX_COMPATIBILITY) fail(`\`compatibility\` is ${compat.length} chars (max ${MAX_COMPATIBILITY})`);

  // unknown keys
  const unknown = fm.keys.filter((k) => !ALLOWED_KEYS.has(k));
  if (unknown.length) fail(`unknown frontmatter key(s): ${unknown.join(", ")} — allowed: ${[...ALLOWED_KEYS].join(", ")}`);
  else pass(`frontmatter keys: ${fm.keys.join(", ")}`);

  // recommended budgets
  const lines = text.split("\n").length;
  if (lines > REC_MAX_LINES) warn(`SKILL.md is ${lines} lines (spec recommends under ${REC_MAX_LINES})`);
  else pass(`length: ${lines}/${REC_MAX_LINES} lines`);

  const tokens = estimateTokens(fm.body);
  if (tokens > REC_MAX_TOKENS) warn(`body is ~${tokens} tokens (spec recommends under ${REC_MAX_TOKENS}) — move lookup material into references/`);
  else pass(`body: ~${tokens}/${REC_MAX_TOKENS} tokens`);

  // referenced files must exist
  const refs = [...fm.body.matchAll(/`((?:references|scripts|assets)\/[\w./-]+)`/g)].map((m) => m[1]);
  const missing = [...new Set(refs)].filter((r) => !existsSync(join(dir, r)));
  if (missing.length) fail(`referenced file(s) not found: ${missing.join(", ")}`);
  else if (refs.length) pass(`${new Set(refs).size} referenced file(s) present`);
}

console.log(c.bold("\nAgent Skills specification check"));
console.log(c.dim("https://agentskills.io/specification.md"));

if (!existsSync(SKILLS_DIR)) {
  console.log(c.red(`\n${SKILLS_DIR}/ not found. Run this from the repo root.\n`));
  process.exit(1);
}

const dirs = readdirSync(SKILLS_DIR)
  .map((d) => join(SKILLS_DIR, d))
  .filter((d) => statSync(d).isDirectory());

if (!dirs.length) {
  console.log(c.red(`\nno skills found in ${SKILLS_DIR}/\n`));
  process.exit(1);
}

dirs.forEach(validateSkill);

console.log("");
if (errors) {
  console.log(c.red(`${errors} error(s)`) + (warnings ? c.yellow(`, ${warnings} warning(s)`) : ""));
  console.log("");
  process.exit(1);
}
console.log(c.green("valid") + (warnings ? c.yellow(` — ${warnings} warning(s)`) : "") + "\n");
