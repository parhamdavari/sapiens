#!/usr/bin/env node
// Rebuilds the banner and social-preview images from assets/src/*.html.
//
// The mark itself (assets/src/mark-source.png) is a hand-generated raster, not vector,
// so it is checked in rather than built. Everything laid out around it — the wordmark,
// the tagline, the spacing — is HTML and CSS, so it stays editable and the type stays
// crisp. Fonts are vendored in assets/src/ so a rebuild is reproducible.
//
//   npm i -D playwright && node scripts/render-assets.mjs
import { chromium } from "playwright";
import { resolve } from "node:path";

const pages = [
  ["assets/src/social.html", "assets/social-preview.png", 1280, 640],
];

const browser = await chromium.launch();
for (const [src, out, width, height] of pages) {
  const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 2 });
  await page.goto("file://" + resolve(src));
  await page.waitForTimeout(400);
  await page.screenshot({ path: out, clip: { x: 0, y: 0, width, height } });
  await page.close();
  console.log("rendered " + out);
}
await browser.close();
