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
if (digest(encoded) !== "ed2ae92db0a6ccc2a3c08572c9c3c425cc234cda0192c041e8e1a75276b7f4e1") {
  throw new Error("Step 3 TypeScript route payload identity mismatch");
}
const compressed = Buffer.from(encoded.toString("ascii"), "base64");
if (digest(compressed) !== "636e803bdf1f272735838512e60a2946f70260310e3223fc6f987367cdb906c8") {
  throw new Error("Step 3 TypeScript route compressed identity mismatch");
}
const run = childProcess.spawnSync("xz", ["-dc"], { input: compressed, maxBuffer: 16 * 1024 * 1024 });
if (run.status !== 0) throw new Error(`xz failed: ${String(run.stderr)}`);
const source = run.stdout;
if (digest(source) !== "7f5b9760ead2ef731de3a6aa8091d35ab14826838fef5fb42686d63c5ef637eb") {
  throw new Error("Step 3 TypeScript route source identity mismatch");
}
const sourceText = source.toString("utf8").replace(/^#![^\n]*(?:\n|$)/, "");
new Function("require", "module", "exports", "__filename", "__dirname", sourceText)(
  require, module, exports, path.join(payload, "cocolon_context_ts_routes.cjs"), payload
);
