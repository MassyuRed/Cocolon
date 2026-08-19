#!/usr/bin/env bash
set -euo pipefail
npm install -g --no-audit --no-fund \
  @sourcegraph/scip-typescript@0.4.0 \
  @sourcegraph/scip-python@0.6.6 \
  typescript@5.2.2
export NODE_PATH="$(npm root -g)"
curl --retry 3 --retry-all-errors -fsSL \
  https://github.com/scip-code/scip/releases/download/v0.7.1/scip-linux-amd64.tar.gz \
  -o /tmp/scip.tar.gz
rm -rf /tmp/scip-bin
mkdir /tmp/scip-bin
tar -xzf /tmp/scip.tar.gz -C /tmp/scip-bin
SCIP_BIN="$(find /tmp/scip-bin -type f -name scip -print -quit)"
test -n "$SCIP_BIN"
sudo install "$SCIP_BIN" /usr/local/bin/scip
