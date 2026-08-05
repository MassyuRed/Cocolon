'use strict';

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const EXIT = Object.freeze({
  TOOLING: 20,
  ARGUMENT: 21,
  LOCATOR: 22,
  ALLOWLIST: 23,
  FILE_ACCESS: 24,
  FILE_IDENTITY: 25,
  JSON_INVALID: 26,
  RECEIPT_INVALID: 27,
  OBJECT_INVALID: 28,
  VECTOR_INVALID: 29,
  INTERNAL: 30,
});

class GateError extends Error {
  constructor(code) {
    super(code);
    this.name = 'GateError';
    this.code = code;
  }
}

function fail(code) {
  throw new GateError(Object.prototype.hasOwnProperty.call(EXIT, code) ? code : 'INTERNAL');
}

function assertGate(condition, code) {
  if (!condition) fail(code);
}

function sha256(buffer) {
  return crypto.createHash('sha256').update(buffer).digest('hex');
}

function gitBlobSha1(buffer) {
  const header = Buffer.from(`blob ${buffer.length}\0`, 'ascii');
  return crypto.createHash('sha1').update(header).update(buffer).digest('hex');
}

function canonicalText(value) {
  if (value === null || typeof value === 'boolean' || typeof value === 'number' || typeof value === 'string') {
    const encoded = JSON.stringify(value);
    assertGate(encoded !== undefined, 'JSON_INVALID');
    return encoded;
  }
  if (Array.isArray(value)) {
    return `[${value.map(canonicalText).join(',')}]`;
  }
  assertGate(typeof value === 'object', 'JSON_INVALID');
  const keys = Object.keys(value).sort();
  return `{${keys.map((key) => `${JSON.stringify(key)}:${canonicalText(value[key])}`).join(',')}}`;
}

function canonicalBuffer(value) {
  return Buffer.from(canonicalText(value), 'utf8');
}

function parseJsonNoDuplicateKeys(buffer) {
  let text;
  try {
    text = new TextDecoder('utf-8', { fatal: true }).decode(buffer);
  } catch (_) {
    fail('JSON_INVALID');
  }
  let index = 0;

  function skipWhitespace() {
    while (index < text.length && (text[index] === ' ' || text[index] === '\n' || text[index] === '\r' || text[index] === '\t')) index += 1;
  }

  function parseString() {
    assertGate(text[index] === '"', 'JSON_INVALID');
    const start = index;
    index += 1;
    let escaped = false;
    while (index < text.length) {
      const code = text.charCodeAt(index);
      if (!escaped && code === 0x22) {
        index += 1;
        try {
          return JSON.parse(text.slice(start, index));
        } catch (_) {
          fail('JSON_INVALID');
        }
      }
      if (!escaped && code < 0x20) fail('JSON_INVALID');
      if (!escaped && code === 0x5c) {
        escaped = true;
      } else {
        escaped = false;
      }
      index += 1;
    }
    fail('JSON_INVALID');
  }

  function parseNumber() {
    const match = /^-?(?:0|[1-9][0-9]*)(?:\.[0-9]+)?(?:[eE][+-]?[0-9]+)?/.exec(text.slice(index));
    assertGate(match !== null, 'JSON_INVALID');
    index += match[0].length;
    const value = Number(match[0]);
    assertGate(Number.isFinite(value), 'JSON_INVALID');
    if (!match[0].includes('.') && !/[eE]/.test(match[0])) assertGate(Number.isSafeInteger(value), 'JSON_INVALID');
    return value;
  }

  function parseArray() {
    assertGate(text[index] === '[', 'JSON_INVALID');
    index += 1;
    skipWhitespace();
    const result = [];
    if (text[index] === ']') {
      index += 1;
      return result;
    }
    while (index < text.length) {
      result.push(parseValue());
      skipWhitespace();
      if (text[index] === ']') {
        index += 1;
        return result;
      }
      assertGate(text[index] === ',', 'JSON_INVALID');
      index += 1;
      skipWhitespace();
    }
    fail('JSON_INVALID');
  }

  function parseObject() {
    assertGate(text[index] === '{', 'JSON_INVALID');
    index += 1;
    skipWhitespace();
    const result = Object.create(null);
    const seen = new Set();
    if (text[index] === '}') {
      index += 1;
      return result;
    }
    while (index < text.length) {
      const key = parseString();
      assertGate(!seen.has(key), 'JSON_INVALID');
      seen.add(key);
      skipWhitespace();
      assertGate(text[index] === ':', 'JSON_INVALID');
      index += 1;
      skipWhitespace();
      result[key] = parseValue();
      skipWhitespace();
      if (text[index] === '}') {
        index += 1;
        return result;
      }
      assertGate(text[index] === ',', 'JSON_INVALID');
      index += 1;
      skipWhitespace();
    }
    fail('JSON_INVALID');
  }

  function parseValue() {
    skipWhitespace();
    assertGate(index < text.length, 'JSON_INVALID');
    const first = text[index];
    if (first === '"') return parseString();
    if (first === '{') return parseObject();
    if (first === '[') return parseArray();
    if (first === '-' || (first >= '0' && first <= '9')) return parseNumber();
    if (text.startsWith('true', index)) {
      index += 4;
      return true;
    }
    if (text.startsWith('false', index)) {
      index += 5;
      return false;
    }
    if (text.startsWith('null', index)) {
      index += 4;
      return null;
    }
    fail('JSON_INVALID');
  }

  const parsed = parseValue();
  skipWhitespace();
  assertGate(index === text.length, 'JSON_INVALID');
  return parsed;
}

function strictBase64Decode(value) {
  assertGate(typeof value === 'string' && value.length > 0 && value.length % 4 === 0, 'TOOLING');
  assertGate(/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(value), 'TOOLING');
  const decoded = Buffer.from(value, 'base64');
  assertGate(decoded.toString('base64') === value, 'TOOLING');
  return decoded;
}

function runToolingSelfTest() {
  assertGate(sha256(Buffer.from('abc', 'ascii')) === 'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad', 'TOOLING');
  assertGate(gitBlobSha1(Buffer.alloc(0)) === 'e69de29bb2d1d6434b8b29ae775ad8c2e48c5391', 'TOOLING');
  const fatal = new TextDecoder('utf-8', { fatal: true });
  assertGate(fatal.decode(Buffer.from('e38182', 'hex')) === '\u3042', 'TOOLING');
  let invalidRejected = false;
  try {
    fatal.decode(Buffer.from([0xc3, 0x28]));
  } catch (_) {
    invalidRejected = true;
  }
  assertGate(invalidRejected, 'TOOLING');
  assertGate(strictBase64Decode('QQo=').equals(Buffer.from([0x41, 0x0a])), 'TOOLING');
  assertGate(strictBase64Decode('44GC').equals(Buffer.from('e38182', 'hex')), 'TOOLING');
  const known = canonicalText({ b: [2, 1], a: '\u3042' });
  assertGate(known === '{"a":"\u3042","b":[2,1]}', 'TOOLING');
}

const DOCS_RELATIVE = 'EmlisAI\u306e\u5b9f\u88c5\u6e08\u307f\u8cc7\u6599/documents';
const DOCS_PREFIX = `${DOCS_RELATIVE}/`;

const FILES = Object.freeze([
  Object.freeze({ role: 'current_07', relative: 'Cocolon_\u524d\u63d0\u8cc7\u6599/07_latest_snapshot_diff.md', bytes: 2332142, lf: 38694, raw: '8429cf405d4e8884a66781155a8c86d75cf516b737a0d66b09ab1ebd7ae4660e', blob: '72a5d84a84422adcadee2df31310e21f1f3d93ef', json: false }),
  Object.freeze({ role: 'current_plan', relative: `${DOCS_PREFIX}NLSv3_Step11_Cycle001_ExecutionAndClosurePlan_ReadOnly_20260723.md`, bytes: 1136748, lf: 17942, raw: '4aa63814fee5fa7a1dfce17d2adf9233fb86f727de6543330b721b2e903dee4a', blob: '8cca7adbe054f445e16a5d678b3386e308872fa1', json: false }),
  Object.freeze({ role: 'r1_function', relative: `${DOCS_PREFIX}NLSv3_Step11_Cycle001_RecoveryEpoch004_GateB_V5FunctionBoundaryGrammarAndPublicExact9FixtureCoverageReconciliationContractV1_DualStaticValidMatching_DesignOnlyStop_BodyFree_Receipt_20260803.json`, bytes: 61034, lf: 1233, raw: 'b2578b507a6685e85b2138a89a1a6bb656d722e3cb3514281e2752fc29b6f159', blob: '088195f3e6e328630947f7ae8c25a98560f7c966', json: true }),
  Object.freeze({ role: 'r2_component', relative: `${DOCS_PREFIX}NLSv3_Step11_Cycle001_RecoveryEpoch004_GateB_V6ComponentModuleSliceAndCrossComponentEdgeDesign_OwnerForwardEdgeResolutionCardinalityInvalidIndependentValidProjectionMismatch_TypedBlockerStop_BodyFree_Receipt_20260803.json`, bytes: 66583, lf: 1276, raw: '061b1274a63d36839d87a2b259a04779d908f539596f298126c20035b9477364', blob: '3f5aa32905955c0407befc520bafbb7ca07ca83f', json: true }),
  Object.freeze({ role: 'r3_projection', relative: `${DOCS_PREFIX}NLSv3_Step11_Cycle001_RecoveryEpoch004_GateB_V6PublicDesignProjectionAggregationAndEdgeResolutionCardinalityReconciliationContractV1_DualStaticValidMatching_DesignOnlyStop_BodyFree_Receipt_20260804.json`, bytes: 80415, lf: 1694, raw: 'e8a2afa60bef47f1221752a3d2d05728c3cc06310764c02cf93c228c0e4dbc30', blob: '35386887f3cbf9bd91955c79430865239e5e755f', json: true }),
  Object.freeze({ role: 'r4_call', relative: `${DOCS_PREFIX}NLSv3_Step11_Cycle001_RecoveryEpoch004_GateB_V10CallOccurrenceResolutionAndForbiddenCalleeFormReconciliationContractV1_DualDesignValidMatching_DesignOnlyStop_BodyFree_Receipt_20260804.json`, bytes: 219337, lf: 4300, raw: '5bbc05949c6e5b584052f3014e4cff5e237d514457cf0d6ec41b4a53f0acccbe', blob: '9d10e44a583efb8f270c909fee5f7133469ab630', json: true }),
  Object.freeze({ role: 'r5_v11', relative: `${DOCS_PREFIX}NLSv3_Step11_Cycle001_RecoveryEpoch004_GateB_V11AnalyzerPreflight_C20UnspecifiedAsUnresolved_ProjectionMismatch_TypedBlockerStop_BodyFree_Receipt_20260804.json`, bytes: 27994, lf: 280, raw: '59e3755c36074ccc086cfc86c34d739e6eae4eb9e9ad765d50f2760956b80569', blob: '52b1dea4861fbfbb87c1e0c04dd7319023c303f3', json: true }),
  Object.freeze({ role: 'r6_v12', relative: `${DOCS_PREFIX}NLSv3_Step11_Cycle001_RecoveryEpoch004_GateB_V12AnalyzerPreflight_OwnerC06ReturnContextRegexProtectedStateKindMismatch_IndependentM05TopLevelPrefixNontriviaCertificateFailure_DualInvalidComparisonUnavailable_TypedBlockerStop_BodyFree_Receipt_20260804.json`, bytes: 29663, lf: 297, raw: '3c9196b803452bcc0ccac46c91f4ae7df55169d5c022e51ff330bf2e2801002e', blob: '19265c9773b21359f02816fbb4c91deb76818b73', json: true }),
  Object.freeze({ role: 'r7_v13', relative: `${DOCS_PREFIX}NLSv3_Step11_Cycle001_RecoveryEpoch004_GateB_V13AnalyzerPreflight_OwnerC05Record2ExactTokenMismatch_IndependentC16Record3ExactTokenMismatch_DualInvalidComparisonUnavailable_TypedBlockerStop_BodyFree_Receipt_20260804.json`, bytes: 32732, lf: 334, raw: '901b574b50c4cbc4202f84d961beea910a227a98c0a148b85f0b33782b70b66f', blob: '5af8d6e9908cadc4eb4e73333118419b985b2074', json: true }),
  Object.freeze({ role: 'r8_v14', relative: `${DOCS_PREFIX}NLSv3_Step11_Cycle001_RecoveryEpoch004_GateB_V14AnalyzerPreflight_DualPublicFixtureContainerLocatorMismatch_TypedBlockerStop_BodyFree_Receipt_20260804.json`, bytes: 8803, lf: 30, raw: '4391aa7214a3d69cbedb55fd4e27c6c0c8f9f034fd1cc682f0a516fd2db36026', blob: '18a23c5906a519775e64e46544129be2490d8423', json: true }),
  Object.freeze({ role: 'static_contract_source', relative: `${DOCS_PREFIX}NLSv3_Step11_Cycle001_RecoveryEpoch004_GateB_V3StaticProofProjectionAndQualifiedTargetBindingReconciliationContractDesignOnly_V1_DualStaticValidMatchingDesignStop_BodyFree_Receipt_20260803.json`, bytes: 49986, lf: 856, raw: '5391ec818ec07f427d260ac863f54fd2e480a9889b47687269440eb33739e24b', blob: 'ec0bbef792e281db006e657daee0fe1f34b30752', json: true }),
  Object.freeze({ role: 'launcher_contract_source', relative: `${DOCS_PREFIX}NLSv3_Step11_Cycle001_RecoveryEpoch004_GateB_LauncherUTF8ExactByteTransportAndSingleTerminalOwnershipReconciliationContractDesignOnly_V1_DualStaticValidMatchingDesignStop_BodyFree_Receipt_20260803.json`, bytes: 69215, lf: 1372, raw: '5e2cd86431713c41866a7fb8fbcef4fb5860d32b6f226f45fc143ef537154793', blob: 'cbeba0e13e7df8eeac41fa5d3b2d50d85320d652', json: true }),
  Object.freeze({ role: 'current_v15_receipt', relative: `${DOCS_PREFIX}NLSv3_Step11_Cycle001_RecoveryEpoch004_GateB_V15PublicFixtureContainerLocatorBoundDualAnalyzerPreflightValidMatching_ImplementationStaticDualValidMatching_StaticOnlyStop_BodyFree_Receipt_20260805.json`, bytes: 22205, lf: 310, raw: '90c10408f33bda9d169dd36ba4ac5a1d5228ea3f7de7be21d58832650f270871', blob: '9ccd77e72a98d7424fc43de018a9c0d00fd00787', json: true }),
]);

const RECEIPTS = Object.freeze([
  Object.freeze({ role: 'r1_function', observationBytes: 34582, observation: '9215d600cf4c686901d5b3147885ab1450557ecb5adacc289d0b1c328e5a9bc7', logicalBytes: 44779, logical: '587d30e97a9335b6f3faeab93fe135b145d4345ddad19ccb08eb0eac6fd982cc' }),
  Object.freeze({ role: 'r2_component', observationBytes: 40647, observation: '24aed53a1a6a23a577ec87d7551ff5e74792b3219656d0c22354989b0b6f6754', logicalBytes: 49750, logical: 'af84cffa67c76a6f835f8073e1d999d4ae33a1fd382ff6e794ac0c3e2848f37b' }),
  Object.freeze({ role: 'r3_projection', observationBytes: 45111, observation: 'c79cb8c04f4e24deb35a36d463498ab645e7edb54a3b4e52cc0d76e86c835ca4', logicalBytes: 58932, logical: 'd05a16ee1384ee11e5b8020c3ebfdc2fe36a722f1b71b0b2aee36972782d9488' }),
  Object.freeze({ role: 'r4_call', observationBytes: 134952, observation: '45c9d5558c31dae1689287822ed5905cc5a903533b30020865d194a419eda069', logicalBytes: 151464, logical: 'f1458ec59188a3a02a8a15c95f28f3c904f495b10cabb0353b165d5981faa11c' }),
  Object.freeze({ role: 'r5_v11', observationBytes: 10163, observation: 'c40a46f63f567b65e4ef375971b6fdeb864a4137ede14429139788eb9bacfc20', logicalBytes: 25544, logical: 'f38bac7e2d3ebae80657118157c84b40c5cb83b93992c2455100a3c2c4584056' }),
  Object.freeze({ role: 'r6_v12', observationBytes: 11469, observation: 'b3000e6f8e01674924a96de8634f7756aa769fc6bc78bdf6d711f3ef5700d7c2', logicalBytes: 27009, logical: 'b1e11e7c7d3d5638c476d03cbd2c4b663bd8fc027fbc57cc83580d5ec0c97112' }),
  Object.freeze({ role: 'r7_v13', observationBytes: 12652, observation: '93749946daf67ec0f4e621d3b998b37fea908066e3d28b3339714c7172e5e21f', logicalBytes: 29692, logical: '75cc375c0f0df503d06c64f2bdf58652ce5c966c73254c858ea9453ff744560e' }),
  Object.freeze({ role: 'r8_v14', observationBytes: 3162, observation: '4b9d156c1dca7bdcd1e7ddcb9454b75a0e2ef105025a693036e4ab741c72c5ec', logicalBytes: 8568, logical: '156212a6df0ea7bd91d4e4396def94737f1d45bb014d486ae81820e5252e92af' }),
]);

const CURRENT_V15 = Object.freeze({ role: 'current_v15_receipt', observationBytes: 10902, observation: '3d807ae78217b119eca1ebf8e877b55b38180a167db51eec86c0d86697c359c8', logicalBytes: 19496, logical: '6fec245d4d4a493677c1ada63ee5e5985e73d08aa09955b1e402663a5e1b1c72' });

const OBJECTS = Object.freeze([
  Object.freeze({ role: 'o01_function_contract', source: 'r1_function', pointer: ['observation', 'reconciliation_contract', 'candidate'], bytes: 9548, sha: 'eaaab87d505c6dbb4a44df8f4b2941ac2e0bae8d6323aa6ebdbefb5175aa08ab' }),
  Object.freeze({ role: 'o02_function_grammar', source: 'r1_function', pointer: ['observation', 'public_function_boundary_design', 'public_grammar_candidate'], bytes: 3137, sha: 'd6075f44c49a1be4f1c3d98ff1b9b533a24426217037c533e2dadd46c314cb3b' }),
  Object.freeze({ role: 'o03_function_fixture', source: 'r1_function', pointer: ['observation', 'public_function_boundary_design', 'public_fixture_set'], bytes: 3233, sha: 'f4a7ff5715295b753c9813256fb1bf51f9ac8bc98580dcdcba1858960bf65c91' }),
  Object.freeze({ role: 'o04_component_grammar', source: 'r2_component', pointer: ['observation', 'public_design_candidates', 'component_module_grammar_candidate'], bytes: 3231, sha: 'd0967909259a1e4fb6bfd2b521d0ade1ea4ce31a3526ca4a56bfcd5ed5deb61d' }),
  Object.freeze({ role: 'o05_component_fixture', source: 'r2_component', pointer: ['observation', 'public_design_candidates', 'component_module_and_cross_component_edge_fixture_set'], bytes: 14564, sha: '3c58b37d24c587de49706d5c8f00a5a74586d7b103e01ddb91466173d4dc400f' }),
  Object.freeze({ role: 'o06_static_contract', source: 'static_contract_source', pointer: ['observation', 'static_proof_reconciliation_contract_v1_candidate'], bytes: 19062, sha: '228ec97e17c52f49db1951a804e7d611831546bf31d4ceb07daab5418e94e3ba' }),
  Object.freeze({ role: 'o07_launcher_contract', source: 'launcher_contract_source', pointer: ['observation', 'launcher_utf8_exact_byte_transport_and_single_terminal_ownership_reconciliation_contract_v1_candidate'], bytes: 30194, sha: 'a444aa84dd7db155ea792f70cc3a1949a03de9e8d9d3cb4b47f3cbce12d2b4e3' }),
  Object.freeze({ role: 'o08_projection_domain', source: 'r3_projection', pointer: ['observation', 'public_design_candidates', 'projection_domain_aggregation_candidate'], bytes: 4329, sha: '5ae8caa3a4bdc20af36150558690babd490e85354d1b4565237a4e71d9d241a4' }),
  Object.freeze({ role: 'o09_edge_cardinality', source: 'r3_projection', pointer: ['observation', 'public_design_candidates', 'edge_resolution_cardinality_domain_candidate'], bytes: 3114, sha: '448bef86a484c2233f4f85b4e734b57dc2927adc1812a75e7c335b6b1d388db9' }),
  Object.freeze({ role: 'o10_projection_contract', source: 'r3_projection', pointer: ['observation', 'reconciliation_contract', 'candidate'], bytes: 3646, sha: '50135a9c633b3c562f6ee808a325f4adbcbf71642481c73a443cc07dffe78bed' }),
  Object.freeze({ role: 'o11_reconciled_projection', source: 'r3_projection', pointer: ['observation', 'owner_forward_public_design', 'projection'], bytes: 6098, sha: '00d6b45aa5c11ac2af1624aa8a92936ac0091a1615c4dabcfeff84223fe87a1b' }),
  Object.freeze({ role: 'o12_call_grammar', source: 'r4_call', pointer: ['observation', 'public_design_candidates', 'grammar_candidate'], bytes: 7619, sha: '06a1ca6324df80857310d63d5e0fcac4b868a0f95adc15acb85f520a235891db' }),
  Object.freeze({ role: 'o13_call_fixture', source: 'r4_call', pointer: ['observation', 'public_design_candidates', 'fixture_set'], bytes: 85504, sha: '88e6f91ef430cf6cadb2eaebf3b4c015de43a17ce6096e1d406f734454934468' }),
  Object.freeze({ role: 'o14_call_contract', source: 'r4_call', pointer: ['observation', 'reconciliation_contract', 'candidate'], bytes: 7601, sha: '6cf8088bdf09c8ad645f811b4dd83928f16632a2da06b18ea4d0b18833220b16' }),
]);

function resolvePointer(root, pointer) {
  let current = root;
  for (const member of pointer) {
    assertGate(current !== null && typeof current === 'object' && Object.prototype.hasOwnProperty.call(current, member), 'OBJECT_INVALID');
    current = current[member];
  }
  return current;
}

function validateArguments() {
  assertGate(process.argv.length === 4, 'ARGUMENT');
  const root = process.argv[2];
  const docsRelative = process.argv[3];
  assertGate(typeof root === 'string' && root.length > 0 && !root.includes('\0'), 'ARGUMENT');
  assertGate(path.isAbsolute(root) && path.normalize(root) === root, 'ARGUMENT');
  assertGate(typeof docsRelative === 'string' && docsRelative === DOCS_RELATIVE && !docsRelative.includes('\0'), 'ARGUMENT');
  assertGate(!path.isAbsolute(docsRelative) && path.posix.normalize(docsRelative) === docsRelative, 'ARGUMENT');
  const parts = docsRelative.split('/');
  assertGate(parts.length === 2 && parts.every((part) => part.length > 0 && part !== '.' && part !== '..'), 'ARGUMENT');
  const docs = path.join(root, ...parts);
  assertGate(path.normalize(docs) === docs && docs.startsWith(`${root}${path.sep}`), 'LOCATOR');
  try {
    assertGate(fs.lstatSync(root).isDirectory() && fs.realpathSync(root) === root, 'LOCATOR');
    assertGate(fs.lstatSync(docs).isDirectory() && fs.realpathSync(docs) === docs, 'LOCATOR');
    fs.accessSync(root, fs.constants.R_OK);
    fs.accessSync(docs, fs.constants.R_OK);
  } catch (_) {
    fail('LOCATOR');
  }
  return Object.freeze({ root, docs });
}

function readPublicFile(root, expected) {
  const absolute = path.join(root, ...expected.relative.split('/'));
  assertGate(path.normalize(absolute) === absolute && absolute.startsWith(`${root}${path.sep}`), 'ALLOWLIST');
  let descriptor;
  let buffer;
  try {
    const before = fs.lstatSync(absolute);
    assertGate(before.isFile() && !before.isSymbolicLink(), 'FILE_ACCESS');
    assertGate(fs.realpathSync(absolute) === absolute, 'FILE_ACCESS');
    descriptor = fs.openSync(absolute, fs.constants.O_RDONLY | fs.constants.O_NOFOLLOW);
    const stat = fs.fstatSync(descriptor);
    assertGate(stat.isFile() && stat.size === expected.bytes, 'FILE_IDENTITY');
    buffer = Buffer.alloc(stat.size);
    let offset = 0;
    while (offset < buffer.length) {
      const count = fs.readSync(descriptor, buffer, offset, buffer.length - offset, offset);
      assertGate(count > 0, 'FILE_ACCESS');
      offset += count;
    }
    const oneMore = Buffer.alloc(1);
    assertGate(fs.readSync(descriptor, oneMore, 0, 1, offset) === 0, 'FILE_ACCESS');
  } catch (error) {
    if (error instanceof GateError) throw error;
    fail('FILE_ACCESS');
  } finally {
    if (descriptor !== undefined) {
      try {
        fs.closeSync(descriptor);
      } catch (_) {
        fail('FILE_ACCESS');
      }
    }
  }
  assertGate(buffer.length === expected.bytes, 'FILE_IDENTITY');
  let lf = 0;
  let cr = 0;
  for (const byte of buffer) {
    if (byte === 0x0a) lf += 1;
    if (byte === 0x0d) cr += 1;
  }
  assertGate(lf === expected.lf && cr === 0 && buffer.length > 0 && buffer[buffer.length - 1] === 0x0a, 'FILE_IDENTITY');
  assertGate(sha256(buffer) === expected.raw && gitBlobSha1(buffer) === expected.blob, 'FILE_IDENTITY');
  return buffer;
}

function validateReceipt(receipt, expected) {
  assertGate(receipt !== null && typeof receipt === 'object' && !Array.isArray(receipt), 'RECEIPT_INVALID');
  assertGate(receipt.receipt_state === 'CLOSED_UNCONSUMED', 'RECEIPT_INVALID');
  assertGate(receipt.body_free === true && receipt.automatic_progression === false, 'RECEIPT_INVALID');
  assertGate(typeof receipt.observation_sha256 === 'string' && receipt.observation_sha256 === expected.observation, 'RECEIPT_INVALID');
  assertGate(typeof receipt.receipt_logical_sha256 === 'string' && receipt.receipt_logical_sha256 === expected.logical, 'RECEIPT_INVALID');
  const observation = canonicalBuffer(receipt.observation);
  assertGate(observation.length === expected.observationBytes && sha256(observation) === expected.observation, 'RECEIPT_INVALID');
  const logicalObject = Object.assign(Object.create(null), receipt);
  assertGate(Object.prototype.hasOwnProperty.call(logicalObject, 'receipt_logical_sha256'), 'RECEIPT_INVALID');
  delete logicalObject.receipt_logical_sha256;
  const logical = canonicalBuffer(logicalObject);
  assertGate(logical.length === expected.logicalBytes && sha256(logical) === expected.logical, 'RECEIPT_INVALID');
}

function validateVector(launcherContract) {
  const vector = resolvePointer(launcherContract, ['public_semantic_preflight_vector_contract']);
  const cases = resolvePointer(vector, ['cases']);
  assertGate(Array.isArray(cases) && cases.length === 14, 'VECTOR_INVALID');
  const canonicalCases = canonicalBuffer(cases);
  assertGate(canonicalCases.length === 8632 && sha256(canonicalCases) === 'fd91e2fcee052403f8c688dfabe63f9383e9f471e7e9db2005a72973b1f31d97', 'VECTOR_INVALID');
  const expectedOrder = ['A01_VALID_ASCII_UTF8_IDENTITY', 'A02_VALID_MULTIBYTE_JAPANESE_UTF8_IDENTITY', 'A03_VALID_CONTROLLER_SINGLE_BODY_FREE_JSON_PUBLICATION', 'S01_SHA_MISMATCH', 'S02_BYTE_COUNT_MISMATCH', 'S03_LINE_COUNT_MISMATCH', 'S04_READBACK_TRUNCATED_OR_EXTRA', 'S05_INVALID_UTF8', 'S06_LOADER_REJECT_OR_THROW', 'S07_PREVALIDATION_FAILURE_EXIT_CATCHABLE', 'S08_EVALUATOR_CONSTRUCTION_FAILURE', 'S09_CONTROLLER_THROW_OR_REJECT_BEFORE_VALID_PUBLICATION', 'S10_CONTROLLER_ZERO_PUBLICATION', 'S11_CONTROLLER_MULTIPLE_OR_MALFORMED_PUBLICATIONS'];
  const ids = cases.map((entry) => entry.case_id);
  assertGate(ids.every((id, index) => id === expectedOrder[index]) && new Set(ids).size === 14, 'VECTOR_INVALID');
  assertGate(cases.every((entry, index) => entry.rank === index + 1 && entry.expected_public_terminal_count === 1), 'VECTOR_INVALID');
  assertGate(cases.filter((entry) => entry.expected_class === 'ADMIT').length === 3, 'VECTOR_INVALID');
  assertGate(cases.filter((entry) => entry.expected_class === 'CONTROLLED_STOP').length === 11, 'VECTOR_INVALID');
  let variants = 0;
  let multi = 0;
  let required = 0;
  for (const entry of cases) {
    assertGate(Array.isArray(entry.synthetic_state_variants) && entry.synthetic_state_variants.length >= 1, 'VECTOR_INVALID');
    const variantIds = entry.synthetic_state_variants.map((variant) => variant.variant_id);
    assertGate(variantIds.every((id) => typeof id === 'string' && id.length > 0) && new Set(variantIds).size === variantIds.length, 'VECTOR_INVALID');
    variants += variantIds.length;
    if (variantIds.length > 1) {
      multi += 1;
      assertGate(Array.isArray(entry.required_subwitnesses), 'VECTOR_INVALID');
      const requiredIds = entry.required_subwitnesses;
      required += requiredIds.length;
      assertGate(requiredIds.length === variantIds.length && new Set(requiredIds).size === requiredIds.length, 'VECTOR_INVALID');
      assertGate([...requiredIds].sort().every((id, index) => id === [...variantIds].sort()[index]), 'VECTOR_INVALID');
    } else {
      assertGate(!Object.prototype.hasOwnProperty.call(entry, 'required_subwitnesses'), 'VECTOR_INVALID');
    }
  }
  assertGate(variants === 20 && multi === 5 && required === 11, 'VECTOR_INVALID');
  assertGate(vector.case_count === 14 && vector.admit_case_count === 3 && vector.controlled_stop_case_count === 11, 'VECTOR_INVALID');
  assertGate(vector.case_ids_unique === true && vector.closed === true, 'VECTOR_INVALID');
}

function main() {
  runToolingSelfTest();
  const locator = validateArguments();
  assertGate(FILES.length === 13 && new Set(FILES.map((entry) => entry.role)).size === 13 && new Set(FILES.map((entry) => entry.relative)).size === 13, 'ALLOWLIST');
  const buffers = new Map();
  const jsonObjects = new Map();
  for (const expected of FILES) {
    const buffer = readPublicFile(locator.root, expected);
    buffers.set(expected.role, buffer);
    if (expected.json) jsonObjects.set(expected.role, parseJsonNoDuplicateKeys(buffer));
  }
  assertGate(buffers.size === 13 && jsonObjects.size === 11, 'ALLOWLIST');
  assertGate(RECEIPTS.length === 8 && new Set(RECEIPTS.map((entry) => entry.role)).size === 8, 'RECEIPT_INVALID');
  for (const expected of RECEIPTS) validateReceipt(jsonObjects.get(expected.role), expected);
  validateReceipt(jsonObjects.get(CURRENT_V15.role), CURRENT_V15);
  assertGate(OBJECTS.length === 14 && new Set(OBJECTS.map((entry) => entry.role)).size === 14, 'OBJECT_INVALID');
  assertGate(new Set(OBJECTS.map((entry) => `${entry.source}:${entry.pointer.join('/')}`)).size === 14, 'OBJECT_INVALID');
  let launcherContract;
  for (const expected of OBJECTS) {
    const source = jsonObjects.get(expected.source);
    assertGate(source !== undefined, 'OBJECT_INVALID');
    const object = resolvePointer(source, expected.pointer);
    const canonical = canonicalBuffer(object);
    assertGate(canonical.length === expected.bytes && sha256(canonical) === expected.sha, 'OBJECT_INVALID');
    if (expected.role === 'o07_launcher_contract') launcherContract = object;
  }
  const projectionSource = jsonObjects.get('r3_projection');
  const independentProjection = resolvePointer(projectionSource, ['observation', 'independent_backward_public_design', 'projection']);
  const independentCanonical = canonicalBuffer(independentProjection);
  assertGate(independentCanonical.length === 6098 && sha256(independentCanonical) === '00d6b45aa5c11ac2af1624aa8a92936ac0091a1615c4dabcfeff84223fe87a1b', 'OBJECT_INVALID');
  assertGate(launcherContract !== undefined, 'OBJECT_INVALID');
  validateVector(launcherContract);
  const success = Object.freeze({
    schema_version: 'NLSV3_V16_PUBLIC_FULL_GATE_HARNESS_RESULT_V1',
    body_free: true,
    terminal: 'PUBLIC_FULL_INPUT_IDENTITY_TOOLING_AND_LOCATOR_GATE_VALID',
    automatic_progression: false,
    failure_count: 0,
    ordered_sanitized_false_keys: Object.freeze([]),
    tooling_self_test_valid: true,
    locator_binding_valid: true,
    public_file_reads_exact: 13,
    required_receipts_valid_exact: 8,
    current_v15_receipt_valid: true,
    public_contract_objects_valid_exact: 14,
    public_dual_projection_match: true,
    closed_vector_cases_exact: 14,
    expected_admit_exact: 3,
    expected_controlled_stop_exact: 11,
    scenario_variants_exact: 20,
    multi_subwitness_cases_exact: 5,
    required_subwitness_records_exact: 11,
  });
  process.stdout.write(`${canonicalText(success)}\n`);
}

try {
  main();
} catch (error) {
  process.exitCode = error instanceof GateError && Object.prototype.hasOwnProperty.call(EXIT, error.code) ? EXIT[error.code] : EXIT.INTERNAL;
}
