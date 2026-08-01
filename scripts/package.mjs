#!/usr/bin/env node
// Builds dist/sapiens.skill — a zip archive of skills/sapiens/, which is the
// distributable form accepted by claude.ai and unzippable into ~/.claude/skills/.
import { execSync } from "node:child_process";
import { mkdirSync, rmSync, existsSync } from "node:fs";

const SKILL = "sapiens";
if (!existsSync(`skills/${SKILL}/SKILL.md`)) {
  console.error("run this from the repo root");
  process.exit(1);
}
rmSync("dist", { recursive: true, force: true });
mkdirSync("dist", { recursive: true });
execSync(`cd skills && zip -qr ../dist/${SKILL}.skill ${SKILL} -x '*.DS_Store'`, { stdio: "inherit" });
console.log(`built dist/${SKILL}.skill`);
