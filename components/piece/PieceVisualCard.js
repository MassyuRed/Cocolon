/** Fixed logical canvas shared by native measurement and preview display.
 * No image file, export completion, missing-glyph proof or save permission.
 */
import React from 'react';
import { View, Text } from 'react-native';
import { preparePieceNativeCard, createPieceNativeMeasurement, pieceNativeTypography, recordPieceNativeMeasurement } from '../../features/piece/pieceLayout';
import { inspectPieceText, measurePieceCandidates } from '../../features/piece/pieceRenderer';
import { planPieceMeasuredRows } from '../../features/piece/pieceMeasuredWrap';

export default class PieceVisualCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = { measurement: createPieceNativeMeasurement(preparePieceNativeCard(props)), width: props.exportCanvas === true ? 1080 : 0 };
    this.active = true;
    this.textNodes = new Map();
    this.probeReady = new Map();
  }

  static getDerivedStateFromProps(props, state) {
    const input = preparePieceNativeCard(props);
    return state.measurement.key === (input?.key ?? null) ? null : { measurement: createPieceNativeMeasurement(input) };
  }

  componentDidMount() { this.active = true; this.syncDeadline(); }
  componentDidUpdate() { this.syncDeadline(); this.inspectDrawing(); }
  componentWillUnmount() { this.active = false; this.clearDeadline(); this.inspection = null; this.planning = null; this.textNodes.clear(); this.probeReady.clear(); }

  clearDeadline = () => {
    if (this.deadline) clearTimeout(this.deadline.handle);
    this.deadline = null;
  };

  syncDeadline = () => {
    const input = preparePieceNativeCard(this.props);
    if (!this.active || !input || input.key !== this.state.measurement.key ||
        !['planning', 'measuring', 'geometry_checked'].includes(this.state.measurement.phase)) {
      this.clearDeadline(); return;
    }
    if (this.deadline?.key === input.key) return;
    this.clearDeadline();
    const key = input.key;
    const deadline = { key, handle: null, expiresAt: Date.now() + 8000 };
    this.deadline = deadline;
    deadline.handle = setTimeout(() => {
      if (this.deadline !== deadline) return;
      this.deadline = null;
      if (!this.active || preparePieceNativeCard(this.props)?.key !== key) return;
      const generation = this.state.measurement.generation;
      this.setState(previous => this.active && preparePieceNativeCard(this.props)?.key === key &&
        previous.measurement.key === key && previous.measurement.generation === generation &&
        ['planning', 'measuring', 'geometry_checked'].includes(previous.measurement.phase)
        ? { measurement: { ...previous.measurement, phase: 'unavailable', blocks: {}, compositionHeight: null, reason: 'measurement_timeout' } }
        : null);
    }, 8000);
  };

  drawingInput = (input, measurement = this.state.measurement) => {
    if (!measurement.plan) return input;
    const blocks = [], rowGaps = [];
    measurement.plan.groups.forEach((group, index) => group.forEach((body, row) => {
      blocks.push(body);
      rowGaps.push(row === group.length - 1 && index < measurement.plan.groups.length - 1 ? measurement.plan.gap : 0);
    }));
    return { ...input, blocks, rowGaps, plannedRows: true };
  };

  planDrawing = async () => {
    const snapshot = this.state.measurement, input = preparePieceNativeCard(this.props);
    if (!this.active || !input || input.key !== snapshot.key || snapshot.phase !== 'planning' ||
        this.planning?.snapshot === snapshot || input.blocks.some((_, i) => this.probeReady.get(i) !== snapshot.generation)) return;
    const operation = { snapshot }; this.planning = operation;
    const current = () => this.active && this.planning === operation && this.state.measurement === snapshot &&
      preparePieceNativeCard(this.props)?.key === input.key && this.deadline && Date.now() < this.deadline.expiresAt;
    try {
      const measurements = [];
      for (let index = 0; index < input.blocks.length; index++) {
        if (!current()) return;
        const node = this.textNodes.get(index);
        if (node?.generation !== snapshot.generation) throw new Error('PIECE_NATIVE_MEASUREMENT_UNAVAILABLE');
        measurements.push(await measurePieceCandidates(node.value, input.blocks[index], input.sizes[snapshot.sizeIndex]));
      }
      if (!current()) return;
      const plan = planPieceMeasuredRows(input, snapshot.sizeIndex, measurements);
      if (!current()) return;
      this.setState(previous => current() && previous.measurement === snapshot ? {
        measurement: plan ? { ...snapshot, phase: 'measuring', plan, generation: Object.freeze({}), blocks: {} }
          : snapshot.sizeIndex + 1 < input.sizes.length ? { ...createPieceNativeMeasurement(input), sizeIndex: snapshot.sizeIndex + 1 }
          : { ...snapshot, phase: 'unavailable', reason: 'font_floor_overflow' },
      } : null);
    } catch {
      if (current()) this.setState(previous => current() && previous.measurement === snapshot
        ? { measurement: { ...snapshot, phase: 'unavailable', reason: 'native_candidates_unavailable' } } : null);
    }
  };

  inspectDrawing = async () => {
    const snapshot = this.state.measurement, raw = preparePieceNativeCard(this.props), input = raw && this.drawingInput(raw, snapshot);
    if (!this.active || !input || input.key !== snapshot.key || snapshot.phase !== 'geometry_checked' || this.inspection?.snapshot === snapshot) return;
    const operation = { snapshot }; this.inspection = operation;
    const current = () => this.active && this.inspection === operation && this.state.measurement === snapshot &&
      preparePieceNativeCard(this.props)?.key === input.key && this.deadline && Date.now() < this.deadline.expiresAt;
    try {
      const evidence = [];
      const count = input.blocks.length + (input.brandingMode === 'off' ? 0 : 1);
      for (let index = 0; index < count; index++) {
        if (!current()) return;
        const node = this.textNodes.get(index);
        if (node?.generation !== snapshot.generation) throw new Error('PIECE_NATIVE_MEASUREMENT_UNAVAILABLE');
        evidence.push(await inspectPieceText(node.value, {
          text: index < input.blocks.length ? input.blocks[index] : 'Cocolon',
          fontSize: index < input.blocks.length ? input.sizes[snapshot.sizeIndex] : 28,
          box: snapshot.blocks[index].box, lineEnds: snapshot.blocks[index].lines.map(line => line.end),
        }));
      }
      if (!current()) return;
      const { lineHeight } = pieceNativeTypography(input, snapshot.sizeIndex);
      const rowOffsets = evidence.slice(0, input.blocks.length).map((result, index) => {
        const [left, top, right, bottom] = result.ink;
        const width = Math.max(snapshot.blocks[index].lines[0].width, right) - Math.min(0, left);
        return { x: -Math.min(0, left) + (input.alignment === 'center' ? (input.contentWidth - width) / 2 : 0),
          y: (lineHeight - (bottom - top)) / 2 - top, width, height: bottom - top };
      });
      // Moving a Text view cannot recover ink clipped by its own bounds.
      // Only already-contained ink may be repositioned within its row.
      const overflow = evidence.some(result => result.overflow) ||
        rowOffsets.some(row => row.width > input.contentWidth || row.height > lineHeight);
      const wrapViolation = evidence.some(result => result.wrapViolation);
      this.setState(previous => current() && previous.measurement === snapshot ? { measurement: overflow || wrapViolation ? snapshot.sizeIndex + 1 < input.sizes.length
        ? { ...createPieceNativeMeasurement(input), sizeIndex: snapshot.sizeIndex + 1 }
        : { ...snapshot, phase: 'unavailable', blocks: {}, compositionHeight: null,
          reason: overflow ? 'native_ink_overflow' : 'native_kinsoku_unavailable' }
        : { ...snapshot, phase: 'native_checked', inspection: evidence, rowOffsets } } : null);
    } catch {
      if (current()) this.setState(previous => current() && previous.measurement === snapshot
        ? { measurement: { ...snapshot, phase: 'unavailable', blocks: {}, compositionHeight: null, reason: 'native_measurement_unavailable' } } : null);
    }
  };

  measure = (ticket, index, kind, value) => {
    if (!this.active) return;
    const raw = preparePieceNativeCard(this.props), input = raw && this.drawingInput(raw);
    if (this.state.measurement.phase === 'planning') return;
    this.setState(previous => {
      const measurement = recordPieceNativeMeasurement(input, previous.measurement, ticket, index, kind, value);
      return measurement === previous.measurement ? null : { measurement };
    });
  };

  // A local capture target, not renderer admission or permission to export.
  // Only the dedicated saved-record canvas exposes it, after its final render.
  getCaptureTarget = () => {
    const input = preparePieceNativeCard(this.props), snapshot = this.state.measurement;
    const node = this.canvasNode;
    if (!this.active || this.props.exportCanvas !== true || !this.props.savedRecord ||
        !input || input.key !== snapshot.key || snapshot.phase !== 'native_checked' || !node) return null;
    return Object.freeze({ node, key: input.key, width: input.width, height: input.height,
      isCurrent: () => this.active && this.props.exportCanvas === true && this.canvasNode === node &&
        this.state.measurement === snapshot && preparePieceNativeCard(this.props)?.key === input.key });
  };

  render() {
    const raw = preparePieceNativeCard(this.props), measurement = this.state.measurement;
    const input = raw && this.drawingInput(raw, measurement);
    if (!input || input.key !== measurement.key) return Object.prototype.hasOwnProperty.call(this.props, 'savedRecord')
      ? React.createElement(Text, { testID: 'piece-visual-unavailable', style: { color: '#494949', fontSize: 14, lineHeight: 22, marginBottom: 12 } },
        'このPieceの画像レイアウトは現在確認できません。本文は下で確認できます。') : null;
    const element = React.createElement, ready = measurement.phase === 'native_checked', planning = measurement.phase === 'planning';
    const { fontSize, lineHeight, gap } = pieceNativeTypography(input, measurement.sizeIndex);
    const ticket = { key: input.key, sizeIndex: measurement.sizeIndex, generation: measurement.generation };
    const scale = this.state.width / input.width;
    const textProps = index => ({
      key: `${input.key}:${measurement.sizeIndex}:${planning ? 'probe' : 'row'}:${index}`, testID: `piece-${planning ? 'probe' : 'visual'}-block-${index}`,
      ref: value => {
        if (value) this.textNodes.set(index, { value, generation: measurement.generation });
        else if (this.textNodes.get(index)?.generation === measurement.generation) this.textNodes.delete(index);
      },
      collapsable: false,
      allowFontScaling: false, adjustsFontSizeToFit: false, accessible: false,
      android_hyphenationFrequency: 'none', textBreakStrategy: 'highQuality', lineBreakStrategyIOS: 'standard',
      onLayout: event => {
        if (planning) {
          if (!this.active || this.state.measurement.generation !== ticket.generation ||
              preparePieceNativeCard(this.props)?.key !== ticket.key || this.state.measurement.phase !== 'planning') return;
          this.probeReady.set(index, ticket.generation); this.planDrawing();
        } else this.measure(ticket, index, 'box', event.nativeEvent?.layout);
      },
      onTextLayout: event => this.measure(ticket, index, 'lines', event.nativeEvent?.lines),
    });
    return element(View, { testID: 'piece-visual-preview', style: { marginBottom: 20 },
      onLayout: event => {
        if (this.props.exportCanvas === true) return;
        const width = event.nativeEvent?.layout?.width;
        if (this.active && Number.isFinite(width) && width > 0 && Math.min(width, 1080) !== this.state.width) {
          this.setState({ width: Math.min(width, 1080) });
        }
      } },
      element(Text, { style: { fontSize: 16, color: '#202020', marginBottom: 8 } }, '画像レイアウト（確認用）'),
      element(View, { style: { width: this.state.width, height: measurement.phase === 'unavailable' ? 0 : input.height * scale },
        accessible: false, accessibilityElementsHidden: true, importantForAccessibility: 'no-hide-descendants' },
        measurement.phase !== 'unavailable' && this.state.width > 0 ? element(View, {
          testID: 'piece-logical-canvas', pointerEvents: 'none', collapsable: false,
          ref: node => { this.canvasNode = node; },
          style: { position: 'absolute', width: input.width, height: input.height,
            left: (this.state.width - input.width) / 2, top: (input.height * scale - input.height) / 2,
            transform: [{ scale }], opacity: ready ? 1 : 0, backgroundColor: input.colors.canvas },
        },
        element(View, { style: { position: 'absolute', left: input.margin / 2, top: input.margin / 2,
          right: input.margin / 2, bottom: input.margin / 2, backgroundColor: input.colors.surface,
          borderColor: input.colors.border, borderWidth: 2 } }),
        element(View, { style: { position: 'absolute', left: input.margin, width: input.contentWidth,
          top: input.margin + (ready ? (input.contentHeight - measurement.compositionHeight) / 2 : 0) } },
          ...input.blocks.map((body, index) => element(View, {
            key: `row:${index}`, style: { height: planning ? undefined : lineHeight, marginBottom: input.rowGaps?.[index] ?? (index < input.blocks.length - 1 ? gap : 0) },
          }, element(Text, { ...textProps(index), style: {
            width: input.contentWidth, fontSize, lineHeight, fontWeight: '400', fontStyle: 'normal',
            letterSpacing: 0, includeFontPadding: false, textAlign: 'left', color: input.colors.text,
            position: planning ? 'relative' : 'absolute', left: ready ? measurement.rowOffsets[index].x : 0,
            top: ready ? measurement.rowOffsets[index].y : 0,
          } }, body)))),
        planning || input.brandingMode === 'off' ? null : element(Text, { ...textProps(input.blocks.length), style: {
          position: 'absolute', left: input.margin, width: input.contentWidth,
          top: input.height - input.margin - input.brandingZone,
          fontSize: 28, lineHeight: 40, includeFontPadding: false, textAlign: 'center',
          color: input.colors.branding, opacity: input.brandingMode === 'required_subtle' ? 0.8 : 1,
        } }, 'Cocolon')) : null),
      element(Text, { testID: 'piece-visual-status', accessibilityLiveRegion: 'polite',
        style: { fontSize: 14, lineHeight: 22, color: '#494949', marginTop: 8 } },
        measurement.phase === 'unavailable' ? '画像レイアウトを確認できませんでした。本文は下で確認できます。' :
          ready ? Object.prototype.hasOwnProperty.call(this.props, 'savedRecord')
            ? '保存済みPieceの画像レイアウトの確認用表示です。画像の保存・共有はまだ利用できません。'
            : '画像レイアウトの確認用表示です。保存・書き出しはまだ利用できません。'
          : '画像レイアウトを確認しています。'),
    );
  }
}
