#!/bin/bash
# Only run in a disposable checkout: build isolation replaces the app launch
# source there. The native build copy gets scalar test diagnostics; the tracked
# product source and native patch stay intact.
set -euo pipefail
: "${RUNNER_TEMP:?Requires an isolated CI checkout}"
test "${GITHUB_ACTIONS:-}" = true
ROOT="$PWD"
OUT="$RUNNER_TEMP/piece-rn-canvas"
mkdir -p "$OUT"
# Scalar guard observation exists only in this disposable hosted-test build.
# Product preimage and exact lexical projection are checked before compilation.
python3 - "$OUT/piece-native-diagnostic-map.json" <<'PIECE_DIAGNOSTIC_PY'
import hashlib
import sys
import json
from pathlib import Path
import re

EXPECTED_SHA256 = "581dfd3864cb5f88457c8cd3e54aa7e6e360e7dcca8c4b58491697c5eb7dbfd4"
PREFIX = '''
// Hosted-test-only scalar diagnostic, injected in this disposable checkout.
// No wire field, guard expression, return value, clock or paint is changed.
struct CocolonPieceDiagnosticTLSState {
  long long tag;
  double fontSize;
  NSInteger requestStage;
  NSInteger firstFailureStage;
  bool enabled;
  double rasterWidth, rasterHeight, rasterScale, rasterColumns, rasterRows;
  unsigned int rasterFailures;
  bool comparisonAvailable, comparisonMismatch;
  size_t comparisonX, comparisonY, comparisonColumns, comparisonRows;
  unsigned int actualAlpha;
  bool referenceOccupied, naturalContentsFlipped, referenceContentsFlipped;
  bool naturalGeometryFlipped, referenceGeometryFlipped, referenceInterpolate;
  CGRect referenceCells, actualCells, nativeExtent, logicalExtent, sourceClip;
  CGAffineTransform observedCTM, paintCTM;
  CGPoint phase;
  double naturalScale, referenceScale, naturalOpacity, referenceOpacity;
};
static_assert(sizeof(CocolonPieceDiagnosticTLSState) <= 1024, "Bound test-only scalar observation");
static thread_local CocolonPieceDiagnosticTLSState CocolonPieceDiagnosticTLS = {};
static inline void CocolonPieceDiagnosticBegin(long long tag, double fontSize, NSInteger stage, BOOL enabled) {
  CocolonPieceDiagnosticTLS = {};
  CocolonPieceDiagnosticTLS.tag=tag; CocolonPieceDiagnosticTLS.fontSize=fontSize;
  CocolonPieceDiagnosticTLS.requestStage=stage; CocolonPieceDiagnosticTLS.enabled=enabled != NO;
}
static inline void CocolonPieceDiagnosticRaster(CGSize size, CGFloat scale, double w, double h) {
  auto &d=CocolonPieceDiagnosticTLS;
  if (!d.enabled || d.rasterFailures) return;
  unsigned int failures=(!isfinite(scale)?1:0)|(scale<=0?2:0)|(!isfinite(w)?4:0)|(!isfinite(h)?8:0)|
    (w<1?16:0)|(h<1?32:0)|(w>4096?64:0)|(h>4096?128:0)|(w*h>4*1024*1024?256:0);
  if (!failures) return;
  d.rasterWidth=size.width; d.rasterHeight=size.height; d.rasterScale=scale;
  d.rasterColumns=w; d.rasterRows=h; d.rasterFailures=failures;
}
static inline void CocolonPieceDiagnosticReference(CGRect cells, CGRect nativeExtent, CGRect logicalExtent,
    CGRect sourceClip, CGAffineTransform observedCTM, CGAffineTransform paintCTM, CGPoint phase,
    CALayer *natural, CALayer *reference, CGImageRef image) {
  auto &d=CocolonPieceDiagnosticTLS;
  if (!d.enabled || d.comparisonAvailable) return;
  d.comparisonAvailable=true; d.referenceCells=cells;
  d.nativeExtent=nativeExtent; d.logicalExtent=logicalExtent; d.sourceClip=sourceClip;
  d.observedCTM=observedCTM; d.paintCTM=paintCTM; d.phase=phase;
  d.naturalContentsFlipped=[natural contentsAreFlipped];
  d.referenceContentsFlipped=[reference contentsAreFlipped];
  d.naturalGeometryFlipped=natural.geometryFlipped; d.referenceGeometryFlipped=reference.geometryFlipped;
  d.referenceInterpolate=CGImageGetShouldInterpolate(image);
  d.naturalScale=natural.contentsScale; d.referenceScale=reference.contentsScale;
  d.naturalOpacity=natural.opacity; d.referenceOpacity=reference.opacity;
}
static inline void CocolonPieceDiagnosticDifference(size_t x, size_t y, size_t columns, size_t rows,
    unsigned int actualAlpha, bool referenceOccupied, CGRect actualCells) {
  auto &d=CocolonPieceDiagnosticTLS;
  if (!d.enabled || d.comparisonMismatch) return;
  d.comparisonMismatch=true; d.comparisonX=x; d.comparisonY=y;
  d.comparisonColumns=columns; d.comparisonRows=rows;
  d.actualAlpha=actualAlpha; d.referenceOccupied=referenceOccupied; d.actualCells=actualCells;
}
static inline void CocolonPieceDiagnosticMark(NSInteger stage) {
  if (CocolonPieceDiagnosticTLS.enabled && CocolonPieceDiagnosticTLS.firstFailureStage == 0)
    CocolonPieceDiagnosticTLS.firstFailureStage = stage;
}
'''
GETTER = '''
// Present only in the disposable hosted-test app, never an RN export.
- (NSDictionary *)cocolonPieceDiagnosticState {
  const auto &d=CocolonPieceDiagnosticTLS;
  return @{@"tag":@(CocolonPieceDiagnosticTLS.tag),
    @"font_size":@(CocolonPieceDiagnosticTLS.fontSize),
    @"request_stage":@(CocolonPieceDiagnosticTLS.requestStage),
    @"first_failure_stage":@(CocolonPieceDiagnosticTLS.firstFailureStage),
    @"enabled":@(CocolonPieceDiagnosticTLS.enabled),
    @"main_thread":@(NSThread.isMainThread),
    @"raster_plan_failure":@{@"input_width":(isfinite(CocolonPieceDiagnosticTLS.rasterWidth) ? @(CocolonPieceDiagnosticTLS.rasterWidth) : (id)NSNull.null),
      @"input_height":(isfinite(CocolonPieceDiagnosticTLS.rasterHeight) ? @(CocolonPieceDiagnosticTLS.rasterHeight) : (id)NSNull.null), @"scale":(isfinite(CocolonPieceDiagnosticTLS.rasterScale) ? @(CocolonPieceDiagnosticTLS.rasterScale) : (id)NSNull.null),
      @"columns":(isfinite(CocolonPieceDiagnosticTLS.rasterColumns) ? @(CocolonPieceDiagnosticTLS.rasterColumns) : (id)NSNull.null), @"rows":(isfinite(CocolonPieceDiagnosticTLS.rasterRows) ? @(CocolonPieceDiagnosticTLS.rasterRows) : (id)NSNull.null),
      @"failure_mask":@(CocolonPieceDiagnosticTLS.rasterFailures)},
    @"output_grid_comparison":!d.comparisonAvailable ? @{} : @{
      @"available":@YES, @"first_mismatch_present":@(d.comparisonMismatch),
      @"cell_x":@(d.comparisonX), @"cell_y":@(d.comparisonY),
      @"columns":@(d.comparisonColumns), @"rows":@(d.comparisonRows),
      @"actual_alpha_u8":@(d.actualAlpha), @"reference_occupied":@(d.referenceOccupied),
      @"reference_cells":@[@(d.referenceCells.origin.x), @(d.referenceCells.origin.y), @(d.referenceCells.size.width), @(d.referenceCells.size.height)], @"actual_cells":@[@(d.actualCells.origin.x), @(d.actualCells.origin.y), @(d.actualCells.size.width), @(d.actualCells.size.height)],
      @"native_extent":@[@(d.nativeExtent.origin.x), @(d.nativeExtent.origin.y), @(d.nativeExtent.size.width), @(d.nativeExtent.size.height)], @"logical_extent":@[@(d.logicalExtent.origin.x), @(d.logicalExtent.origin.y), @(d.logicalExtent.size.width), @(d.logicalExtent.size.height)],
      @"source_clip":@[@(d.sourceClip.origin.x), @(d.sourceClip.origin.y), @(d.sourceClip.size.width), @(d.sourceClip.size.height)], @"phase":@[@(d.phase.x), @(d.phase.y)],
      @"observed_ctm":@[@(d.observedCTM.a), @(d.observedCTM.b), @(d.observedCTM.c), @(d.observedCTM.d), @(d.observedCTM.tx), @(d.observedCTM.ty)], @"paint_ctm":@[@(d.paintCTM.a), @(d.paintCTM.b), @(d.paintCTM.c), @(d.paintCTM.d), @(d.paintCTM.tx), @(d.paintCTM.ty)],
      @"natural_contents_are_flipped":@(d.naturalContentsFlipped),
      @"reference_contents_are_flipped":@(d.referenceContentsFlipped),
      @"natural_geometry_flipped":@(d.naturalGeometryFlipped),
      @"reference_geometry_flipped":@(d.referenceGeometryFlipped),
      @"reference_image_should_interpolate":@(d.referenceInterpolate),
      @"natural_contents_scale":@(d.naturalScale), @"reference_contents_scale":@(d.referenceScale),
      @"natural_opacity":@(d.naturalOpacity), @"reference_opacity":@(d.referenceOpacity)}};
}
'''


def build(original):
    assert hashlib.sha256(original.encode()).hexdigest() == EXPECTED_SHA256, 'Unexpected product preimage'
    assert 'CocolonPieceDiagnosticTLS' not in original
    # Locate the deepest versioned method, not a stale source line number.
    # The BOOL compatibility wrapper remains uninstrumented and unchanged.
    method_match = re.search(r'(?m)^- \(void\)inspectSnapshot:\(NSNumber \*\)tag[^;{}]*containmentVersion:\(NSUInteger\)containmentVersion[^;{}]*\n\{', original)
    assert method_match, 'Missing explicit V3/V4 snapshot implementation'
    method_marker = method_match.group(0)[:-1]
    method_start = method_match.start()

    spans = [
      ('shared_canvas_frame', original.index('static BOOL PiecePixelCanvasFrame('), original.index('// Pure v2 raster primitive.')),
      ('shared_direct_paint', original.index('static NSArray *PieceDirectPixelInk('), original.index('static NSDictionary *PieceSelectedPixels(')),
      ('v3_v4_helpers', original.index('struct PieceRasterBudget {'), original.index('@implementation PieceTextMetrics')),
    ]
    edits = []
    stages = []
    # Only the already-existing false/nil returns are annotated. The comma
    # operator evaluates the scalar write then returns the identical constant.
    for label, start, end in spans:
        for match in re.finditer(r'\breturn (NO|nil);', original[start:end]):
            position = start + match.start(); value = match.group(1)
            stages.append({'offset':position,'span':label,'kind':'return_'+value,
              'original_line':original.count('\n',0,position)+1,
              'original_expression':match.group(0)})
    method = original[method_start:]
    for match in re.finditer(r'\bunavailable\(\);', method):
        position = method_start + match.start()
        stages.append({'offset':position,'span':'versioned_snapshot_method','kind':'unavailable',
          'original_line':original.count('\n',0,position)+1,
          'original_expression':match.group(0)})
    stages.sort(key=lambda entry:entry['offset'])
    for number, stage in enumerate(stages,1):
        stage['stage']=number
        value=stage['kind'].removeprefix('return_')
        replacement = f'return (CocolonPieceDiagnosticMark({number}), {value});' if stage['kind'].startswith('return_') else f'(CocolonPieceDiagnosticMark({number}), unavailable());'
        if stage['offset'] == original.index('return NO;', original.index('if ((actual.data[y * actual.stride + x * 4 + 3] > 0)', original.index('static BOOL PieceNativeAndLayerV4Ink('))):
            assert number == 83 and value == 'NO', 'Unexpected V4 comparator guard identity'
            difference_plain = replacement
            difference_observed = replacement.replace('CocolonPieceDiagnosticMark(83),', 'CocolonPieceDiagnosticDifference(x, y, lw, lh, actual.data[y * actual.stride + x * 4 + 3], (bits[index / 8] & (1 << (index % 8))) != 0, cells), CocolonPieceDiagnosticMark(83),', 1)
            replacement = difference_observed
        edits.append((stage['offset'],stage['offset']+len(stage['original_expression']),replacement))
    assert stages and len(stages) < 512, ('Missing or unbounded guarded-return map',len(stages))
    assert len({stage['offset'] for stage in stages})==len(stages)
    reference_anchor='      if (!PieceScanPixels(compared, withinDeadline, YES, &comparedCells)) return NO;\n'
    assert original.count(reference_anchor)==1, 'Unexpected V4 reference scan identity'
    reference_position=original.index(reference_anchor)+len(reference_anchor)
    reference_observer='      CocolonPieceDiagnosticReference(comparedCells, nativeExtent, logicalExtent, sourceClip, observed, paintCTM, phase, view.layer, reference, clippedImage);\n'
    edits.append((reference_position,reference_position,reference_observer))
    instrumented=original
    for start,end,replacement in sorted(edits,reverse=True):
        instrumented=instrumented[:start]+replacement+instrumented[end:]
    # Restore every modified return/reject expression to prove exact lexical
    # preservation before introducing declarations and reset-only statements.
    projection=instrumented.replace(difference_observed,difference_plain,1).replace(reference_observer,'',1)
    restored=re.sub(r'return \(CocolonPieceDiagnosticMark\(\d+\), (NO|nil)\);',r'return \1;',projection)
    restored=re.sub(r'\(CocolonPieceDiagnosticMark\(\d+\), unavailable\(\)\);','unavailable();',restored)
    raster_anchor='  double w = ceil(size.width * scale), h = ceil(size.height * scale);\n'
    raster_observer='  CocolonPieceDiagnosticRaster(size, scale, w, h);\n'
    assert instrumented.count(raster_anchor)==1
    instrumented=instrumented.replace(raster_anchor,raster_anchor+raster_observer,1)
    projection=instrumented.replace(difference_observed,difference_plain,1).replace(reference_observer,'',1)
    restored=re.sub(r'return \(CocolonPieceDiagnosticMark\(\d+\), (NO|nil)\);',r'return \1;',projection)
    restored=re.sub(r'\(CocolonPieceDiagnosticMark\(\d+\), unavailable\(\)\);','unavailable();',restored)
    assert restored.count(raster_observer)==1
    restored=restored.replace(raster_observer,'',1)
    assert restored==original, 'Instrumentation changed original tokens'
    begin='  CocolonPieceDiagnosticBegin(tag.longLongValue, fontSize, [pixelRequest[@"stage"] isEqual:@"local"] ? 1 : ([pixelRequest[@"stage"] isEqual:@"placed"] ? 2 : 0), containmentVersion == 3 || containmentVersion == 4);\n'
    # All block callbacks observe TLS on the actual executing thread. Reset in
    # the original method covers immediate input rejection; reset in each of
    # its two UIBlocks covers the async UIManager-queue -> main-thread hop.
    old=method_marker+'{\n'
    assert instrumented.count(old)==1
    instrumented=instrumented.replace(old,old+begin,1)
    index=instrumented.index(method_marker)
    head,tail=instrumented[:index],instrumented[index:]
    block='NSDictionary<NSNumber *, UIView *> *registry) {\n'
    assert tail.count(block)==2
    tail=tail.replace(block,block+begin)
    instrumented=head+tail
    implementation='@implementation PieceTextMetrics\n'
    assert instrumented.count(implementation)==1
    instrumented=instrumented.replace(implementation,implementation+GETTER,1)
    declaration='// Read-only accessors added by the pinned RN patch; no KVC/private-ivar read.\n'
    assert instrumented.count(declaration)==1
    instrumented=instrumented.replace(declaration,PREFIX+'\n'+declaration,1)
    return instrumented, {'preimage_sha256':EXPECTED_SHA256,'instrumented_sha256':hashlib.sha256(instrumented.encode()).hexdigest(),'markers':stages,'marker_count':len(stages),'tls_resets':3,'same_call_raster_observers':1,'same_call_v4_reference_observers':1,'first_v4_mismatch_observers':1,'scalar_tls_max_bytes':1024,'inspection_versions':[3,4],'postimage_is_test_instrumentation_only':True,'unchanged_original_lexical_projection':True}


source=Path('ios/tempCocolon/PieceTextMetrics.mm')
instrumented, metadata=build(source.read_text())
source.write_text(instrumented)
Path(sys.argv[1]).write_text(json.dumps(metadata,indent=2)+'\n')
print('PIECE_V4_DIAGNOSTIC_MAP '+json.dumps(metadata,separators=(',',':')))
PIECE_DIAGNOSTIC_PY
# The standalone metrics job reuses this exact104-marker projection, then
# compiles its existing TextKit fixture. It does not start a React/native build
# or substitute its control/fault assertions with the diagnostic observation.
if [ "${PIECE_NATIVE_DIAGNOSTIC_ONLY:-}" = 1 ]; then
  exit 0
fi
PIECE_RN_CANVAS_PROFILE=output-grid-v4 node tests/native/piece-rn-canvas-fixtures.cjs > tests/native/piece-rn-canvas-fixtures.json
PIECE_RN_CANVAS_PROFILE=output-grid-v4 PIECE_RN_BITMAP_GROUP=1 node tests/native/piece-rn-canvas-fixtures.cjs > tests/native/piece-rn-bitmap-fixtures.json
PIECE_RN_CANVAS_PROFILE=output-grid-v4 PIECE_RN_ADMITTED_GROUP=1 node tests/native/piece-rn-canvas-fixtures.cjs > tests/native/piece-rn-admitted-fixtures.json
PIECE_RN_CANVAS_PROFILE=output-grid-v4 PIECE_RN_EXPORT_GROUP=1 node tests/native/piece-rn-canvas-fixtures.cjs > tests/native/piece-rn-export-fixtures.json
PIECE_RN_CANVAS_PROFILE=output-grid-v4 PIECE_RN_MODEL73_GROUP=1 node tests/native/piece-rn-canvas-fixtures.cjs > tests/native/piece-rn-model73-fixtures.json
PIECE_RN_CANVAS_PROFILE=output-grid-v4 PIECE_RN_VISUAL_TRANSITION_GROUP=1 node tests/native/piece-rn-canvas-fixtures.cjs > tests/native/piece-rn-visual-transition-fixtures.json
PIECE_RN_CANVAS_PROFILE=output-grid-v4 PIECE_RN_NORMAL_HOST_GROUP=1 node tests/native/piece-rn-canvas-fixtures.cjs > tests/native/piece-rn-normal-host-fixtures.json
cat > tests/native/piece-rn-no-transport.js <<'JS'
// Closed test-only transport for explicitly installed visual and normal-host scopes.
// No fetch/Auth implementation is imported. Other groups retain refusal.
let visualScope = null;
let normalScope = null;
const copy = value => JSON.parse(JSON.stringify(value));
const canonical = value => Array.isArray(value) ? value.map(canonical) : value && typeof value === 'object'
  ? Object.fromEntries(Object.keys(value).sort().map(key => [key, canonical(value[key])])) : value;
const same = (a, b) => JSON.stringify(canonical(a)) === JSON.stringify(canonical(b));
const forbidden = () => { throw new Error('TRANSPORT_FORBIDDEN_IN_RENDER_TEST'); };
export function installPieceVisualTransitionTransport(fixture) {
  if (visualScope || normalScope || fixture.mode !== 'parent_loading_remount') forbidden();
  const scope = { fixture, api: [], sessions: [], pending: null, postSignal: null };
  visualScope = scope;
  const snapshot = () => ({ api: scope.api.map(copy), session_calls: scope.sessions.length,
    session_owners_match: scope.sessions.every(owner => owner === scope.fixture.controller_context.expectedUserId),
    patch_pending: !!scope.pending });
  return Object.freeze({ snapshot,
    releasePatch: () => { if (visualScope !== scope || !scope.pending) forbidden();
      const resolve = scope.pending; scope.pending = null; resolve({ status: 200, json: async () => copy(scope.fixture.preview_b) }); },
    close: () => { const result = snapshot(); if (visualScope === scope) visualScope = null;
      scope.pending = null; scope.fixture = null; scope.postSignal = null; scope.api = []; scope.sessions = []; return result; },
  });
}
const exactKeys = (value, keys) => value && typeof value === 'object' && !Array.isArray(value) &&
  same(Object.keys(value).sort(), keys.slice().sort());
const validSignal = signal => signal && signal.aborted === false &&
  typeof signal.addEventListener === 'function' && typeof signal.removeEventListener === 'function';
function normalRequestCurrent(scope) {
  const current = scope.current;
  return !!current && validSignal(current.options.signal) &&
    current.options.body === current.body && same(current.options.headers, current.headers);
}
export function installPieceNormalHostTransport(fixture) {
  const transport = fixture?.transport;
  if (visualScope || normalScope || !exactKeys(transport, ['owner', 'steps']) ||
      typeof transport.owner !== 'string' || !transport.owner || !Array.isArray(transport.steps) ||
      transport.steps.length !== 5) forbidden();
  const steps = copy(transport.steps);
  const routes = [
    ['GET', /^\/emotion\/piece\/source-ref\/[0-9a-f-]{36}(?:\?supplemental_answer_identity=[0-9a-f-]{36})?$/],
    ['POST', /^\/emotion\/piece\/preview$/], ['POST', /^\/emotion\/piece\/save$/],
    ['GET', /^\/emotion\/piece\/[0-9a-f-]{36}$/], ['GET', /^\/emotion\/piece\/[0-9a-f-]{36}\/export$/],
  ];
  for (const [index, step] of steps.entries()) {
    const generated = index === 2;
    const keys = ['path', 'method', 'headers', 'status', 'response',
      ...(step.method === 'GET' ? [] : ['body']),
      ...(Object.prototype.hasOwnProperty.call(step, 'response_headers') ? ['response_headers'] : []),
      ...(generated ? ['generatedIdempotencyHeader'] : [])];
    if (!exactKeys(step, keys) || step.method !== routes[index][0] || !routes[index][1].test(step.path) ||
        !step.headers || typeof step.headers !== 'object' || Array.isArray(step.headers) ||
        !Object.values(step.headers).every(value => typeof value === 'string') ||
        !Number.isInteger(step.status) || step.status < 100 || step.status > 599 ||
        (generated && (step.generatedIdempotencyHeader !== true || Object.prototype.hasOwnProperty.call(step.headers, 'Idempotency-Key'))) ||
        (step.response_headers !== undefined && (!step.response_headers || typeof step.response_headers !== 'object' ||
          Array.isArray(step.response_headers) || !Object.values(step.response_headers).every(value => typeof value === 'string')))) forbidden();
  }
  const scope = { transport, original: copy(transport), owner: transport.owner, steps,
    index: 0, phase: 'before', api: [], sessions: [], current: null, saveKey: null, closed: false };
  normalScope = scope;
  const snapshot = () => scope.closed ? { api: [], session_calls: 0, scope_closed: true, cleared: true } : {
    api: scope.api.map(record => ({ ...record })), session_calls: scope.sessions.length,
    session_owners_match: scope.sessions.every(owner => owner === scope.owner),
    fixture_headers_intact: same(scope.transport, scope.original),
    before_after_key_intact: scope.api.every(record => record.before_key_intact && record.after_key_intact),
    save_key_generated_valid: typeof scope.saveKey === 'string' && /^piece-save-[0-9a-f]{32}$/.test(scope.saveKey),
    complete: scope.index === scope.steps.length && scope.phase === 'before', scope_closed: false,
  };
  return Object.freeze({ snapshot, close: () => {
    const result = snapshot();
    if (normalScope === scope) normalScope = null;
    scope.closed = true; scope.transport = null; scope.original = null; scope.owner = null;
    scope.steps = []; scope.api = []; scope.sessions = []; scope.current = null; scope.saveKey = null;
    return { ...result, scope_closed: true, cleared: true };
  } });
}
function normalAccessToken(expectedUserId) {
  const scope = normalScope;
  if (!scope || scope.closed || expectedUserId !== scope.owner || scope.index >= scope.steps.length ||
      !same(scope.transport, scope.original)) throw new Error('AUTH_FORBIDDEN_IN_RENDER_TEST');
  if (scope.phase === 'before') {
    scope.phase = 'request';
  } else if (scope.phase === 'after' && normalRequestCurrent(scope)) {
    const record = scope.api[scope.index];
    record.after_key_intact = true; record.session_count = 2;
    scope.index++; scope.phase = 'before'; scope.current = null;
  } else throw new Error('AUTH_FORBIDDEN_IN_RENDER_TEST');
  scope.sessions.push(expectedUserId);
  return 'synthetic-native-normal-host-session';
}
function normalApiFetch(path, options) {
  const scope = normalScope, step = scope?.steps[scope.index];
  if (!scope || scope.closed || scope.phase !== 'request' || !step ||
      !same(scope.transport, scope.original) || scope.sessions.length !== scope.index * 2 + 1) forbidden();
  const preview = scope.index === 1, generated = step.generatedIdempotencyHeader === true;
  const keys = ['method', 'auth', 'expectedUserId', 'headers', 'body', 'signal', ...(preview ? ['timeoutMs'] : [])];
  const headers = { ...step.headers };
  if (generated) {
    const key = options?.headers?.['Idempotency-Key'];
    if (typeof key !== 'string' || !/^piece-save-[0-9a-f]{32}$/.test(key) ||
        scope.steps.some(value => value.headers['Idempotency-Key'] === key)) forbidden();
    headers['Idempotency-Key'] = key;
  }
  let body;
  if (step.method === 'GET') {
    if (options.body !== undefined) forbidden();
  } else {
    try { body = JSON.parse(options.body); } catch { forbidden(); }
    if (!same(body, step.body)) forbidden();
  }
  if (!exactKeys(options, keys) || path !== step.path || options.method !== step.method || options.auth !== true ||
      options.expectedUserId !== scope.owner || !same(options.headers, headers) || !validSignal(options.signal) ||
      (preview && options.timeoutMs !== 250000)) forbidden();
  if (generated) scope.saveKey = headers['Idempotency-Key'];
  scope.current = { options, headers: copy(headers), body: options.body };
  scope.api.push({ path, method: options.method, session_count: 1, before_key_intact: true, after_key_intact: false });
  scope.phase = 'json';
  const responseHeaders = Object.fromEntries(Object.entries(step.response_headers || {}).map(([key, value]) => [key.toLowerCase(), value]));
  return { status: step.status, headers: { get: name => responseHeaders[String(name).toLowerCase()] ?? null },
    json: async () => {
      if (normalScope !== scope || scope.phase !== 'json' || !normalRequestCurrent(scope)) forbidden();
      scope.phase = 'after'; return copy(step.response);
    } };
}
// The actual runtime/context modules may import this function, but this
// isolated host never mounts their networked Providers or opens bootstrap IO.
export const apiGet = forbidden;
export async function getAccessToken(expectedUserId) {
  if (normalScope) return normalAccessToken(expectedUserId);
  const scope = visualScope;
  if (!scope || expectedUserId !== scope.fixture.controller_context.expectedUserId || scope.sessions.length >= 4)
    throw new Error('AUTH_FORBIDDEN_IN_RENDER_TEST');
  scope.sessions.push(expectedUserId);
  return 'synthetic-native-visual-session';
}
export async function apiFetch(path, options = {}) {
  if (normalScope) return normalApiFetch(path, options);
  const scope = visualScope;
  if (!scope || scope.api.length >= 2) forbidden();
  const fixture = scope.fixture, context = fixture.controller_context, post = scope.api.length === 0;
  const selection = fixture.preview_b.visual_recipe;
  const expectedBody = post ? context.request : { expected_preview_revision: fixture.preview_a.preview_revision,
    visual_selection: { theme_id: selection.theme.theme_id, aspect_ratio: selection.aspect_ratio, branding_mode: selection.branding.branding_mode } };
  const headers = { 'X-Piece-Renderer': 'piece.rn_bitmap_renderer.ios.v2', 'X-Piece-Palette': '3',
    ...(post ? { 'Idempotency-Key': context.idempotencyKey } : { 'Cache-Control': 'no-store' }) };
  let body; try { body = JSON.parse(options.body); } catch { forbidden(); }
  const expectedKeys = ['method', 'auth', 'expectedUserId', 'headers', 'body', 'signal', ...(post ? ['timeoutMs'] : [])];
  if (!same(Object.keys(options).sort(), expectedKeys.sort()) || path !== (post ? '/emotion/piece/preview' : `/emotion/piece/preview/${fixture.preview_a.preview_id}`) ||
      options.method !== (post ? 'POST' : 'PATCH') || options.auth !== true || options.expectedUserId !== context.expectedUserId ||
      !same(body, expectedBody) || !same(options.headers, headers) || !options.signal || options.signal.aborted !== false ||
      (post ? options.timeoutMs !== 250000 || scope.sessions.length !== 1 : options.signal === scope.postSignal || scope.sessions.length !== 3)) forbidden();
  scope.api.push({ path, method: options.method, body: copy(body), headers: copy(options.headers), owner_matches: true,
    signal_present: true, signal_aborted: false, timeout_ms: options.timeoutMs ?? null });
  if (post) { scope.postSignal = options.signal; return { status: 200, json: async () => copy(fixture.preview_a) }; }
  return new Promise(resolve => { scope.pending = resolve; });
}
JS
cat > tests/native/piece-rn-no-supabase.js <<'JS'
// Module evaluation must not construct the application's persisted Auth client.
// Both import forms resolve; every subsequent access remains forbidden.
const refuse = () => { throw new Error('SUPABASE_FORBIDDEN_IN_RENDER_TEST'); };
export const supabase = new Proxy(Object.create(null), {
  get: refuse, set: refuse, has: refuse, ownKeys: refuse,
  getOwnPropertyDescriptor: refuse, defineProperty: refuse, deleteProperty: refuse,
  getPrototypeOf: refuse, setPrototypeOf: refuse, preventExtensions: refuse,
});
export default supabase;
JS
cat > metro.piece-canvas.config.js <<'JS'
const path = require('node:path');
const { mergeConfig } = require('@react-native/metro-config');
const config = require('./metro.config');
module.exports = mergeConfig(config, { resolver: { resolveRequest(context, name, platform) {
  const resolved = context.resolveRequest(context, name, platform);
  if (resolved.type === 'sourceFile' && resolved.filePath === path.join(__dirname, 'lib/apiClient.js')) {
    return { type: 'sourceFile', filePath: path.join(__dirname, 'tests/native/piece-rn-no-transport.js') };
  }
  if (resolved.type === 'sourceFile' && resolved.filePath === path.join(__dirname, 'lib/supabase.ts')) {
    return { type: 'sourceFile', filePath: path.join(__dirname, 'tests/native/piece-rn-no-supabase.js') };
  }
  return resolved;
} } });
JS
node node_modules/react-native/cli.js bundle --platform ios --dev false --minify false --max-workers 2 \
  --entry-file tests/native/piece-rn-canvas-entry.js --config metro.piece-canvas.config.js \
  --bundle-output "$OUT/piece-canvas.jsbundle"
# Same old-architecture slider compatibility operation as ios-build.yml.
python3 - <<'PY'
from pathlib import Path
for p in Path('node_modules/@react-native-community/slider').rglob('RNCSliderComponentView.*'):
    p.unlink()
PY
# This is a simulator-only hosted-test launcher. No Firebase or normal JS app starts.
cat > ios/tempCocolon/AppDelegate.mm <<'OBJC'
#import "AppDelegate.h"
@implementation AppDelegate
- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)options {
  self.window = [[UIWindow alloc] initWithFrame:UIScreen.mainScreen.bounds];
  self.window.rootViewController = [UIViewController new];
  [self.window makeKeyAndVisible];
  return YES;
}
@end
OBJC
cd ios
pod install
git diff --exit-code -- Podfile.lock
# Add the test and local bundle only to this disposable project, keeping the
# historical welcome test untouched and excluded by -only-testing below.
ruby - "$OUT" <<'RUBY'
require 'xcodeproj'
p = Xcodeproj::Project.open('tempCocolon.xcodeproj')
tests = p.targets.find { |t| t.name == 'tempCocolonTests' }
# Hosted tests resolve RN from TEST_HOST via the existing BUNDLE_LOADER.
# Inheriting all static Pod frameworks with -ObjC creates a second RN runtime
# in the test binary (including RCTBridge/RCTTextView/RCTUIManager).
tests.build_configurations.each do |config|
  config.build_settings['OTHER_LDFLAGS'] = ['-lc++']
  config.build_settings['GCC_PREPROCESSOR_DEFINITIONS'] = ['$(inherited)', 'PIECE_OUTPUT_GRID_V4=1']
end
ref = p.main_group.new_file('../tests/native/piece-rn-canvas-ios.m')
tests.source_build_phase.add_file_reference(ref)
app = p.targets.find { |t| t.name == 'tempCocolon' }
bundle = p.main_group.new_file(File.join(ARGV[0], 'piece-canvas.jsbundle'))
app.resources_build_phase.add_file_reference(bundle)
p.save
RUBY
xcrun simctl list devices available --json > "$OUT/devices.json"
DEVICE=$(python3 - "$OUT/devices.json" <<'PY'
import json,re,sys
c=[]
for runtime,devices in json.load(open(sys.argv[1]))['devices'].items():
    m=re.search(r'\.iOS-(\d+)(?:-(\d+))?',runtime)
    if m:
        for d in devices:
            if d.get('isAvailable') and d['name'].startswith('iPhone'):
                c.append((tuple(int(v or 0) for v in m.groups()),d['udid']))
if not c: raise SystemExit('No iPhone simulator')
print(max(c)[1])
PY
)
# Export inspection PNG/JSON even when the assertion fails. No app archive or upload.
collect() {
  container=$(xcrun simctl get_app_container "$DEVICE" org.reactjs.native.example.tempCocolon data 2>/dev/null || true)
  if [ -n "$container" ] && [ -d "$container/Documents/piece-rn-canvas" ]; then
    cp -R "$container/Documents/piece-rn-canvas" "$OUT/evidence"
    cat "$OUT/evidence/normal-host-results.json"
  fi
  if [ -d "$OUT/result.xcresult" ]; then
    xcrun xcresulttool get --legacy --path "$OUT/result.xcresult" --format json 2>&1 | tee -a "$OUT/xcodebuild.log" || true
  fi
  xcrun simctl shutdown "$DEVICE" >/dev/null 2>&1 || true
}
trap collect EXIT
export SKIP_BUNDLING=1 RCT_NEW_ARCH_ENABLED=0
XCODE=(xcodebuild -quiet -jobs 3 -workspace tempCocolon.xcworkspace -scheme tempCocolon \
  -configuration Debug -destination "platform=iOS Simulator,id=$DEVICE" \
  -derivedDataPath "$OUT/build" \
  -parallel-testing-enabled NO -only-testing:tempCocolonTests/PieceRNCanvasTests/testRecordedSavedInputHostSaveOwnerAndExportWithRealReactNative \
  CODE_SIGNING_ALLOWED=NO CODE_SIGNING_REQUIRED=NO CODE_SIGN_IDENTITY= \
  ONLY_ACTIVE_ARCH=YES ENABLE_DEBUG_DYLIB=NO)
# Compile before booting the simulator, so its memory/CPU does not compete
# with the first full native build. The draw deadline/assertions stay unchanged.
echo 'PIECE_RN_PHASE build_started'
"${XCODE[@]}" build-for-testing 2>&1 | tee "$OUT/xcodebuild.log"
echo 'PIECE_RN_PHASE build_completed'
xcrun simctl boot "$DEVICE"
xcrun simctl bootstatus "$DEVICE" -b
echo 'PIECE_RN_PHASE test_started'
"${XCODE[@]}" -resultBundlePath "$OUT/result.xcresult" test-without-building 2>&1 | tee -a "$OUT/xcodebuild.log"
