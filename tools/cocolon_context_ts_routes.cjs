#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const childProcess = require("child_process");

const root = path.resolve(__dirname, "..");
const payload = path.join(root, ".github", "context-payloads", "step3-ts-routes");
const encoded = Buffer.concat(fs.readdirSync(payload).filter(name => name.startsWith("part")).sort().map(name => fs.readFileSync(path.join(payload, name))));
const digest = value => crypto.createHash("sha256").update(value).digest("hex");
if (digest(encoded) !== "3d412d5f9b120b8ffa2a988c348e378dbf290744f3f17162136272772f1100cd") {
  throw new Error("Step 3 TypeScript route payload identity mismatch");
}
const compressed = Buffer.from(encoded.toString("ascii"), "base64");
if (digest(compressed) !== "8b29c3e816efe2ded73457cd6f393118262499f52daa17d5767a6326ae5b95a6") {
  throw new Error("Step 3 TypeScript route compressed identity mismatch");
}
const run = childProcess.spawnSync("xz", ["-dc"], { input: compressed, maxBuffer: 16 * 1024 * 1024 });
if (run.status !== 0) throw new Error(`xz failed: ${String(run.stderr)}`);
const source = run.stdout;
if (digest(source) !== "be848dc46ce77e04a6c4e7acbd5dbf6b39337f037daf3f6880f8fc534ce519a4") {
  throw new Error("Step 3 TypeScript route source identity mismatch");
}
const sourceText = source.toString("utf8").replace(/^#![^\n]*(?:\n|$)/, "");
new Function("require", "module", "exports", "__filename", "__dirname", sourceText)(
  require, module, exports, path.join(payload, "cocolon_context_ts_routes.cjs"), payload
);
