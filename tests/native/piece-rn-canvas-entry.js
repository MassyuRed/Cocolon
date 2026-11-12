// Actual React/Paper/Piece component. Only transport/auth and input data are synthetic.
import 'react-native-get-random-values';
import 'react-native-url-polyfill/auto';
import React from 'react';
import { AppRegistry, View, Text, NativeModules, findNodeHandle } from 'react-native';
import PieceVisualCard from '../../components/piece/PieceVisualCard';
import { preparePieceNativeCard } from '../../features/piece/pieceLayout';
import fixtures from './piece-rn-canvas-fixtures.json';
import bitmapFixtures from './piece-rn-bitmap-fixtures.json';
import admittedFixtures from './piece-rn-admitted-fixtures.json';
import exportFixtures from './piece-rn-export-fixtures.json';
import model73Fixtures from './piece-rn-model73-fixtures.json';
import transitionFixtures from './piece-rn-visual-transition-fixtures.json';
import normalHostFixtures from './piece-rn-normal-host-fixtures.json';
import InputPieceActionArea from '../../screens/input/InputPieceActionArea';
import { PieceOwnerHistoryHost } from '../../screens/PieceOwnerHistoryScreen';
import { AppRuntimeContext } from '../../AppRuntimeContext';
import { Dirs, FileSystem } from 'react-native-file-access';
import PiecePreviewModal from '../../components/piece/PiecePreviewModal';
import { createPieceCreateController } from '../../features/piece/PieceCreateController';
import { readPiecePreviewDisplay } from '../../features/piece/piecePreviewModel';
import { installPieceVisualTransitionTransport, installPieceNormalHostTransport } from '../../lib/apiClient';
import { captureRef, releaseCapture } from 'react-native-view-shot';

// Test-only timing around the unchanged native bridge call. In particular,
// distinguish a pending candidate table from planner/render/inspection work.
const OUTPUT_GRID_PROFILE = 'piece.rn_native_preview.containment.prototype.v2';
const BITMAP_PROFILE = 'piece.rn_bitmap_preview.prototype.v1';
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

// Observe V4 separately; the original V3 wrappers above remain intact.
let selectedV4Ordinal = 0, nativeV4Ordinal = 0, dispatchingSelectedV4 = null;
const nativeSelectedV4 = NativeModules.PieceTextMetrics.inspectSelectedLineV4;
if (typeof nativeSelectedV4 === 'function') {
  NativeModules.PieceTextMetrics.inspectSelectedLineV4 = function (...args) {
    const dispatch = dispatchingSelectedV4, trace = dispatch?.trace ?? activeTrace;
    const started = performance.now(), request = args[3];
    const sample = { ordinal: ++nativeV4Ordinal, adapter_ordinal: dispatch?.ordinal ?? null,
      tag: args[0], canvas_tag: request?.canvas_tag ?? null, stage: request?.stage ?? null,
      font_size: args[2], expires_at_ms: request?.expires_at_ms ?? null,
      inspection_version: 'piece.native_selected_line.v4', candidate_profile: OUTPUT_GRID_PROFILE,
      dispatched_at_ms: Date.now(), status: 'pending' };
    trace?.native_selected_v4.push(sample);
    try {
      // Exactly one original native call; neither request nor reply is changed.
      const pending = nativeSelectedV4.apply(this, args);
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
const selectedV4 = renderer.inspectPieceSelectedLineV4;
renderer.inspectPieceSelectedLineV4 = async (...args) => {
  const trace = activeTrace, start = performance.now(), expected = args[1];
  const ordinal = ++selectedV4Ordinal;
  const sample = { adapter_ordinal: ordinal, stage: expected.stage, font_size: expected.fontSize, status: 'pending',
    expected: { text: expected.text, box: expected.box ? { ...expected.box } : null,
      line_ends: Array.isArray(expected.lineEnds) ? [...expected.lineEnds] : null,
      tag: diagnosticNodeTag(args[0]), canvas_tag: diagnosticNodeTag(expected.canvasNode),
      stage: expected.stage, font_size: expected.fontSize, expires_at_ms: expected.expiresAt ?? null } };
  trace?.selected.push(sample);
  try {
    let pending;
    const previous = dispatchingSelectedV4;
    dispatchingSelectedV4 = { trace, ordinal };
    try { pending = selectedV4(...args); }
    finally { dispatchingSelectedV4 = previous; }
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
  caseFixtures = (this.props.pieceGroup === 'model73' ? model73Fixtures : this.props.pieceGroup === 'export' ? exportFixtures : this.props.pieceGroup === 'admitted' ? admittedFixtures : this.props.pieceGroup === 'bitmap' ? bitmapFixtures : fixtures).map(fixture => fixture.props?.display ? { ...fixture,
    props: { ...fixture.props, display: { ...fixture.props.display, visualToken: Object.freeze({}) } } } : fixture);
  state = { index: 0, rawLeft: 0 };
  observedGeometryCards = new WeakSet();
  observeGeometryCard = node => {
    this.card = node;
    if (!node || this.observedGeometryCards.has(node)) return;
    this.observedGeometryCards.add(node);
    const measure = node.measure;
    // Observe synchronous event handling separately from native/React layout
    // waits. Ref detach/reattach must not stack wrappers on the same Card.
    node.measure = (...args) => {
      const trace = this.card === node ? this.trace : null;
      const started = performance.now();
      const event = trace ? { index: args[1], kind: args[2], phase: node.state.measurement.phase,
        elapsed_ms: started - this.started } : null;
      if (event) trace.geometry_events.push(event);
      try { return measure.apply(node, args); }
      finally { if (event) event.handler_ms = performance.now() - started; }
    };
  };
  saveFitChanged = (next, previous) => {
    if (next || this.saveFitHandle === previous) this.saveFitHandle = next;
  };
  componentDidMount() { this.startCase(); }
  componentWillUnmount() { clearTimeout(this.timer); }
  startCase = () => {
    this.resetCaseClock();
    this.poll();
  };
  resetCaseClock = () => {
    this.started = performance.now(); this.originalStartedAt = Date.now(); this.originalExpiresAt = this.originalStartedAt + 8000;
    this.outputGridDeadline = Object.freeze({ profile: OUTPUT_GRID_PROFILE, startedAt: this.originalStartedAt,
      expiresAt: this.originalExpiresAt, monotonicStartedAt: this.started });
    this.bitmapDeadline = Object.freeze({ profile: BITMAP_PROFILE, startedAt: this.originalStartedAt,
      expiresAt: this.originalExpiresAt, monotonicStartedAt: this.started });
    this.trace = { candidates: [], adapters: [], plans: [], states: [], selected: [], native_selected_v3: [], native_selected_v4: [], geometry_events: [] };
    activeTrace = this.trace;
    this.finishing = false; this.rawOperation = null; this.rawReport = null;
    this.cropApplied = false; this.cropResult = null; this.cropBeforeFit = false;
  };
  poll = () => {
    const fixture = this.caseFixtures[this.state.index];
    if (typeof fixture.raw_text === 'string') {
      if (fixture.candidate_profile === BITMAP_PROFILE) this.probeRawBitmap(); else this.probeRawText();
      if (!this.finishing && (this.rawReport || performance.now() - this.started >= 8000)) {
        this.finishing = true;
        requestAnimationFrame(() => requestAnimationFrame(() => this.finishRawText()));
      } else if (!this.finishing) this.timer = setTimeout(this.poll, 20);
      return;
    }
    const card = this.card, snapshot = card?.state.measurement;
    if (fixture.controlled_host_crop && this.cropApplied && snapshot?.phase === 'native_checked' && performance.now() - this.started < 8000) {
      this.timer = setTimeout(this.poll, 20); return;
    }
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
    if (fixture.controlled_host_crop && !this.cropApplied && m?.phase === 'native_checked') {
      this.cropApplied = true;
      this.cropBeforeFit = this.saveFitHandle?.isCurrent(fixture.props.display.preview, fixture.props.display.visualToken) === true;
      try { this.cropResult = await NativeModules.PieceCanvasTest.cropBitmapHost(findNodeHandle(card.bitmapNode), m.bitmapCanvas.artifactToken); }
      catch { this.cropResult = { image_cleared: false }; }
      this.finishing = false; this.poll(); return;
    }
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
      test_profile: fixture.test_profile ?? null,
      comparison_grid: input?.candidateProfile === OUTPUT_GRID_PROFILE ? 'output_logical1' : null,
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
      ...(fixture.evidence_set.startsWith('model73_') ? { source_case_id: fixture.source_case_id,
        recorded_artifact: Object.fromEntries(['format_type', 'piece_text', 'piece_text_hash', 'content_payload',
          'content_payload_hash', 'visual_recipe', 'visual_recipe_hash', 'renderer_version'].map(key =>
          [key, (display?.preview || fixture.props.savedRecord)[key]])) } : {}),
      ...(input?.candidateProfile === BITMAP_PROFILE ? { bitmap_canvas: m?.bitmapCanvas ?? null, colors: input.colors,
        branding_mode: input.brandingMode, crop_result: this.cropResult, crop_before_fit: this.cropBeforeFit } : {}),
    };
    if (fixture.retain_after_deadline) {
      const deadline = card?.deadline, artifact = card?.bitmapArtifact;
      report.saved_retained_after_deadline = false;
      if (deadline && Number.isFinite(deadline.monotonicStartedAt)) {
        await new Promise(resolve => setTimeout(resolve, Math.max(0, 8100 - (performance.now() - deadline.monotonicStartedAt))));
        report.retained_deadline_elapsed_ms = performance.now() - deadline.monotonicStartedAt;
        report.saved_retained_after_deadline = this.card === card && card.state.measurement === m &&
          m?.phase === 'native_checked' && card.bitmapArtifact === artifact && !!artifact &&
          card.deadline === deadline && deadline.handle === null && !card.saveFit && !this.saveFitHandle;
      } else report.retention_error = 'missing_original_deadline';
    }
    if (fixture.evidence_set === 'export_saved' || fixture.evidence_set === 'export_trap' || fixture.evidence_set === 'model73_export') {
      const target=card?.getCaptureTarget();let uri=null;
      report.export_target_current=target?.isCurrent()===true;report.export_rejected=false;
      try {
        if(!target)throw new Error('no_current_export_target');
        if(['clear','removed','multiple','during'].includes(fixture.export_trap)){
          report.export_mutation_applied=await NativeModules.PieceCanvasTest.mutateExportBitmap(m.bitmapCanvas.canvasTag,findNodeHandle(target.node),fixture.export_trap);
        }
        const options={format:'png',result:'tmpfile',quality:1,width:target.width,height:target.height,
          snapshotContentContainer:false,cocolonPieceCache:true,useRenderInContext:true,
          cocolonPieceBitmapToken:fixture.export_trap==='token'?'wrong-token':target.bitmapToken,
          cocolonPieceBitmapBinding:fixture.export_trap==='binding'?'wrong-binding':target.bitmapBinding};
        // Trap calls intentionally bypass the JS predicate after mutation to
        // test the native boundary before/independent of queued JS events.
        uri=await captureRef(target.node,options);
        report.export_target_after=target.isCurrent();report.export_capture_uri=uri;
      }catch {report.export_rejected=true;}
      if(fixture.export_trap){
        if(uri)releaseCapture(uri);delete report.export_capture_uri;
        NativeModules.PieceCanvasTest.record(report);
        this.advanceCase();return;
      }
      try {await this.captureAndAdvance(report,card?.canvasNode);}finally{if(uri)releaseCapture(uri);}
      return;
    }
    await this.captureAndAdvance(report, card?.canvasNode);
  };
  captureAndAdvance = async (report, node) => {
    try {
      const tag = findNodeHandle(node);
      // RN rejects a null NSNumber before calling native, leaving its Promise
      // pending. Preserve every failure report so the baseline and additions finish.
      if (!Number.isInteger(tag) || tag <= 0) NativeModules.PieceCanvasTest.record({ ...report, capture_error: true });
      else if (report.candidate_profile === BITMAP_PROFILE) await NativeModules.PieceCanvasTest.captureBitmap(tag, report);
      else await NativeModules.PieceCanvasTest.capture(tag, report);
    }
    catch { NativeModules.PieceCanvasTest.record({ ...report, capture_error: true }); }
    this.advanceCase();
  };
  advanceCase = () => {
    if(this.state.index+1===this.caseFixtures.length){NativeModules.PieceCanvasTest.done();return;}
    this.setState(({index})=>({index:index+1,rawLeft:0}),this.startCase);
  };
  probeRawBitmap = async () => {
    const fixture = this.caseFixtures[this.state.index], node = this.rawTextNode;
    if (this.rawOperation || this.finishing || !node || !this.rawBitmapNode || this.rawBox?.name !== fixture.name || this.rawLines?.name !== fixture.name) return;
    const operation = { node, name: fixture.name, host: this.rawBitmapNode }; this.rawOperation = operation;
    try {
      const text = fixture.raw_text, box = this.rawBox.value, lines = this.rawLines.value;
      if (lines.length !== 1 || lines[0].text !== text) throw new Error('raw source mismatch');
      const input = { key: fixture.name, candidateProfile: BITMAP_PROFILE, width: 1080, height: 1350, margin: 96,
        brandingZone: 72, contentWidth: 888, contentHeight: 1086, alignment: 'left', brandingMode: 'off' };
      const table = await renderer.measurePieceCandidates(node, text, 48, { candidateProfile: 'piece.rn_native_preview.prototype.v5' });
      const plan = measuredWrap.planPieceMeasuredRows({ ...input, blocks: [text], sizes: [48], lineRatio: 75 / 48, paragraphRatio: 0 }, 0, [table]);
      if (!plan || plan.groups.length !== 1 || plan.groups[0].length !== 1 || plan.groups[0][0] !== text) throw new Error('raw B9 mismatch');
      const result = await renderer.renderPieceBitmapCanvas(operation.host, { input, bindingToken: fixture.name, deadline: this.bitmapDeadline,
        totalHeight: 75, lineHeight: 75, rows: [{ node, text, fontSize: 48, box, lineEnds: [text.length], lineWidth: lines[0].width, gapAfter: 0, kind: 'body' }] });
      if (this.rawOperation !== operation || this.caseFixtures[this.state.index].name !== fixture.name) return;
      this.rawReport = { name: fixture.name, evidence_set: 'bitmap_raw', candidate_profile: BITMAP_PROFILE,
        phase: result.checked ? 'bitmap_checked' : 'measurement_unavailable', bitmap_canvas: result,
        rows: [text], blocks: [text], width: 1080, height: 1350, margin: 96, branding_zone: 72,
        content_width: 888, content_height: 1086, plan_line_height: 75, branding: false, body_preserved: true,
        colors: { canvas: '#F6F1E8', surface: '#FFFDF8', border: '#D7D2C9' }, trace: this.trace,
        elapsed_ms: performance.now() - this.started, state_can_save: false, state_can_export: false };
    } catch { this.rawReport = { name: fixture.name, evidence_set: 'bitmap_raw', candidate_profile: BITMAP_PROFILE,
      phase: 'measurement_unavailable', body_preserved: false, rows: [fixture.raw_text], blocks: [fixture.raw_text],
      elapsed_ms: performance.now() - this.started, trace: this.trace }; }
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
      const candidateProfile = fixture.candidate_profile ?? 'piece.rn_native_preview.containment.prototype.v1';
      const inspectSelected = candidateProfile === OUTPUT_GRID_PROFILE
        ? renderer.inspectPieceSelectedLineV4 : renderer.inspectPieceSelectedLineV3;
      const input = { candidateProfile, blocks: [text], contentWidth: 888,
        contentHeight: 75, sizes: [48], lineRatio: 75 / 48, paragraphRatio: 0, alignment: 'left' };
      const table = await renderer.measurePieceCandidates(node, text, 48, { candidateProfile: 'piece.rn_native_preview.prototype.v5' });
      if (!current()) return;
      const plan = measuredWrap.planPieceMeasuredRows(input, 0, [table]);
      if (JSON.stringify(plan?.groups) !== JSON.stringify([[text]])) throw Error('raw_b9_selection');
      const expected = { text, fontSize: 48, box, lineEnds: [text.length], canvasNode: operation.canvas, expiresAt: this.originalExpiresAt,
        ...(candidateProfile === OUTPUT_GRID_PROFILE ? { deadline: this.outputGridDeadline } : {}) };
      await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
      if (!current()) return;
      const result = await inspectSelected(node, { ...expected, stage: 'local' });
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
      const placed = await inspectSelected(node, { ...expected, stage: 'placed', local: result,
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
      candidate_profile: fixture.candidate_profile ?? 'piece.rn_native_preview.containment.prototype.v1',
      test_profile: fixture.test_profile ?? null, comparison_grid: fixture.candidate_profile === OUTPUT_GRID_PROFILE ? 'output_logical1' : null,
      font_size: 48, elapsed_ms: performance.now() - this.started,
      width: 1080, height: 320, content_width: 888, content_height: 75, margin: 96, branding_zone: 0, branding: false,
      rows: [fixture.raw_text], blocks: [fixture.raw_text], trace: this.trace,
      ...(this.rawReport || { phase: 'measurement_unavailable', diagnostic_valid: false, body_preserved: false }) };
    await this.captureAndAdvance(report, this.rawCanvasNode);
  };
  render() {
    const fixture = this.caseFixtures[this.state.index];
    if (typeof fixture.raw_text === 'string' && fixture.candidate_profile === BITMAP_PROFILE) {
      const BitmapCanvas = renderer.pieceBitmapNativeView();
      return <View key={fixture.name} style={{ width: 360, height: 450 }}>
        <View collapsable={false} ref={node => { this.rawCanvasNode = node; }} style={{ position: 'absolute', width: 1080, height: 1350,
          left: -360, top: -450, transform: [{ scale: 1 / 3 }], backgroundColor: '#F6F1E8' }}>
          <View style={{ position: 'absolute', left: 48, top: 48, right: 48, bottom: 48,
            backgroundColor: '#FFFDF8', borderColor: '#D7D2C9', borderWidth: 2 }} />
          {BitmapCanvas ? <BitmapCanvas collapsable={false} ref={node => { this.rawBitmapNode = node; }} bitmapBinding={fixture.name}
            style={{ position: 'absolute', left: 0, top: 0, width: 1080, height: 1350 }} /> : null}
          <View style={{ opacity: 0 }}><Text collapsable={false} ref={node => { this.rawTextNode = node; }}
            allowFontScaling={false} adjustsFontSizeToFit={false} accessible={false}
            android_hyphenationFrequency="none" textBreakStrategy="highQuality" lineBreakStrategyIOS="standard"
            onLayout={event => { if (this.caseFixtures[this.state.index].name === fixture.name) this.rawBox = { name: fixture.name, value: event.nativeEvent.layout }; }}
            onTextLayout={event => { if (this.caseFixtures[this.state.index].name === fixture.name) this.rawLines = { name: fixture.name, value: event.nativeEvent.lines }; }}
            style={{ position: 'absolute', left: 0, top: 0, width: 1080, paddingHorizontal: 96, fontSize: 48, lineHeight: 75,
              fontWeight: '400', fontStyle: 'normal', letterSpacing: 0, includeFontPadding: false, textAlign: 'left', color: '#111827' }}>
            {fixture.raw_text}
          </Text></View>
        </View>
      </View>;
    }
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
    return <View style={this.props.pieceGroup==='export'||fixture.evidence_set==='model73_export'?{position:'absolute',left:-10000,top:0,width:1080}:{width:360}}><PieceVisualCard key={fixture.name} ref={this.observeGeometryCard}
      {...fixture.props} onSaveFitChange={this.saveFitChanged} /></View>;
  }
}
// Two finite visual-transition scenarios. The parent mode uses the production
// controller/reader/Modal; the retained mode is explicitly component coverage.
class VisualTransitionCases extends CanvasCases {
  constructor(props) {
    super(props);
    this.caseFixtures = transitionFixtures.map(fixture => ({ ...fixture, props: { display: null } }));
    this.baseFinishCase = this.finishCase;
    this.baseCaptureAndAdvance = this.captureAndAdvance;
    this.baseAdvanceCase = this.advanceCase;
    this.startCase = this.startTransitionCase;
    this.finishCase = this.finishTransitionFrame;
    this.captureAndAdvance = this.captureTransitionFrame;
    this.advanceCase = this.advanceTransitionFrame;
  }
  componentWillUnmount() { this.cleanTransition(); super.componentWillUnmount(); }
  observeCardLifecycles = () => {
    const owner = this, prototype = PieceVisualCard.prototype;
    this.lifecycleOriginals = ['componentDidMount', 'componentDidUpdate', 'componentWillUnmount'].map(name => {
      const original = prototype[name];
      const wrapper = function (...args) {
        const result = original.apply(this, args);
        if (owner.scenario && (name === 'componentDidMount' || owner.instances.includes(this))) {
          if (name === 'componentDidMount') { owner.instances.push(this); owner.card = this; }
          if (name === 'componentWillUnmount' && owner.card === this) owner.card = null;
          if (name !== 'componentDidUpdate') owner.events.push({ event: name, instance: owner.instances.indexOf(this), stage: owner.stage });
        }
        return result;
      };
      prototype[name] = wrapper;
      return { name, original, wrapper };
    });
  };
  cleanTransition = () => {
    this.unsubscribe?.(); this.unsubscribe = null;
    this.controller?.dispose(); this.controller = null;
    this.transport?.close(); this.transport = null;
    for (const { name, original, wrapper } of this.lifecycleOriginals || [])
      if (PieceVisualCard.prototype[name] === wrapper) PieceVisualCard.prototype[name] = original;
    this.lifecycleOriginals = null;
  };
  startTransitionCase = () => {
    this.scenario = this.caseFixtures[this.state.index]; this.stage = 'A';
    this.card = null; this.oldFrame = null; this.instances = []; this.events = [];
    this.loadingCommitSeen = false;
    this.loadingObservation = null; this.frameObservation = null; this.transportResult = null;
    this.observeCardLifecycles(); this.resetCaseClock();
    if (this.scenario.mode === 'parent_loading_remount') {
      this.transport = installPieceVisualTransitionTransport(this.scenario);
      this.controller = createPieceCreateController();
      this.unsubscribe = this.controller.subscribe(this.readControllerDisplay);
      this.controller.setContext(this.scenario.controller_context);
      void this.controller.start();
    } else {
      this.scenario.props.display = { phase: 'received', preview: this.scenario.preview_a,
        hashVerified: true, visualToken: Object.freeze({}) };
      this.forceUpdate();
    }
    this.poll();
  };
  readControllerDisplay = () => {
    if (!this.controller || !this.scenario) return;
    const display = readPiecePreviewDisplay(this.controller.getView());
    this.scenario.props.display = display;
    this.forceUpdate(() => {
      if (this.stage === 'waiting' && display.phase === 'loading')
        requestAnimationFrame(() => { this.loadingCommitSeen = true; this.releaseAfterLoadingCommit(); });
    });
  };
  releaseAfterLoadingCommit = () => {
    if (this.stage !== 'waiting' || !this.transport) return;
    const display = readPiecePreviewDisplay(this.controller.getView()), old = this.oldFrame;
    if (display.phase !== 'loading' || performance.now() - this.waitStarted >= 8000) {
      this.loadingObservation = { ...this.loadingObservation, failed_before_B: true, reader_phase: display.phase, wait_ms: performance.now() - this.waitStarted };
      this.stage = 'B'; this.resetCaseClock(); this.finishing = true; void this.finishTransitionFrame(); return;
    }
    if (!this.loadingCommitSeen || !this.transport.snapshot().patch_pending) { this.timer = setTimeout(this.releaseAfterLoadingCommit, 20); return; }
    this.loadingObservation = { reader_phase: display.phase, preview_absent: display.preview === null,
      card_absent: this.card === null, old_card_unmounted: old?.card.active === false,
      old_fit_revoked: !!old?.fit && !old.fit.isCurrent(old.preview, old.visualToken),
      unmount_observed: this.events.some(event => event.event === 'componentWillUnmount' && event.instance === 0),
      wait_ms: performance.now() - this.waitStarted };
    if (!['preview_absent', 'card_absent', 'old_card_unmounted', 'old_fit_revoked', 'unmount_observed']
      .every(key => this.loadingObservation[key] === true)) {
      this.timer = setTimeout(this.releaseAfterLoadingCommit, 20); return;
    }
    // Release only after the actual loading Modal commit was observed. This
    // wait is not a native generation or an extension of A's original clock.
    this.stage = 'B'; this.resetCaseClock(); this.transport.releasePatch(); this.poll();
  };
  transitionVisualChange = (selection, identity, visualToken) => this.controller?.changeVisual(selection, identity, visualToken);
  observeTransitionBitmap = async (card, snapshot, stage) => {
    const tag = findNodeHandle(card?.bitmapNode), token = snapshot?.bitmapCanvas?.artifactToken;
    if (!Number.isInteger(tag) || tag <= 0 || typeof token !== 'string') return { observation_failed: true };
    try { return await NativeModules.PieceCanvasTest.observeTransitionBitmap(tag, token, stage); }
    catch { return { observation_failed: true }; }
  };
  finishTransitionFrame = async () => {
    const fixture = this.scenario, card = this.card, snapshot = card?.state.measurement;
    const display = fixture.props.display, fit = this.saveFitHandle;
    const observation = { mode: fixture.mode, stage: this.stage,
      preview_revision: display?.preview?.preview_revision, row_version: display?.preview?.row_version,
      capture_target_null: card?.getCaptureTarget() === null,
      fit_current: !!fit && fit.isCurrent(display?.preview, display?.visualToken),
      native_clock_span_ms: card?.deadline ? card.deadline.expiresAt - card.deadline.startedAt : null,
      events: this.events.map(event => ({ ...event })) };
    if (this.stage === 'A') {
      this.oldFrame = { card, fit, preview: display?.preview, visualToken: display?.visualToken,
        binding: card?.state.binding, generation: snapshot?.generation, bitmapNode: card?.bitmapNode,
        bitmapToken: snapshot?.bitmapCanvas?.artifactToken, callback: card?.bitmapRef?.callback,
        deadline: card?.deadline, deadlineExpiresAt: card?.deadline?.expiresAt };
      observation.native_bitmap = await this.observeTransitionBitmap(card, snapshot, 'A');
    } else {
      const old = this.oldFrame;
      observation.same_card_instance = card === old?.card;
      observation.binding_changed = !!card?.state.binding && card.state.binding !== old?.binding;
      observation.generation_changed = !!snapshot?.generation && snapshot.generation !== old?.generation;
      observation.bitmap_token_changed = typeof snapshot?.bitmapCanvas?.artifactToken === 'string' &&
        !!old?.bitmapToken && snapshot.bitmapCanvas.artifactToken !== old.bitmapToken;
      observation.new_fit_handle = !!fit && fit !== old?.fit;
      observation.old_fit_revoked = !!old?.fit && !old.fit.isCurrent(old.preview, old.visualToken) && !old.fit.isCurrent(display?.preview, display?.visualToken);
      observation.new_fit_rejects_A = !!fit && !fit.isCurrent(old?.preview, old?.visualToken);
      observation.old_deadline_not_extended = !!old?.deadline && old.deadline.expiresAt === old.deadlineExpiresAt && card?.deadline !== old.deadline;
      observation.loading = this.loadingObservation;
      if (fixture.mode === 'retained_card_regression') {
        observation.controlled_old_callback_injected = false;
        observation.controlled_old_callback_ignored = false;
      }
      if (fixture.mode === 'retained_card_regression' && card && fit && old?.fit && typeof old.callback === 'function') {
        const before = { node: card.bitmapNode, state: card.state.measurement, artifact: card.bitmapArtifact, fit };
        // Controlled late callback injection, not an independently observed
        // late native event. It must not revive A or invalidate ready B.
        old.callback(null); old.callback(old.bitmapNode);
        observation.controlled_old_callback_injected = true;
        observation.controlled_old_callback_ignored = card.bitmapNode === before.node && card.state.measurement === before.state &&
          card.bitmapArtifact === before.artifact && this.saveFitHandle === before.fit && fit.isCurrent(display.preview, display.visualToken) &&
          !old.fit.isCurrent(old.preview, old.visualToken);
      }
      observation.native_bitmap = await this.observeTransitionBitmap(card, snapshot, 'B');
      this.transportResult = this.transport ? { ...this.transport.close(), scope_closed: true }
        : { api: [], session_calls: 0, scope_closed: true, not_installed: true };
      this.transport = null;
      observation.transport = this.transportResult;
    }
    this.frameObservation = observation;
    await this.baseFinishCase();
  };
  captureTransitionFrame = (report, node) => {
    const preview = this.scenario.props.display?.preview;
    return this.baseCaptureAndAdvance({ ...report, name: `${this.scenario.name}_${this.stage}`,
      transition: this.frameObservation, source_case_id: this.scenario.source_case_id,
      recorded_artifact: preview ? Object.fromEntries(['format_type', 'piece_text', 'piece_text_hash', 'content_payload',
        'content_payload_hash', 'visual_recipe', 'visual_recipe_hash', 'renderer_version'].map(key => [key, preview[key]])) : null }, node);
  };
  advanceTransitionFrame = () => {
    if (this.stage === 'A') {
      clearTimeout(this.timer); this.finishing = true;
      if (this.scenario.mode === 'parent_loading_remount') {
        this.stage = 'waiting'; this.waitStarted = performance.now();
        const display = this.scenario.props.display, b = this.scenario.preview_b;
        void this.transitionVisualChange({ theme_id: b.visual_recipe.theme.theme_id, aspect_ratio: b.visual_recipe.aspect_ratio,
          branding_mode: b.visual_recipe.branding.branding_mode }, { preview_id: display.preview.preview_id,
          preview_revision: display.preview.preview_revision, visual_recipe_hash: display.preview.visual_recipe_hash }, display.visualToken);
        this.timer = setTimeout(this.releaseAfterLoadingCommit, 20);
      } else {
        this.stage = 'B'; this.resetCaseClock();
        this.scenario.props.display = { phase: 'received', preview: this.scenario.preview_b, hashVerified: true, visualToken: Object.freeze({}) };
        this.forceUpdate(this.poll);
      }
      return;
    }
    this.cleanTransition(); this.scenario = null; this.baseAdvanceCase();
  };
  render() {
    const fixture = this.caseFixtures[this.state.index];
    if (this.scenario !== fixture) return <View />;
    if (fixture.mode === 'parent_loading_remount') return <PiecePreviewModal visible display={fixture.props.display}
      onVisualChange={this.transitionVisualChange} onSaveFitChange={this.saveFitChanged} />;
    return <View style={{ width: 360 }}><PieceVisualCard key={fixture.name} display={fixture.props.display}
      onSaveFitChange={this.saveFitChanged} /></View>;
  }
}

/** Actual hosts; only runtime/Auth/transport are local test doubles.
 * Native fit, admission, save, owner read and PNG capture are production code.
 * The test does not invoke Photos or Share.
 */
class NormalHostCases extends CanvasCases {
  constructor(props) {
    super(props);
    this.caseFixtures = normalHostFixtures.map(f => ({ ...f, props: {} }));
    this.baseFinishCase = this.finishCase;
    this.baseCaptureAndAdvance = this.captureAndAdvance;
    this.baseAdvanceCase = this.advanceCase;
    this.startCase = this.startHostCase;
    this.finishCase = this.finishHostFrame;
    this.captureAndAdvance = this.captureHostFrame;
    this.advanceCase = this.advanceHostFrame;
  }
  componentWillUnmount() { this.cleanHostCase(); super.componentWillUnmount(); }
  waitForHost = async predicate => {
    const start = performance.now();
    while (!predicate()) {
      if (!this.scenario || performance.now() - start >= 8000) throw new Error('host_phase_unavailable');
      await new Promise(resolve => setTimeout(resolve, 20));
    }
  };
  observeHostCards = () => {
    const owner = this, prototype = PieceVisualCard.prototype;
    this.hostLifecycleOriginals = ['componentDidMount', 'componentWillUnmount'].map(name => {
      const original = prototype[name];
      const wrapper = function (...args) {
        const result = original.apply(this, args);
        if (owner.scenario) {
          if (name === 'componentDidMount') {
            owner.card = this; owner.hostEvents.push({ event: 'mount', stage: owner.stage });
            const d = this.props.display;
            if (owner.stage === 'preview' && d?.preview && owner.inputHost)
              owner.preFitSaveBlocked = owner.inputHost.saveFitHandle === null &&
                owner.inputHost.isSaveAdmitted(d.preview, d.visualToken) === false;
          } else if (owner.card === this) {
            owner.card = null; owner.hostEvents.push({ event: 'unmount', stage: owner.stage });
          }
        }
        return result;
      };
      prototype[name] = wrapper; return { name, original, wrapper };
    });
  };
  cleanHostCase = () => {
    this.transport?.close(); this.transport = null;
    for (const { name, original, wrapper } of this.hostLifecycleOriginals || [])
      if (PieceVisualCard.prototype[name] === wrapper) PieceVisualCard.prototype[name] = original;
    this.hostLifecycleOriginals = null;
  };
  failHostCase = async error => {
    if (this.hostFailed) return;
    this.hostFailed = true; clearTimeout(this.timer);
    NativeModules.PieceCanvasTest.record({ name: 'normal_host_' + this.stage + '_' + this.scenario?.source_case_id,
      phase: 'host_integration_failed', error: String(error?.message || 'host_integration_failed').slice(0, 120) });
    try { await this.exportAsset?.dispose(); } catch { /* Failed test remains failed; confined copy only. */ }
    this.exportAsset = null; this.cleanHostCase(); NativeModules.PieceCanvasTest.done();
  };
  startHostCase = () => {
    this.scenario = this.caseFixtures[this.state.index]; this.stage = 'preview';
    this.card = null; this.inputHost = null; this.ownerHost = null; this.savedTarget = null;
    this.saveFitHandle = null; this.hostEvents = []; this.preFitSaveBlocked = false; this.hostFailed = false;
    this.exportAsset = null; this.exportFile = null; this.hostLinkage = null;
    this.finalTransport = null; this.navigationObserved = false; this.savedReceipt = null;
    const flags = { piece_v2_preview_enabled: true, piece_v2_save_enabled: true,
      piece_v2_owner_read_enabled: true, piece_v2_export_enabled: true };
    this.runtimeValue = { runtime: Object.freeze({ loaded: true, loading: false, error: null }),
      isFeatureEnabled: name => flags[name] === true, refreshAppRuntime: () => { throw new Error('runtime_refresh_unexpected'); } };
    this.ownerFlags = { piece_v2_owner_read_enabled: true, piece_v2_export_enabled: true,
      piece_v2_visibility_toggle_enabled: false, piece_v2_public_write_enabled: false, piece_v2_delete_enabled: false };
    this.observeHostCards(); this.resetCaseClock();
    try { this.transport = installPieceNormalHostTransport(this.scenario); }
    catch (error) { this.failHostCase(error); return; }
    this.forceUpdate(async () => {
      try {
        await this.waitForHost(() => this.inputHost?.controller && this.inputHost.isCurrent());
        await this.inputHost.createFromSavedInput();
        await this.waitForHost(() => readPiecePreviewDisplay(this.inputHost.controller.getView()).phase === 'received');
        this.poll();
      } catch (error) { this.failHostCase(error); }
    });
  };
  navigateSaved = (name, route) => {
    const target = route?.params?.savedPiece, expected = this.scenario;
    if (name !== 'Piece' || route?.screen !== 'PieceOwnerHistory' || route?.initial !== false ||
        !target || Object.keys(target).sort().join() !== 'expectedUserId,pieceId' ||
        target.pieceId !== expected.save.piece_id || target.expectedUserId !== expected.transport.owner)
      throw new Error('saved_navigation_mismatch');
    this.navigationObserved = true; this.savedTarget = target; this.card = null; this.forceUpdate();
  };
  findRenderedModal = () => {
    const visit = node => {
      if (Array.isArray(node)) return node.map(visit).find(Boolean);
      if (!node || typeof node !== 'object') return null;
      return node.type === PiecePreviewModal ? node : visit(node.props?.children);
    };
    return visit(this.inputHost?.render());
  };
  finishHostFrame = async () => {
    try {
      const fixture = this.scenario, card = this.card, m = card?.state.measurement;
      fixture.name = 'normal_host_' + this.stage + '_' + fixture.source_case_id;
      fixture.evidence_set = 'normal_host_' + this.stage; fixture.props = card?.props || {};
      this.saveFitHandle = this.stage === 'preview' ? this.inputHost?.saveFitHandle : null;
      const artifact = fixture.props.display?.preview || fixture.props.savedRecord;
      const expected = this.stage === 'preview' ? fixture.preview : fixture.detail;
      const keys = ['format_type', 'piece_text', 'piece_text_hash', 'content_payload',
        'content_payload_hash', 'visual_recipe', 'visual_recipe_hash', 'renderer_version'];
      const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
      const matches = !!artifact && keys.every(key => same(artifact[key], expected[key]));
      if (this.stage === 'preview') {
        const d = readPiecePreviewDisplay(this.inputHost.controller.getView());
        this.hostLinkage = { source_ready: this.inputHost.sourcePhase === 'ready',
          pre_fit_save_blocked: this.preFitSaveBlocked,
          save_admitted: this.inputHost.isSaveAdmitted(d.preview, d.visualToken), recorded_artifact_matches: matches };
      } else if (this.stage === 'saved') {
        this.hostLinkage = { saved_receipt_matches: this.savedReceiptMatches === true,
          navigation_body_free: this.navigationObserved === true,
          fresh_owner_read: this.transport.snapshot().api.some(call => call.method === 'GET' &&
            call.path === '/emotion/piece/' + fixture.save.piece_id),
          owner_record_matches: matches && artifact.row_version === fixture.save.row_version };
      } else {
        const attempt = this.ownerHost.exportAttempt, target = attempt?.target;
        const before = target?.isCurrent() === true;
        if (m?.phase !== 'native_checked' || !before || !attempt?.job) throw new Error('export_native_target_unavailable');
        this.exportAsset = await attempt.job.capture(target);
        const hash = this.exportAsset?.candidate?.asset_sha256;
        if (typeof hash !== 'string' || !/^[0-9a-f]{64}$/.test(hash)) throw new Error('actual_export_hash_missing');
        const root = Dirs.CacheDir + '/piece-export', matched = [];
        const filename = 'cocolon-piece_' + fixture.save.piece_id.replace(/-/g, '') + '_' +
          fixture.detail.visual_recipe_hash.slice(0, 12) + '_' + fixture.detail.visual_recipe.aspect_ratio.replace(':', 'x') + '.png';
        for (const dir of await FileSystem.ls(root)) {
          if (!/^[0-9a-f]{32}$/.test(dir)) continue;
          const file = root + '/' + dir + '/' + filename;
          if (await FileSystem.exists(file) && await FileSystem.hash(file, 'SHA-256') === hash) matched.push(file);
        }
        if (matched.length !== 1) throw new Error('actual_owned_export_png_not_unique');
        this.exportFile = matched[0];
        this.hostLinkage = { fresh_export_read: this.transport.snapshot().api.some(call => call.method === 'GET' &&
            call.path === '/emotion/piece/' + fixture.save.piece_id + '/export'),
          export_target_current: before && target.isCurrent() === true,
          actual_job_capture: this.exportAsset.nativeStatus === 'not_started',
          export_asset_sha256: hash, export_piece_id: this.savedReceipt?.piece_id,
          recorded_artifact_matches: matches, saved_row_version: artifact.row_version };
        this.finalTransport = this.transport.close(); this.transport = null;
      }
      await this.baseFinishCase();
    } catch (error) { this.failHostCase(error); }
  };
  captureHostFrame = (report, node) => {
    const props = this.scenario.props, a = props.display?.preview || props.savedRecord;
    const keys = ['format_type', 'piece_text', 'piece_text_hash', 'content_payload',
      'content_payload_hash', 'visual_recipe', 'visual_recipe_hash', 'renderer_version'];
    return this.baseCaptureAndAdvance({ ...report, source_case_id: this.scenario.source_case_id,
      recorded_artifact: a ? Object.fromEntries(keys.map(key => [key, a[key]])) : null,
      host_linkage: { ...this.hostLinkage }, projection: this.scenario.projection,
      host_events: this.hostEvents.map(event => ({ ...event })), transport: this.finalTransport || this.transport.snapshot(),
      ...(this.stage === 'export' ? { export_capture_uri: this.exportFile,
        export_target_current: this.hostLinkage.export_target_current, export_target_after: this.hostLinkage.export_target_current,
        export_rejected: false } : {}) }, node);
  };
  advanceHostFrame = async () => {
    try {
      clearTimeout(this.timer); this.finishing = true;
      if (this.stage === 'preview') {
        const host = this.inputHost, d = readPiecePreviewDisplay(host.controller.getView()), modal = this.findRenderedModal();
        if (typeof modal?.props.onSave !== 'function' || this.hostLinkage.save_admitted !== true)
          throw new Error('rendered_save_action_unavailable');
        modal.props.onSave({ preview_id: d.preview.preview_id, preview_revision: d.preview.preview_revision,
          visual_recipe_hash: d.preview.visual_recipe_hash }, d.visualToken);
        await this.waitForHost(() => host.controller.getView().phase === 'saved');
        const receipt = host.controller.getView().savedReceipt; this.savedReceipt = receipt;
        this.savedReceiptMatches = ['piece_id', 'consumption_id', 'row_version', 'saved_at', 'lifecycle_status', 'visibility_scope']
          .every(key => receipt[key] === this.scenario.save[key]);
        this.stage = 'saved'; this.resetCaseClock(); host.openSavedPiece(receipt);
        await this.waitForHost(() => this.ownerHost?.controller?.getView().phase === 'detail');
        this.poll(); return;
      }
      if (this.stage === 'saved') {
        const record = this.ownerHost.controller.getView().record;
        this.stage = 'export'; this.resetCaseClock();
        await this.ownerHost.prepareExport(record);
        await this.waitForHost(() => this.ownerHost.exportAttempt?.target?.isCurrent() === true);
        this.poll(); return;
      }
      await this.exportAsset?.dispose(); this.exportAsset = null;
      const transport = this.finalTransport;
      if (transport.api.length !== this.scenario.transport.steps.length ||
          transport.session_calls !== 2 * this.scenario.transport.steps.length || transport.complete !== true ||
          transport.before_after_key_intact !== true || transport.session_owners_match !== true ||
          transport.fixture_headers_intact !== true || transport.save_key_generated_valid !== true ||
          transport.scope_closed !== true || transport.cleared !== true)
        throw new Error('normal_host_transport_incomplete');
      this.cleanHostCase(); this.scenario = null; this.savedTarget = null; this.baseAdvanceCase();
    } catch (error) { this.failHostCase(error); }
  };
  render() {
    const fixture = this.caseFixtures[this.state.index];
    if (this.scenario !== fixture) return <View />;
    if (this.savedTarget) return <PieceOwnerHistoryHost ref={node => { this.ownerHost = node; }}
      owner={fixture.transport.owner} enabled presentationActive runtimePending={false}
      flags={this.ownerFlags} savedPiece={this.savedTarget} />;
    const navigation = { getParent: () => ({ navigate: this.navigateSaved }) };
    return <AppRuntimeContext.Provider value={this.runtimeValue}>
      <InputPieceActionArea ref={node => { this.inputHost = node; }} savedInput={fixture.saved_input}
        active creationMode navigation={navigation} isSaveAdmitted={renderer.isPieceBitmapSaveAdmitted} />
    </AppRuntimeContext.Provider>;
  }
}

AppRegistry.registerComponent('PieceCanvasCases', () => props => props.pieceGroup === 'normalHost'
  ? <NormalHostCases {...props} /> : props.pieceGroup === 'visualTransition'
    ? <VisualTransitionCases {...props} /> : <CanvasCases {...props} />);
