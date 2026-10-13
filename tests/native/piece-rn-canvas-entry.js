// Actual React/Paper/Piece component. Only transport/auth and input data are synthetic.
import React from 'react';
import { AppRegistry, View, NativeModules, findNodeHandle } from 'react-native';
import PieceVisualCard from '../../components/piece/PieceVisualCard';
import { preparePieceNativeCard } from '../../features/piece/pieceLayout';
import fixtures from './piece-rn-canvas-fixtures.json';

class CanvasCases extends React.Component {
  state = { index: 0 };
  componentDidMount() { this.startCase(); }
  componentWillUnmount() { clearTimeout(this.timer); }
  startCase = () => {
    this.started = performance.now();
    this.finishing = false;
    this.poll();
  };
  poll = () => {
    const card = this.card, snapshot = card?.state.measurement;
    if (!this.finishing && snapshot && (['native_checked', 'unavailable'].includes(snapshot.phase) || performance.now() - this.started > 10000)) {
      this.finishing = true;
      requestAnimationFrame(() => requestAnimationFrame(() => this.finishCase()));
      return;
    }
    this.timer = setTimeout(this.poll, 20);
  };
  finishCase = async () => {
    const fixture = fixtures[this.state.index], card = this.card, m = card?.state.measurement;
    const input = preparePieceNativeCard(fixture.props);
    const report = { name: fixture.name, phase: m?.phase ?? 'missing', reason: m?.reason ?? null,
      elapsed_ms: performance.now() - this.started, size_index: m?.sizeIndex,
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
