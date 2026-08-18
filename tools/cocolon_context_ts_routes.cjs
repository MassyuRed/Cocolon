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
if (digest(encoded) !== "50c90cfacf3c765c69987d5c8dc04b1c4a9b5e9a161cb0bcef8692a0f93a71d9") {
  throw new Error("Step 3 TypeScript route payload identity mismatch");
}
const compressed = Buffer.from(encoded.toString("ascii"), "base64");
if (digest(compressed) !== "f718b0a9aa4535376e6aeff5bb64500ab1484322e0a2925b1b163d1e6b51079d") {
  throw new Error("Step 3 TypeScript route compressed identity mismatch");
}
const run = childProcess.spawnSync("xz", ["-dc"], { input: compressed, maxBuffer: 16 * 1024 * 1024 });
if (run.status !== 0) throw new Error(`xz failed: ${String(run.stderr)}`);
const source = run.stdout;
if (digest(source) !== "46493b8a988713fd7cf07e601de59d4a087f6094fa6149e06dcc5dc1a32015f4") {
  throw new Error("Step 3 TypeScript route source identity mismatch");
}
new Function("require", "module", "exports", "__filename", "__dirname", source.toString("utf8"))(
  require, module, exports, path.join(payload, "cocolon_context_ts_routes.cjs"), payload
);
