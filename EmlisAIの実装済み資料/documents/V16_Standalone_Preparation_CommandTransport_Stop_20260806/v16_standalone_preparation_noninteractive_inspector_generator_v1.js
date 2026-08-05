'use strict';

const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');

const EXPECTED_SOURCE_PATH = '/workspace/scratch/e97a00d75240/Cocolon_v16_standalone_preparation_retry_v3/EmlisAIの実装済み資料/documents/V16_PublicGate_LocalEvidence_Preservation_20260805/artifacts/v16_public_gate_execution_continuation_carrier_v3_t06_sanitized_shape_extractor_v2.js';
const EXPECTED_SOURCE_BYTES = 41972;
const EXPECTED_SOURCE_LF = 1339;
const EXPECTED_SOURCE_BLOB = '69ca116c3bc8c618792f3da9bd72686a4759fd8d';
const EXPECTED_SOURCE_SHA256 = '0d2dcffe2d55c08e97dfcf588e8a13b6b26f8e5c337ee549e3ffcf41c300dcca';
const OLD_BASENAME = 'v16_public_gate_execution_continuation_carrier_v3_t06_sanitized_shape_extractor_v2.js';
const NEW_BASENAME = 'v16_public_gate_execution_continuation_carrier_v3_t06_sanitized_shape_extractor_v3.js';
const BT = String.fromCharCode(96);
const ERROR_CODES = new Set([
  'S1_ARGS', 'S1_LSTAT', 'S1_TYPE_MODE_SIZE', 'S1_REALPATH',
  'S2_OPEN', 'S2_FSTAT', 'S2_RACE', 'S2_FSTAT_CLOSE', 'S2_RACE_CLOSE',
  'S3_READ', 'S3_READ_CLOSE', 'S4_EOF', 'S4_EOF_CLOSE', 'S5_CLOSE',
  'S6_SOURCE_IDENTITY', 'S6_SOURCE_ENCODING', 'S6_JS_LEX',
  'S6_C01', 'S6_C02', 'S6_C03', 'S6_C04',
  'S6_CARDINALITY', 'S6_NONOVERLAP', 'S6_OUTSIDE',
  'S6_TARGET', 'S6_CANONICAL', 'S6_OUTPUT_LIMIT', 'S6_INTERNAL'
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

function sha256(buffer) {
  return crypto.createHash('sha256').update(buffer).digest('hex');
}

function gitBlob(buffer) {
  const header = Buffer.from('blob ' + String(buffer.length) + '\0', 'ascii');
  return crypto.createHash('sha1').update(header).update(buffer).digest('hex');
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

function readExactSource() {
  const input = process.argv[2];
  if (process.argv.length !== 3 || input !== EXPECTED_SOURCE_PATH ||
      !path.isAbsolute(input) || path.normalize(input) !== input) {
    stop('S1_ARGS');
  }

  let before;
  try {
    before = fs.lstatSync(input);
  } catch (_error) {
    stop('S1_LSTAT');
  }
  if (!before.isFile() || before.isSymbolicLink() ||
      (before.mode & 0o777) !== 0o644 || before.size !== EXPECTED_SOURCE_BYTES) {
    stop('S1_TYPE_MODE_SIZE');
  }

  let direct;
  try {
    direct = fs.realpathSync.native(input);
  } catch (_error) {
    stop('S1_REALPATH');
  }
  if (direct !== input) {
    stop('S1_REALPATH');
  }

  let fd = -1;
  let primary = null;
  let buffer = null;
  try {
    try {
      fd = fs.openSync(
        input,
        fs.constants.O_RDONLY | fs.constants.O_NOFOLLOW | fs.constants.O_NONBLOCK
      );
    } catch (_error) {
      stop('S2_OPEN');
    }

    let after;
    try {
      after = fs.fstatSync(fd);
    } catch (_error) {
      stop('S2_FSTAT');
    }
    if (!after.isFile() || (after.mode & 0o777) !== 0o644 ||
        after.size !== EXPECTED_SOURCE_BYTES) {
      stop('S2_FSTAT');
    }
    if (after.dev !== before.dev || after.ino !== before.ino) {
      stop('S2_RACE');
    }

    buffer = Buffer.alloc(EXPECTED_SOURCE_BYTES);
    let read;
    try {
      read = fs.readSync(fd, buffer, 0, buffer.length, 0);
    } catch (_error) {
      stop('S3_READ');
    }
    if (read !== buffer.length) {
      stop('S3_READ');
    }

    const probe = Buffer.alloc(1);
    let eof;
    try {
      eof = fs.readSync(fd, probe, 0, 1, buffer.length);
    } catch (_error) {
      stop('S4_EOF');
    }
    if (eof !== 0) {
      stop('S4_EOF');
    }
  } catch (error) {
    primary = codeOf(error);
  }

  if (fd >= 0) {
    try {
      fs.closeSync(fd);
    } catch (_error) {
      const closeMap = {
        S2_FSTAT: 'S2_FSTAT_CLOSE',
        S2_RACE: 'S2_RACE_CLOSE',
        S3_READ: 'S3_READ_CLOSE',
        S4_EOF: 'S4_EOF_CLOSE'
      };
      primary = primary === null ? 'S5_CLOSE' : (closeMap[primary] || 'S5_CLOSE');
    }
  }
  if (primary !== null) {
    stop(primary);
  }
  return buffer;
}

function requireSourceIdentity(buffer) {
  const m = metrics(buffer);
  if (m.bytes !== EXPECTED_SOURCE_BYTES || m.lf !== EXPECTED_SOURCE_LF ||
      m.cr !== 0 || !m.final_lf || m.git_blob !== EXPECTED_SOURCE_BLOB ||
      m.sha256 !== EXPECTED_SOURCE_SHA256) {
    stop('S6_SOURCE_IDENTITY');
  }
  const decoded = buffer.toString('utf8');
  if (!Buffer.from(decoded, 'utf8').equals(buffer)) {
    stop('S6_SOURCE_ENCODING');
  }
  for (const byte of buffer) {
    if (byte > 0x7f) {
      stop('S6_SOURCE_ENCODING');
    }
  }
  return decoded;
}

function countText(haystack, needle) {
  if (needle.length === 0) return 0;
  let count = 0;
  let at = 0;
  for (;;) {
    const found = haystack.indexOf(needle, at);
    if (found < 0) return count;
    count += 1;
    at = found + 1;
  }
}

function jsNormalMap(text) {
  const normal = new Uint8Array(text.length);
  let i = 0;
  let expectExpression = true;
  while (i < text.length) {
    const ch = text[i];
    if (/\s/.test(ch)) {
      normal[i] = 1;
      i += 1;
      continue;
    }
    if (ch === '/' && text[i + 1] === '/') {
      i += 2;
      while (i < text.length && text[i] !== '\n') i += 1;
      continue;
    }
    if (ch === '/' && text[i + 1] === '*') {
      i += 2;
      let closed = false;
      while (i + 1 < text.length) {
        if (text[i] === '*' && text[i + 1] === '/') {
          i += 2;
          closed = true;
          break;
        }
        i += 1;
      }
      if (!closed) stop('S6_JS_LEX');
      continue;
    }
    if (ch === "'" || ch === '"' || ch === BT) {
      const quote = ch;
      i += 1;
      let closed = false;
      while (i < text.length) {
        if (text[i] === '\\') {
          i += 2;
          continue;
        }
        if (text[i] === quote) {
          i += 1;
          closed = true;
          break;
        }
        i += 1;
      }
      if (!closed) stop('S6_JS_LEX');
      expectExpression = false;
      continue;
    }
    if (ch === '/') {
      if (!expectExpression) {
        normal[i] = 1;
        expectExpression = true;
        i += 1;
        continue;
      }
      i += 1;
      let inClass = false;
      let closed = false;
      while (i < text.length) {
        if (text[i] === '\\') {
          i += 2;
          continue;
        }
        if (text[i] === '[') inClass = true;
        else if (text[i] === ']') inClass = false;
        else if (text[i] === '/' && !inClass) {
          i += 1;
          while (i < text.length && /[A-Za-z]/.test(text[i])) i += 1;
          closed = true;
          break;
        }
        if (text[i] === '\n' || text[i] === '\r') break;
        i += 1;
      }
      if (!closed) stop('S6_JS_LEX');
      expectExpression = false;
      continue;
    }
    if (/[A-Za-z_$]/.test(ch)) {
      const start = i;
      while (i < text.length && /[A-Za-z0-9_$]/.test(text[i])) {
        normal[i] = 1;
        i += 1;
      }
      const word = text.slice(start, i);
      expectExpression = /^(return|throw|case|delete|void|typeof|new|yield|await|in|instanceof)$/.test(word);
      continue;
    }
    if (/[0-9]/.test(ch)) {
      while (i < text.length && /[A-Za-z0-9_.]/.test(text[i])) {
        normal[i] = 1;
        i += 1;
      }
      expectExpression = false;
      continue;
    }
    normal[i] = 1;
    if (ch === ')' || ch === ']' || ch === '}') expectExpression = false;
    else if (ch === '(' || ch === '[' || ch === '{' || ch === ',' ||
             ch === ':' || ch === ';' || ch === '?' || ch === '!' ||
             ch === '=' || ch === '+' || ch === '-' || ch === '*' ||
             ch === '%' || ch === '&' || ch === '|' || ch === '^' ||
             ch === '~' || ch === '<' || ch === '>') expectExpression = true;
    i += 1;
  }
  return normal;
}

function parseFunctions(text) {
  const normal = jsNormalMap(text);
  const result = [];
  const pattern = /\bfunction\s+([A-Za-z_$][A-Za-z0-9_$]*)\s*\(([^()]*)\)\s*\{/g;
  let match;
  while ((match = pattern.exec(text)) !== null) {
    if (!normal[match.index]) continue;
    const open = match.index + match[0].lastIndexOf('{');
    if (!normal[open]) continue;
    let depth = 0;
    let close = -1;
    for (let i = open; i < text.length; i += 1) {
      if (!normal[i]) continue;
      if (text[i] === '{') depth += 1;
      else if (text[i] === '}') {
        depth -= 1;
        if (depth === 0) {
          close = i;
          break;
        }
      }
    }
    if (close < 0) stop('S6_JS_LEX');
    const params = match[2].trim() === '' ? [] :
      match[2].split(',').map((part) => part.trim());
    if (params.some((name) => !/^[A-Za-z_$][A-Za-z0-9_$]*$/.test(name))) {
      continue;
    }
    result.push({
      name: match[1],
      params,
      start: match.index,
      end: close + 1,
      old: text.slice(match.index, close + 1)
    });
    pattern.lastIndex = close + 1;
  }
  return result;
}

function selectOne(code, candidates) {
  const unique = new Map();
  for (const candidate of candidates) {
    unique.set(String(candidate.start) + ':' + String(candidate.end) + ':' +
      sha256(Buffer.from(candidate.new || candidate.old, 'ascii')), candidate);
  }
  if (unique.size !== 1) stop(code);
  return Array.from(unique.values())[0];
}

function c01Fragment(text) {
  const first = text.indexOf(OLD_BASENAME);
  if (first < 0) stop('S6_C01');
  let last = first;
  let at = first + 1;
  for (;;) {
    const next = text.indexOf(OLD_BASENAME, at);
    if (next < 0) break;
    last = next;
    at = next + 1;
  }
  let start = text.lastIndexOf('\n\n', first);
  start = start < 0 ? 0 : start + 2;
  let end = text.indexOf('\n\n', last + OLD_BASENAME.length);
  end = end < 0 ? text.length : end + 1;
  if (end <= start || end - start > 4096) stop('S6_C01');
  const old = text.slice(start, end);
  let versionChanges = 0;
  let replacement = old.split(OLD_BASENAME).join(NEW_BASENAME);
  const quotedVersion = /\b(TOOL_VERSION|VERSION|SCHEMA_VERSION)(\s*[:=]\s*)(['"])V?2\3/g;
  replacement = replacement.replace(quotedVersion, (_all, name, sep, quote) => {
    versionChanges += 1;
    return name + sep + quote + 'V3' + quote;
  });
  const numericVersion = /\b(TOOL_VERSION|VERSION|SCHEMA_VERSION)(\s*[:=]\s*)2\b/g;
  replacement = replacement.replace(numericVersion, (_all, name, sep) => {
    versionChanges += 1;
    return name + sep + '3';
  });
  if (replacement === old || versionChanges < 1 ||
      countText(replacement, OLD_BASENAME) !== 0 ||
      countText(replacement, NEW_BASENAME) < 1) {
    stop('S6_C01');
  }
  return { id: 'C01', start, end, old, new: replacement };
}

function c02Fragment(text, functions) {
  const candidates = functions.filter((item) => {
    const lower = item.old.toLowerCase();
    return /(lex|token|scan)/.test(item.name.toLowerCase()) &&
      lower.includes('regex') &&
      (lower.includes('slash') || lower.includes('division')) &&
      (lower.includes('quote') || lower.includes('string')) &&
      item.params.filter((name) => /(source|text|code|input|expression|rhs)/i.test(name)).length === 1;
  }).map((item) => {
    const inputIndex = item.params.findIndex((name) => /(source|text|code|input|expression|rhs)/i.test(name));
    const renamed = item.name + 'V2Original';
    const prefix = '__v16C02';
    if (text.includes(renamed) || text.includes(prefix)) return null;
    const original = item.old.replace(
      new RegExp('^function\\s+' + item.name + '\\b'),
      'function ' + renamed
    );
    const params = item.params.join(', ');
    const helper = [
      '',
      'function ' + prefix + 'Mask(text, start, end, kind, used) {',
      "  const original = text.slice(start, end);",
      "  const alphabet = 'zqvxjkwy';",
      "  for (let n = 0; n < alphabet.length; n += 1) {",
      "    let mask;",
      "    if (kind === 'variable') {",
      "      mask = '$' + alphabet[n] + original.slice(2);",
      "    } else {",
      "      if (original.length < 2) throw new Error('V16_MASK_RANGE');",
      "      mask = "'" + alphabet[n].repeat(original.length - 2) + "'";",
      "    }",
      "    if (mask.length === original.length && text.indexOf(mask) < 0 && !used.has(mask)) {",
      "      used.add(mask);",
      "      return { original, mask };",
      "    }",
      "  }",
      "  throw new Error('V16_MASK_COLLISION');",
      '}',
      '',
      'function ' + prefix + 'Prepare(value) {',
      "  if (typeof value !== 'string') throw new Error('V16_LEX_INPUT');",
      '  const out = value.split("");',
      '  const mapping = [];',
      '  const used = new Set();',
      "  let previous = 'START';",
      '  let i = 0;',
      '  function install(start, end, kind) {',
      '    const row = ' + prefix + 'Mask(value, start, end, kind, used);',
      '    for (let k = 0; k < row.mask.length; k += 1) out[start + k] = row.mask[k];',
      '    mapping.push(row);',
      '  }',
      '  while (i < value.length) {',
      '    const ch = value[i];',
      '    if (/\\s/.test(ch)) { i += 1; continue; }',
      "    if (ch === '#') { while (i < value.length && value[i] !== '\\n') i += 1; continue; }",
      "    if (ch === "'" || ch === '"') {",
      '      const quote = ch; i += 1; let closed = false;',
      '      while (i < value.length) {',
      "        if (value[i] === '\\\\') { i += 2; continue; }",
      '        if (value[i] === quote) { i += 1; closed = true; break; }',
      '        i += 1;',
      '      }',
      "      if (!closed) throw new Error('V16_LEX_QUOTE');",
      "      previous = 'END'; continue;",
      '    }',
      '    if (ch.charCodeAt(0) === 96) {',
      '      const start = i; i += 1; let closed = false;',
      '      while (i < value.length) {',
      "        if (value[i] === '\\\\') { i += 2; continue; }",
      '        if (value[i].charCodeAt(0) === 96) { i += 1; closed = true; break; }',
      '        i += 1;',
      '      }',
      "      if (!closed) throw new Error('V16_LEX_BACKTICK');",
      "      install(start, i, 'opaque'); previous = 'END'; continue;",
      '    }',
      "    if (ch === '$' && value[i + 1] === '#' && /[A-Za-z_]/.test(value[i + 2] || '')) {",
      '      const start = i; i += 3;',
      '      while (i < value.length && /[A-Za-z0-9_]/.test(value[i])) i += 1;',
      "      install(start, i, 'variable'); previous = 'END'; continue;",
      '    }',
      "    if (ch === '/') {",
      "      let decision;",
      "      if (previous === 'START' || previous === 'OPEN' || previous === 'OP') decision = 'REGEX';",
      "      else if (previous === 'END') decision = 'DIVISION';",
      "      else throw new Error('V16_LEX_SLASH_CONTEXT');",
      "      if (decision === 'DIVISION') { previous = 'OP'; i += 1; continue; }",
      '      const start = i; i += 1; let inClass = false; let closed = false;',
      '      while (i < value.length) {',
      "        if (value[i] === '\\\\') { i += 2; continue; }",
      "        if (value[i] === '[') inClass = true;",
      "        else if (value[i] === ']') inClass = false;",
      "        else if (value[i] === '/' && !inClass) { i += 1; closed = true; break; }",
      "        if (value[i] === '\\n' || value[i] === '\\r') break;",
      '        i += 1;',
      '      }',
      "      if (!closed) throw new Error('V16_LEX_REGEX');",
      '      while (i < value.length && /[A-Za-z]/.test(value[i])) i += 1;',
      "      install(start, i, 'opaque'); previous = 'END'; continue;",
      '    }',
      "    if (/[A-Za-z_$]/.test(ch)) {",
      '      i += 1; while (i < value.length && /[A-Za-z0-9_$]/.test(value[i])) i += 1;',
      "      previous = 'END'; continue;",
      '    }',
      "    if (/[0-9]/.test(ch)) {",
      '      i += 1; while (i < value.length && /[A-Za-z0-9_.]/.test(value[i])) i += 1;',
      "      previous = 'END'; continue;",
      '    }',
      "    if (ch === '(' || ch === '[' || ch === '{' || ch === ',' || ch === ';' || ch === ':') {",
      "      previous = 'OPEN'; i += 1; continue;",
      '    }',
      "    if (ch === ')' || ch === ']' || ch === '}') { previous = 'END'; i += 1; continue; }",
      "    if ('=+-*%&|^!~<>?.'.includes(ch)) { previous = 'OP'; i += 1; continue; }",
      "    throw new Error('V16_LEX_UNKNOWN');",
      '  }',
      "  return { text: out.join(''), mapping };",
      '}',
      '',
      'function ' + prefix + 'Restore(value, mapping, seen) {',
      "  if (typeof value === 'string') {",
      '    let result = value;',
      '    for (const row of mapping) result = result.split(row.mask).join(row.original);',
      '    return result;',
      '  }',
      '  if (value === null || typeof value !== "object") return value;',
      '  const memo = seen || new WeakMap();',
      '  if (memo.has(value)) return memo.get(value);',
      '  if (Array.isArray(value)) {',
      '    const array = []; memo.set(value, array);',
      '    for (const item of value) array.push(' + prefix + 'Restore(item, mapping, memo));',
      '    return array;',
      '  }',
      '  const object = {}; memo.set(value, object);',
      '  for (const key of Object.keys(value)) object[key] = ' + prefix + 'Restore(value[key], mapping, memo);',
      '  return object;',
      '}',
      '',
      'function ' + item.name + '(' + params + ') {',
      '  const prepared = ' + prefix + 'Prepare(' + item.params[inputIndex] + ');',
      '  const args = Array.prototype.slice.call(arguments);',
      '  args[' + String(inputIndex) + '] = prepared.text;',
      '  const result = ' + renamed + '.apply(this, args);',
      '  return ' + prefix + 'Restore(result, prepared.mapping);',
      '}'
    ].join('\n');
    return { ...item, new: original + helper };
  }).filter(Boolean);
  const chosen = selectOne('S6_C02', candidates);
  return { id: 'C02', start: chosen.start, end: chosen.end, old: chosen.old, new: chosen.new };
}

function balancedOuterHelper(prefix) {
  return [
    'function ' + prefix + 'MatchingFinal(text) {',
    '  const stack = []; let quote = null; let escaped = false;',
    '  for (let i = 0; i < text.length; i += 1) {',
    '    const ch = text[i];',
    '    if (quote !== null) {',
    "      if (escaped) { escaped = false; continue; }",
    "      if (ch === '\\\\') { escaped = true; continue; }",
    '      if (ch === quote) quote = null;',
    '      continue;',
    '    }',
    "    if (ch === "'" || ch === '"' || ch.charCodeAt(0) === 96) { quote = ch; continue; }",
    "    if (ch === '(' || ch === '[' || ch === '{') { stack.push(ch); continue; }",
    "    if (ch === ')' || ch === ']' || ch === '}') {",
    "      const want = ch === ')' ? '(' : (ch === ']' ? '[' : '{');",
    '      if (stack.length === 0 || stack.pop() !== want) return -1;',
    "      if (stack.length === 0 && ch === ')') return i;",
    '    }',
    '  }',
    '  return -1;',
    '}',
    'function ' + prefix + 'Strip(value) {',
    "  if (typeof value !== 'string') return value;",
    '  let current = value;',
    '  for (;;) {',
    '    const leftTrim = current.match(/^\\s*/)[0].length;',
    '    const rightTrim = current.match(/\\s*$/)[0].length;',
    '    const end = current.length - rightTrim;',
    "    if (leftTrim >= end || current[leftTrim] !== '(') return current;",
    '    const inner = current.slice(leftTrim, end);',
    '    const close = ' + prefix + 'MatchingFinal(inner);',
    '    if (close !== inner.length - 1) return current;',
    '    current = current.slice(0, leftTrim) + inner.slice(1, -1) + current.slice(end);',
    '  }',
    '}'
  ].join('\n');
}

function c03Fragment(text, functions) {
  const candidates = functions.filter((item) => {
    const lowerName = item.name.toLowerCase();
    const lower = item.old.toLowerCase();
    return /(strip|remove|unwrap)/.test(lowerName) &&
      /(paren|parenth)/.test(lowerName + ' ' + lower) &&
      item.params.length === 1 &&
      (lower.includes('startswith') || lower.includes('endswith') || lower.includes('slice'));
  }).map((item) => {
    const renamed = item.name + 'V2Original';
    const prefix = '__v16C03';
    if (text.includes(renamed) || text.includes(prefix)) return null;
    const original = item.old.replace(
      new RegExp('^function\\s+' + item.name + '\\b'),
      'function ' + renamed
    );
    const replacement = [
      original,
      '',
      balancedOuterHelper(prefix),
      '',
      'function ' + item.name + '(' + item.params[0] + ') {',
      '  return ' + prefix + 'Strip(' + item.params[0] + ');',
      '}'
    ].join('\n');
    return { ...item, new: replacement };
  }).filter(Boolean);
  const chosen = selectOne('S6_C03', candidates);
  return { id: 'C03', start: chosen.start, end: chosen.end, old: chosen.old, new: chosen.new };
}

function c04Fragment(text, functions) {
  const candidates = functions.filter((item) => {
    const lower = (item.name + ' ' + item.old).toLowerCase();
    const marker = item.params.filter((name) => /(marker|expected|rhs)/i.test(name));
    const argument = item.params.filter((name) => /(arg|argument|expression|text|actual|lhs)/i.test(name));
    return lower.includes('marker') && /(arg|argument|exact|equal|match)/.test(lower) &&
      marker.length === 1 && argument.length === 1 && marker[0] !== argument[0];
  }).map((item) => {
    const marker = item.params.find((name) => /(marker|expected|rhs)/i.test(name));
    const argument = item.params.find((name) => /(arg|argument|expression|text|actual|lhs)/i.test(name));
    const renamed = item.name + 'V2Original';
    const prefix = '__v16C04';
    if (text.includes(renamed) || text.includes(prefix)) return null;
    const original = item.old.replace(
      new RegExp('^function\\s+' + item.name + '\\b'),
      'function ' + renamed
    );
    const decoder = [
      balancedOuterHelper(prefix),
      'function ' + prefix + 'DecodeOne(value) {',
      '  const stripped = ' + prefix + 'Strip(String(value)).trim();',
      '  if (stripped.length < 2) return null;',
      '  const quote = stripped[0];',
      "  if (quote !== "'" && quote !== '"') return null;",
      '  let out = ""; let i = 1;',
      '  while (i < stripped.length) {',
      '    const ch = stripped[i];',
      '    if (ch === quote) return i === stripped.length - 1 ? out : null;',
      "    if (ch !== '\\\\') { out += ch; i += 1; continue; }",
      '    i += 1; if (i >= stripped.length) return null;',
      '    const esc = stripped[i];',
      "    if (quote === "'") {",
      "      if (esc === "'" || esc === '\\\\') out += esc;",
      "      else out += '\\\\' + esc;",
      '      i += 1; continue;',
      '    }',
      "    const simple = { n: '\\n', r: '\\r', t: '\\t', f: '\\f', b: '\\b', a: '\\x07', e: '\\x1b', '"': '"', '\\\\': '\\\\' };",
      '    if (Object.prototype.hasOwnProperty.call(simple, esc)) { out += simple[esc]; i += 1; continue; }',
      "    if (esc === 'x') {",
      '      const hex = stripped.slice(i + 1, i + 3);',
      '      if (!/^[0-9A-Fa-f]{2}$/.test(hex)) return null;',
      '      out += String.fromCharCode(parseInt(hex, 16)); i += 3; continue;',
      '    }',
      '    return null;',
      '  }',
      '  return null;',
      '}'
    ].join('\n');
    const replacement = [
      original,
      '',
      decoder,
      '',
      'function ' + item.name + '(' + item.params.join(', ') + ') {',
      '  const decoded = ' + prefix + 'DecodeOne(' + argument + ');',
      '  return decoded !== null && decoded === String(' + marker + ');',
      '}'
    ].join('\n');
    return { ...item, new: replacement };
  }).filter(Boolean);
  const chosen = selectOne('S6_C04', candidates);
  return { id: 'C04', start: chosen.start, end: chosen.end, old: chosen.old, new: chosen.new };
}

function verifyFragments(source, fragments) {
  if (fragments.length !== 4 || fragments.map((row) => row.id).join(',') !== 'C01,C02,C03,C04') {
    stop('S6_CARDINALITY');
  }
  for (const row of fragments) {
    if (row.end <= row.start || source.slice(row.start, row.end) !== row.old ||
        countText(source, row.old) !== 1 || row.new === row.old) {
      stop('S6_CARDINALITY');
    }
  }
  const ordered = fragments.slice().sort((a, b) => a.start - b.start);
  for (let i = 1; i < ordered.length; i += 1) {
    if (ordered[i - 1].end > ordered[i].start) stop('S6_NONOVERLAP');
  }

  const pieces = [];
  const gaps = [];
  let sourceAt = 0;
  let candidateAt = 0;
  for (const row of ordered) {
    const gap = Buffer.from(source.slice(sourceAt, row.start), 'ascii');
    pieces.push(gap);
    gaps.push({
      source_start: sourceAt,
      source_end: row.start,
      candidate_start: candidateAt,
      candidate_end: candidateAt + gap.length,
      sha256: sha256(gap)
    });
    candidateAt += gap.length;
    const replacement = Buffer.from(row.new, 'ascii');
    pieces.push(replacement);
    candidateAt += replacement.length;
    sourceAt = row.end;
  }
  const tail = Buffer.from(source.slice(sourceAt), 'ascii');
  pieces.push(tail);
  gaps.push({
    source_start: sourceAt,
    source_end: source.length,
    candidate_start: candidateAt,
    candidate_end: candidateAt + tail.length,
    sha256: sha256(tail)
  });
  const candidate = Buffer.concat(pieces);
  const outsideSource = Buffer.concat(gaps.map((gap) =>
    Buffer.from(source.slice(gap.source_start, gap.source_end), 'ascii')));
  const outsideCandidate = Buffer.concat(gaps.map((gap) =>
    candidate.subarray(gap.candidate_start, gap.candidate_end)));
  const delta = fragments.reduce((sum, row) =>
    sum + Buffer.byteLength(row.new, 'ascii') - Buffer.byteLength(row.old, 'ascii'), 0);
  if (!outsideSource.equals(outsideCandidate) ||
      candidate.length !== Buffer.byteLength(source, 'ascii') + delta) {
    stop('S6_OUTSIDE');
  }
  return { ordered, candidate, gaps, outsideSource, outsideCandidate };
}

function buildTarget(fragments) {
  const data = fragments.map((row) => ({
    id: row.id,
    old_b64: Buffer.from(row.old, 'ascii').toString('base64'),
    new_b64: Buffer.from(row.new, 'ascii').toString('base64')
  }));
  const lines = [
    "'use strict';",
    "",
    "const fs = require('node:fs');",
    "const path = require('node:path');",
    "const crypto = require('node:crypto');",
    "const SOURCE_BYTES = 41972;",
    "const SOURCE_LF = 1339;",
    "const SOURCE_BLOB = '69ca116c3bc8c618792f3da9bd72686a4759fd8d';",
    "const SOURCE_SHA256 = '0d2dcffe2d55c08e97dfcf588e8a13b6b26f8e5c337ee549e3ffcf41c300dcca';",
    "const FRAGMENTS = " + JSON.stringify(data) + ";",
    "",
    "function digest(name, buffer) { return crypto.createHash(name).update(buffer).digest('hex'); }",
    "function blob(buffer) { return digest('sha1', Buffer.concat([Buffer.from('blob ' + buffer.length + '\\0', 'ascii'), buffer])); }",
    "function fail() { throw new Error('V16_TARGET_STOP'); }",
    "function count(haystack, needle) {",
    "  let n = 0; let at = 0;",
    "  for (;;) { const found = haystack.indexOf(needle, at); if (found < 0) return n; n += 1; at = found + 1; }",
    "}",
    "function readSource(file) {",
    "  const before = fs.lstatSync(file);",
    "  if (!before.isFile() || before.isSymbolicLink() || (before.mode & 0o777) !== 0o644 || before.size !== SOURCE_BYTES) fail();",
    "  if (fs.realpathSync.native(file) !== file) fail();",
    "  const fd = fs.openSync(file, fs.constants.O_RDONLY | fs.constants.O_NOFOLLOW | fs.constants.O_NONBLOCK);",
    "  let buffer; let ok = false;",
    "  try {",
    "    const after = fs.fstatSync(fd);",
    "    if (!after.isFile() || after.dev !== before.dev || after.ino !== before.ino || after.size !== SOURCE_BYTES) fail();",
    "    buffer = Buffer.alloc(SOURCE_BYTES);",
    "    if (fs.readSync(fd, buffer, 0, buffer.length, 0) !== buffer.length) fail();",
    "    if (fs.readSync(fd, Buffer.alloc(1), 0, 1, buffer.length) !== 0) fail();",
    "    ok = true;",
    "  } finally { fs.closeSync(fd); }",
    "  if (!ok) fail();",
    "  let lf = 0; let cr = 0; for (const b of buffer) { if (b === 10) lf += 1; if (b === 13) cr += 1; }",
    "  if (lf !== SOURCE_LF || cr !== 0 || buffer[buffer.length - 1] !== 10 || blob(buffer) !== SOURCE_BLOB || digest('sha256', buffer) !== SOURCE_SHA256) fail();",
    "  return buffer;",
    "}",
    "function safeRelative(value) {",
    "  return typeof value === 'string' && value.length > 0 && !path.posix.isAbsolute(value) && !path.win32.isAbsolute(value) &&",
    "    path.posix.normalize(value) === value && !value.includes('\\\\') && !/[\\r\\n\\0]/.test(value) &&",
    "    value.split('/').every((part) => part !== '' && part !== '.' && part !== '..');",
    "}",
    "function makeCandidate(source) {",
    "  const rows = FRAGMENTS.map((item) => {",
    "    const oldBytes = Buffer.from(item.old_b64, 'base64'); const newBytes = Buffer.from(item.new_b64, 'base64');",
    "    if (oldBytes.toString('base64') !== item.old_b64 || newBytes.toString('base64') !== item.new_b64 || oldBytes.length === 0) fail();",
    "    const start = source.indexOf(oldBytes); if (start < 0 || count(source, oldBytes) !== 1) fail();",
    "    return { id: item.id, start, end: start + oldBytes.length, oldBytes, newBytes };",
    "  }).sort((a, b) => a.start - b.start);",
    "  if (rows.map((row) => row.id).sort().join(',') !== 'C01,C02,C03,C04') fail();",
    "  for (let i = 1; i < rows.length; i += 1) if (rows[i - 1].end > rows[i].start) fail();",
    "  const pieces = []; let at = 0; for (const row of rows) { pieces.push(source.subarray(at, row.start), row.newBytes); at = row.end; } pieces.push(source.subarray(at));",
    "  return Buffer.concat(pieces);",
    "}",
    "function main() {",
    "  if (process.argv.length !== 5) fail();",
    "  const sourcePath = process.argv[2]; const targetPath = process.argv[3]; const relative = process.argv[4];",
    "  if (!path.isAbsolute(sourcePath) || path.normalize(sourcePath) !== sourcePath || !path.isAbsolute(targetPath) || path.normalize(targetPath) !== targetPath || !safeRelative(relative)) fail();",
    "  try { fs.lstatSync(targetPath); fail(); } catch (error) { if (!error || error.code !== 'ENOENT') fail(); }",
    "  const candidate = makeCandidate(readSource(sourcePath));",
    "  if (candidate[candidate.length - 1] !== 10 || candidate.includes(13)) fail();",
    "  const text = candidate.toString('utf8'); if (!Buffer.from(text, 'utf8').equals(candidate)) fail();",
    "  const body = text.slice(0, -1).split('\\n').map((line) => '+' + line).join('\\n') + '\\n';",
    "  const patch = Buffer.from('*** Begin Patch\\n*** Add File: ' + relative + '\\n' + body + '*** End Patch\\n', 'utf8');",
    "  const patchText = patch.toString('utf8'); const all = patchText.split('\\n');",
    "  if (all[0] !== '*** Begin Patch' || all[1] !== '*** Add File: ' + relative || all[all.length - 2] !== '*** End Patch' || all[all.length - 1] !== '') fail();",
    "  const decoded = Buffer.from(all.slice(2, -2).map((line) => { if (!line.startsWith('+')) fail(); return line.slice(1); }).join('\\n') + '\\n', 'utf8');",
    "  if (!decoded.equals(candidate)) fail();",
    "  if (fs.writeSync(1, patch) !== patch.length) fail();",
    "}",
    "try { main(); } catch (_error) { try { fs.writeSync(2, Buffer.from('V16_TARGET_STOP\\n', 'ascii')); } catch (_ignored) {} process.exitCode = 70; }",
    ""
  ];
  const target = Buffer.from(lines.join('\n'), 'ascii');
  if (target.includes(13) || target[target.length - 1] !== 10) stop('S6_TARGET');
  return target;
}

function canonical(value) {
  const encoded = JSON.stringify(value);
  for (let i = 0; i < encoded.length; i += 1) {
    if (encoded.charCodeAt(i) > 0x7f) stop('S6_CANONICAL');
  }
  const buffer = Buffer.from(encoded + '\n', 'ascii');
  if (buffer.length > 131072 || buffer[buffer.length - 1] !== 10) stop('S6_OUTPUT_LIMIT');
  return buffer;
}

function inspect(sourceBuffer) {
  const source = requireSourceIdentity(sourceBuffer);
  const functions = parseFunctions(source);
  const fragments = [
    c01Fragment(source),
    c02Fragment(source, functions),
    c03Fragment(source, functions),
    c04Fragment(source, functions)
  ];
  const proof = verifyFragments(source, fragments);
  const target = buildTarget(fragments);
  const sourceMetrics = metrics(sourceBuffer);
  const candidateMetrics = metrics(proof.candidate);
  const targetMetrics = metrics(target);
  const rows = fragments.map((row) => {
    const oldBuffer = Buffer.from(row.old, 'ascii');
    const newBuffer = Buffer.from(row.new, 'ascii');
    const oldB64 = oldBuffer.toString('base64');
    const newB64 = newBuffer.toString('base64');
    if (Buffer.from(oldB64, 'base64').toString('base64') !== oldB64 ||
        Buffer.from(newB64, 'base64').toString('base64') !== newB64) {
      stop('S6_CANONICAL');
    }
    return {
      id: row.id,
      old_b64: oldB64,
      new_b64: newB64,
      occurrences: 1,
      start: row.start,
      end: row.end,
      old_bytes: oldBuffer.length,
      new_bytes: newBuffer.length
    };
  });
  const targetB64 = target.toString('base64');
  if (!/^[A-Za-z0-9+/]*={0,2}$/.test(targetB64) ||
      targetB64.length % 4 !== 0 ||
      Buffer.from(targetB64, 'base64').toString('base64') !== targetB64) {
    stop('S6_TARGET');
  }
  return canonical({
    schema: 'v16_standalone_preparation_exact4_v1',
    status: 'EXACT4_AND_TARGET_PREPARED_UNREVIEWED_NONCREDIT',
    source: {
      bytes: sourceMetrics.bytes,
      lf: sourceMetrics.lf,
      cr: sourceMetrics.cr,
      final_lf: sourceMetrics.final_lf,
      git_blob: sourceMetrics.git_blob,
      sha256: sourceMetrics.sha256
    },
    fragments: rows,
    ranges_nonoverlap: true,
    outside: {
      gaps: proof.gaps,
      bytes: proof.outsideSource.length,
      source_sha256: sha256(proof.outsideSource),
      candidate_sha256: sha256(proof.outsideCandidate),
      equal: proof.outsideSource.equals(proof.outsideCandidate)
    },
    candidate_v3: {
      bytes: candidateMetrics.bytes,
      lf: candidateMetrics.lf,
      cr: candidateMetrics.cr,
      final_lf: candidateMetrics.final_lf,
      git_blob: candidateMetrics.git_blob,
      sha256: candidateMetrics.sha256
    },
    target_b64: targetB64,
    target_bytes: targetMetrics.bytes,
    target_lf: targetMetrics.lf,
    target_cr: targetMetrics.cr,
    target_final_lf: targetMetrics.final_lf,
    target_git_blob: targetMetrics.git_blob,
    target_sha256: targetMetrics.sha256
  });
}

let failure = null;
let output = null;
try {
  output = inspect(readExactSource());
} catch (error) {
  failure = codeOf(error);
}
if (failure !== null) {
  try {
    fs.writeSync(2, Buffer.from(failure + '\n', 'ascii'));
  } catch (_ignored) {
  }
  process.exitCode = 64;
} else {
  const written = fs.writeSync(1, output);
  if (written !== output.length) process.exitCode = 74;
}
