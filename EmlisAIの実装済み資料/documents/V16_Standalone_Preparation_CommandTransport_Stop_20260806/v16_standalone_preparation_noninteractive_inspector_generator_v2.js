'use strict';

const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');

const SOURCE_REL = 'EmlisAIの実装済み資料/documents/V16_PublicGate_LocalEvidence_Preservation_20260805/artifacts/v16_public_gate_execution_continuation_carrier_v3_t06_sanitized_shape_extractor_v2.js';
const TARGET_REL = 'EmlisAIの実装済み資料/documents/V16_PublicGate_LocalEvidence_Preservation_20260805/artifacts/v16_public_gate_execution_continuation_carrier_v3_t06_sanitized_shape_extractor_v3.js';
const SOURCE_BYTES = 41972;
const SOURCE_LF = 1339;
const SOURCE_BLOB = '69ca116c3bc8c618792f3da9bd72686a4759fd8d';
const SOURCE_SHA256 = '0d2dcffe2d55c08e97dfcf588e8a13b6b26f8e5c337ee549e3ffcf41c300dcca';
const OLD_BASENAME = 'v16_public_gate_execution_continuation_carrier_v3_t06_sanitized_shape_extractor_v2.js';
const NEW_BASENAME = 'v16_public_gate_execution_continuation_carrier_v3_t06_sanitized_shape_extractor_v3.js';
const MAX_OUTPUT = 131072;
const ERROR_CODES = new Set([
  'S1_ARGS', 'S1_ROOT', 'S1_SOURCE_PARENT', 'S1_TARGET_PARENT',
  'S1_LSTAT', 'S1_TYPE_MODE_SIZE', 'S1_REALPATH',
  'S2_OPEN', 'S2_FSTAT', 'S2_RACE', 'S2_FSTAT_CLOSE', 'S2_RACE_CLOSE',
  'S3_READ', 'S3_READ_CLOSE', 'S4_EOF', 'S4_EOF_CLOSE', 'S5_CLOSE',
  'S6_SOURCE_IDENTITY', 'S6_SOURCE_ENCODING', 'S6_JS_LEX',
  'S6_C01', 'S6_C02', 'S6_C03', 'S6_C04',
  'S6_CARDINALITY', 'S6_NONOVERLAP', 'S6_OUTSIDE',
  'S6_TARGET', 'S6_CANONICAL', 'S6_OUTPUT_LIMIT',
  'S6_OUTPUT_STOP', 'S6_INTERNAL'
]);

function stop(code) {
  throw { v16Stop: code };
}

function codeOf(error) {
  if (error && typeof error === 'object' && ERROR_CODES.has(error.v16Stop)) {
    return error.v16Stop;
  }
  return 'S6_INTERNAL';
}

function digest(name, buffer) {
  return crypto.createHash(name).update(buffer).digest('hex');
}

function sha256(buffer) {
  return digest('sha256', buffer);
}

function gitBlob(buffer) {
  return digest('sha1', Buffer.concat([
    Buffer.from('blob ' + String(buffer.length) + '\0', 'ascii'),
    buffer
  ]));
}

function metrics(buffer) {
  let lf = 0;
  let cr = 0;
  for (const byte of buffer) {
    if (byte === 10) lf += 1;
    if (byte === 13) cr += 1;
  }
  return {
    bytes: buffer.length,
    lf,
    cr,
    final_lf: buffer.length > 0 && buffer[buffer.length - 1] === 10,
    git_blob: gitBlob(buffer),
    sha256: sha256(buffer)
  };
}

function safeRelative(value) {
  return typeof value === 'string' && value.length > 0 &&
    !path.posix.isAbsolute(value) && !path.win32.isAbsolute(value) &&
    path.posix.normalize(value) === value && !value.includes('\\') &&
    !/[\r\n\0]/.test(value) &&
    value.split('/').every((part) => part !== '' && part !== '.' && part !== '..');
}

function underRoot(root, relative) {
  if (!safeRelative(relative)) stop('S1_ROOT');
  const absolute = path.join(root, ...relative.split('/'));
  const back = path.relative(root, absolute).split(path.sep).join('/');
  if (back !== relative) stop('S1_ROOT');
  return absolute;
}

function attestDirectory(absolute, errorCode, io) {
  let stat;
  let direct;
  try {
    stat = io.lstatSync(absolute);
    direct = io.realpathSync.native(absolute);
  } catch (_error) {
    stop(errorCode);
  }
  if (!stat.isDirectory() || stat.isSymbolicLink() || direct !== absolute) {
    stop(errorCode);
  }
}

function attestParents(root, absolute, errorCode, io) {
  const relative = path.relative(root, absolute);
  if (relative === '' || relative.startsWith('..' + path.sep) || path.isAbsolute(relative)) {
    stop(errorCode);
  }
  const parts = relative.split(path.sep);
  let current = root;
  for (let index = 0; index < parts.length; index += 1) {
    current = path.join(current, parts[index]);
    attestDirectory(current, errorCode, io);
  }
}

function deriveRuntime(argv, io) {
  if (!Array.isArray(argv) || argv.length !== 3) stop('S1_ARGS');
  const root = argv[2];
  if (typeof root !== 'string' || !path.isAbsolute(root) ||
      path.normalize(root) !== root || root === path.parse(root).root ||
      root.endsWith(path.sep)) {
    stop('S1_ARGS');
  }
  attestDirectory(root, 'S1_ROOT', io);
  const source = underRoot(root, SOURCE_REL);
  const target = underRoot(root, TARGET_REL);
  attestParents(root, path.dirname(source), 'S1_SOURCE_PARENT', io);
  attestParents(root, path.dirname(target), 'S1_TARGET_PARENT', io);
  return Object.freeze({ root, source, target, target_relative: TARGET_REL });
}

function readExactSource(input, io) {
  let before;
  try {
    before = io.lstatSync(input);
  } catch (_error) {
    stop('S1_LSTAT');
  }
  if (!before.isFile() || before.isSymbolicLink() ||
      (before.mode & 0o777) !== 0o644 || before.size !== SOURCE_BYTES) {
    stop('S1_TYPE_MODE_SIZE');
  }
  let direct;
  try {
    direct = io.realpathSync.native(input);
  } catch (_error) {
    stop('S1_REALPATH');
  }
  if (direct !== input) stop('S1_REALPATH');

  let fd = -1;
  let primary = null;
  let buffer = null;
  try {
    try {
      fd = io.openSync(
        input,
        io.constants.O_RDONLY | io.constants.O_NOFOLLOW | io.constants.O_NONBLOCK
      );
    } catch (_error) {
      stop('S2_OPEN');
    }
    let after;
    try {
      after = io.fstatSync(fd);
    } catch (_error) {
      stop('S2_FSTAT');
    }
    if (!after.isFile() || (after.mode & 0o777) !== 0o644 ||
        after.size !== SOURCE_BYTES) {
      stop('S2_FSTAT');
    }
    if (after.dev !== before.dev || after.ino !== before.ino) stop('S2_RACE');
    buffer = Buffer.alloc(SOURCE_BYTES);
    let amount;
    try {
      amount = io.readSync(fd, buffer, 0, buffer.length, 0);
    } catch (_error) {
      stop('S3_READ');
    }
    if (amount !== buffer.length) stop('S3_READ');
    let eof;
    try {
      eof = io.readSync(fd, Buffer.alloc(1), 0, 1, buffer.length);
    } catch (_error) {
      stop('S4_EOF');
    }
    if (eof !== 0) stop('S4_EOF');
  } catch (error) {
    primary = codeOf(error);
  }
  if (fd >= 0) {
    try {
      io.closeSync(fd);
    } catch (_error) {
      const map = {
        S2_FSTAT: 'S2_FSTAT_CLOSE',
        S2_RACE: 'S2_RACE_CLOSE',
        S3_READ: 'S3_READ_CLOSE',
        S4_EOF: 'S4_EOF_CLOSE'
      };
      primary = primary === null ? 'S5_CLOSE' : (map[primary] || 'S5_CLOSE');
    }
  }
  if (primary !== null) stop(primary);
  return buffer;
}

function requireSourceIdentity(buffer) {
  const m = metrics(buffer);
  if (m.bytes !== SOURCE_BYTES || m.lf !== SOURCE_LF || m.cr !== 0 ||
      !m.final_lf || m.git_blob !== SOURCE_BLOB || m.sha256 !== SOURCE_SHA256) {
    stop('S6_SOURCE_IDENTITY');
  }
  const text = buffer.toString('utf8');
  if (!Buffer.from(text, 'utf8').equals(buffer)) stop('S6_SOURCE_ENCODING');
  for (const byte of buffer) {
    if (byte > 0x7f) stop('S6_SOURCE_ENCODING');
  }
  return text;
}

function countBuffer(haystack, needle) {
  if (!Buffer.isBuffer(haystack) || !Buffer.isBuffer(needle) || needle.length === 0) {
    return 0;
  }
  let count = 0;
  let at = 0;
  for (;;) {
    const found = haystack.indexOf(needle, at);
    if (found < 0) return count;
    count += 1;
    at = found + 1;
  }
}

function countText(haystack, needle) {
  return countBuffer(Buffer.from(haystack, 'utf8'), Buffer.from(needle, 'utf8'));
}

function codeMask(text) {
  const normal = new Uint8Array(text.length);
  let index = 0;
  let expectExpression = true;
  while (index < text.length) {
    const ch = text[index];
    const next = text[index + 1];
    if (/\s/.test(ch)) {
      normal[index] = 1;
      index += 1;
      continue;
    }
    if (ch === '/' && next === '/') {
      index += 2;
      while (index < text.length && text[index] !== '\n') index += 1;
      continue;
    }
    if (ch === '/' && next === '*') {
      index += 2;
      let closed = false;
      while (index + 1 < text.length) {
        if (text[index] === '*' && text[index + 1] === '/') {
          index += 2;
          closed = true;
          break;
        }
        index += 1;
      }
      if (!closed) stop('S6_JS_LEX');
      continue;
    }
    if (ch === "'" || ch === '"') {
      const quote = ch;
      index += 1;
      let closed = false;
      while (index < text.length) {
        if (text[index] === '\\') {
          index += 2;
          continue;
        }
        if (text[index] === '\n' || text[index] === '\r') stop('S6_JS_LEX');
        if (text[index] === quote) {
          index += 1;
          closed = true;
          break;
        }
        index += 1;
      }
      if (!closed) stop('S6_JS_LEX');
      expectExpression = false;
      continue;
    }
    if (ch.charCodeAt(0) === 96) {
      index += 1;
      let closed = false;
      while (index < text.length) {
        if (text[index] === '\\') {
          index += 2;
          continue;
        }
        if (text[index].charCodeAt(0) === 96) {
          index += 1;
          closed = true;
          break;
        }
        index += 1;
      }
      if (!closed) stop('S6_JS_LEX');
      expectExpression = false;
      continue;
    }
    if (ch === '/') {
      if (!expectExpression) {
        normal[index] = 1;
        index += 1;
        expectExpression = true;
        continue;
      }
      index += 1;
      let escaped = false;
      let inClass = false;
      let closed = false;
      while (index < text.length) {
        const code = text[index];
        if (escaped) {
          escaped = false;
          index += 1;
          continue;
        }
        if (code === '\\') {
          escaped = true;
          index += 1;
          continue;
        }
        if (code === '\n' || code === '\r') break;
        if (code === '[') inClass = true;
        else if (code === ']') inClass = false;
        else if (code === '/' && !inClass) {
          index += 1;
          while (index < text.length && /[A-Za-z]/.test(text[index])) index += 1;
          closed = true;
          break;
        }
        index += 1;
      }
      if (!closed || inClass || escaped) stop('S6_JS_LEX');
      expectExpression = false;
      continue;
    }
    if (/[A-Za-z_$]/.test(ch)) {
      const start = index;
      while (index < text.length && /[A-Za-z0-9_$]/.test(text[index])) {
        normal[index] = 1;
        index += 1;
      }
      const word = text.slice(start, index);
      expectExpression = /^(return|throw|case|delete|void|typeof|new|yield|await|in|instanceof)$/.test(word);
      continue;
    }
    if (/[0-9]/.test(ch)) {
      while (index < text.length && /[A-Za-z0-9_.]/.test(text[index])) {
        normal[index] = 1;
        index += 1;
      }
      expectExpression = false;
      continue;
    }
    normal[index] = 1;
    if (ch === ')' || ch === ']' || ch === '}') expectExpression = false;
    else if ('([{,:;?!~=+-*%&|^<>'.includes(ch)) expectExpression = true;
    index += 1;
  }
  return normal;
}

function parseFunctionsA(text) {
  const normal = codeMask(text);
  const rows = [];
  const pattern = /\bfunction\s+([A-Za-z_$][A-Za-z0-9_$]*)\s*\(([^()]*)\)\s*\{/g;
  let match;
  while ((match = pattern.exec(text)) !== null) {
    if (!normal[match.index]) continue;
    const open = match.index + match[0].lastIndexOf('{');
    if (!normal[open]) continue;
    const params = match[2].trim() === '' ? [] :
      match[2].split(',').map((part) => part.trim());
    if (params.some((item) => !/^[A-Za-z_$][A-Za-z0-9_$]*$/.test(item))) continue;
    let depth = 0;
    let close = -1;
    for (let index = open; index < text.length; index += 1) {
      if (!normal[index]) continue;
      if (text[index] === '{') depth += 1;
      else if (text[index] === '}') {
        depth -= 1;
        if (depth === 0) {
          close = index;
          break;
        }
        if (depth < 0) stop('S6_JS_LEX');
      }
    }
    if (close < 0) stop('S6_JS_LEX');
    rows.push({
      name: match[1],
      params,
      start: match.index,
      end: close + 1,
      old: text.slice(match.index, close + 1)
    });
    pattern.lastIndex = close + 1;
  }
  return rows;
}

function parseFunctionsB(text) {
  const normal = codeMask(text);
  const rows = [];
  let index = 0;
  function whitespace() {
    while (index < text.length && normal[index] && /\s/.test(text[index])) index += 1;
  }
  function identifier() {
    if (index >= text.length || !normal[index] || !/[A-Za-z_$]/.test(text[index])) {
      return null;
    }
    const start = index;
    index += 1;
    while (index < text.length && normal[index] && /[A-Za-z0-9_$]/.test(text[index])) {
      index += 1;
    }
    return text.slice(start, index);
  }
  while (index < text.length) {
    const boundaryBefore = index === 0 || !/[A-Za-z0-9_$]/.test(text[index - 1]);
    const boundaryAfter = !/[A-Za-z0-9_$]/.test(text[index + 8] || '');
    if (!normal[index] || !boundaryBefore || !boundaryAfter ||
        text.slice(index, index + 8) !== 'function') {
      index += 1;
      continue;
    }
    const start = index;
    index += 8;
    whitespace();
    const name = identifier();
    if (name === null) {
      index = start + 1;
      continue;
    }
    whitespace();
    if (!normal[index] || text[index] !== '(') {
      index = start + 1;
      continue;
    }
    index += 1;
    whitespace();
    const params = [];
    let headerBad = false;
    if (text[index] !== ')') {
      for (;;) {
        const param = identifier();
        if (param === null) {
          headerBad = true;
          break;
        }
        params.push(param);
        whitespace();
        if (text[index] === ')') break;
        if (!normal[index] || text[index] !== ',') {
          headerBad = true;
          break;
        }
        index += 1;
        whitespace();
      }
    }
    if (headerBad) {
      index = start + 1;
      continue;
    }
    index += 1;
    whitespace();
    if (!normal[index] || text[index] !== '{') {
      index = start + 1;
      continue;
    }
    let depth = 0;
    let close = -1;
    for (; index < text.length; index += 1) {
      if (!normal[index]) continue;
      if (text[index] === '{') depth += 1;
      else if (text[index] === '}') {
        depth -= 1;
        if (depth === 0) {
          close = index;
          break;
        }
        if (depth < 0) stop('S6_JS_LEX');
      }
    }
    if (close < 0) stop('S6_JS_LEX');
    rows.push({ name, params, start, end: close + 1, old: text.slice(start, close + 1) });
    index = close + 1;
  }
  return rows;
}

function codeWords(text) {
  const normal = codeMask(text);
  const words = new Set();
  let index = 0;
  while (index < text.length) {
    if (normal[index] && /[A-Za-z_$]/.test(text[index])) {
      const start = index;
      index += 1;
      while (index < text.length && normal[index] && /[A-Za-z0-9_$]/.test(text[index])) {
        index += 1;
      }
      words.add(text.slice(start, index).toLowerCase());
    } else {
      index += 1;
    }
  }
  return words;
}

function sameParams(a, b) {
  return a.length === b.length && a.every((value, index) => value === b[index]);
}

function exactlyOne(code, rows) {
  if (rows.length !== 1) stop(code);
  return rows[0];
}

function convergeFunction(code, text, predicateA, predicateB) {
  const a = exactlyOne(code, parseFunctionsA(text).filter(predicateA));
  const b = exactlyOne(code, parseFunctionsB(text).filter(predicateB));
  if (a.start !== b.start || a.end !== b.end || a.name !== b.name ||
      !sameParams(a.params, b.params) || a.old !== b.old ||
      sha256(Buffer.from(a.old, 'ascii')) !== sha256(Buffer.from(b.old, 'ascii'))) {
    stop(code);
  }
  return a;
}

function extractTemplate(owner) {
  const source = Function.prototype.toString.call(owner);
  const begin = '/*V16_TEMPLATE_BEGIN\n';
  const end = '\nV16_TEMPLATE_END*/';
  const start = source.indexOf(begin);
  const finish = source.indexOf(end);
  if (start < 0 || finish < 0 || source.indexOf(begin, start + 1) >= 0 ||
      source.indexOf(end, finish + 1) >= 0 || finish <= start + begin.length) {
    stop('S6_INTERNAL');
  }
  const template = source.slice(start + begin.length, finish);
  if (/[\r\u0080-\uFFFF]/.test(template)) stop('S6_INTERNAL');
  return template;
}

function renderFixed(code, template, slots) {
  let output = template;
  for (const [name, row] of Object.entries(slots)) {
    const token = '@@' + name + '@@';
    const expected = row.count === undefined ? 1 : row.count;
    if (countText(output, token) !== expected) stop(code);
    const value = row.value;
    if (row.kind === 'id' && !/^[A-Za-z_$][A-Za-z0-9_$]*$/.test(value)) stop(code);
    if (row.kind === 'uint' && !/^(0|[1-9][0-9]*)$/.test(value)) stop(code);
    if (row.kind === 'b64' &&
        (typeof value !== 'string' || value.length % 4 !== 0 ||
         !/^[A-Za-z0-9+/]*={0,2}$/.test(value) ||
         Buffer.from(value, 'base64').toString('base64') !== value)) {
      stop(code);
    }
    output = output.split(token).join(value);
  }
  if (/@@[A-Z0-9_]+@@/.test(output) || /[\r\u0080-\uFFFF]/.test(output)) stop(code);
  return output;
}

function lineStart(text, index) {
  const found = text.lastIndexOf('\n', index - 1);
  return found < 0 ? 0 : found + 1;
}

function lineEnd(text, index) {
  const found = text.indexOf('\n', index);
  return found < 0 ? text.length : found + 1;
}

function declarationRecipeA(text) {
  const normal = codeMask(text);
  const versions = [];
  const selves = [];
  const lines = text.split(/(?<=\n)/);
  let offset = 0;
  const versionPattern = /^([ \t]*)(?:const|let|var)[ \t]+(TOOL_VERSION|VERSION|SCHEMA_VERSION)[ \t]*=[ \t]*(?:(['"])(V?2)\3|(2))[ \t]*;[ \t]*(?:\n)?$/;
  const selfPattern = /^([ \t]*)(?:const|let|var)[ \t]+([A-Z_$][A-Z0-9_$]*(?:SELF|PATH|BASENAME)[A-Z0-9_$]*)[ \t]*=[ \t]*(['"])([^'"\r\n]*)\3[ \t]*;[ \t]*(?:\n)?$/;
  for (const line of lines) {
    const first = line.search(/\S/);
    const at = first < 0 ? offset : offset + first;
    if (first >= 0 && normal[at]) {
      const version = line.match(versionPattern);
      if (version) {
        const literal = version[4] !== undefined ? version[4] : version[5];
        const local = line.indexOf(literal, line.indexOf('=') + 1);
        versions.push({
          line_start: offset,
          line_end: offset + line.length,
          value_start: offset + local,
          value_end: offset + local + literal.length,
          value: literal,
          name: version[2]
        });
      }
      const self = line.match(selfPattern);
      if (self && self[4] === OLD_BASENAME) {
        const local = line.indexOf(OLD_BASENAME, line.indexOf('=') + 1);
        selves.push({
          line_start: offset,
          line_end: offset + line.length,
          value_start: offset + local,
          value_end: offset + local + OLD_BASENAME.length,
          value: OLD_BASENAME,
          name: self[2]
        });
      }
    }
    offset += line.length;
  }
  return { version: exactlyOne('S6_C01', versions), self: exactlyOne('S6_C01', selves) };
}

function declarationRecipeB(text) {
  const normal = codeMask(text);
  const versions = [];
  const selves = [];
  let index = 0;
  function skipSpace(limit) {
    while (index < limit && (text[index] === ' ' || text[index] === '\t')) index += 1;
  }
  function readId(limit) {
    if (index >= limit || !/[A-Za-z_$]/.test(text[index])) return null;
    const start = index++;
    while (index < limit && /[A-Za-z0-9_$]/.test(text[index])) index += 1;
    return text.slice(start, index);
  }
  while (index < text.length) {
    const start = lineStart(text, index);
    const end = lineEnd(text, index);
    index = start;
    skipSpace(end);
    const firstCode = index;
    const kind = readId(end);
    if (!normal[firstCode] || !/^(const|let|var)$/.test(kind || '')) {
      index = end;
      continue;
    }
    skipSpace(end);
    const name = readId(end);
    skipSpace(end);
    if (name === null || text[index] !== '=') {
      index = end;
      continue;
    }
    index += 1;
    skipSpace(end);
    const valueStart = index;
    let value = null;
    if (text[index] === "'" || text[index] === '"') {
      const quote = text[index++];
      const inner = index;
      while (index < end && text[index] !== quote && text[index] !== '\n') {
        if (text[index] === '\\') {
          index = end;
          break;
        }
        index += 1;
      }
      if (index < end && text[index] === quote) {
        value = text.slice(inner, index);
        index += 1;
      }
    } else {
      const number = index;
      while (index < end && /[A-Za-z0-9_]/.test(text[index])) index += 1;
      value = text.slice(number, index);
    }
    skipSpace(end);
    if (value === null || text[index] !== ';') {
      index = end;
      continue;
    }
    index += 1;
    skipSpace(end);
    if (index < end && text[index] !== '\n') {
      index = end;
      continue;
    }
    const actualStart = text[valueStart] === "'" || text[valueStart] === '"' ?
      valueStart + 1 : valueStart;
    const row = {
      line_start: start,
      line_end: end,
      value_start: actualStart,
      value_end: actualStart + value.length,
      value,
      name
    };
    if (/^(TOOL_VERSION|VERSION|SCHEMA_VERSION)$/.test(name) && /^(V?2|2)$/.test(value)) {
      versions.push(row);
    }
    if (/(?:SELF|PATH|BASENAME)/.test(name) && value === OLD_BASENAME) selves.push(row);
    index = end;
  }
  return { version: exactlyOne('S6_C01', versions), self: exactlyOne('S6_C01', selves) };
}

function c01Fragment(text) {
  const a = declarationRecipeA(text);
  const b = declarationRecipeB(text);
  for (const role of ['version', 'self']) {
    for (const key of ['line_start', 'line_end', 'value_start', 'value_end', 'value', 'name']) {
      if (a[role][key] !== b[role][key]) stop('S6_C01');
    }
  }
  const start = Math.min(a.version.line_start, a.self.line_start);
  const end = Math.max(a.version.line_end, a.self.line_end);
  const changes = [
    {
      start: a.version.value_start,
      end: a.version.value_end,
      value: a.version.value === '2' ? '3' : (a.version.value === 'V2' ? 'V3' : '3')
    },
    { start: a.self.value_start, end: a.self.value_end, value: NEW_BASENAME }
  ].sort((left, right) => left.start - right.start);
  if (changes[0].end > changes[1].start) stop('S6_C01');
  const pieces = [];
  let at = start;
  for (const change of changes) {
    pieces.push(text.slice(at, change.start), change.value);
    at = change.end;
  }
  pieces.push(text.slice(at, end));
  const old = text.slice(start, end);
  const replacement = pieces.join('');
  if (old === replacement || countText(text, old) !== 1 ||
      countText(replacement, OLD_BASENAME) !== 0 ||
      countText(replacement, NEW_BASENAME) !== 1) {
    stop('S6_C01');
  }
  return { id: 'C01', start, end, old, new: replacement };
}

function c02TemplateOwner() {/*
V16_TEMPLATE_BEGIN
function @@PFX@@Mask(text, start, end, kind, used) {
  const original = text.slice(start, end);
  const alphabet = 'zqvxjkwy';
  for (let n = 0; n < alphabet.length; n += 1) {
    let mask;
    if (kind === 'variable') {
      mask = '$' + alphabet[n] + original.slice(2);
    } else {
      if (original.length < 2) throw new Error('V16_MASK_RANGE');
      mask = String.fromCharCode(39) + alphabet[n].repeat(original.length - 2) + String.fromCharCode(39);
    }
    if (mask.length === original.length && text.indexOf(mask) < 0 && !used.has(mask)) {
      used.add(mask);
      return { original, mask };
    }
  }
  throw new Error('V16_MASK_COLLISION');
}
function @@PFX@@Prepare(value) {
  if (typeof value !== 'string') throw new Error('V16_LEX_INPUT');
  const out = value.split('');
  const mapping = [];
  const used = new Set();
  let previous = 'START';
  let i = 0;
  function install(start, end, kind) {
    const row = @@PFX@@Mask(value, start, end, kind, used);
    for (let k = 0; k < row.mask.length; k += 1) out[start + k] = row.mask[k];
    mapping.push(row);
  }
  while (i < value.length) {
    const code = value.charCodeAt(i);
    const next = value.charCodeAt(i + 1);
    if (/\s/.test(value[i])) { i += 1; continue; }
    if (code === 35) { while (i < value.length && value.charCodeAt(i) !== 10) i += 1; continue; }
    if (code === 39 || code === 34) {
      const quote = code; i += 1; let closed = false;
      while (i < value.length) {
        if (value.charCodeAt(i) === 92) { i += 2; continue; }
        if (value.charCodeAt(i) === quote) { i += 1; closed = true; break; }
        if (value.charCodeAt(i) === 10 || value.charCodeAt(i) === 13) throw new Error('V16_LEX_QUOTE');
        i += 1;
      }
      if (!closed) throw new Error('V16_LEX_QUOTE');
      previous = 'END'; continue;
    }
    if (code === 96) {
      const start = i; i += 1; let closed = false;
      while (i < value.length) {
        if (value.charCodeAt(i) === 92) { i += 2; continue; }
        if (value.charCodeAt(i) === 96) { i += 1; closed = true; break; }
        i += 1;
      }
      if (!closed) throw new Error('V16_LEX_BACKTICK');
      install(start, i, 'opaque'); previous = 'END'; continue;
    }
    if (code === 36 && next === 35 && /[A-Za-z_]/.test(value[i + 2] || '')) {
      const start = i; i += 3;
      while (i < value.length && /[A-Za-z0-9_]/.test(value[i])) i += 1;
      install(start, i, 'variable'); previous = 'END'; continue;
    }
    if (code === 47) {
      if (next === 47) { i += 2; while (i < value.length && value.charCodeAt(i) !== 10) i += 1; continue; }
      if (next === 42) {
        i += 2; let closed = false;
        while (i + 1 < value.length) {
          if (value.charCodeAt(i) === 42 && value.charCodeAt(i + 1) === 47) { i += 2; closed = true; break; }
          i += 1;
        }
        if (!closed) throw new Error('V16_LEX_COMMENT');
        continue;
      }
      if (previous === 'END') { previous = 'OP'; i += 1; continue; }
      if (previous !== 'START' && previous !== 'OPEN' && previous !== 'OP') throw new Error('V16_LEX_SLASH_CONTEXT');
      const start = i; i += 1; let escaped = false; let inClass = false; let closed = false;
      while (i < value.length) {
        const c = value.charCodeAt(i);
        if (escaped) { escaped = false; i += 1; continue; }
        if (c === 92) { escaped = true; i += 1; continue; }
        if (c === 10 || c === 13) break;
        if (c === 91) inClass = true;
        else if (c === 93) inClass = false;
        else if (c === 47 && !inClass) { i += 1; closed = true; break; }
        i += 1;
      }
      if (!closed || inClass || escaped) throw new Error('V16_LEX_REGEX');
      while (i < value.length && /[A-Za-z]/.test(value[i])) i += 1;
      install(start, i, 'opaque'); previous = 'END'; continue;
    }
    if (/[A-Za-z_$]/.test(value[i])) {
      i += 1; while (i < value.length && /[A-Za-z0-9_$]/.test(value[i])) i += 1;
      previous = 'END'; continue;
    }
    if (/[0-9]/.test(value[i])) {
      i += 1; while (i < value.length && /[A-Za-z0-9_.]/.test(value[i])) i += 1;
      previous = 'END'; continue;
    }
    if ('([{,:;'.includes(value[i])) { previous = 'OPEN'; i += 1; continue; }
    if (')]}'.includes(value[i])) { previous = 'END'; i += 1; continue; }
    if ('=+-*%&|^!~<>?.'.includes(value[i])) { previous = 'OP'; i += 1; continue; }
    throw new Error('V16_LEX_UNKNOWN');
  }
  return { text: out.join(''), mapping };
}
function @@PFX@@Restore(value, mapping, seen) {
  if (typeof value === 'string') {
    let result = value;
    for (const row of mapping) result = result.split(row.mask).join(row.original);
    return result;
  }
  if (value === null || typeof value !== 'object') return value;
  const memo = seen || new WeakMap();
  if (memo.has(value)) return memo.get(value);
  if (Array.isArray(value)) {
    const array = []; memo.set(value, array);
    for (const item of value) array.push(@@PFX@@Restore(item, mapping, memo));
    return array;
  }
  const object = {}; memo.set(value, object);
  for (const key of Object.keys(value)) object[key] = @@PFX@@Restore(value[key], mapping, memo);
  return object;
}
function @@NAME@@(@@PARAMS@@) {
  const prepared = @@PFX@@Prepare(@@INPUT@@);
  const args = Array.prototype.slice.call(arguments);
  args[@@INDEX@@] = prepared.text;
  const result = @@RENAMED@@.apply(this, args);
  return @@PFX@@Restore(result, prepared.mapping);
}
V16_TEMPLATE_END*/}

function replaceFunctionName(code, item, renamed) {
  const header = /^function\s+([A-Za-z_$][A-Za-z0-9_$]*)/;
  const match = item.old.match(header);
  if (!match || match[1] !== item.name || countText(item.old, match[0]) !== 1) stop(code);
  return item.old.replace(header, 'function ' + renamed);
}

function c02Fragment(text) {
  const inputName = (item) => item.params.filter((name) =>
    /^(source|text|code|input|expression|rhs)$/i.test(name));
  const predicateA = (item) => {
    const lower = item.old.toLowerCase();
    return /(lex|token|scan)/i.test(item.name) && inputName(item).length === 1 &&
      lower.includes('regex') && (lower.includes('slash') || lower.includes('division')) &&
      (lower.includes('quote') || lower.includes('string'));
  };
  const predicateB = (item) => {
    const words = codeWords(item.old);
    return /(lex|token|scan)/i.test(item.name) && inputName(item).length === 1 &&
      words.has('regex') && (words.has('slash') || words.has('division')) &&
      (words.has('quote') || words.has('string'));
  };
  const item = convergeFunction('S6_C02', text, predicateA, predicateB);
  const input = exactlyOne('S6_C02', inputName(item));
  const inputIndex = item.params.indexOf(input);
  const renamed = item.name + 'V16V2Original';
  const prefix = '__v16C02V2';
  if (text.includes(renamed) || text.includes(prefix)) stop('S6_C02');
  const original = replaceFunctionName('S6_C02', item, renamed);
  const helper = renderFixed('S6_C02', extractTemplate(c02TemplateOwner), {
    PFX: { kind: 'id', value: prefix, count: 8 },
    NAME: { kind: 'id', value: item.name },
    PARAMS: { kind: 'ascii', value: item.params.join(', ') },
    INPUT: { kind: 'id', value: input },
    INDEX: { kind: 'uint', value: String(inputIndex) },
    RENAMED: { kind: 'id', value: renamed }
  });
  return { id: 'C02', start: item.start, end: item.end, old: item.old, new: original + '\n\n' + helper };
}

function matchingFinal(text) {
  if (typeof text !== 'string' || text.length < 2 || text.charCodeAt(0) !== 40) return -1;
  const stack = [40];
  let state = 0;
  let escaped = false;
  let inClass = false;
  let canRegex = true;
  function mate(open, close) {
    return (open === 40 && close === 41) ||
      (open === 91 && close === 93) || (open === 123 && close === 125);
  }
  for (let index = 1; index < text.length; index += 1) {
    const code = text.charCodeAt(index);
    const next = text.charCodeAt(index + 1);
    if (state === 1 || state === 2 || state === 3) {
      if (escaped) { escaped = false; continue; }
      if (code === 92) { escaped = true; continue; }
      if ((state === 1 && code === 39) || (state === 2 && code === 34) ||
          (state === 3 && code === 96)) {
        state = 0;
        canRegex = false;
        continue;
      }
      if ((state === 1 || state === 2) && (code === 10 || code === 13)) return -1;
      continue;
    }
    if (state === 4) {
      if (code === 10 || code === 13) { state = 0; canRegex = true; }
      continue;
    }
    if (state === 5) {
      if (code === 42 && next === 47) { state = 0; index += 1; }
      continue;
    }
    if (state === 6) {
      if (escaped) { escaped = false; continue; }
      if (code === 92) { escaped = true; continue; }
      if (code === 10 || code === 13) return -1;
      if (code === 91) { inClass = true; continue; }
      if (code === 93 && inClass) { inClass = false; continue; }
      if (code === 47 && !inClass) {
        state = 0;
        while (/[A-Za-z]/.test(text[index + 1] || '')) index += 1;
        canRegex = false;
      }
      continue;
    }
    if (code === 39) { state = 1; continue; }
    if (code === 34) { state = 2; continue; }
    if (code === 96) { state = 3; continue; }
    if (code === 47 && next === 47) { state = 4; index += 1; continue; }
    if (code === 47 && next === 42) { state = 5; index += 1; continue; }
    if (code === 47 && canRegex) { state = 6; inClass = false; continue; }
    if (code === 47) { canRegex = true; continue; }
    if (code === 40 || code === 91 || code === 123) {
      stack.push(code);
      canRegex = true;
      continue;
    }
    if (code === 41 || code === 93 || code === 125) {
      if (stack.length === 0 || !mate(stack.pop(), code)) return -1;
      if (stack.length === 0) return index === text.length - 1 ? index : -1;
      canRegex = false;
      continue;
    }
    const ch = text[index];
    if (/\s/.test(ch)) continue;
    if (/[A-Za-z_$]/.test(ch)) {
      const start = index;
      while (/[A-Za-z0-9_$]/.test(text[index + 1] || '')) index += 1;
      const word = text.slice(start, index + 1);
      canRegex = /^(return|throw|case|delete|void|typeof|new|yield|await|in|instanceof)$/.test(word);
      continue;
    }
    if (/[0-9]/.test(ch)) {
      while (/[A-Za-z0-9_.]/.test(text[index + 1] || '')) index += 1;
      canRegex = false;
      continue;
    }
    canRegex = '(,[{:;?!=+-*%&|^~<>'.includes(ch);
  }
  return -1;
}

function stripOuterExact(value) {
  if (typeof value !== 'string') return value;
  let current = value;
  for (;;) {
    if (current.length < 2 || current.charCodeAt(0) !== 40) return current;
    const close = matchingFinal(current);
    if (close < 0 || close !== current.length - 1) return current;
    current = current.slice(1, -1);
  }
}

function c03TemplateOwner() {/*
V16_TEMPLATE_BEGIN
function @@PFX@@MatchingFinal(text) {
  if (typeof text !== 'string' || text.length < 2 || text.charCodeAt(0) !== 40) return -1;
  const stack = [40]; let state = 0; let escaped = false; let inClass = false; let canRegex = true;
  function mate(open, close) { return (open === 40 && close === 41) || (open === 91 && close === 93) || (open === 123 && close === 125); }
  for (let i = 1; i < text.length; i += 1) {
    const code = text.charCodeAt(i); const next = text.charCodeAt(i + 1);
    if (state === 1 || state === 2 || state === 3) {
      if (escaped) { escaped = false; continue; }
      if (code === 92) { escaped = true; continue; }
      if ((state === 1 && code === 39) || (state === 2 && code === 34) || (state === 3 && code === 96)) { state = 0; canRegex = false; continue; }
      if ((state === 1 || state === 2) && (code === 10 || code === 13)) return -1;
      continue;
    }
    if (state === 4) { if (code === 10 || code === 13) { state = 0; canRegex = true; } continue; }
    if (state === 5) { if (code === 42 && next === 47) { state = 0; i += 1; } continue; }
    if (state === 6) {
      if (escaped) { escaped = false; continue; }
      if (code === 92) { escaped = true; continue; }
      if (code === 10 || code === 13) return -1;
      if (code === 91) { inClass = true; continue; }
      if (code === 93 && inClass) { inClass = false; continue; }
      if (code === 47 && !inClass) { state = 0; while (/[A-Za-z]/.test(text[i + 1] || '')) i += 1; canRegex = false; }
      continue;
    }
    if (code === 39) { state = 1; continue; }
    if (code === 34) { state = 2; continue; }
    if (code === 96) { state = 3; continue; }
    if (code === 47 && next === 47) { state = 4; i += 1; continue; }
    if (code === 47 && next === 42) { state = 5; i += 1; continue; }
    if (code === 47 && canRegex) { state = 6; inClass = false; continue; }
    if (code === 47) { canRegex = true; continue; }
    if (code === 40 || code === 91 || code === 123) { stack.push(code); canRegex = true; continue; }
    if (code === 41 || code === 93 || code === 125) {
      if (stack.length === 0 || !mate(stack.pop(), code)) return -1;
      if (stack.length === 0) return i === text.length - 1 ? i : -1;
      canRegex = false; continue;
    }
    const ch = text[i]; if (/\s/.test(ch)) continue;
    if (/[A-Za-z_$]/.test(ch)) { const start = i; while (/[A-Za-z0-9_$]/.test(text[i + 1] || '')) i += 1; const word = text.slice(start, i + 1); canRegex = /^(return|throw|case|delete|void|typeof|new|yield|await|in|instanceof)$/.test(word); continue; }
    if (/[0-9]/.test(ch)) { while (/[A-Za-z0-9_.]/.test(text[i + 1] || '')) i += 1; canRegex = false; continue; }
    canRegex = '(,[{:;?!=+-*%&|^~<>'.includes(ch);
  }
  return -1;
}
function @@PFX@@Strip(value) {
  if (typeof value !== 'string') return value;
  let current = value;
  for (;;) {
    if (current.length < 2 || current.charCodeAt(0) !== 40) return current;
    const close = @@PFX@@MatchingFinal(current);
    if (close < 0 || close !== current.length - 1) return current;
    current = current.slice(1, -1);
  }
}
function @@NAME@@(@@PARAM@@) { return @@PFX@@Strip(@@PARAM@@); }
V16_TEMPLATE_END*/}

function c03Fragment(text) {
  const predicateA = (item) => {
    const lower = item.old.toLowerCase();
    return item.params.length === 1 && /(strip|remove|unwrap)/i.test(item.name) &&
      /(paren|parenth)/.test(item.name.toLowerCase() + ' ' + lower) &&
      (lower.includes('startswith') || lower.includes('endswith') || lower.includes('slice'));
  };
  const predicateB = (item) => {
    const words = codeWords(item.old);
    return item.params.length === 1 && /(strip|remove|unwrap)/i.test(item.name) &&
      /(paren|parenth)/i.test(item.name) &&
      (words.has('startswith') || words.has('endswith') || words.has('slice'));
  };
  const item = convergeFunction('S6_C03', text, predicateA, predicateB);
  const prefix = '__v16C03V2';
  if (text.includes(prefix)) stop('S6_C03');
  const replacement = renderFixed('S6_C03', extractTemplate(c03TemplateOwner), {
    PFX: { kind: 'id', value: prefix, count: 4 },
    NAME: { kind: 'id', value: item.name },
    PARAM: { kind: 'id', value: item.params[0], count: 2 }
  });
  return { id: 'C03', start: item.start, end: item.end, old: item.old, new: replacement };
}

function decodeOneMarker(value) {
  if (typeof value !== 'string') return null;
  const source = stripOuterExact(value);
  if (typeof source !== 'string' || source.length < 2) return null;
  const quote = source.charCodeAt(0);
  if (quote !== 39 && quote !== 34) return null;
  let output = '';
  let index = 1;
  while (index < source.length) {
    const code = source.charCodeAt(index);
    if (code === quote) return index === source.length - 1 ? output : null;
    if (code === 0 || code === 10 || code === 13) return null;
    if (code !== 92) {
      output += source[index];
      index += 1;
      continue;
    }
    index += 1;
    if (index >= source.length) return null;
    const escape = source.charCodeAt(index++);
    if (quote === 39) {
      if (escape === 39) output += String.fromCharCode(39);
      else if (escape === 92) output += String.fromCharCode(92);
      else return null;
      continue;
    }
    if (escape === 34) output += String.fromCharCode(34);
    else if (escape === 92) output += String.fromCharCode(92);
    else if (escape === 110) output += '\n';
    else if (escape === 114) output += '\r';
    else if (escape === 116) output += '\t';
    else if (escape === 102) output += '\f';
    else if (escape === 98) output += '\b';
    else if (escape === 97) output += String.fromCharCode(7);
    else if (escape === 101) output += String.fromCharCode(27);
    else if (escape === 120) {
      const hex = source.slice(index, index + 2);
      if (!/^[0-9A-Fa-f]{2}$/.test(hex)) return null;
      output += String.fromCharCode(parseInt(hex, 16));
      index += 2;
    } else {
      return null;
    }
  }
  return null;
}

function c04TemplateOwner() {/*
V16_TEMPLATE_BEGIN
function @@PFX@@MatchingFinal(text) {
  if (typeof text !== 'string' || text.length < 2 || text.charCodeAt(0) !== 40) return -1;
  const stack = [40]; let quote = 0; let escaped = false;
  for (let i = 1; i < text.length; i += 1) {
    const code = text.charCodeAt(i);
    if (quote !== 0) {
      if (escaped) { escaped = false; continue; }
      if (code === 92) { escaped = true; continue; }
      if (code === quote) { quote = 0; continue; }
      if ((quote === 39 || quote === 34) && (code === 10 || code === 13)) return -1;
      continue;
    }
    if (code === 39 || code === 34 || code === 96) { quote = code; continue; }
    if (code === 40 || code === 91 || code === 123) { stack.push(code); continue; }
    if (code === 41 || code === 93 || code === 125) {
      const open = stack.pop();
      if (!((open === 40 && code === 41) || (open === 91 && code === 93) || (open === 123 && code === 125))) return -1;
      if (stack.length === 0) return i === text.length - 1 ? i : -1;
    }
  }
  return -1;
}
function @@PFX@@Strip(value) {
  if (typeof value !== 'string') return value;
  let current = value;
  for (;;) {
    if (current.length < 2 || current.charCodeAt(0) !== 40) return current;
    const close = @@PFX@@MatchingFinal(current);
    if (close < 0 || close !== current.length - 1) return current;
    current = current.slice(1, -1);
  }
}
function @@PFX@@Decode(value) {
  if (typeof value !== 'string') return null;
  const source = @@PFX@@Strip(value);
  if (typeof source !== 'string' || source.length < 2) return null;
  const quote = source.charCodeAt(0); if (quote !== 39 && quote !== 34) return null;
  let output = ''; let i = 1;
  while (i < source.length) {
    const code = source.charCodeAt(i);
    if (code === quote) return i === source.length - 1 ? output : null;
    if (code === 0 || code === 10 || code === 13) return null;
    if (code !== 92) { output += source[i++]; continue; }
    i += 1; if (i >= source.length) return null; const escape = source.charCodeAt(i++);
    if (quote === 39) {
      if (escape === 39) output += String.fromCharCode(39);
      else if (escape === 92) output += String.fromCharCode(92);
      else return null;
      continue;
    }
    if (escape === 34) output += String.fromCharCode(34);
    else if (escape === 92) output += String.fromCharCode(92);
    else if (escape === 110) output += '\n';
    else if (escape === 114) output += '\r';
    else if (escape === 116) output += '\t';
    else if (escape === 102) output += '\f';
    else if (escape === 98) output += '\b';
    else if (escape === 97) output += String.fromCharCode(7);
    else if (escape === 101) output += String.fromCharCode(27);
    else if (escape === 120) {
      const hex = source.slice(i, i + 2); if (!/^[0-9A-Fa-f]{2}$/.test(hex)) return null;
      output += String.fromCharCode(parseInt(hex, 16)); i += 2;
    } else return null;
  }
  return null;
}
function @@NAME@@(@@PARAMS@@) {
  if (typeof @@ARG@@ !== 'string' || typeof @@MARKER@@ !== 'string') return false;
  const decoded = @@PFX@@Decode(@@ARG@@);
  return decoded !== null && decoded === @@MARKER@@;
}
V16_TEMPLATE_END*/}

function c04Fragment(text) {
  function roles(item) {
    const markers = item.params.filter((name) => /^(marker|expected|rhs)$/i.test(name));
    const args = item.params.filter((name) =>
      /^(arg|argument|expression|text|actual|lhs)$/i.test(name));
    return { markers, args };
  }
  const predicateA = (item) => {
    const role = roles(item);
    const lower = (item.name + ' ' + item.old).toLowerCase();
    return role.markers.length === 1 && role.args.length === 1 &&
      role.markers[0] !== role.args[0] && lower.includes('marker') &&
      /(arg|argument|exact|equal|match)/.test(lower);
  };
  const predicateB = (item) => {
    const role = roles(item);
    const words = codeWords(item.old);
    return role.markers.length === 1 && role.args.length === 1 &&
      role.markers[0] !== role.args[0] && words.has(role.markers[0].toLowerCase()) &&
      words.has(role.args[0].toLowerCase()) &&
      (words.has('exact') || words.has('equal') || words.has('match'));
  };
  const item = convergeFunction('S6_C04', text, predicateA, predicateB);
  const role = roles(item);
  const marker = role.markers[0];
  const argument = role.args[0];
  const prefix = '__v16C04V2';
  if (text.includes(prefix)) stop('S6_C04');
  const replacement = renderFixed('S6_C04', extractTemplate(c04TemplateOwner), {
    PFX: { kind: 'id', value: prefix, count: 8 },
    NAME: { kind: 'id', value: item.name },
    PARAMS: { kind: 'ascii', value: item.params.join(', ') },
    ARG: { kind: 'id', value: argument, count: 2 },
    MARKER: { kind: 'id', value: marker, count: 2 }
  });
  return { id: 'C04', start: item.start, end: item.end, old: item.old, new: replacement };
}

function verifyFragments(source, fragments) {
  if (typeof source !== 'string' || fragments.length !== 4 ||
      fragments.map((row) => row.id).join(',') !== 'C01,C02,C03,C04') {
    stop('S6_CARDINALITY');
  }
  const sourceBuffer = Buffer.from(source, 'ascii');
  for (const row of fragments) {
    const old = Buffer.from(row.old, 'ascii');
    const replacement = Buffer.from(row.new, 'ascii');
    if (old.length === 0 || replacement.length === 0 || row.end <= row.start ||
        !sourceBuffer.subarray(row.start, row.end).equals(old) ||
        countBuffer(sourceBuffer, old) !== 1 || old.equals(replacement)) {
      stop('S6_CARDINALITY');
    }
  }
  const ordered = fragments.slice().sort((a, b) => a.start - b.start);
  for (let index = 1; index < ordered.length; index += 1) {
    if (ordered[index - 1].end > ordered[index].start) stop('S6_NONOVERLAP');
  }
  const pieces = [];
  const gaps = [];
  let sourceAt = 0;
  let candidateAt = 0;
  for (const row of ordered) {
    const gap = sourceBuffer.subarray(sourceAt, row.start);
    pieces.push(gap);
    gaps.push({
      source_start: sourceAt,
      source_end: row.start,
      candidate_start: candidateAt,
      candidate_end: candidateAt + gap.length
    });
    candidateAt += gap.length;
    const replacement = Buffer.from(row.new, 'ascii');
    pieces.push(replacement);
    candidateAt += replacement.length;
    sourceAt = row.end;
  }
  const tail = sourceBuffer.subarray(sourceAt);
  pieces.push(tail);
  gaps.push({
    source_start: sourceAt,
    source_end: sourceBuffer.length,
    candidate_start: candidateAt,
    candidate_end: candidateAt + tail.length
  });
  if (gaps.length !== 5) stop('S6_OUTSIDE');
  const candidate = Buffer.concat(pieces);
  const outsideSourceRows = [];
  const outsideCandidateRows = [];
  const gapProof = [];
  for (const gap of gaps) {
    const before = sourceBuffer.subarray(gap.source_start, gap.source_end);
    const after = candidate.subarray(gap.candidate_start, gap.candidate_end);
    if (before.length !== after.length || !before.equals(after) ||
        sha256(before) !== sha256(after)) {
      stop('S6_OUTSIDE');
    }
    outsideSourceRows.push(before);
    outsideCandidateRows.push(after);
    gapProof.push({
      source_start: gap.source_start,
      source_end: gap.source_end,
      candidate_start: gap.candidate_start,
      candidate_end: gap.candidate_end,
      source_sha256: sha256(before),
      candidate_sha256: sha256(after),
      equal: true
    });
  }
  const outsideSource = Buffer.concat(outsideSourceRows);
  const outsideCandidate = Buffer.concat(outsideCandidateRows);
  const delta = fragments.reduce((sum, row) =>
    sum + Buffer.byteLength(row.new, 'ascii') - Buffer.byteLength(row.old, 'ascii'), 0);
  if (!outsideSource.equals(outsideCandidate) ||
      candidate.length !== sourceBuffer.length + delta) {
    stop('S6_OUTSIDE');
  }
  return { ordered, candidate, gaps: gapProof, outsideSource, outsideCandidate };
}

function targetTemplateOwner() {/*
V16_TEMPLATE_BEGIN
'use strict';
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const SOURCE_REL_B64='RW1saXNBSeOBruWun+ijhea4iOOBv+izh+aWmS9kb2N1bWVudHMvVjE2X1B1YmxpY0dhdGVfTG9jYWxFdmlkZW5jZV9QcmVzZXJ2YXRpb25fMjAyNjA4MDUvYXJ0aWZhY3RzL3YxNl9wdWJsaWNfZ2F0ZV9leGVjdXRpb25fY29udGludWF0aW9uX2NhcnJpZXJfdjNfdDA2X3Nhbml0aXplZF9zaGFwZV9leHRyYWN0b3JfdjIuanM=';
const TARGET_REL_B64='RW1saXNBSeOBruWun+ijhea4iOOBv+izh+aWmS9kb2N1bWVudHMvVjE2X1B1YmxpY0dhdGVfTG9jYWxFdmlkZW5jZV9QcmVzZXJ2YXRpb25fMjAyNjA4MDUvYXJ0aWZhY3RzL3YxNl9wdWJsaWNfZ2F0ZV9leGVjdXRpb25fY29udGludWF0aW9uX2NhcnJpZXJfdjNfdDA2X3Nhbml0aXplZF9zaGFwZV9leHRyYWN0b3JfdjMuanM=';
const SOURCE_BYTES=41972,SOURCE_LF=1339,SOURCE_BLOB='69ca116c3bc8c618792f3da9bd72686a4759fd8d',SOURCE_SHA256='0d2dcffe2d55c08e97dfcf588e8a13b6b26f8e5c337ee549e3ffcf41c300dcca';
const FRAGMENTS_B64='@@FRAGMENTS_B64@@';
function fail(){throw{v16Target:true};}
function dig(n,b){return crypto.createHash(n).update(b).digest('hex');}
function blob(b){return dig('sha1',Buffer.concat([Buffer.from('blob '+b.length+'\0','ascii'),b]));}
function b64(s){if(typeof s!=='string'||s.length%4!==0||!/^[A-Za-z0-9+/]*={0,2}$/.test(s))fail();const b=Buffer.from(s,'base64');if(b.toString('base64')!==s)fail();return b;}
function utf8(s){const b=b64(s),v=b.toString('utf8');if(!Buffer.from(v,'utf8').equals(b))fail();return v;}
const SOURCE_REL=utf8(SOURCE_REL_B64),TARGET_REL=utf8(TARGET_REL_B64);
function safe(v){return typeof v==='string'&&v!==''&&!path.posix.isAbsolute(v)&&!path.win32.isAbsolute(v)&&path.posix.normalize(v)===v&&!v.includes('\\')&&!/[\r\n\0]/.test(v)&&v.split('/').every(p=>p!==''&&p!=='.'&&p!=='..');}
function under(root,rel){if(!safe(rel))fail();const a=path.join(root,...rel.split('/'));if(path.relative(root,a).split(path.sep).join('/')!==rel)fail();return a;}
function dir(v){let s,r;try{s=fs.lstatSync(v);r=fs.realpathSync.native(v);}catch(_){fail();}if(!s.isDirectory()||s.isSymbolicLink()||r!==v)fail();}
function paths(){if(process.argv.length!==3)fail();const root=process.argv[2];if(typeof root!=='string'||!path.isAbsolute(root)||path.normalize(root)!==root||root===path.parse(root).root||root.endsWith(path.sep))fail();dir(root);const source=under(root,SOURCE_REL),target=under(root,TARGET_REL);dir(path.dirname(source));dir(path.dirname(target));let absent=false;try{fs.lstatSync(target);}catch(e){if(e&&e.code==='ENOENT')absent=true;else fail();}if(!absent)fail();return{source,target};}
function rows(){let x;try{const raw=b64(FRAGMENTS_B64);if([...raw].some(c=>c>127))fail();x=JSON.parse(raw.toString('ascii'));}catch(_){fail();}if(!Array.isArray(x)||x.length!==4)fail();return x.map((r,i)=>{if(!r||typeof r!=='object'||Array.isArray(r)||Object.keys(r).sort().join(',')!=='id,new_b64,old_b64'||r.id!==['C01','C02','C03','C04'][i])fail();const old=b64(r.old_b64),neu=b64(r.new_b64);if(old.length===0||neu.length===0)fail();return{id:r.id,old,neu};});}
function read(file){let before;try{before=fs.lstatSync(file);}catch(_){fail();}if(!before.isFile()||before.isSymbolicLink()||(before.mode&0o777)!==0o644||before.size!==SOURCE_BYTES)fail();try{if(fs.realpathSync.native(file)!==file)fail();}catch(_){fail();}let fd=-1,b=null,bad=false;try{fd=fs.openSync(file,fs.constants.O_RDONLY|fs.constants.O_NOFOLLOW|fs.constants.O_NONBLOCK);const after=fs.fstatSync(fd);if(!after.isFile()||(after.mode&0o777)!==0o644||after.size!==SOURCE_BYTES||after.dev!==before.dev||after.ino!==before.ino)fail();b=Buffer.alloc(SOURCE_BYTES);if(fs.readSync(fd,b,0,b.length,0)!==b.length)fail();if(fs.readSync(fd,Buffer.alloc(1),0,1,b.length)!==0)fail();}catch(_){bad=true;}if(fd>=0){try{fs.closeSync(fd);}catch(_){bad=true;}}if(bad||b===null)fail();let lf=0,cr=0;for(const c of b){if(c===10)lf++;if(c===13)cr++;}if(lf!==SOURCE_LF||cr!==0||b[b.length-1]!==10||blob(b)!==SOURCE_BLOB||dig('sha256',b)!==SOURCE_SHA256)fail();return b;}
function count(h,n){let c=0,p=0;for(;;){const q=h.indexOf(n,p);if(q<0)return c;c++;p=q+1;}}
function transform(source){const rs=rows().map(r=>{const start=source.indexOf(r.old);if(start<0||count(source,r.old)!==1)fail();return{id:r.id,old:r.old,neu:r.neu,start,end:start+r.old.length};}).sort((a,b)=>a.start-b.start);if(rs.map(r=>r.id).sort().join(',')!=='C01,C02,C03,C04')fail();for(let i=1;i<4;i++)if(rs[i-1].end>rs[i].start)fail();const pieces=[],gaps=[];let sa=0,ca=0;for(const r of rs){const g=source.subarray(sa,r.start);pieces.push(g);gaps.push({ss:sa,se:r.start,cs:ca,ce:ca+g.length});ca+=g.length;pieces.push(r.neu);ca+=r.neu.length;sa=r.end;}const tail=source.subarray(sa);pieces.push(tail);gaps.push({ss:sa,se:source.length,cs:ca,ce:ca+tail.length});const candidate=Buffer.concat(pieces);if(gaps.length!==5)fail();for(const g of gaps){const a=source.subarray(g.ss,g.se),b=candidate.subarray(g.cs,g.ce);if(a.length!==b.length||!a.equals(b)||dig('sha256',a)!==dig('sha256',b))fail();}const ao=Buffer.concat(gaps.map(g=>source.subarray(g.ss,g.se))),bo=Buffer.concat(gaps.map(g=>candidate.subarray(g.cs,g.ce)));if(!ao.equals(bo))fail();return candidate;}
function patch(candidate){if(candidate.length===0||candidate[candidate.length-1]!==10||candidate.includes(13))fail();const s=candidate.toString('utf8');if(!Buffer.from(s,'utf8').equals(candidate))fail();const body=s.slice(0,-1).split('\n').map(x=>'+'+x).join('\n')+'\n';const p=Buffer.from('*** Begin Patch\n*** Add File: '+TARGET_REL+'\n'+body+'*** End Patch\n','utf8');const a=p.toString('utf8').split('\n');if(a[0]!=='*** Begin Patch'||a[1]!=='*** Add File: '+TARGET_REL||a[a.length-2]!=='*** End Patch'||a[a.length-1]!=='')fail();const d=Buffer.from(a.slice(2,-2).map(x=>{if(!x.startsWith('+'))fail();return x.slice(1);}).join('\n')+'\n','utf8');if(!d.equals(candidate))fail();return p;}
function writeAll(fd,b){let o=0;while(o<b.length){let n;try{n=fs.writeSync(fd,b,o,b.length-o);}catch(_){fail();}if(!Number.isSafeInteger(n)||n<=0||n>b.length-o)fail();o+=n;}}
function main(){const p=paths(),out=patch(transform(read(p.source)));if(out.length>131072)fail();return out;}
let out=null,bad=false;try{out=main();}catch(_){bad=true;}if(!bad){try{writeAll(1,out);}catch(_){bad=true;}}if(bad){try{writeAll(2,Buffer.from('V16_TARGET_STOP\n','ascii'));process.exitCode=70;}catch(_){process.exitCode=75;}}
V16_TEMPLATE_END*/}

function strictBase64(buffer) {
  const encoded = buffer.toString('base64');
  if (encoded.length % 4 !== 0 || !/^[A-Za-z0-9+/]*={0,2}$/.test(encoded) ||
      !Buffer.from(encoded, 'base64').equals(buffer) ||
      Buffer.from(encoded, 'base64').toString('base64') !== encoded) {
    stop('S6_CANONICAL');
  }
  return encoded;
}

function buildTarget(fragments) {
  const rows = fragments.map((row) => ({
    id: row.id,
    old_b64: strictBase64(Buffer.from(row.old, 'ascii')),
    new_b64: strictBase64(Buffer.from(row.new, 'ascii'))
  }));
  const config = Buffer.from(JSON.stringify(rows), 'ascii');
  const target = Buffer.from(renderFixed('S6_TARGET', extractTemplate(targetTemplateOwner), {
    FRAGMENTS_B64: { kind: 'b64', value: strictBase64(config) }
  }) + '\n', 'ascii');
  if (target.includes(13) || target[target.length - 1] !== 10 ||
      target.some((byte) => byte > 0x7f)) {
    stop('S6_TARGET');
  }
  return target;
}

function record(pairs) {
  return { v16_record_pairs: pairs };
}

function serialize(value) {
  if (value && typeof value === 'object' && Array.isArray(value.v16_record_pairs) &&
      Object.keys(value).length === 1) {
    return '{' + value.v16_record_pairs.map((pair) => {
      if (!Array.isArray(pair) || pair.length !== 2 || typeof pair[0] !== 'string') {
        stop('S6_CANONICAL');
      }
      return JSON.stringify(pair[0]) + ':' + serialize(pair[1]);
    }).join(',') + '}';
  }
  if (Array.isArray(value)) return '[' + value.map(serialize).join(',') + ']';
  if (value === null || typeof value === 'string' || typeof value === 'boolean') {
    return JSON.stringify(value);
  }
  if (typeof value === 'number' && Number.isSafeInteger(value)) return String(value);
  stop('S6_CANONICAL');
}

function canonical(value) {
  const encoded = serialize(value);
  for (let index = 0; index < encoded.length; index += 1) {
    if (encoded.charCodeAt(index) > 0x7f) stop('S6_CANONICAL');
  }
  const buffer = Buffer.from(encoded + '\n', 'ascii');
  if (buffer.length === 0 || buffer.length > MAX_OUTPUT ||
      buffer.includes(13) || buffer[buffer.length - 1] !== 10) {
    stop('S6_OUTPUT_LIMIT');
  }
  return buffer;
}

function inspectBuffer(sourceBuffer) {
  const source = requireSourceIdentity(sourceBuffer);
  const fragments = [
    c01Fragment(source),
    c02Fragment(source),
    c03Fragment(source),
    c04Fragment(source)
  ];
  const proof = verifyFragments(source, fragments);
  const target = buildTarget(fragments);
  const sm = metrics(sourceBuffer);
  const cm = metrics(proof.candidate);
  const tm = metrics(target);
  const fragmentRows = fragments.map((row) => record([
    ['id', row.id],
    ['old_b64', strictBase64(Buffer.from(row.old, 'ascii'))],
    ['new_b64', strictBase64(Buffer.from(row.new, 'ascii'))],
    ['occurrences', 1],
    ['start', row.start],
    ['end', row.end],
    ['old_bytes', Buffer.byteLength(row.old, 'ascii')],
    ['new_bytes', Buffer.byteLength(row.new, 'ascii')]
  ]));
  const gaps = proof.gaps.map((gap) => record([
    ['source_start', gap.source_start],
    ['source_end', gap.source_end],
    ['candidate_start', gap.candidate_start],
    ['candidate_end', gap.candidate_end],
    ['source_sha256', gap.source_sha256],
    ['candidate_sha256', gap.candidate_sha256],
    ['equal', gap.equal]
  ]));
  return canonical(record([
    ['schema', 'v16_standalone_preparation_exact4_v2'],
    ['status', 'EXACT4_AND_TARGET_PREPARED_UNREVIEWED_NONCREDIT'],
    ['source', record([
      ['bytes', sm.bytes], ['lf', sm.lf], ['cr', sm.cr],
      ['final_lf', sm.final_lf], ['git_blob', sm.git_blob], ['sha256', sm.sha256]
    ])],
    ['fragments', fragmentRows],
    ['ranges_nonoverlap', true],
    ['outside', record([
      ['gaps', gaps],
      ['bytes', proof.outsideSource.length],
      ['source_sha256', sha256(proof.outsideSource)],
      ['candidate_sha256', sha256(proof.outsideCandidate)],
      ['equal', proof.outsideSource.equals(proof.outsideCandidate)]
    ])],
    ['candidate_v3', record([
      ['bytes', cm.bytes], ['lf', cm.lf], ['cr', cm.cr],
      ['final_lf', cm.final_lf], ['git_blob', cm.git_blob], ['sha256', cm.sha256]
    ])],
    ['target_b64', strictBase64(target)],
    ['target_bytes', tm.bytes],
    ['target_lf', tm.lf],
    ['target_cr', tm.cr],
    ['target_final_lf', tm.final_lf],
    ['target_git_blob', tm.git_blob],
    ['target_sha256', tm.sha256]
  ]));
}

function writeAll(fd, buffer, writer) {
  if (!Number.isSafeInteger(fd) || !Buffer.isBuffer(buffer) || typeof writer !== 'function') {
    throw { v16OutputFault: true, fd, written: 0 };
  }
  let offset = 0;
  while (offset < buffer.length) {
    let amount;
    try {
      amount = writer(fd, buffer, offset, buffer.length - offset);
    } catch (_error) {
      throw { v16OutputFault: true, fd, written: offset };
    }
    if (!Number.isSafeInteger(amount) || amount <= 0 || amount > buffer.length - offset) {
      throw { v16OutputFault: true, fd, written: offset };
    }
    offset += amount;
  }
  return offset;
}

function emitFailure(code, writer, exitCode) {
  try {
    writeAll(2, Buffer.from(code + '\n', 'ascii'), writer);
    return exitCode;
  } catch (_error) {
    return 75;
  }
}

function terminalDispatch(program, writer) {
  let output;
  try {
    output = program();
    if (!Buffer.isBuffer(output) || output.length === 0 || output.length > MAX_OUTPUT ||
        output.includes(13) || output[output.length - 1] !== 10) {
      stop('S6_OUTPUT_LIMIT');
    }
  } catch (error) {
    return emitFailure(codeOf(error), writer, 64);
  }
  try {
    writeAll(1, output, writer);
    return 0;
  } catch (_error) {
    return emitFailure('S6_OUTPUT_STOP', writer, 74);
  }
}

function production() {
  const runtime = deriveRuntime(process.argv, fs);
  return inspectBuffer(readExactSource(runtime.source, fs));
}

if (require.main === module) {
  process.exitCode = terminalDispatch(production, fs.writeSync.bind(fs));
}

module.exports = {
  _test: Object.freeze({
    SOURCE_REL,
    TARGET_REL,
    MAX_OUTPUT,
    stop,
    codeOf,
    safeRelative,
    underRoot,
    deriveRuntime,
    codeMask,
    parseFunctionsA,
    parseFunctionsB,
    convergeFunction,
    renderFixed,
    c01Fragment,
    c02Fragment,
    matchingFinal,
    stripOuterExact,
    c03Fragment,
    decodeOneMarker,
    c04Fragment,
    verifyFragments,
    buildTarget,
    canonical,
    writeAll,
    terminalDispatch
  })
};
