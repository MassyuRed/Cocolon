'use strict';

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const SOURCE_RELATIVE_PATH = 'v16_retry2_draft/v16_public_gate_execution_continuation_carrier_v3_lineage_transformer_v3.pl';
const TARGET_RELATIVE_PATH = 'v16_retry2_draft/v16_public_gate_execution_continuation_carrier_v3_lineage_transformer_v4.pl';
const PROGRAM_RELATIVE_PATH = 'v16_retry2_draft/v16_public_gate_execution_continuation_carrier_v3_transformer_v4_preparation_orchestrator_v2.js';
const SOURCE_BYTES = 14081;
const SOURCE_LF = 280;
const SOURCE_SHA256 = '971a4f79f6352e209df088bd619787ac93ceaf1ab0163e5e5cbaefd6d092d83d';
const V23_ASCII_BYTES = 10330;
const V23_SHA256 = '70cf4dfeafd3f3ba2b72a2c1e5221a1f7e0ee79cfa8c8ba4b8f3b585b25e1be3';
const V27_ASCII_BYTES = 12125;
const V27_SHA256 = 'cb0d8b6a8b3c9ef47233a2ee00cad2091c68048d6a0b93e92b45e5ba1f305932';
const ORCHESTRATOR_V1_BYTES = 20806;
const ORCHESTRATOR_V1_LF = 552;
const ORCHESTRATOR_V1_SHA256 = '17cfbd29782f28d441f11c25b667773e5fa73270ae220e5490b6c63f757f2950';
const ABC_SHA256 = 'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad';
const OUTPUT_SCHEMA = 'V16_TRANSFORMER_V4_PREPARATION_ORCHESTRATOR_OUTPUT_V1';
const OUTPUT_TERMINAL = 'ORCHESTRATOR_PATCH_READY';
const HASH_PATTERN = /^[0-9a-f]{64}$/;
const DECIMAL_PATTERN = /^[1-9][0-9]*$/;
const T06_ASSIGNMENT_PATTERN = /^[ \t]*my[ \t]+\$T06[ \t]*=/gm;
const EXIT_GATE = 31;
const EXIT_INTERNAL = 32;
const EXIT_WRITE = 33;

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

function countOccurrences(text, needle) {
  ensure(typeof text === 'string');
  ensure(typeof needle === 'string');
  ensure(needle.length > 0);
  let count = 0;
  let offset = 0;
  for (;;) {
    const index = text.indexOf(needle, offset);
    if (index < 0) {
      return count;
    }
    count += 1;
    offset = index + needle.length;
  }
}

function manualAsciiBuffer(text) {
  ensure(typeof text === 'string');
  const output = Buffer.alloc(text.length);
  for (let index = 0; index < text.length; index += 1) {
    const code = text.charCodeAt(index);
    ensure(code >= 0x20 && code <= 0x7e);
    output[index] = code;
  }
  return output;
}

function verifyAsciiBuffer(buffer, allowLf) {
  ensure(Buffer.isBuffer(buffer));
  for (let index = 0; index < buffer.length; index += 1) {
    const value = buffer[index];
    if (value === 0x09) {
      continue;
    }
    if (allowLf && value === 0x0a) {
      continue;
    }
    ensure(value >= 0x20 && value <= 0x7e);
  }
}

function primitiveSelfTest() {
  const literal = Buffer.from([97, 98, 99]);
  ensure(literal.length === 3);
  ensure(literal[0] === 97 && literal[1] === 98 && literal[2] === 99);
  ensure(literal.toString('ascii') === 'abc');
  const manual = manualAsciiBuffer('abc');
  ensure(Buffer.compare(literal, manual) === 0);
  ensure(sha256(literal) === ABC_SHA256);
  let rejected = false;
  try {
    manualAsciiBuffer('\u00e9');
  } catch (error) {
    rejected = Boolean(error && error.gateCode === EXIT_GATE);
  }
  ensure(rejected);
}

function parseCanonicalPositiveInteger(value) {
  ensure(typeof value === 'string');
  ensure(DECIMAL_PATTERN.test(value));
  const parsed = Number(value);
  ensure(Number.isSafeInteger(parsed));
  ensure(parsed > 0);
  ensure(String(parsed) === value);
  return parsed;
}

function parseSha256(value) {
  ensure(typeof value === 'string');
  ensure(HASH_PATTERN.test(value));
  return value;
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
  return relativePath;
}

function resolveInside(root, relativePath) {
  validateFixedRelative(relativePath);
  const absolute = path.resolve(root, ...relativePath.split('/'));
  ensure(absolute.startsWith(root + path.sep));
  return absolute;
}

function validateFixedPhysicalPaths(root, sourceAbsolute, targetAbsolute) {
  const sourceReal = fs.realpathSync.native(sourceAbsolute);
  ensure(sourceReal === sourceAbsolute);
  ensure(sourceReal.startsWith(root + path.sep));
  const targetParent = path.dirname(targetAbsolute);
  const targetParentReal = fs.realpathSync.native(targetParent);
  ensure(targetParentReal === targetParent);
  ensure(targetParentReal.startsWith(root + path.sep));
}

function readExactRegularFile(absolutePath, expectedBytes, expectedMode) {
  ensure(Number.isSafeInteger(expectedBytes) && expectedBytes > 0);
  ensure(Number.isSafeInteger(expectedMode) && expectedMode >= 0);
  ensure(Number.isInteger(fs.constants.O_NOFOLLOW));
  ensure(Number.isInteger(fs.constants.O_NONBLOCK));
  const flags = fs.constants.O_RDONLY | fs.constants.O_NOFOLLOW | fs.constants.O_NONBLOCK;
  const descriptor = fs.openSync(absolutePath, flags);
  let buffer;
  try {
    const stat = fs.fstatSync(descriptor);
    ensure(stat.isFile());
    ensure((stat.mode & 0o7777) === expectedMode);
    ensure(stat.size === expectedBytes);
    buffer = Buffer.alloc(expectedBytes);
    let offset = 0;
    while (offset < expectedBytes) {
      const amount = fs.readSync(descriptor, buffer, offset, expectedBytes - offset, offset);
      ensure(Number.isSafeInteger(amount));
      ensure(amount > 0);
      offset += amount;
    }
    ensure(offset === expectedBytes);
    const extra = Buffer.alloc(1);
    const extraAmount = fs.readSync(descriptor, extra, 0, 1, expectedBytes);
    ensure(extraAmount === 0);
  } finally {
    fs.closeSync(descriptor);
  }
  return buffer;
}

function requireTargetAbsent(absolutePath) {
  const observed = fs.lstatSync(absolutePath, { throwIfNoEntry: false });
  ensure(observed === undefined);
}

function findT06Definition(text) {
  ensure(typeof text === 'string');
  const matches = [];
  T06_ASSIGNMENT_PATTERN.lastIndex = 0;
  for (;;) {
    const match = T06_ASSIGNMENT_PATTERN.exec(text);
    if (match === null) {
      break;
    }
    matches.push({ index: match.index, matched: match[0] });
  }
  ensure(matches.length === 1);
  const start = matches[0].index;
  const equalsIndex = text.indexOf('=', start);
  ensure(equalsIndex >= start);
  let single = false;
  let double = false;
  let escaped = false;
  let round = 0;
  let square = 0;
  let curly = 0;
  let end = -1;
  for (let index = equalsIndex + 1; index < text.length; index += 1) {
    const character = text[index];
    if (escaped) {
      escaped = false;
      continue;
    }
    if ((single || double) && character === '\\') {
      escaped = true;
      continue;
    }
    if (!double && character === "'") {
      single = !single;
      continue;
    }
    if (!single && character === '"') {
      double = !double;
      continue;
    }
    if (single || double) {
      continue;
    }
    if (character === '(') {
      round += 1;
      continue;
    }
    if (character === ')') {
      ensure(round > 0);
      round -= 1;
      continue;
    }
    if (character === '[') {
      square += 1;
      continue;
    }
    if (character === ']') {
      ensure(square > 0);
      square -= 1;
      continue;
    }
    if (character === '{') {
      curly += 1;
      continue;
    }
    if (character === '}') {
      ensure(curly > 0);
      curly -= 1;
      continue;
    }
    if (character === ';' && round === 0 && square === 0 && curly === 0) {
      end = index + 1;
      if (text[end] === '\n') {
        end += 1;
      }
      break;
    }
  }
  ensure(end > start);
  ensure(!single && !double && !escaped);
  ensure(round === 0 && square === 0 && curly === 0);
  const linePrefix = text.slice(start, text.indexOf('my', start));
  ensure(/^[ \t]*$/.test(linePrefix));
  return { start, end, indent: linePrefix };
}

function extractT06CompleteRhsToken(definition) {
  ensure(typeof definition === 'string');
  const singleQuoted = definition.match(
    /^[ \t]*my[ \t]+\$T06[ \t]*=[ \t]*'([A-Z][A-Z0-9_]*)'[ \t]*;[ \t]*\n?$/
  );
  const bracedQuoted = definition.match(
    /^[ \t]*my[ \t]+\$T06[ \t]*=[ \t]*q\{([A-Z][A-Z0-9_]*)\}[ \t]*;[ \t]*\n?$/
  );
  const matches = [singleQuoted, bracedQuoted].filter((match) => match !== null);
  ensure(matches.length === 1);
  const token = matches[0][1];
  ensure(/^[A-Z][A-Z0-9_]*$/.test(token));
  return token;
}

function locateExactValidatorLiteral(text, token) {
  ensure(typeof text === 'string');
  ensure(typeof token === 'string');
  ensure(countOccurrences(text, token) === 1);
  const tokenIndex = text.indexOf(token);
  const forms = [
    { start: tokenIndex - 1, end: tokenIndex + token.length + 1, text: "'" + token + "'", token },
    { start: tokenIndex - 1, end: tokenIndex + token.length + 1, text: '"' + token + '"', token },
    { start: tokenIndex - 2, end: tokenIndex + token.length + 1, text: 'q{' + token + '}', token }
  ].filter((form) => form.start >= 0 && text.slice(form.start, form.end) === form.text);
  ensure(forms.length === 1);
  return forms[0];
}

function validatorLiteralHasExactEqualityRole(text, literal) {
  const lineStart = text.lastIndexOf('\n', literal.start - 1) + 1;
  let lineEnd = text.indexOf('\n', literal.end);
  if (lineEnd < 0) {
    lineEnd = text.length;
  }
  const line = text.slice(lineStart, lineEnd);
  ensure(!/^[ \t]*#/.test(line));
  ensure(!/\b(?:index|substr|starts_with|startsWith|prefix)\b|=~/.test(line));
  const localStart = literal.start - lineStart;
  const localEnd = literal.end - lineStart;
  const before = line.slice(0, localStart);
  const after = line.slice(localEnd);
  const directRight = /\$T06[ \t]+eq[ \t]*$/.test(before);
  const directLeft = /^[ \t]+eq[ \t]+\$T06\b/.test(after);
  const escapedLiteral = literal.text.startsWith('q{')
    ? 'q\\{' + literal.token + '\\}'
    : literal.text;
  const countEquality = new RegExp(
    '(?:count_occurrences|countOccurrences)[ \\t]*\\([^;\\n]*' +
      escapedLiteral +
      '[^;\\n]*\\)[ \\t]*(?:===|==|eq)[ \\t]*2\\b'
  ).test(line);
  const validatorControl =
    /\b(?:ensure|die|croak|confess|stop|gate|return|if|unless)\b/.test(line);
  return validatorControl && (directRight || directLeft || countEquality);
}

function deriveT06Marker(definition, outside) {
  const marker = extractT06CompleteRhsToken(definition);
  ensure(countOccurrences(definition, marker) === 1);
  ensure(countOccurrences(outside, marker) === 1);
  const literal = locateExactValidatorLiteral(outside, marker);
  ensure(validatorLiteralHasExactEqualityRole(outside, literal));
  return marker;
}

function buildT06Value(marker, futureAuthorityBytes, futureAuthoritySha, programBytes, programSha) {
  ensure(/^[A-Z][A-Z0-9_]+$/.test(marker));
  const groups = [
    'D01_V10_AUTHORITY_SHA256_FAC59C843757FC3CC2F80489D50212D95A4D2A1055861F515C7142CE26C40F1E_APPROVED_ACTIVATED_CONSUMED_CLOSED_SINGLE_USE_EXACT1_WORKDIR_APPROVED_ROOT_EXACT1_ACTUAL_ADD_FILE_HEADER_ABSOLUTE_EXACT1_REQUIRED_REPOSITORY_RELATIVE_HEADER_EXACT0_RESOLVED_TARGET_IDENTITY_MATCH_TRUE_TRANSPORT_PROVENANCE_VALID_FALSE_V3_SOURCE_BYTES_14081_LF_280_CR_EXACT0_FINAL_LF_TRUE_RAW_SHA256_971A4F79F6352E209DF088BD619787AC93CEAF1AB0163E5E5CBAEFD6D092D83D_FROZEN_UNCHANGED_INACTIVE_NONCREDIT_UNPUBLISHED_EXACT1_AUTHORITY_AND_STATIC_REVIEW_CREDIT_EXACT0_SCOPE_BLOCKER_STOP_EXACT1_REACTIVATION_RECONSUMPTION_RETRY_RETROACTIVE_CREDIT_EXACT0_EACH',
    'D02_V14_AUTHORITY_ASCII_BYTES_14434_SHA256_4B5B2D34F902F18E06635EDCE2C10A9D81711CC6CC3B797EE1A05E6DEE358FFB_APPROVED_ACTIVATED_CONSUMED_CLOSED_SINGLE_USE_EXACT1_RAW_WHOLE_PATCH_ADD_FILE_SUBSTRING_EXPECTED1_OBSERVED4_CONTROL1_SOURCE_BODY3_VALIDATED_SOURCE_AND_PATCH_BUFFER_IDENTITY_PASS_TRUE_FINAL_TARGET_LSTAT_APPLY_V4_CREATE_WRITE_FREEZE_REVIEW_EXACT0_EACH_V4_REMAINS_ABSENT_V3_UNCHANGED_TRUE_RAW_COUNTER_VALID_FALSE_TYPED_CONTROL_DOMAIN_VALIDATOR_BLOCKER_STOP_EXACT1_REACTIVATION_RECONSUMPTION_RETRY_RETROACTIVE_CREDIT_EXACT0_EACH',
    'D03_V15_AUTHORITY_ASCII_BYTES_12496_SHA256_0B5183E438B2D1295721578CDDAD25CA0D4B660CF6BC2D97B625A5CB1F40687E_APPROVED_ACTIVATED_CONSUMED_CLOSED_SINGLE_USE_EXACT1_ROOT_ORCHESTRATION_JAVASCRIPT_EVALUATION_ATTEMPT_EXACT1_UNQUALIFIED_TEXTENCODER_REFERENCE_EXACT1_REFERENCE_ERROR_TEXTENCODER_IS_NOT_DEFINED_EXACT1_NESTED_TOOL_INVOCATION_AUTHORITY_OR_V3_READ_STAT_HASH_V4_LSTAT_RECONSTRUCTION_PATCH_APPLY_CREATE_FREEZE_REVIEW_EXACT0_EACH_CHANGED_PATHS_EXACT0_V4_ABSENT_V3_UNCHANGED_TRUE_TECHNICAL_CREDIT_EXACT0_PRETOOL_PRIMITIVE_BLOCKER_STOP_EXACT1_REACTIVATION_RECONSUMPTION_RETRY_RETROACTIVE_CREDIT_EXACT0_EACH',
    'D04_PRIOR_V23_PREPARATION_AUTHORITY_ASCII_BYTES_' + String(V23_ASCII_BYTES) + '_SHA256_' + V23_SHA256.toUpperCase() + '_APPROVED_ACTIVATED_CONSUMED_CLOSED_SINGLE_USE_EXACT1_ORCHESTRATOR_V1_RELATIVE_PATH_V16_RETRY2_DRAFT_SLASH_V16_PUBLIC_GATE_EXECUTION_CONTINUATION_CARRIER_V3_TRANSFORMER_V4_PREPARATION_ORCHESTRATOR_V1_DOT_JS_RAW_BYTES_' + String(ORCHESTRATOR_V1_BYTES) + '_LF_' + String(ORCHESTRATOR_V1_LF) + '_CR_EXACT0_FINAL_LF_TRUE_SHA256_' + ORCHESTRATOR_V1_SHA256.toUpperCase() + '_EXACT_NEW_CREATE_WRITE_CLOSE_FREEZE_EXACT1_EACH_STATIC_REVIEW_ATTEMPT_EXACT4_PASS_EXACT0_INVALID_EXACT4_BLOCKER_STOP_EXACT1_FROZEN_UNCHANGED_INACTIVE_NONCREDIT_UNPUBLISHED_EXACT1_EACH_REUSE_REACTIVATION_RECONSUMPTION_REEXECUTION_RETRY_RETROACTIVE_CREDIT_EXACT0_EACH_CURRENT_V27_PREPARATION_AUTHORITY_ASCII_BYTES_' + String(V27_ASCII_BYTES) + '_SHA256_' + V27_SHA256.toUpperCase() + '_APPROVED_ACTIVATED_CONSUMED_CLOSED_SINGLE_USE_EXACT1_ORCHESTRATOR_V2_RELATIVE_PATH_V16_RETRY2_DRAFT_SLASH_V16_PUBLIC_GATE_EXECUTION_CONTINUATION_CARRIER_V3_TRANSFORMER_V4_PREPARATION_ORCHESTRATOR_V2_DOT_JS_RAW_BYTES_' + String(programBytes) + '_SHA256_' + programSha.toUpperCase() + '_EXACT_NEW_CREATE_WRITE_CLOSE_FREEZE_EXACT1_EACH_STATIC_REVIEW_ATTEMPT_EXACT4_PASS_EXACT4_INVALID_EXACT0_RECORDED_ONLY_DURING_FUTURE_EXECUTION_AFTER_COMPLETED_REVIEW_GATE_EXACT1_EXECUTION_NODE_SYNTAX_IMPORT_REQUIRE_EVALUATION_EXACT0_EACH_REACTIVATION_RECONSUMPTION_REEXECUTION_RETRY_EXACT0_EACH',
    'D05_FUTURE_ORCHESTRATOR_EXECUTION_AUTHORITY_ASCII_BYTES_' + String(futureAuthorityBytes) + '_SHA256_' + futureAuthoritySha.toUpperCase() + '_SEPARATELY_APPROVED_ACTIVATED_CONSUMED_SINGLE_USE_EXACT1_FROZEN_ORCHESTRATOR_RAW_BYTES_' + String(programBytes) + '_SHA256_' + programSha.toUpperCase() + '_IDENTITY_BOUND_FROM_VALIDATED_DIRECT_ARGV_EXACT1_EXECUTION_ATTEMPT_EXACT1_RETRY_EXACT0_V4_EXACT_NEW_CREATION_AND_IDENTITY_FREEZE_AUTHORIZED_EXACT1_V4_STATIC_REVIEW_ATTEMPT_AUTHORIZED_EXACT4_V4_STATIC_REVIEW_PASS_NOT_PRECLAIMED_PENDING_EXTERNAL_EXACT1_V4_SUCCESSOR_PRESENTATION_REQUIRES_ALL_FOUR_EXTERNAL_REVIEWS_PASS_EXACT1',
    'D06_SELF_RELATIVE_PATH_V16_RETRY2_DRAFT_SLASH_V16_PUBLIC_GATE_EXECUTION_CONTINUATION_CARRIER_V3_LINEAGE_TRANSFORMER_V4_DOT_PL_EXACT1'
  ];
  ensure(groups.length === 6);
  for (const group of groups) {
    ensure(/^[A-Z0-9_]+$/.test(group));
  }
  return marker + '_' + groups.join('_');
}

function transformSource(sourceBuffer, futureAuthorityBytes, futureAuthoritySha, programBytes, programSha) {
  verifyAsciiBuffer(sourceBuffer, true);
  ensure(sourceBuffer[sourceBuffer.length - 1] === 0x0a);
  ensure(countByte(sourceBuffer, 0x0a) === SOURCE_LF);
  ensure(countByte(sourceBuffer, 0x0d) === 0);
  const source = sourceBuffer.toString('ascii');
  const region = findT06Definition(source);
  const definition = source.slice(region.start, region.end);
  const outside = source.slice(0, region.start) + source.slice(region.end);
  const marker = deriveT06Marker(definition, outside);
  ensure(countOccurrences(source, marker) === 2);
  ensure(countOccurrences(definition, marker) === 1);
  ensure(countOccurrences(outside, marker) === 1);
  const value = buildT06Value(marker, futureAuthorityBytes, futureAuthoritySha, programBytes, programSha);
  const replacement = region.indent + "my $T06 = '" + value + "';\n";
  const transformed = source.slice(0, region.start) + replacement + source.slice(region.end);
  ensure(transformed.slice(0, region.start) === source.slice(0, region.start));
  ensure(transformed.slice(region.start + replacement.length) === source.slice(region.end));
  ensure(countOccurrences(transformed, marker) === 2);
  const transformedRegion = findT06Definition(transformed);
  ensure(transformedRegion.start === region.start);
  ensure(transformed.slice(transformedRegion.start, transformedRegion.end) === replacement);
  const transformedBuffer = Buffer.from(transformed, 'ascii');
  verifyAsciiBuffer(transformedBuffer, true);
  ensure(transformedBuffer[transformedBuffer.length - 1] === 0x0a);
  ensure(countByte(transformedBuffer, 0x0d) === 0);
  return transformedBuffer;
}

function buildAndValidatePatch(transformedBuffer) {
  verifyAsciiBuffer(transformedBuffer, true);
  ensure(transformedBuffer[transformedBuffer.length - 1] === 0x0a);
  const transformed = transformedBuffer.toString('ascii');
  const sourceLines = transformed.slice(0, -1).split('\n');
  const patchLines = [
    '*** Begin Patch',
    '*** Add File: ' + TARGET_RELATIVE_PATH,
    ...sourceLines.map((line) => '+' + line),
    '*** End Patch'
  ];
  ensure(patchLines.length === sourceLines.length + 3);
  ensure(patchLines[0] === '*** Begin Patch');
  ensure(patchLines[1] === '*** Add File: ' + TARGET_RELATIVE_PATH);
  ensure(patchLines[patchLines.length - 1] === '*** End Patch');
  const bodyLines = patchLines.slice(2, -1);
  ensure(bodyLines.length === sourceLines.length);
  for (const line of bodyLines) {
    ensure(line.startsWith('+'));
  }
  const reconstructed = bodyLines.map((line) => line.slice(1)).join('\n') + '\n';
  const reconstructedBuffer = Buffer.from(reconstructed, 'ascii');
  ensure(Buffer.compare(reconstructedBuffer, transformedBuffer) === 0);
  const patchText = patchLines.join('\n') + '\n';
  const patchBuffer = Buffer.from(patchText, 'ascii');
  verifyAsciiBuffer(patchBuffer, true);
  ensure(patchBuffer[patchBuffer.length - 1] === 0x0a);
  ensure(countByte(patchBuffer, 0x0d) === 0);
  ensure(countByte(patchBuffer, 0x0a) === patchLines.length);
  ensure(countOccurrences(patchLines[0], '*** Begin Patch') === 1);
  ensure(countOccurrences(patchLines[1], '*** Add File: ') === 1);
  ensure(countOccurrences(patchLines[patchLines.length - 1], '*** End Patch') === 1);
  return patchBuffer;
}

function buildCanonicalOutput(patchBuffer) {
  ensure(Buffer.isBuffer(patchBuffer));
  ensure(patchBuffer.length > 0);
  ensure(Number.isSafeInteger(patchBuffer.length));
  const patchSha = sha256(patchBuffer);
  const patchBase64 = patchBuffer.toString('base64');
  ensure(/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(patchBase64));
  const decoded = Buffer.from(patchBase64, 'base64');
  ensure(Buffer.compare(decoded, patchBuffer) === 0);
  ensure(decoded.toString('base64') === patchBase64);
  const record = {
    automatic_progression: false,
    body_free: false,
    patch_base64: patchBase64,
    patch_bytes: patchBuffer.length,
    patch_sha256: patchSha,
    schema_version: OUTPUT_SCHEMA,
    terminal: OUTPUT_TERMINAL
  };
  const keys = Object.keys(record);
  const expectedKeys = [
    'automatic_progression',
    'body_free',
    'patch_base64',
    'patch_bytes',
    'patch_sha256',
    'schema_version',
    'terminal'
  ];
  ensure(keys.length === expectedKeys.length);
  for (let index = 0; index < expectedKeys.length; index += 1) {
    ensure(keys[index] === expectedKeys[index]);
  }
  ensure(record.automatic_progression === false);
  ensure(record.body_free === false);
  ensure(record.patch_bytes === patchBuffer.length);
  ensure(record.patch_sha256 === patchSha);
  ensure(record.schema_version === OUTPUT_SCHEMA);
  ensure(record.terminal === OUTPUT_TERMINAL);
  const json = JSON.stringify(record);
  ensure(!json.includes('\n'));
  ensure(!json.includes('\r'));
  const jsonBuffer = manualAsciiBuffer(json);
  const parsed = JSON.parse(json);
  ensure(Object.keys(parsed).length === expectedKeys.length);
  ensure(parsed.patch_base64 === patchBase64);
  ensure(parsed.patch_bytes === patchBuffer.length);
  ensure(parsed.patch_sha256 === patchSha);
  return Buffer.concat([jsonBuffer, Buffer.from([0x0a])]);
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
  ensure(process.argv.length === 7);
  const root = validateRoot(process.argv[2]);
  const futureAuthorityBytes = parseCanonicalPositiveInteger(process.argv[3]);
  const futureAuthoritySha = parseSha256(process.argv[4]);
  const programBytes = parseCanonicalPositiveInteger(process.argv[5]);
  const programSha = parseSha256(process.argv[6]);
  const sourceAbsolute = resolveInside(root, SOURCE_RELATIVE_PATH);
  const targetAbsolute = resolveInside(root, TARGET_RELATIVE_PATH);
  const programAbsolute = resolveInside(root, PROGRAM_RELATIVE_PATH);
  ensure(path.normalize(__filename) === programAbsolute);
  ensure(sourceAbsolute !== targetAbsolute);
  ensure(sourceAbsolute !== programAbsolute);
  ensure(targetAbsolute !== programAbsolute);
  validateFixedPhysicalPaths(root, sourceAbsolute, targetAbsolute);
  const sourceBuffer = readExactRegularFile(sourceAbsolute, SOURCE_BYTES, 0o644);
  ensure(sourceBuffer.length === SOURCE_BYTES);
  ensure(sha256(sourceBuffer) === SOURCE_SHA256);
  verifyAsciiBuffer(sourceBuffer, true);
  ensure(countByte(sourceBuffer, 0x0a) === SOURCE_LF);
  ensure(countByte(sourceBuffer, 0x0d) === 0);
  ensure(sourceBuffer[sourceBuffer.length - 1] === 0x0a);
  requireTargetAbsent(targetAbsolute);
  const transformedBuffer = transformSource(
    sourceBuffer,
    futureAuthorityBytes,
    futureAuthoritySha,
    programBytes,
    programSha
  );
  const patchBuffer = buildAndValidatePatch(transformedBuffer);
  const outputBuffer = buildCanonicalOutput(patchBuffer);
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
