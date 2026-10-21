// Actual React/Paper/Piece component. Only transport/auth and input data are synthetic.
import React from 'react';
import { AppRegistry, View, Text, NativeModules, findNodeHandle } from 'react-native';
import PieceVisualCard from '../../components/piece/PieceVisualCard';
import { preparePieceNativeCard } from '../../features/piece/pieceLayout';
import fixtures from './piece-rn-canvas-fixtures.json';

// Test-only timing around the unchanged native bridge call. In particular,
// distinguish a pending candidate table from planner/render/inspection work.
let activeTrace;
// Keep adapter decoding and B9 time separate from the raw native call. These
// wrappers observe the real functions; no candidate, plan or deadline changes.
const renderer = require('../../features/piece/pieceRenderer');
const measuredWrap = require('../../features/piece/pieceMeasuredWrap');
const measureCandidates = renderer.measurePieceCandidates;
renderer.measurePieceCandidates = async (...args) => {
  const started = performance.now(), sample = { font_size: args[2], status: 'pending',
    candidate_profile: args[3]?.candidateProfile ?? null, content_width: args[3]?.contentWidth ?? null };
  activeTrace?.adapters.push(sample);
  try {
    const value = await measureCandidates(...args);
    Object.assign(sample, { status: 'resolved', elapsed_ms: performance.now() - started,
      version: value.version ?? null, returned_content_width: value.contentWidth ?? null });
    return value;
  } catch (error) {
    Object.assign(sample, { status: 'rejected', elapsed_ms: performance.now() - started });
    throw error;
  }
};
const planRows = measuredWrap.planPieceMeasuredRows;
measuredWrap.planPieceMeasuredRows = (...args) => {
  const started = performance.now(), sample = { size_index: args[1] };
  activeTrace?.plans.push(sample);
  const plan = planRows(...args);
  Object.assign(sample, { elapsed_ms: performance.now() - started, fit: !!plan });
  if (plan) {
    sample.groups = plan.groups; sample.line_height = plan.lineHeight; sample.gap = plan.gap; sample.total_height = plan.totalHeight;
    sample.selected_exploration_metrics = plan.groups.map((group, block) => {
      const table = args[2][block], n = table.boundaries.length - 1; let offset = 0;
      return group.map(text => {
        const start = table.boundaries.indexOf(offset), end = table.boundaries.indexOf(offset += text.length);
        const row = table.rows[start * n - start * (start - 1) / 2 + end - start - 1];
        return row?.[0] === start && row?.[1] === end ? row.slice(2) : null;
      });
    });
  }

  return plan;
};
for (const method of ['measureCandidates', 'measureCandidatesForWidth', 'measureExplorationCandidates']) {
  const nativeCandidates = NativeModules.PieceTextMetrics[method];
  if (typeof nativeCandidates !== 'function') continue;
  NativeModules.PieceTextMetrics[method] = (...args) => {
    const started = performance.now();
    const sample = { method, font_size: args[2], utf16_length: args[1].length, content_width: args[3] ?? null, status: 'pending' };
    activeTrace?.candidates.push(sample);
    return nativeCandidates(...args).then(value => {
      const packedBytes = typeof value.rows_f64le === 'string'
        ? value.rows_f64le.length / 4 * 3 - (value.rows_f64le.endsWith('==') ? 2 : value.rows_f64le.endsWith('=') ? 1 : 0) : null;
      Object.assign(sample, { status: 'resolved', elapsed_ms: performance.now() - started,
        rows: value.rows?.length ?? (['piece.native_candidates.v3', 'piece.native_candidates.v4', 'piece.native_candidates.v5'].includes(value.version)
          ? value.boundaries.length * (value.boundaries.length - 1) / 2 : packedBytes === null ? null : packedBytes / 56),
        metric_count: value.metric_count ?? null, full_metric_count: value.full_metric_count ?? null,
        returned_content_width: value.content_width ?? null, version: value.version });
      console.log('PIECE_RN_CANDIDATES', JSON.stringify(sample));
      return value;
    }, error => {
      Object.assign(sample, { status: 'rejected', elapsed_ms: performance.now() - started });
      console.log('PIECE_RN_CANDIDATES', JSON.stringify(sample));
      throw error;
    });
  };
}

// Keep the raw native reply and the original adapter outcome in the SAME
// actual call. The adapter performs its unchanged native await and decoder.
// Capturing trace/context here prevents a late callback entering another case.
let selectedV3Ordinal = 0, nativeV3Ordinal = 0, dispatchingSelectedV3 = null;
const diagnosticNodeTag = node => {
  try { return findNodeHandle(node); } catch { return null; }
};
const nativeSelectedV3 = NativeModules.PieceTextMetrics.inspectSelectedLineV3;
if (typeof nativeSelectedV3 === 'function') {
  NativeModules.PieceTextMetrics.inspectSelectedLineV3 = function (...args) {
    const dispatch = dispatchingSelectedV3, trace = dispatch?.trace ?? activeTrace;
    const started = performance.now(), request = args[3];
    const sample = { ordinal: ++nativeV3Ordinal, adapter_ordinal: dispatch?.ordinal ?? null,
      tag: args[0], canvas_tag: request?.canvas_tag ?? null, stage: request?.stage ?? null,
      font_size: args[2], expires_at_ms: request?.expires_at_ms ?? null,
      dispatched_at_ms: Date.now(), status: 'pending' };
    trace?.native_selected_v3.push(sample);
    try {
      // Exactly one original native call; neither request nor reply is changed.
      const pending = nativeSelectedV3.apply(this, args);
      return pending.then(value => {
        Object.assign(sample, { status: 'resolved', received_at_ms: Date.now(),
          elapsed_ms: performance.now() - started, raw_wire: value });
        return value;
      }, error => {
        Object.assign(sample, { status: 'rejected', rejected_at_ms: Date.now(),
          elapsed_ms: performance.now() - started,
          reject_code: error?.code ?? null, reject_message: error?.message ?? null });
        throw error;
      });
    } catch (error) {
      Object.assign(sample, { status: 'threw', rejected_at_ms: Date.now(),
        elapsed_ms: performance.now() - started,
        reject_code: error?.code ?? null, reject_message: error?.message ?? null });
      throw error;
    }
  };
}
const selectedV3 = renderer.inspectPieceSelectedLineV3;
renderer.inspectPieceSelectedLineV3 = async (...args) => {
  const trace = activeTrace, start = performance.now(), expected = args[1];
  const ordinal = ++selectedV3Ordinal;
  const sample = { adapter_ordinal: ordinal, stage: expected.stage, font_size: expected.fontSize, status: 'pending',
    expected: { text: expected.text, box: expected.box ? { ...expected.box } : null,
      line_ends: Array.isArray(expected.lineEnds) ? [...expected.lineEnds] : null,
      tag: diagnosticNodeTag(args[0]), canvas_tag: diagnosticNodeTag(expected.canvasNode),
      stage: expected.stage, font_size: expected.fontSize, expires_at_ms: expected.expiresAt ?? null } };
  trace?.selected.push(sample);
  try {
    let pending;
    const previous = dispatchingSelectedV3;
    dispatchingSelectedV3 = { trace, ordinal };
    try { pending = selectedV3(...args); }
    finally { dispatchingSelectedV3 = previous; }
    const result = await pending;
    Object.assign(sample, { status: 'resolved', adapter_completed_at_ms: Date.now(),
      elapsed_ms: performance.now() - start, tag: result.tag,
      canvas_tag: result.canvasTag, canvas_frame: result.canvasFrame, ink: result.ink,
      native_raster_scale: result.nativeRasterScale, component_inks: result.componentInks });
    return result;
  } catch (error) {
    Object.assign(sample, { status: 'rejected', adapter_rejected_at_ms: Date.now(),
      elapsed_ms: performance.now() - start,
      reject_code: error?.code ?? null, reject_message: error?.message ?? null });
    throw error;
  }
};

class CanvasCases extends React.Component {
  caseFixtures = fixtures.map(fixture => fixture.props?.display ? { ...fixture,
    props: { ...fixture.props, display: { ...fixture.props.display, visualToken: Object.freeze({}) } } } : fixture);
  state = { index: 0, rawLeft: 0 };
  saveFitChanged = (next, previous) => {
    if (next || this.saveFitHandle === previous) this.saveFitHandle = next;
  };
  componentDidMount() { this.startCase(); }
  componentWillUnmount() { clearTimeout(this.timer); }
  startCase = () => {
    this.started = performance.now(); this.originalExpiresAt = Date.now() + 8000;
    this.trace = { candidates: [], adapters: [], plans: [], states: [], selected: [], native_selected_v3: [] };
    activeTrace = this.trace;
    this.finishing = false; this.rawOperation = null; this.rawReport = null;
    this.poll();
  };
  poll = () => {
    const fixture = this.caseFixtures[this.state.index];
    if (typeof fixture.raw_text === 'string') {
      this.probeRawText();
      if (!this.finishing && (this.rawReport || performance.now() - this.started >= 8000)) {
        this.finishing = true;
        requestAnimationFrame(() => requestAnimationFrame(() => this.finishRawText()));
      } else if (!this.finishing) this.timer = setTimeout(this.poll, 20);
      return;
    }
    const card = this.card, snapshot = card?.state.measurement;
    const state = snapshot && `${snapshot.phase}:${snapshot.sizeIndex}`;
    if (state && this.trace.states[this.trace.states.length - 1]?.state !== state) this.trace.states.push({ state, elapsed_ms: performance.now() - this.started });
    if (!this.finishing && snapshot && (['native_checked', 'unavailable'].includes(snapshot.phase) || performance.now() - this.started > 10000)) {
      this.finishing = true;
      requestAnimationFrame(() => requestAnimationFrame(() => {
        // A legitimate late layout event can invalidate the first ready state.
        // Keep the original time budget and capture only a stable snapshot.
        if ((this.card !== card || card.state.measurement !== snapshot) && performance.now() - this.started <= 10000) {
          this.finishing = false; this.poll(); return;
        }
        this.finishCase();
      }));
      return;
    }
    this.timer = setTimeout(this.poll, 20);
  };
  finishCase = async () => {
    const fixture = this.caseFixtures[this.state.index], card = this.card, m = card?.state.measurement;
    const input = preparePieceNativeCard(fixture.props);
    const display = fixture.props.display, fit = this.saveFitHandle;
    // Read the actual mounted handle before elapsed_ms so its integrity checks
    // remain inside the same eight-second budget. Saved cards must publish none.
    const saveFitCurrent = !!fit && fit.isCurrent(display?.preview, display?.visualToken) === true;
    const saveFitWrongTokenCurrent = !!fit && fit.isCurrent(display?.preview, Object.freeze({})) === true;
    const rejected = card?.inspection;
    const rejectedInspection = m?.phase === 'unavailable' && rejected?.snapshot.key === m.key &&
      rejected.snapshot.generation === m.generation && rejected.snapshot.sizeIndex === m.sizeIndex &&
      rejected.snapshot.plan === m.plan ? { inspection: rejected.evidence ?? [], blocks: rejected.snapshot.blocks } : null;
    const report = { name: fixture.name, evidence_set: fixture.evidence_set, phase: m?.phase ?? 'missing', reason: m?.reason ?? null,
      renderer_version: display?.preview?.renderer_version ?? fixture.props.savedRecord?.renderer_version,
      candidate_profile: input?.candidateProfile,
      elapsed_ms: performance.now() - this.started, size_index: m?.sizeIndex, font_size: input?.sizes[m?.sizeIndex],
      plan_line_height: m?.plan?.lineHeight, plan_groups: m?.plan?.groups,
      trace: this.trace,
      width: input?.width, height: input?.height, content_width: input?.contentWidth,
      content_height: input?.contentHeight, margin: input?.margin, branding_zone: input?.brandingZone,
      composition_height: m?.compositionHeight, blocks: input?.blocks,
      rows: m?.plan?.groups.flat() ?? [], row_offsets: m?.rowOffsets ?? [], inspection: m?.inspection ?? [],
      rejected_inspection: rejectedInspection, local_inspection: m?.localInspection ?? [],
      original_deadline_ms: card?.deadline?.expiresAt ?? null, placement_epoch: card?.placementEpoch ?? null,
      branding: input?.brandingMode !== 'off', state_can_save: m?.canSave, state_can_export: m?.canExport,
      save_fit_current: saveFitCurrent, save_fit_wrong_token_current: saveFitWrongTokenCurrent,
      save_fit_handle_keys: fit ? Object.keys(fit) : [],
      body_preserved: !!m?.plan && m.plan.groups.every((rows, index) => rows.join('') === input.blocks[index]),
    };
    await this.captureAndAdvance(report, card?.canvasNode);
  };
  captureAndAdvance = async (report, node) => {
    try {
      const tag = findNodeHandle(node);
      // RN rejects a null NSNumber before calling native, leaving its Promise
      // pending. Preserve every failure report so the baseline and additions finish.
      if (!Number.isInteger(tag) || tag <= 0) NativeModules.PieceCanvasTest.record({ ...report, capture_error: true });
      else await NativeModules.PieceCanvasTest.capture(tag, report);
    }
    catch { NativeModules.PieceCanvasTest.record({ ...report, capture_error: true }); }
    if (this.state.index + 1 === fixtures.length) { NativeModules.PieceCanvasTest.done(); return; }
    this.setState(({ index }) => ({ index: index + 1, rawLeft: 0 }), this.startCase);
  };
  // The three below-minimum historical strings use the actual RN Text,
  // candidate adapter, B9 and selected-line inspector without inventing a
  // Piece response, Card state or local-fit permission.
  probeRawText = async () => {
    const fixture = this.caseFixtures[this.state.index], node = this.rawTextNode;
    if (this.rawOperation || this.finishing || !node || this.rawBox?.name !== fixture.name || this.rawLines?.name !== fixture.name) return;
    const operation = { node, canvas: this.rawCanvasNode, name: fixture.name }; this.rawOperation = operation;
    const current = () => this.rawOperation === operation && this.caseFixtures[this.state.index].name === fixture.name &&
      this.rawTextNode === node && this.rawCanvasNode === operation.canvas && performance.now() - this.started < 8000 && Date.now() < this.originalExpiresAt;
    try {
      const text = fixture.raw_text, box = this.rawBox.value, lines = this.rawLines.value;
      if (lines.length !== 1 || lines[0].text !== text || box.width !== 1080 || !Number.isFinite(box.height) || Math.abs(box.height - 75) > 0.5 ||
          !['x', 'y', 'width', 'height'].every(key => Number.isFinite(lines[0][key])) ||
          lines[0].width < 0 || lines[0].height <= 0 || lines[0].width > 888 || lines[0].height > 75) throw Error('raw_geometry');
      const input = { candidateProfile: 'piece.rn_native_preview.containment.prototype.v1', blocks: [text], contentWidth: 888,
        contentHeight: 75, sizes: [48], lineRatio: 75 / 48, paragraphRatio: 0, alignment: 'left' };
      const table = await renderer.measurePieceCandidates(node, text, 48, { candidateProfile: 'piece.rn_native_preview.prototype.v5' });
      if (!current()) return;
      const plan = measuredWrap.planPieceMeasuredRows(input, 0, [table]);
      if (JSON.stringify(plan?.groups) !== JSON.stringify([[text]])) throw Error('raw_b9_selection');
      const expected = { text, fontSize: 48, box, lineEnds: [text.length], canvasNode: operation.canvas, expiresAt: this.originalExpiresAt };
      await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
      if (!current()) return;
      const result = await renderer.inspectPieceSelectedLineV3(node, { ...expected, stage: 'local' });
      if (!current()) return;
      operation.inspection = result;
      if (fixture.controlled_native_clip_trap) {
        const c = result.componentInks;
        const observed = !!c && c.direct[1] >= 0 && c.layer[1] >= 0 && c.native[1] < 0 &&
          result.ink[1] < 0 && result.overflow === true && result.wrapViolation === false;
        this.rawReport = { phase: 'measurement_checked', diagnostic_valid: observed, body_preserved: true,
          native_clip_trap_synthetic: true, expected_overflow: true, native_clip_trap_detected: observed,
          plan_groups: plan.groups, plan_line_height: plan.lineHeight, inspection: [result], local_inspection: [result],
          on_text_layout: lines, candidate_range_count: table.rows.length, same_selected_text_node: true };
        return;
      }
      const [advance, left, top, right, bottom] = result.independentMetrics;
      if (result.overflow || result.wrapViolation || Math.max(advance, right) - Math.min(0, left) > 888 || bottom - top > 75) throw Error('raw_independent_overflow');
      const contentLeft = result.ink[0] - 96, contentRight = result.ink[2] - 96;
      if (Math.max(lines[0].width, contentRight) - Math.min(0, contentLeft) > 888 || result.ink[3] - result.ink[1] > 75) throw Error('raw_placement_overflow');
      // Match v7: preserve the 888-point TextContainer and normalize only ink.
      // The transparent outer view starts at zero; the visible ink starts at96.
      const rawLeft = -Math.min(0, contentLeft);
      await new Promise(resolve => this.setState({ rawLeft }, resolve));
      await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
      if (!current() || this.state.rawLeft !== rawLeft) return;
      const placed = await renderer.inspectPieceSelectedLineV3(node, { ...expected, stage: 'placed', local: result,
        canvasFrame: [rawLeft, 96, box.width, box.height] });
      if (!current() || this.state.rawLeft !== rawLeft) return;
      const [x, y] = placed.canvasFrame, [l, t, r, b] = placed.ink;
      if (placed.overflow || placed.wrapViolation || r - l > 888 || b - t > 75 ||
          x + l < 95.5 || x + r > 984.5 || y + t < 95.5 || y + b > 224.5) throw Error('raw_final_placement_overflow');
      operation.inspection = placed;
      this.rawReport = { phase: 'measurement_checked', diagnostic_valid: true, body_preserved: true,
        plan_groups: plan.groups, plan_line_height: plan.lineHeight, inspection: [placed], local_inspection: [result], on_text_layout: lines,
        candidate_range_count: table.rows.length, same_selected_text_node: true };
    } catch (error) {
      if (current()) this.rawReport = { phase: 'measurement_unavailable', diagnostic_valid: false, body_preserved: false,
        reason: error.message, rejected_inspection: operation.inspection ?? null };
    }
  };
  finishRawText = async () => {
    const fixture = this.caseFixtures[this.state.index];
    const report = { name: fixture.name, evidence_set: fixture.evidence_set, diagnostic_only: true,
      candidate_profile: 'piece.rn_native_preview.containment.prototype.v1', font_size: 48, elapsed_ms: performance.now() - this.started,
      width: 1080, height: 320, content_width: 888, content_height: 75, margin: 96, branding_zone: 0, branding: false,
      rows: [fixture.raw_text], blocks: [fixture.raw_text], trace: this.trace,
      ...(this.rawReport || { phase: 'measurement_unavailable', diagnostic_valid: false, body_preserved: false }) };
    await this.captureAndAdvance(report, this.rawCanvasNode);
  };
  render() {
    const fixture = this.caseFixtures[this.state.index];
    if (typeof fixture.raw_text === 'string') return <View key={fixture.name} style={{ width: 360, height: 320 / 3 }}>
      <View collapsable={false} ref={node => { this.rawCanvasNode = node; }} style={{ position: 'absolute', width: 1080, height: 320,
        left: -360, top: (320 / 3 - 320) / 2, transform: [{ scale: 1 / 3 }], backgroundColor: '#F6F1E8' }}>
        <View collapsable={false} style={{ position: 'absolute', left: 0, top: 0, width: 1080, height: 320,
          transform: [{ translateX: this.state.rawLeft }] }}>
        <Text collapsable={false} ref={node => { this.rawTextNode = node; }} allowFontScaling={false} adjustsFontSizeToFit={false}
          accessible={false} android_hyphenationFrequency="none" textBreakStrategy="highQuality" lineBreakStrategyIOS="standard"
          onLayout={event => { if (this.caseFixtures[this.state.index].name === fixture.name) this.rawBox = { name: fixture.name, value: event.nativeEvent.layout }; }}
          onTextLayout={event => { if (this.caseFixtures[this.state.index].name === fixture.name) this.rawLines = { name: fixture.name, value: event.nativeEvent.lines }; }}
          style={{ position: 'absolute', left: 0, top: 96, width: 1080, paddingHorizontal: 96, fontSize: 48, lineHeight: 75,
            fontWeight: '400', fontStyle: 'normal', letterSpacing: 0, includeFontPadding: false, textAlign: 'left', color: '#111827' }}>
          {fixture.raw_text}
        </Text>
        </View>
      </View>
    </View>;
    return <View style={{ width: 360 }}><PieceVisualCard key={fixture.name} ref={node => { this.card = node; }}
      {...fixture.props} onSaveFitChange={this.saveFitChanged} /></View>;
  }
}
AppRegistry.registerComponent('PieceCanvasCases', () => CanvasCases);
