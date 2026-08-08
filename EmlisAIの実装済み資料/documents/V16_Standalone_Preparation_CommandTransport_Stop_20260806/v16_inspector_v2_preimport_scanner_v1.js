'use strict';

const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');

const EXPECTED = Object.freeze({
  inspector: Object.freeze({
    basename: 'V16_INSPECTOR_V2_SINGLE_CREATE_CANDIDATE.js',
    sha256: 'db7c36351070487d98c34d6d34710f25ce010bb54f33d744102e00f5fcf5fc31',
    requires: Object.freeze(['node:fs', 'node:path', 'node:crypto']),
  }),
  harness: Object.freeze({
    basename: 'v16_standalone_preparation_inspector_v2_synthetic_harness_v1.js',
    sha256: '6950bf08242c42d96e2bab53d3dca845cec2b261298e2268cce6a52ffd9734ad',
    requires: Object.freeze(['node:path', './V16_INSPECTOR_V2_SINGLE_CREATE_CANDIDATE.js']),
  }),
});

function stop(code) {
  process.stdout.write('');
  process.stderr.write(`STOP ${code}\n`);
  process.exitCode = 2;
}

function sha256(buffer) {
  return crypto.createHash('sha256').update(buffer).digest('hex');
}

function isIdentChar(ch) {
  return /[A-Za-z0-9_$]/u.test(ch || '');
}

function decodeSimpleString(source, quoteIndex) {
  const quote = source[quoteIndex];
  let value = '';
  for (let i = quoteIndex + 1; i < source.length; i += 1) {
    const ch = source[i];
    if (ch === quote) return { value, end: i + 1 };
    if (ch === '\n' || ch === '\r') return null;
    if (ch !== '\\') {
      value += ch;
      continue;
    }
    i += 1;
    if (i >= source.length) return null;
    const escaped = source[i];
    const map = { n: '\n', r: '\r', t: '\t', b: '\b', f: '\f', v: '\v', '0': '\0' };
    if (Object.prototype.hasOwnProperty.call(map, escaped)) value += map[escaped];
    else if (escaped === quote || escaped === '\\') value += escaped;
    else return null;
  }
  return null;
}

function canStartRegex(code, index) {
  let j = index - 1;
  while (j >= 0 && /\s/u.test(code[j])) j -= 1;
  if (j < 0) return true;
  if (code[j] === 'C' || code[j] === 'B') return true;
  let k = j - 1;
  while (k >= 0 && /\s/u.test(code[k])) k -= 1;
  if ((code[j] === '+' || code[j] === '-') && code[k] === code[j]) return false;
  if ('([{:;,=!?&|+-*%^~<>'.includes(code[j])) return true;
  const prefix = code.slice(0, j + 1).join('');
  const word = /([A-Za-z_$][A-Za-z0-9_$]*)$/u.exec(prefix);
  return Boolean(word && new Set([
    'return', 'case', 'throw', 'else', 'do', 'typeof', 'instanceof',
    'in', 'of', 'yield', 'await', 'delete', 'void', 'new',
  ]).has(word[1]));
}

function scanActiveCode(source) {
  const code = Array.from(source, () => ' ');
  const requires = [];
  let dynamicRequireCount = 0;
  let i = 0;
  const contexts = [{ kind: 'code', templateExpressionDepth: null }];
  const parenKinds = [];
  const braceKinds = [];

  const current = () => contexts[contexts.length - 1];
  while (i < source.length) {
    const ctx = current();
    const ch = source[i];
    const next = source[i + 1] || '';

    if (ctx.kind === 'lineComment') {
      if (ch === '\n') {
        code[i] = '\n';
        contexts.pop();
      }
      i += 1;
      continue;
    }
    if (ctx.kind === 'blockComment') {
      if (ch === '*' && next === '/') {
        i += 2;
        contexts.pop();
      } else i += 1;
      continue;
    }
    if (ctx.kind === 'string') {
      if (ch === '\\') i += 2;
      else if (ch === ctx.quote) {
        code[i] = 'S';
        i += 1;
        contexts.pop();
      } else i += 1;
      continue;
    }
    if (ctx.kind === 'regex') {
      if (ch === '\\') {
        i += 2;
        continue;
      }
      if (ch === '[') {
        ctx.inClass = true;
        i += 1;
        continue;
      }
      if (ch === ']' && ctx.inClass) {
        ctx.inClass = false;
        i += 1;
        continue;
      }
      if (ch === '/' && !ctx.inClass) {
        code[i] = 'R';
        i += 1;
        while (/[A-Za-z]/u.test(source[i] || '')) i += 1;
        contexts.pop();
      } else i += 1;
      continue;
    }
    if (ctx.kind === 'template') {
      if (ch === '\\') {
        i += 2;
        continue;
      }
      if (ch === '`') {
        code[i] = 'T';
        i += 1;
        contexts.pop();
        continue;
      }
      if (ch === '$' && next === '{') {
        code[i] = '$';
        code[i + 1] = '{';
        contexts.push({ kind: 'code', templateExpressionDepth: 1 });
        i += 2;
        continue;
      }
      i += 1;
      continue;
    }

    if (ch === '/' && next === '/') {
      contexts.push({ kind: 'lineComment' });
      i += 2;
      continue;
    }
    if (ch === '/' && next === '*') {
      contexts.push({ kind: 'blockComment' });
      i += 2;
      continue;
    }
    if (ch === '/' && canStartRegex(code, i)) {
      contexts.push({ kind: 'regex', inClass: false });
      i += 1;
      continue;
    }
    if (ch === '\'' || ch === '"') {
      contexts.push({ kind: 'string', quote: ch });
      i += 1;
      continue;
    }
    if (ch === '`') {
      contexts.push({ kind: 'template' });
      i += 1;
      continue;
    }

    code[i] = ch;
    if (ch === '(') {
      const prefix = code.slice(0, i).join('');
      const word = /([A-Za-z_$][A-Za-z0-9_$]*)\s*$/u.exec(prefix);
      const control = Boolean(word && new Set(['if', 'while', 'for', 'with', 'catch', 'switch']).has(word[1]));
      parenKinds.push(control ? 'control' : 'expression');
    } else if (ch === ')') {
      const kind = parenKinds.pop();
      if (!kind) return { error: 'PAREN_STATE_UNBALANCED' };
      if (kind === 'control') code[i] = 'C';
    } else if (ch === '{' && ctx.templateExpressionDepth === null) {
      let j = i - 1;
      while (j >= 0 && /\s/u.test(code[j])) j -= 1;
      const prefix = code.slice(0, j + 1).join('');
      const word = /([A-Za-z_$][A-Za-z0-9_$]*)\s*$/u.exec(prefix);
      const block = j < 0
        || code[j] === 'C'
        || code[j] === 'B'
        || code[j] === ';'
        || code[j] === ':'
        || code[j] === '>'
        || code[j] === ')'
        || /\bclass\b[^{};]*$/u.test(prefix)
        || Boolean(word && new Set(['else', 'try', 'catch', 'finally', 'do', 'class']).has(word[1]));
      braceKinds.push(block ? 'block' : 'expression');
    } else if (ch === '}' && ctx.templateExpressionDepth === null) {
      const kind = braceKinds.pop();
      if (!kind) return { error: 'BRACE_STATE_UNBALANCED' };
      if (kind === 'block') code[i] = 'B';
    }
    if (ctx.templateExpressionDepth !== null) {
      if (ch === '{') ctx.templateExpressionDepth += 1;
      if (ch === '}') {
        ctx.templateExpressionDepth -= 1;
        if (ctx.templateExpressionDepth === 0) {
          contexts.pop();
          i += 1;
          continue;
        }
      }
    }

    if (
      source.startsWith('require', i)
      && !isIdentChar(source[i - 1])
      && !isIdentChar(source[i + 7])
    ) {
      for (let j = i; j < i + 7; j += 1) code[j] = source[j];
      let j = i + 7;
      while (/\s/u.test(source[j] || '')) j += 1;
      if (source[j] === '(') {
        code[j] = '(';
        j += 1;
        while (/\s/u.test(source[j] || '')) j += 1;
        if (source[j] === '\'' || source[j] === '"') {
          const parsed = decodeSimpleString(source, j);
          if (parsed) {
            let k = parsed.end;
            while (/\s/u.test(source[k] || '')) k += 1;
            if (source[k] === ')') requires.push(parsed.value);
            else dynamicRequireCount += 1;
          } else dynamicRequireCount += 1;
        } else dynamicRequireCount += 1;
      }
    }
    i += 1;
  }

  if (contexts.length !== 1 || current().kind !== 'code' || parenKinds.length !== 0 || braceKinds.length !== 0) {
    return { error: 'LEXICAL_STATE_UNCLOSED' };
  }
  return { code: code.join(''), requires, dynamicRequireCount };
}

function sameList(actual, expected) {
  return actual.length === expected.length && actual.every((item, index) => item === expected[index]);
}

function inspect(label, filePath, expected) {
  if (!path.isAbsolute(filePath) || path.basename(filePath) !== expected.basename) {
    return `${label.toUpperCase()}_PATH`;
  }
  const stat = fs.lstatSync(filePath);
  if (!stat.isFile() || stat.isSymbolicLink() || (stat.mode & 0o777) !== 0o644) {
    return `${label.toUpperCase()}_FILE_IDENTITY`;
  }
  const buffer = fs.readFileSync(filePath);
  if (sha256(buffer) !== expected.sha256 || buffer.includes(0) || buffer.includes(13)) {
    return `${label.toUpperCase()}_BYTE_IDENTITY`;
  }
  const source = buffer.toString('utf8');
  if (!Buffer.from(source, 'utf8').equals(buffer)) return `${label.toUpperCase()}_UTF8`;
  const scan = scanActiveCode(source);
  if (scan.error) return `${label.toUpperCase()}_${scan.error}`;
  if (scan.dynamicRequireCount !== 0 || !sameList(scan.requires, expected.requires)) {
    return `${label.toUpperCase()}_REQUIRE_SET`;
  }
  const active = scan.code;
  const guards = active.match(/require\s*\.\s*main\s*===\s*module/gu) || [];
  if (guards.length !== 1) return `${label.toUpperCase()}_MAIN_GUARD`;
  const requireIdentifiers = active.match(/\brequire\b/gu) || [];
  if (requireIdentifiers.length !== expected.requires.length + 1) {
    return `${label.toUpperCase()}_NONCANONICAL_REQUIRE`;
  }
  const forbidden = [
    /\bimport\s*\(/u,
    /\beval\b/u,
    /\bFunction\b/u,
    /\bprocess\s*\.\s*env\b/u,
    /\bprocess\s*\.\s*cwd\s*\(/u,
    /\bprocess\s*\.\s*chdir\s*\(/u,
    /\b(?:exec|execFile|spawn|fork)\s*\(/u,
  ];
  if (forbidden.some((pattern) => pattern.test(active))) return `${label.toUpperCase()}_FORBIDDEN_ACTIVE_CALL`;
  return null;
}

function main() {
  if (process.argv.length !== 4) return stop('ARGV');
  try {
    const inspectorError = inspect('inspector', process.argv[2], EXPECTED.inspector);
    if (inspectorError) return stop(inspectorError);
    const harnessError = inspect('harness', process.argv[3], EXPECTED.harness);
    if (harnessError) return stop(harnessError);
    process.stdout.write('PASS\n');
    process.stderr.write('');
    return undefined;
  } catch {
    return stop('UNEXPECTED');
  }
}

if (require.main === module) main();
