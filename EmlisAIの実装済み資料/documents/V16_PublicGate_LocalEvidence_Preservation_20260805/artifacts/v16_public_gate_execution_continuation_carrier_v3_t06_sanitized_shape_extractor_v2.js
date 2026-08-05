'use strict';

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const PROGRAM_RELATIVE_PATH = 'v16_retry2_draft/v16_public_gate_execution_continuation_carrier_v3_t06_sanitized_shape_extractor_v2.js';
const SOURCE_RELATIVE_PATH = 'v16_retry2_draft/v16_public_gate_execution_continuation_carrier_v3_lineage_transformer_v3.pl';
const SOURCE_BYTES = 14081;
const SOURCE_LF = 280;
const SOURCE_SHA256 = '971a4f79f6352e209df088bd619787ac93ceaf1ab0163e5e5cbaefd6d092d83d';
const ABC_SHA256 = 'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad';
const OUTPUT_SCHEMA = 'V16_T06_SANITIZED_SHAPE_PROJECTION_V1';
const OUTPUT_TERMINAL = 'SANITIZED_T06_SHAPE_READY';
const MAX_TOKENS = 10000;
const MAX_RHS_TOKENS = 512;
const MAX_STATEMENT_TOKENS = 256;
const MAX_VALIDATOR_CANDIDATES = 8;
const MAX_OUTPUT_BYTES = 32768;
const EXIT_GATE = 41;
const EXIT_INTERNAL = 42;
const EXIT_WRITE = 43;

function gate() {
  throw { gateCode: EXIT_GATE };
}

function ensure(condition) {
  if (!condition) {
    gate();
  }
}

function sha256(buffer) {
  return crypto.createHash('sha256').update(buffer).digest('hex');
}

function countByte(buffer, value) {
  let count = 0;
  for (let index = 0; index < buffer.length; index += 1) {
    if (buffer[index] === value) {
      count += 1;
    }
  }
  return count;
}

function primitiveSelfTest() {
  const literal = Buffer.from([97, 98, 99]);
  ensure(literal.length === 3);
  ensure(literal[0] === 97 && literal[1] === 98 && literal[2] === 99);
  ensure(literal.toString('ascii') === 'abc');
  ensure(sha256(literal) === ABC_SHA256);
}

function verifySourceByteDomain(buffer) {
  ensure(Buffer.isBuffer(buffer));
  for (let index = 0; index < buffer.length; index += 1) {
    const value = buffer[index];
    if (value === 0x09 || value === 0x0a) {
      continue;
    }
    ensure(value >= 0x20 && value <= 0x7e);
  }
}

function validateRoot(root) {
  ensure(typeof root === 'string');
  ensure(root.length > 1);
  ensure(!root.includes('\u0000'));
  ensure(path.isAbsolute(root));
  ensure(path.normalize(root) === root);
  const parsed = path.parse(root);
  ensure(parsed.root.length > 0);
  const remainder = root.slice(parsed.root.length);
  ensure(remainder.length > 0);
  const segments = remainder.split(path.sep);
  ensure(segments.length > 0);
  for (const segment of segments) {
    ensure(segment.length > 0);
    ensure(segment !== '.' && segment !== '..');
  }
  const stat = fs.statSync(root);
  ensure(stat.isDirectory());
  const real = fs.realpathSync.native(root);
  ensure(real === root);
  return root;
}

function validateFixedRelative(relativePath) {
  ensure(typeof relativePath === 'string');
  ensure(relativePath.length > 0);
  ensure(!relativePath.includes('\u0000'));
  ensure(!path.isAbsolute(relativePath));
  ensure(path.posix.normalize(relativePath) === relativePath);
  const segments = relativePath.split('/');
  ensure(segments.length > 1);
  for (const segment of segments) {
    ensure(segment.length > 0);
    ensure(segment !== '.' && segment !== '..');
  }
}

function resolveInside(root, relativePath) {
  validateFixedRelative(relativePath);
  const absolute = path.resolve(root, ...relativePath.split('/'));
  ensure(absolute.startsWith(root + path.sep));
  return absolute;
}

function validateSourcePhysicalPath(root, sourceAbsolute) {
  const sourceReal = fs.realpathSync.native(sourceAbsolute);
  ensure(sourceReal === sourceAbsolute);
  ensure(sourceReal.startsWith(root + path.sep));
}

function readExactSource(sourceAbsolute) {
  ensure(Number.isInteger(fs.constants.O_NOFOLLOW));
  ensure(Number.isInteger(fs.constants.O_NONBLOCK));
  const flags = fs.constants.O_RDONLY | fs.constants.O_NOFOLLOW | fs.constants.O_NONBLOCK;
  const descriptor = fs.openSync(sourceAbsolute, flags);
  let buffer;
  try {
    const stat = fs.fstatSync(descriptor);
    ensure(stat.isFile());
    ensure((stat.mode & 0o7777) === 0o644);
    ensure(stat.size === SOURCE_BYTES);
    buffer = Buffer.alloc(SOURCE_BYTES);
    let offset = 0;
    while (offset < SOURCE_BYTES) {
      const amount = fs.readSync(descriptor, buffer, offset, SOURCE_BYTES - offset, offset);
      ensure(Number.isSafeInteger(amount));
      ensure(amount > 0);
      offset += amount;
    }
    ensure(offset === SOURCE_BYTES);
    const extra = Buffer.alloc(1);
    const extraAmount = fs.readSync(descriptor, extra, 0, 1, SOURCE_BYTES);
    ensure(extraAmount === 0);
  } finally {
    fs.closeSync(descriptor);
  }
  ensure(buffer.length === SOURCE_BYTES);
  ensure(sha256(buffer) === SOURCE_SHA256);
  verifySourceByteDomain(buffer);
  ensure(countByte(buffer, 0x0a) === SOURCE_LF);
  ensure(countByte(buffer, 0x0d) === 0);
  ensure(buffer[buffer.length - 1] === 0x0a);
  return buffer;
}

function isIdentifierStart(character) {
  return /[A-Za-z_]/.test(character);
}

function isIdentifierPart(character) {
  return /[A-Za-z0-9_]/.test(character);
}

function delimiterKind(character) {
  const kinds = {
    '(': 'ROUND',
    ')': 'ROUND',
    '[': 'SQUARE',
    ']': 'SQUARE',
    '{': 'CURLY',
    '}': 'CURLY',
    '<': 'ANGLE',
    '>': 'ANGLE',
    '/': 'SLASH',
    '!': 'BANG',
    '#': 'HASH',
    '|': 'PIPE'
  };
  return kinds[character] || 'OTHER';
}

function pairedClose(character) {
  const pairs = {
    '(': ')',
    '[': ']',
    '{': '}',
    '<': '>'
  };
  return pairs[character] || character;
}

function decodeSimpleQuoted(content, quoteCharacter) {
  let output = '';
  for (let index = 0; index < content.length; index += 1) {
    const character = content[index];
    if (character !== '\\') {
      output += character;
      continue;
    }
    ensure(index + 1 < content.length);
    const next = content[index + 1];
    if (next === '\\' || next === quoteCharacter) {
      output += next;
      index += 1;
      continue;
    }
    return null;
  }
  return output;
}

function parseNormalString(text, start, line) {
  const quote = text[start];
  ensure(quote === "'" || quote === '"');
  let index = start + 1;
  let currentLine = line;
  let escaped = false;
  while (index < text.length) {
    const character = text[index];
    if (character === '\n') {
      currentLine += 1;
    }
    if (escaped) {
      escaped = false;
      index += 1;
      continue;
    }
    if (character === '\\') {
      escaped = true;
      index += 1;
      continue;
    }
    if (character === quote) {
      const content = text.slice(start + 1, index);
      let value = decodeSimpleQuoted(content, quote);
      if (quote === '"' && /[$@]/.test(content)) {
        value = null;
      }
      return {
        end: index + 1,
        endLine: currentLine,
        token: {
          kind: 'STRING',
          line,
          endLine: currentLine,
          quoteKind: quote === "'" ? 'SINGLE' : 'DOUBLE',
          delimiterKind: quote === "'" ? 'APOSTROPHE' : 'QUOTE',
          lexicalLength: content.length,
          value
        }
      };
    }
    index += 1;
  }
  gate();
}

function parseDelimitedBody(text, delimiterIndex, line) {
  ensure(delimiterIndex < text.length);
  const open = text[delimiterIndex];
  ensure(!/[A-Za-z0-9_\s]/.test(open));
  const close = pairedClose(open);
  const paired = close !== open;
  let depth = 1;
  let index = delimiterIndex + 1;
  let currentLine = line;
  let escaped = false;
  let inCharacterClass = false;
  while (index < text.length) {
    const character = text[index];
    if (character === '\n') {
      currentLine += 1;
    }
    if (escaped) {
      escaped = false;
      index += 1;
      continue;
    }
    if (character === '\\') {
      escaped = true;
      index += 1;
      continue;
    }
    if (!paired && open === '/') {
      if (character === '[') {
        inCharacterClass = true;
        index += 1;
        continue;
      }
      if (character === ']' && inCharacterClass) {
        inCharacterClass = false;
        index += 1;
        continue;
      }
      if (inCharacterClass) {
        index += 1;
        continue;
      }
    }
    if (paired && character === open) {
      depth += 1;
      index += 1;
      continue;
    }
    if (character === close) {
      depth -= 1;
      if (depth === 0) {
        return {
          contentEnd: index,
          end: index + 1,
          endLine: currentLine,
          open,
          close,
          paired
        };
      }
      index += 1;
      continue;
    }
    index += 1;
  }
  gate();
}

function parseUnpairedContinuation(text, start, delimiter, line) {
  let index = start;
  let currentLine = line;
  let escaped = false;
  while (index < text.length) {
    const character = text[index];
    if (character === '\n') {
      currentLine += 1;
    }
    if (escaped) {
      escaped = false;
      index += 1;
      continue;
    }
    if (character === '\\') {
      escaped = true;
      index += 1;
      continue;
    }
    if (character === delimiter) {
      return { end: index + 1, endLine: currentLine };
    }
    index += 1;
  }
  gate();
}

function consumeRegexModifiers(text, start) {
  let index = start;
  while (index < text.length && /[A-Za-z]/.test(text[index])) {
    index += 1;
  }
  return index;
}

function parseQuoteLike(text, start, prefixEnd, line, prefix) {
  let delimiterIndex = prefixEnd;
  while (delimiterIndex < text.length && (text[delimiterIndex] === ' ' || text[delimiterIndex] === '\t')) {
    delimiterIndex += 1;
  }
  const parsed = parseDelimitedBody(text, delimiterIndex, line);
  const content = text.slice(delimiterIndex + 1, parsed.contentEnd);
  const scalarStatic = prefix === 'q' || prefix === 'qq';
  let value = null;
  if (prefix === 'q' && !content.includes('\\')) {
    value = content;
  } else if (prefix === 'qq' && !/[\\$@]/.test(content)) {
    value = content;
  }
  return {
    end: parsed.end,
    endLine: parsed.endLine,
    token: scalarStatic
      ? {
          kind: 'STRING',
          line,
          endLine: parsed.endLine,
          quoteKind: prefix.toUpperCase(),
          delimiterKind: delimiterKind(parsed.open),
          lexicalLength: content.length,
          value
        }
      : {
          kind: 'OPAQUE',
          line,
          endLine: parsed.endLine,
          opaqueKind: 'QUOTE_OPERATOR_' + prefix.toUpperCase()
        }
  };
}

function parseOpaqueMatchLike(text, prefixEnd, line, prefix) {
  let delimiterIndex = prefixEnd;
  while (delimiterIndex < text.length && (text[delimiterIndex] === ' ' || text[delimiterIndex] === '\t')) {
    delimiterIndex += 1;
  }
  const first = parseDelimitedBody(text, delimiterIndex, line);
  let end = first.end;
  let endLine = first.endLine;
  if (prefix === 's' || prefix === 'tr' || prefix === 'y') {
    if (first.paired) {
      let secondDelimiter = end;
      while (secondDelimiter < text.length &&
             (text[secondDelimiter] === ' ' || text[secondDelimiter] === '\t')) {
        secondDelimiter += 1;
      }
      const second = parseDelimitedBody(text, secondDelimiter, endLine);
      end = second.end;
      endLine = second.endLine;
    } else {
      const second = parseUnpairedContinuation(text, end, first.open, endLine);
      end = second.end;
      endLine = second.endLine;
    }
  }
  end = consumeRegexModifiers(text, end);
  return {
    end,
    endLine,
    token: {
      kind: 'OPAQUE',
      line,
      endLine,
      opaqueKind: 'REGEX_OPERATOR_' + prefix.toUpperCase()
    }
  };
}

function isPhysicalLineStart(text, index) {
  return index === 0 || text[index - 1] === '\n';
}

function lineEndIndex(text, index) {
  const end = text.indexOf('\n', index);
  return end === -1 ? text.length : end;
}

function skipPodBlock(text, start, line) {
  ensure(isPhysicalLineStart(text, start));
  const firstEnd = lineEndIndex(text, start);
  const first = text.slice(start, firstEnd);
  ensure(/^=(?:pod|head[1-6]|over|item|back|begin|end|for|encoding)\b/.test(first));
  let index = firstEnd < text.length ? firstEnd + 1 : firstEnd;
  let currentLine = line + (firstEnd < text.length ? 1 : 0);
  while (index < text.length) {
    ensure(isPhysicalLineStart(text, index));
    const end = lineEndIndex(text, index);
    const current = text.slice(index, end);
    if (/^=cut(?:\s.*)?$/.test(current)) {
      return {
        end: end < text.length ? end + 1 : end,
        endLine: currentLine + (end < text.length ? 1 : 0)
      };
    }
    index = end < text.length ? end + 1 : end;
    currentLine += end < text.length ? 1 : 0;
  }
  gate();
}

function bareSlashBeginsRegex(tokens) {
  if (tokens.length === 0) {
    return true;
  }
  const previous = tokens[tokens.length - 1];
  if (previous.kind === 'OPERATOR') {
    return new Set(['=~', '!~', '=', '==', '!=', '&&', '||', '!', '=>', '?', ':']).has(previous.raw);
  }
  if (previous.kind === 'PUNCTUATION') {
    return new Set(['(', '[', '{', ',', ';']).has(previous.raw);
  }
  if (previous.kind === 'IDENTIFIER') {
    return new Set(['if', 'unless', 'while', 'until', 'return', 'grep', 'map']).has(previous.raw);
  }
  return false;
}

function lexSource(text) {
  ensure(typeof text === 'string');
  const tokens = [];
  const quotePrefixes = new Set(['q', 'qq', 'qw', 'qr', 'qx']);
  const regexPrefixes = new Set(['m', 's', 'tr', 'y']);
  const wordOperators = new Set(['eq', 'ne', 'lt', 'gt', 'le', 'ge', 'and', 'or', 'not']);
  const multiOperators = ['===', '!==', '==', '!=', '<=', '>=', '&&', '||', '=>', '=~', '!~', '++', '--', '::', '->', '..'];
  let index = 0;
  let line = 1;
  while (index < text.length) {
    ensure(tokens.length < MAX_TOKENS);
    const character = text[index];
    if (isPhysicalLineStart(text, index) && character === '=') {
      const end = lineEndIndex(text, index);
      const current = text.slice(index, end);
      if (/^=cut(?:\s.*)?$/.test(current)) {
        gate();
      }
      if (/^=(?:pod|head[1-6]|over|item|back|begin|end|for|encoding)\b/.test(current)) {
        const skipped = skipPodBlock(text, index, line);
        index = skipped.end;
        line = skipped.endLine;
        continue;
      }
    }
    if (character === ' ' || character === '\t' || character === '\r') {
      index += 1;
      continue;
    }
    if (character === '\n') {
      line += 1;
      index += 1;
      continue;
    }
    if (character === '#') {
      while (index < text.length && text[index] !== '\n') {
        index += 1;
      }
      continue;
    }
    if (text.startsWith('<<', index)) {
      gate();
    }
    if (character === "'" || character === '"') {
      const parsed = parseNormalString(text, index, line);
      tokens.push(parsed.token);
      index = parsed.end;
      line = parsed.endLine;
      continue;
    }
    if ((character === '$' || character === '@' || character === '%') &&
        index + 1 < text.length && isIdentifierStart(text[index + 1])) {
      const start = index;
      index += 2;
      while (index < text.length && isIdentifierPart(text[index])) {
        index += 1;
      }
      tokens.push({ kind: 'VARIABLE', line, endLine: line, raw: text.slice(start, index) });
      continue;
    }
    if (isIdentifierStart(character)) {
      const start = index;
      index += 1;
      while (index < text.length && isIdentifierPart(text[index])) {
        index += 1;
      }
      const raw = text.slice(start, index);
      if ((raw === '__DATA__' || raw === '__END__') && isPhysicalLineStart(text, start)) {
        break;
      }
      let delimiterIndex = index;
      while (delimiterIndex < text.length &&
             (text[delimiterIndex] === ' ' || text[delimiterIndex] === '\t')) {
        delimiterIndex += 1;
      }
      const hasDelimiter = delimiterIndex < text.length &&
        !/[A-Za-z0-9_\s]/.test(text[delimiterIndex]);
      if (quotePrefixes.has(raw) && hasDelimiter) {
        const parsed = parseQuoteLike(text, start, index, line, raw);
        tokens.push(parsed.token);
        index = parsed.end;
        line = parsed.endLine;
        continue;
      }
      if (regexPrefixes.has(raw) && hasDelimiter) {
        const parsed = parseOpaqueMatchLike(text, index, line, raw);
        tokens.push(parsed.token);
        index = parsed.end;
        line = parsed.endLine;
        continue;
      }
      tokens.push({
        kind: wordOperators.has(raw) ? 'OPERATOR' : 'IDENTIFIER',
        line,
        endLine: line,
        raw
      });
      continue;
    }
    if (/[0-9]/.test(character)) {
      const start = index;
      index += 1;
      while (index < text.length && /[0-9]/.test(text[index])) {
        index += 1;
      }
      tokens.push({ kind: 'NUMBER', line, endLine: line, raw: text.slice(start, index) });
      continue;
    }
    let matchedOperator = null;
    for (const operator of multiOperators) {
      if (text.startsWith(operator, index)) {
        matchedOperator = operator;
        break;
      }
    }
    if (matchedOperator !== null) {
      tokens.push({ kind: 'OPERATOR', line, endLine: line, raw: matchedOperator });
      index += matchedOperator.length;
      continue;
    }
    if (character === '/' && bareSlashBeginsRegex(tokens)) {
      const parsed = parseDelimitedBody(text, index, line);
      tokens.push({
        kind: 'OPAQUE',
        line,
        endLine: parsed.endLine,
        opaqueKind: 'BARE_REGEX'
      });
      index = consumeRegexModifiers(text, parsed.end);
      line = parsed.endLine;
      continue;
    }
    if ('=.!+-*/<>?:'.includes(character)) {
      tokens.push({ kind: 'OPERATOR', line, endLine: line, raw: character });
      index += 1;
      continue;
    }
    if ('()[]{};,'.includes(character)) {
      tokens.push({ kind: 'PUNCTUATION', line, endLine: line, raw: character });
      index += 1;
      continue;
    }
    tokens.push({ kind: 'SYMBOL', line, endLine: line, raw: character });
    index += 1;
  }
  ensure(tokens.length > 0 && tokens.length < MAX_TOKENS);
  return tokens;
}

function assignIdentifierOrdinals(tokenGroups) {
  ensure(Array.isArray(tokenGroups));
  const ordinals = new Map();
  for (const group of tokenGroups) {
    ensure(Array.isArray(group));
    for (const token of group) {
      if (token.kind !== 'IDENTIFIER' && token.kind !== 'VARIABLE') {
        continue;
      }
      if (!ordinals.has(token.raw)) {
        ordinals.set(token.raw, 'I' + String(ordinals.size + 1));
      }
    }
  }
  return ordinals;
}

function updateDepth(token, depth) {
  if (token.kind !== 'PUNCTUATION') {
    return;
  }
  if (token.raw === '(') {
    depth.round += 1;
  } else if (token.raw === ')') {
    ensure(depth.round > 0);
    depth.round -= 1;
  } else if (token.raw === '[') {
    depth.square += 1;
  } else if (token.raw === ']') {
    ensure(depth.square > 0);
    depth.square -= 1;
  } else if (token.raw === '{') {
    depth.curly += 1;
  } else if (token.raw === '}') {
    ensure(depth.curly > 0);
    depth.curly -= 1;
  }
}

function depthIsZero(depth) {
  return depth.round === 0 && depth.square === 0 && depth.curly === 0;
}

function findT06Assignments(tokens) {
  const assignments = [];
  const declarations = new Set(['my', 'our', 'state']);
  for (let index = 0; index + 2 < tokens.length; index += 1) {
    const declaration = tokens[index];
    const variable = tokens[index + 1];
    const equals = tokens[index + 2];
    if (declaration.kind !== 'IDENTIFIER' || !declarations.has(declaration.raw) ||
        variable.kind !== 'VARIABLE' || variable.raw !== '$T06' ||
        equals.kind !== 'OPERATOR' || equals.raw !== '=') {
      continue;
    }
    const depth = { round: 0, square: 0, curly: 0 };
    let end = -1;
    for (let cursor = index + 3; cursor < tokens.length; cursor += 1) {
      const token = tokens[cursor];
      if (token.kind === 'PUNCTUATION' && token.raw === ';' && depthIsZero(depth)) {
        end = cursor;
        break;
      }
      updateDepth(token, depth);
    }
    ensure(end > index + 3);
    assignments.push({
      declarationIndex: index,
      lhsIndex: index + 1,
      equalsIndex: index + 2,
      rhsStart: index + 3,
      rhsEnd: end,
      endIndex: end
    });
  }
  return assignments;
}

function operatorKind(raw) {
  const kinds = {
    '.': 'CONCAT',
    '=': 'ASSIGN',
    '==': 'NUMERIC_EQUAL',
    '===': 'STRICT_EQUAL',
    'eq': 'STRING_EQUAL',
    '!=': 'NUMERIC_NOT_EQUAL',
    '!==': 'STRICT_NOT_EQUAL',
    'ne': 'STRING_NOT_EQUAL',
    '&&': 'LOGICAL_AND',
    '||': 'LOGICAL_OR',
    '!': 'LOGICAL_NOT',
    '=~': 'REGEX_MATCH',
    '!~': 'REGEX_NOT_MATCH'
  };
  return kinds[raw] || 'OPERATOR_OTHER';
}

function punctuationKind(raw) {
  const kinds = {
    '(': 'OPEN_ROUND',
    ')': 'CLOSE_ROUND',
    '[': 'OPEN_SQUARE',
    ']': 'CLOSE_SQUARE',
    '{': 'OPEN_CURLY',
    '}': 'CLOSE_CURLY',
    ';': 'SEMICOLON',
    ',': 'COMMA'
  };
  return kinds[raw] || 'PUNCTUATION_OTHER';
}

function tokenKindForProjection(token, marker, ordinals) {
  if (token.kind === 'STRING') {
    if (token.value !== null && token.value === marker) {
      return 'MARKER_LITERAL_' + token.quoteKind + '_' + token.delimiterKind;
    }
    return 'STRING_' + token.quoteKind + '_' + token.delimiterKind +
      '_LENGTH_' + String(token.lexicalLength);
  }
  if (token.kind === 'OPAQUE') {
    return 'OPAQUE_UNSUPPORTED';
  }
  if (token.kind === 'VARIABLE') {
    if (token.raw === '$T06') {
      return 'VARIABLE_T06_ROLE';
    }
    ensure(ordinals.has(token.raw));
    return 'VARIABLE_' + ordinals.get(token.raw);
  }
  if (token.kind === 'IDENTIFIER') {
    const known = {
      ensure: 'CONTROL_ENSURE',
      gate: 'CONTROL_GATE',
      stop: 'CONTROL_STOP',
      die: 'CONTROL_DIE',
      croak: 'CONTROL_CROAK',
      confess: 'CONTROL_CONFESS',
      if: 'CONTROL_IF',
      unless: 'CONTROL_UNLESS',
      return: 'CONTROL_RETURN',
      count_occurrences: 'COUNT_FUNCTION',
      countOccurrences: 'COUNT_FUNCTION',
      my: 'DECLARATION',
      our: 'DECLARATION',
      state: 'DECLARATION'
    };
    if (known[token.raw]) {
      return known[token.raw];
    }
    ensure(ordinals.has(token.raw));
    return 'IDENTIFIER_' + ordinals.get(token.raw);
  }
  if (token.kind === 'NUMBER') {
    return token.raw === '2' ? 'NUMBER_EXACT2' : 'NUMBER_OTHER';
  }
  if (token.kind === 'OPERATOR') {
    return operatorKind(token.raw);
  }
  if (token.kind === 'PUNCTUATION') {
    return punctuationKind(token.raw);
  }
  return 'SYMBOL_OTHER';
}

function analyzeRhs(tokens, assignment, ordinals) {
  const rhs = tokens.slice(assignment.rhsStart, assignment.rhsEnd);
  ensure(rhs.length > 0 && rhs.length <= MAX_RHS_TOKENS);
  const reduced = [];
  const literalLengths = [];
  const quoteKinds = [];
  const delimiterKinds = [];
  const operatorKinds = [];
  let marker = '';
  let stringCount = 0;
  let depth = 0;
  let maxDepth = 0;
  for (const token of rhs) {
    if (token.kind === 'STRING') {
      ensure(token.value !== null);
      ensure(token.value.length <= SOURCE_BYTES);
      stringCount += 1;
      marker += token.value;
      literalLengths.push(token.lexicalLength);
      quoteKinds.push(token.quoteKind);
      delimiterKinds.push(token.delimiterKind);
      reduced.push('STRING');
      continue;
    }
    if (token.kind === 'OPERATOR' && token.raw === '.') {
      operatorKinds.push('CONCAT');
      reduced.push('CONCAT');
      continue;
    }
    if (token.kind === 'PUNCTUATION' && token.raw === '(') {
      depth += 1;
      maxDepth = Math.max(maxDepth, depth);
      operatorKinds.push('OPEN_ROUND');
      continue;
    }
    if (token.kind === 'PUNCTUATION' && token.raw === ')') {
      ensure(depth > 0);
      depth -= 1;
      operatorKinds.push('CLOSE_ROUND');
      continue;
    }
    gate();
  }
  ensure(depth === 0);
  ensure(stringCount > 0 && stringCount <= 64);
  ensure(reduced.length === stringCount * 2 - 1);
  for (let index = 0; index < reduced.length; index += 1) {
    ensure(reduced[index] === (index % 2 === 0 ? 'STRING' : 'CONCAT'));
  }
  ensure(marker.length > 0 && marker.length <= SOURCE_BYTES);
  ensure(/^[A-Z][A-Z0-9_]*$/.test(marker));
  const parenthesized = rhs[0].kind === 'PUNCTUATION' && rhs[0].raw === '(' &&
    rhs[rhs.length - 1].kind === 'PUNCTUATION' && rhs[rhs.length - 1].raw === ')';
  let rootKind;
  if (stringCount === 1 && parenthesized) {
    rootKind = 'PARENTHESIZED_STATIC_LITERAL';
  } else if (stringCount === 1) {
    rootKind = 'STATIC_LITERAL';
  } else if (parenthesized) {
    rootKind = 'PARENTHESIZED_STATIC_CONCAT';
  } else {
    rootKind = 'STATIC_CONCAT';
  }
  const tokenKinds = rhs.map((token) => tokenKindForProjection(token, marker, ordinals));
  return {
    marker,
    projection: {
      delimiter_kind_vector: delimiterKinds,
      line_count: tokens[assignment.endIndex].line - tokens[assignment.declarationIndex].line + 1,
      literal_lexical_length_vector: literalLengths,
      operator_kind_vector: operatorKinds,
      parenthesis_max_depth: maxDepth,
      quote_kind_vector: quoteKinds,
      root_kind: rootKind,
      segment_count: stringCount,
      token_kind_vector: tokenKinds
    }
  };
}

function findMatchingRound(tokens, openIndex, endExclusive) {
  ensure(tokens[openIndex].kind === 'PUNCTUATION' && tokens[openIndex].raw === '(');
  let depth = 0;
  for (let index = openIndex; index < endExclusive; index += 1) {
    const token = tokens[index];
    if (token.kind === 'PUNCTUATION' && token.raw === '(') {
      depth += 1;
    } else if (token.kind === 'PUNCTUATION' && token.raw === ')') {
      depth -= 1;
      ensure(depth >= 0);
      if (depth === 0) {
        return index;
      }
    }
  }
  gate();
}

function findMatchingCurly(tokens, openIndex, endExclusive) {
  ensure(tokens[openIndex].kind === 'PUNCTUATION' && tokens[openIndex].raw === '{');
  let depth = 0;
  for (let index = openIndex; index < endExclusive; index += 1) {
    const token = tokens[index];
    if (token.kind === 'PUNCTUATION' && token.raw === '{') {
      depth += 1;
    } else if (token.kind === 'PUNCTUATION' && token.raw === '}') {
      depth -= 1;
      ensure(depth >= 0);
      if (depth === 0) {
        return index;
      }
    }
  }
  gate();
}

function findStatementBounds(tokens, markerIndex) {
  let start = 0;
  const backward = { round: 0, square: 0, curly: 0 };
  for (let index = markerIndex - 1; index >= 0; index -= 1) {
    const token = tokens[index];
    if (token.kind === 'PUNCTUATION') {
      if (token.raw === ')') {
        backward.round += 1;
      } else if (token.raw === '(') {
        if (backward.round > 0) {
          backward.round -= 1;
        }
      } else if (token.raw === ']') {
        backward.square += 1;
      } else if (token.raw === '[') {
        if (backward.square > 0) {
          backward.square -= 1;
        }
      } else if (token.raw === '}') {
        backward.curly += 1;
      } else if (token.raw === '{') {
        if (backward.curly > 0) {
          backward.curly -= 1;
        } else if (backward.round === 0 && backward.square === 0) {
          start = index + 1;
          break;
        }
      } else if (token.raw === ';' && backward.round === 0 &&
                 backward.square === 0 && backward.curly === 0) {
        start = index + 1;
        break;
      }
    }
  }
  const forward = { round: 0, square: 0, curly: 0 };
  let end = -1;
  for (let index = start; index < tokens.length; index += 1) {
    const token = tokens[index];
    if (token.kind === 'PUNCTUATION' && token.raw === ';' && depthIsZero(forward)) {
      end = index + 1;
      break;
    }
    updateDepth(token, forward);
    if (index >= markerIndex && depthIsZero(forward) &&
        token.kind === 'PUNCTUATION' && token.raw === '}') {
      end = index + 1;
      break;
    }
  }
  ensure(end > markerIndex);
  ensure(end - start > 0 && end - start <= MAX_STATEMENT_TOKENS);
  return { start, end };
}

function splitCallArguments(tokens, openIndex, closeIndex) {
  const ranges = [];
  const depth = { round: 0, square: 0, curly: 0 };
  let start = openIndex + 1;
  for (let index = openIndex + 1; index < closeIndex; index += 1) {
    const token = tokens[index];
    if (token.kind === 'PUNCTUATION' && token.raw === ',' && depthIsZero(depth)) {
      ranges.push({ start, end: index });
      start = index + 1;
      continue;
    }
    updateDepth(token, depth);
  }
  ensure(depthIsZero(depth));
  ranges.push({ start, end: closeIndex });
  ensure(ranges.length === 2);
  for (const range of ranges) {
    ensure(range.end > range.start);
  }
  return ranges;
}

function subjectProjection(tokens, range, ordinals) {
  const slice = tokens.slice(range.start, range.end);
  ensure(slice.length > 0);
  if (slice.length === 1 && slice[0].kind === 'VARIABLE') {
    ensure(ordinals.has(slice[0].raw));
    return { class: 'VARIABLE', ordinal: ordinals.get(slice[0].raw) };
  }
  if (slice.length === 1 && slice[0].kind === 'IDENTIFIER') {
    ensure(ordinals.has(slice[0].raw));
    return { class: 'IDENTIFIER', ordinal: ordinals.get(slice[0].raw) };
  }
  if (slice.length >= 3 && slice[0].kind === 'IDENTIFIER' &&
      slice[1].kind === 'PUNCTUATION' && slice[1].raw === '(' &&
      slice[slice.length - 1].kind === 'PUNCTUATION' && slice[slice.length - 1].raw === ')') {
    const close = findMatchingRound(slice, 1, slice.length);
    if (close === slice.length - 1) {
      ensure(ordinals.has(slice[0].raw));
      return { class: 'CALL_RESULT', ordinal: ordinals.get(slice[0].raw) };
    }
  }
  return { class: 'COMPOSITE', ordinal: 'NONE' };
}

function comparisonKind(token) {
  ensure(token.kind === 'OPERATOR');
  if (token.raw === '==') {
    return 'NUMERIC_EQUAL';
  }
  if (token.raw === '===') {
    return 'STRICT_EQUAL';
  }
  if (token.raw === 'eq') {
    return 'STRING_EQUAL';
  }
  return 'NONE';
}

function unwrapRoundRange(tokens, start, end) {
  let currentStart = start;
  let currentEnd = end;
  while (currentEnd - currentStart >= 2 &&
         tokens[currentStart].kind === 'PUNCTUATION' &&
         tokens[currentStart].raw === '(') {
    const close = findMatchingRound(tokens, currentStart, currentEnd);
    if (close !== currentEnd - 1) {
      break;
    }
    currentStart += 1;
    currentEnd -= 1;
  }
  return { start: currentStart, end: currentEnd };
}

function rangeIsExactComparison(tokens, start, end, countStart, comparisonEnd) {
  const unwrapped = unwrapRoundRange(tokens, start, end);
  return unwrapped.start === countStart && unwrapped.end === comparisonEnd;
}

function exactFailControlSlice(tokens, start, end) {
  const failControls = new Set(['die', 'croak', 'confess', 'gate', 'stop']);
  let currentEnd = end;
  if (currentEnd > start && tokens[currentEnd - 1].kind === 'PUNCTUATION' &&
      tokens[currentEnd - 1].raw === ';') {
    currentEnd -= 1;
  }
  if (currentEnd - start === 1 && tokens[start].kind === 'IDENTIFIER' &&
      failControls.has(tokens[start].raw)) {
    return true;
  }
  return currentEnd - start === 3 &&
    tokens[start].kind === 'IDENTIFIER' && failControls.has(tokens[start].raw) &&
    tokens[start + 1].kind === 'PUNCTUATION' && tokens[start + 1].raw === '(' &&
    tokens[start + 2].kind === 'PUNCTUATION' && tokens[start + 2].raw === ')';
}

function classifyControlRelation(statement, countStart, comparisonEnd) {
  const hasSemicolon = statement.length > 0 &&
    statement[statement.length - 1].kind === 'PUNCTUATION' &&
    statement[statement.length - 1].raw === ';';
  const terminalEnd = hasSemicolon ? statement.length - 1 : statement.length;
  if (hasSemicolon && terminalEnd >= 3 && statement[0].kind === 'IDENTIFIER' &&
      statement[0].raw === 'ensure' &&
      statement[1].kind === 'PUNCTUATION' && statement[1].raw === '(') {
    const close = findMatchingRound(statement, 1, terminalEnd);
    if (close === terminalEnd - 1 &&
        rangeIsExactComparison(statement, 2, close, countStart, comparisonEnd)) {
      return 'DIRECT_ENSURE_ARGUMENT';
    }
  }
  if (hasSemicolon && terminalEnd >= 2 && statement[0].kind === 'IDENTIFIER' &&
      statement[0].raw === 'return' &&
      rangeIsExactComparison(statement, 1, terminalEnd, countStart, comparisonEnd)) {
    return 'DIRECT_RETURN_VALUE';
  }
  if (hasSemicolon) {
    const unlessIndices = [];
    for (let index = 0; index < terminalEnd; index += 1) {
      if (statement[index].kind === 'IDENTIFIER' && statement[index].raw === 'unless') {
        unlessIndices.push(index);
      }
    }
    if (unlessIndices.length === 1) {
      const unlessIndex = unlessIndices[0];
      if (exactFailControlSlice(statement, 0, unlessIndex) &&
          rangeIsExactComparison(
            statement,
            unlessIndex + 1,
            terminalEnd,
            countStart,
            comparisonEnd
          )) {
        return 'DIRECT_FAIL_UNLESS';
      }
    }
  }
  if (statement.length >= 7 && statement[0].kind === 'IDENTIFIER' &&
      (statement[0].raw === 'if' || statement[0].raw === 'unless') &&
      statement[1].kind === 'PUNCTUATION' && statement[1].raw === '(') {
    const conditionClose = findMatchingRound(statement, 1, statement.length);
    if (rangeIsExactComparison(
      statement,
      2,
      conditionClose,
      countStart,
      comparisonEnd
    )) {
      const bodyOpen = conditionClose + 1;
      if (bodyOpen < statement.length &&
          statement[bodyOpen].kind === 'PUNCTUATION' &&
          statement[bodyOpen].raw === '{') {
        const bodyClose = findMatchingCurly(statement, bodyOpen, statement.length);
        const statementEnd = hasSemicolon ? statement.length - 1 : statement.length;
        if (bodyClose === statementEnd - 1 &&
            exactFailControlSlice(statement, bodyOpen + 1, bodyClose)) {
          return statement[0].raw === 'if'
            ? 'DIRECT_CONDITIONAL_IF_TO_FAIL_CONTROL'
            : 'DIRECT_CONDITIONAL_UNLESS_TO_FAIL_CONTROL';
        }
      }
    }
  }
  return 'NO_DIRECT_CONTROL_RELATION';
}

function analyzeValidatorCandidate(tokens, markerIndex, marker, ordinals) {
  const bounds = findStatementBounds(tokens, markerIndex);
  const statement = tokens.slice(bounds.start, bounds.end);
  const localMarkerIndex = markerIndex - bounds.start;
  ensure(localMarkerIndex >= 0 && localMarkerIndex < statement.length);
  const countCalls = [];
  for (let index = 0; index + 1 < statement.length; index += 1) {
    const token = statement[index];
    if (token.kind !== 'IDENTIFIER' ||
        (token.raw !== 'count_occurrences' && token.raw !== 'countOccurrences')) {
      continue;
    }
    if (statement[index + 1].kind !== 'PUNCTUATION' || statement[index + 1].raw !== '(') {
      continue;
    }
    const close = findMatchingRound(statement, index + 1, statement.length);
    const ranges = splitCallArguments(statement, index + 1, close);
    let markerArgument = -1;
    let matchedCurrentMarker = false;
    for (let argumentIndex = 0; argumentIndex < ranges.length; argumentIndex += 1) {
      const range = ranges[argumentIndex];
      const markerPositions = [];
      for (let cursor = range.start; cursor < range.end; cursor += 1) {
        const candidate = statement[cursor];
        if (candidate.kind === 'STRING' &&
            candidate.value !== null && candidate.value === marker) {
          markerPositions.push(cursor);
        }
      }
      if (markerPositions.length === 1) {
        ensure(markerArgument === -1);
        markerArgument = argumentIndex;
        matchedCurrentMarker = markerPositions[0] === localMarkerIndex;
      } else {
        ensure(markerPositions.length === 0);
      }
    }
    if (markerArgument >= 0 && matchedCurrentMarker) {
      countCalls.push({ index, close, ranges, markerArgument });
    }
  }
  ensure(countCalls.length === 1);
  const call = countCalls[0];
  const subjectRange = call.ranges[call.markerArgument === 0 ? 1 : 0];
  const subject = subjectProjection(statement, subjectRange, ordinals);
  let kind = 'NONE';
  let comparisonEnd = call.close + 1;
  if (call.close + 2 < statement.length &&
      statement[call.close + 1].kind === 'OPERATOR' &&
      statement[call.close + 2].kind === 'NUMBER' &&
      statement[call.close + 2].raw === '2') {
    kind = comparisonKind(statement[call.close + 1]);
    comparisonEnd = call.close + 3;
  }
  const control = kind === 'NONE'
    ? 'NO_DIRECT_CONTROL_RELATION'
    : classifyControlRelation(statement, call.index, comparisonEnd);
  const tokenKinds = statement.map(
    (token) => tokenKindForProjection(token, marker, ordinals)
  );
  return {
    comparison_kind: kind,
    comparison_value: kind === 'NONE' ? 0 : 2,
    control_relation: control,
    count_subject_class: subject.class,
    count_subject_ordinal: subject.ordinal,
    marker_argument_ordinal: call.markerArgument + 1,
    marker_literal_equal_to_rhs: true,
    statement_line_count:
      statement[statement.length - 1].endLine - statement[0].line + 1,
    statement_token_kind_vector: tokenKinds
  };
}

function canonicalize(value) {
  if (Array.isArray(value)) {
    return value.map((entry) => canonicalize(entry));
  }
  if (value !== null && typeof value === 'object') {
    const output = {};
    const keys = Object.keys(value).sort();
    for (const key of keys) {
      output[key] = canonicalize(value[key]);
    }
    return output;
  }
  return value;
}

function buildProjection(sourceBuffer) {
  const text = sourceBuffer.toString('ascii');
  const tokens = lexSource(text);
  const assignments = findT06Assignments(tokens);
  ensure(assignments.length === 1);
  const assignment = assignments[0];
  const preliminaryRhs = analyzeRhs(tokens, assignment, new Map());
  const markerIndices = [];
  for (let index = 0; index < tokens.length; index += 1) {
    if (index >= assignment.rhsStart && index < assignment.rhsEnd) {
      continue;
    }
    const token = tokens[index];
    if (token.kind === 'STRING' &&
        token.value !== null && token.value === preliminaryRhs.marker) {
      markerIndices.push(index);
    }
  }
  ensure(markerIndices.length > 0 && markerIndices.length <= MAX_VALIDATOR_CANDIDATES);
  const validatorBounds = markerIndices.map(
    (markerIndex) => findStatementBounds(tokens, markerIndex)
  );
  const relevantGroups = [
    tokens.slice(assignment.declarationIndex, assignment.endIndex + 1)
  ];
  for (const bounds of validatorBounds) {
    relevantGroups.push(tokens.slice(bounds.start, bounds.end));
  }
  const ordinals = assignIdentifierOrdinals(relevantGroups);
  const rhs = analyzeRhs(tokens, assignment, ordinals);
  ensure(rhs.marker === preliminaryRhs.marker);
  const validators = markerIndices.map(
    (markerIndex) => analyzeValidatorCandidate(tokens, markerIndex, rhs.marker, ordinals)
  );
  const countSubjectOrdinals = validators.map((record) => record.count_subject_ordinal);
  const projection = {
    assignment_cardinality: 'EXACT1',
    assignment_multiline: rhs.projection.line_count > 1,
    automatic_progression: false,
    body_free: true,
    identifier_relation: {
      count_subject_ordinal_vector: countSubjectOrdinals,
      definition_lhs_role: 'T06',
      raw_identifier_publication_count: 0
    },
    marker_literal_occurrence_count: markerIndices.length,
    rhs_delimiter_kind_vector: rhs.projection.delimiter_kind_vector,
    rhs_line_count: rhs.projection.line_count,
    rhs_literal_lexical_length_vector: rhs.projection.literal_lexical_length_vector,
    rhs_operator_kind_vector: rhs.projection.operator_kind_vector,
    rhs_parenthesis_max_depth: rhs.projection.parenthesis_max_depth,
    rhs_quote_kind_vector: rhs.projection.quote_kind_vector,
    rhs_root_kind: rhs.projection.root_kind,
    rhs_segment_count: rhs.projection.segment_count,
    rhs_token_kind_vector: rhs.projection.token_kind_vector,
    schema_version: OUTPUT_SCHEMA,
    source_identity_valid: true,
    technical_credit: false,
    terminal: OUTPUT_TERMINAL,
    validator_candidate_count: validators.length,
    validator_projection: validators
  };
  const canonical = canonicalize(projection);
  const json = JSON.stringify(canonical);
  ensure(!json.includes('\n') && !json.includes('\r'));
  const output = Buffer.from(json + '\n', 'ascii');
  ensure(output.length > 0 && output.length <= MAX_OUTPUT_BYTES);
  ensure(output[output.length - 1] === 0x0a);
  for (let index = 0; index < output.length; index += 1) {
    const value = output[index];
    ensure(value === 0x0a || (value >= 0x20 && value <= 0x7e));
  }
  const parsed = JSON.parse(output.slice(0, -1).toString('ascii'));
  ensure(JSON.stringify(canonicalize(parsed)) === json);
  ensure(parsed.body_free === true);
  ensure(parsed.automatic_progression === false);
  ensure(parsed.technical_credit === false);
  ensure(parsed.terminal === OUTPUT_TERMINAL);
  return output;
}

function writeWholeStdout(buffer) {
  ensure(Buffer.isBuffer(buffer));
  ensure(buffer.length > 0);
  let offset = 0;
  while (offset < buffer.length) {
    let amount;
    try {
      amount = fs.writeSync(1, buffer, offset, buffer.length - offset);
    } catch (error) {
      throw { gateCode: EXIT_WRITE };
    }
    if (!Number.isSafeInteger(amount) || amount <= 0) {
      throw { gateCode: EXIT_WRITE };
    }
    offset += amount;
  }
  ensure(offset === buffer.length);
}

function main() {
  primitiveSelfTest();
  ensure(process.argv.length === 3);
  const root = validateRoot(process.argv[2]);
  const programAbsolute = resolveInside(root, PROGRAM_RELATIVE_PATH);
  const sourceAbsolute = resolveInside(root, SOURCE_RELATIVE_PATH);
  ensure(path.normalize(__filename) === programAbsolute);
  ensure(programAbsolute !== sourceAbsolute);
  validateSourcePhysicalPath(root, sourceAbsolute);
  const sourceBuffer = readExactSource(sourceAbsolute);
  const outputBuffer = buildProjection(sourceBuffer);
  writeWholeStdout(outputBuffer);
  process.exitCode = 0;
}

try {
  main();
} catch (error) {
  if (error && Number.isSafeInteger(error.gateCode)) {
    process.exitCode = error.gateCode;
  } else {
    process.exitCode = EXIT_INTERNAL;
  }
}
