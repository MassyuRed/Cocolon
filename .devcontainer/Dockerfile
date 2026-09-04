FROM --platform=linux/amd64 python:3.11.16-slim-bookworm@sha256:b1add8a6f2aca6bcfcf0b9c9b522352f7ce0d62a3d556a2f2f32511aa0cca250

ARG NODE_VERSION=20.20.2
ARG NODE_ARCHIVE_SHA256=df770b2a6f130ed8627c9782c988fda9669fa23898329a61a871e32f965e007d
ARG SCIP_VERSION=v0.7.1
ARG SCIP_ARCHIVE_SHA256=7bb1a566787478641a13bd9c93c2f571337556c76d659206f2225dc7d71a648b
ARG DEBIAN_SNAPSHOT=20260822T000000Z

RUN rm -f /etc/apt/sources.list.d/debian.sources \
    && printf '%s\n' \
        "deb [check-valid-until=no] https://snapshot.debian.org/archive/debian/${DEBIAN_SNAPSHOT}/ bookworm main" \
        "deb [check-valid-until=no] https://snapshot.debian.org/archive/debian/${DEBIAN_SNAPSHOT}/ bookworm-updates main" \
        "deb [check-valid-until=no] https://snapshot.debian.org/archive/debian-security/${DEBIAN_SNAPSHOT}/ bookworm-security main" \
        > /etc/apt/sources.list \
    && apt-get update \
    && apt-get install -y --no-install-recommends \
        bash \
        ca-certificates \
        curl \
        git \
        xz-utils \
    && rm -rf /var/lib/apt/lists/*

SHELL ["/bin/bash", "-o", "pipefail", "-c"]

RUN curl --fail --location --silent --show-error \
        "https://nodejs.org/dist/v${NODE_VERSION}/node-v${NODE_VERSION}-linux-x64.tar.xz" \
        --output /tmp/node.tar.xz \
    && printf '%s  %s\n' "${NODE_ARCHIVE_SHA256}" /tmp/node.tar.xz | sha256sum --check --strict \
    && mkdir -p /opt/node \
    && tar --extract --xz --file /tmp/node.tar.xz --directory /opt/node \
        --strip-components 1 --no-same-owner \
    && rm /tmp/node.tar.xz

RUN curl --fail --location --silent --show-error \
        "https://github.com/scip-code/scip/releases/download/${SCIP_VERSION}/scip-linux-amd64.tar.gz" \
        --output /tmp/scip.tar.gz \
    && printf '%s  %s\n' "${SCIP_ARCHIVE_SHA256}" /tmp/scip.tar.gz | sha256sum --check --strict \
    && mkdir -p /tmp/scip-extract \
    && tar --extract --gzip --file /tmp/scip.tar.gz --directory /tmp/scip-extract \
        --no-same-owner scip \
    && install --mode 0755 /tmp/scip-extract/scip /usr/local/bin/scip \
    && rm -r /tmp/scip-extract /tmp/scip.tar.gz

ENV PATH="/opt/cocolon-system-context-node/node_modules/.bin:/opt/node/bin:${PATH}" \
    NODE_PATH="/opt/cocolon-system-context-node/node_modules" \
    PYTHONDONTWRITEBYTECODE="1" \
    PYTHONUNBUFFERED="1"

WORKDIR /opt/cocolon-system-context-node
COPY system-context-node/package.json system-context-node/package-lock.json ./
RUN npm ci --omit=dev --ignore-scripts --no-audit --no-fund

WORKDIR /opt/cocolon-system-context-toolchain
COPY system-context-python.lock system-context-toolchain.lock.json ./
RUN python -m pip install --no-cache-dir --only-binary=:all: --require-hashes \
        --requirement system-context-python.lock

RUN python -c 'import hashlib, json, pathlib; root = pathlib.Path("/opt/cocolon-system-context-toolchain"); spec = json.loads((root / "system-context-toolchain.lock.json").read_text(encoding="utf-8")); pairs = ((root / "system-context-python.lock", spec["python"]["test_lock"]["sha256"]), (pathlib.Path("/opt/cocolon-system-context-node/package-lock.json"), spec["npm_toolchain"]["lock"]["sha256"])); assert all(hashlib.sha256(path.read_bytes()).hexdigest() == expected for path, expected in pairs), "toolchain lock file hash mismatch"' \
    && test "$(python -c 'import platform; print(platform.python_version())')" = "3.11.16" \
    && test "$(node --version)" = "v20.20.2" \
    && test "$(npm --version)" = "10.8.2" \
    && test "$(node -p 'require("typescript/package.json").version')" = "5.2.2" \
    && test "$(node -p 'require("/opt/cocolon-system-context-node/node_modules/@sourcegraph/scip-typescript/node_modules/typescript/package.json").version')" = "5.9.3" \
    && test "$(scip --version)" = "scip version v0.7.1" \
    && test "$(scip-typescript --version)" = "0.4.0" \
    && test "$(scip-python --version)" = "0.6.6" \
    && test "$(python -m pytest --version)" = "pytest 8.4.2" \
    && command -v bash git xz >/dev/null

WORKDIR /workspace
CMD ["bash"]
