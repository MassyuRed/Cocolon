// Actual React/Paper/Piece component. Only transport/auth and input data are synthetic.
import React from 'react';
import { AppRegistry, View, NativeModules, findNodeHandle } from 'react-native';
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
  const started = performance.now(), sample = { font_size: args[2], status: 'pending' };
  activeTrace?.adapters.push(sample);
  try {
    const value = await measureCandidates(...args);
    Object.assign(sample, { status: 'resolved', elapsed_ms: performance.now() - started });
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
  return plan;
};
const nativeCandidates = NativeModules.PieceTextMetrics.measureCandidates;
NativeModules.PieceTextMetrics.measureCandidates = (...args) => {
  const started = performance.now();
  const sample = { font_size: args[2], utf16_length: args[1].length, status: 'pending' };
  activeTrace?.candidates.push(sample);
  return nativeCandidates(...args).then(value => {
    const packedBytes = typeof value.rows_f64le === 'string'
      ? value.rows_f64le.length / 4 * 3 - (value.rows_f64le.endsWith('==') ? 2 : value.rows_f64le.endsWith('=') ? 1 : 0) : null;
    Object.assign(sample, { status: 'resolved', elapsed_ms: performance.now() - started,
      rows: value.rows?.length ?? (value.version === 'piece.native_candidates.v3'
        ? value.boundaries.length * (value.boundaries.length - 1) / 2 : packedBytes === null ? null : packedBytes / 56),
      metric_count: value.metric_count ?? null, version: value.version });
    console.log('PIECE_RN_CANDIDATES', JSON.stringify(sample));
    return value;
  }, error => {
    Object.assign(sample, { status: 'rejected', elapsed_ms: performance.now() - started });
    console.log('PIECE_RN_CANDIDATES', JSON.stringify(sample));
    throw error;
  });
};

class CanvasCases extends React.Component {
  state = { index: 0 };
  componentDidMount() { this.startCase(); }
  componentWillUnmount() { clearTimeout(this.timer); }
  startCase = () => {
    this.started = performance.now();
    this.trace = { candidates: [], adapters: [], plans: [], states: [] };
    activeTrace = this.trace;
    this.finishing = false;
    this.poll();
  };
  poll = () => {
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
    const fixture = fixtures[this.state.index], card = this.card, m = card?.state.measurement;
    const input = preparePieceNativeCard(fixture.props);
    const report = { name: fixture.name, phase: m?.phase ?? 'missing', reason: m?.reason ?? null,
      elapsed_ms: performance.now() - this.started, size_index: m?.sizeIndex,
      trace: this.trace,
      width: input?.width, height: input?.height, content_width: input?.contentWidth,
      content_height: input?.contentHeight, margin: input?.margin, branding_zone: input?.brandingZone,
      composition_height: m?.compositionHeight, blocks: input?.blocks,
      rows: m?.plan?.groups.flat() ?? [], row_offsets: m?.rowOffsets ?? [], inspection: m?.inspection ?? [],
      branding: input?.brandingMode !== 'off', state_can_save: m?.canSave, state_can_export: m?.canExport,
      body_preserved: !!m?.plan && m.plan.groups.every((rows, index) => rows.join('') === input.blocks[index]),
    };
    try {
      const tag = findNodeHandle(card?.canvasNode);
      // RN rejects a null NSNumber before calling native, leaving its Promise
      // pending. Preserve the failure report so all five cases still finish.
      if (!Number.isInteger(tag) || tag <= 0) NativeModules.PieceCanvasTest.record({ ...report, capture_error: true });
      else await NativeModules.PieceCanvasTest.capture(tag, report);
    }
    catch { NativeModules.PieceCanvasTest.record({ ...report, capture_error: true }); }
    if (this.state.index + 1 === fixtures.length) { NativeModules.PieceCanvasTest.done(); return; }
    this.setState(({ index }) => ({ index: index + 1 }), this.startCase);
  };
  render() {
    const fixture = fixtures[this.state.index];
    return <View style={{ width: 360 }}><PieceVisualCard key={fixture.name} ref={node => { this.card = node; }} {...fixture.props} /></View>;
  }
}
AppRegistry.registerComponent('PieceCanvasCases', () => CanvasCases);
