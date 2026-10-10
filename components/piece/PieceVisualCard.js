/** Fixed logical canvas shared by native measurement and preview display.
 * No image file, export completion, missing-glyph proof or save permission.
 */
import React from 'react';
import { View, Text } from 'react-native';
import { preparePieceNativePreview, createPieceNativeMeasurement, pieceNativeTypography, recordPieceNativeMeasurement } from '../../features/piece/pieceLayout';
import { inspectPieceText } from '../../features/piece/pieceRenderer';

export default class PieceVisualCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = { measurement: createPieceNativeMeasurement(preparePieceNativePreview(props.display)), width: 0 };
    this.active = true;
    this.textNodes = new Map();
  }

  static getDerivedStateFromProps(props, state) {
    const input = preparePieceNativePreview(props.display);
    return state.measurement.key === (input?.key ?? null) ? null : { measurement: createPieceNativeMeasurement(input) };
  }

  componentDidMount() { this.active = true; this.syncDeadline(); }
  componentDidUpdate() { this.syncDeadline(); this.inspectDrawing(); }
  componentWillUnmount() { this.active = false; this.clearDeadline(); this.inspection = null; this.textNodes.clear(); }

  clearDeadline = () => {
    if (this.deadline) clearTimeout(this.deadline.handle);
    this.deadline = null;
  };

  syncDeadline = () => {
    const input = preparePieceNativePreview(this.props.display);
    if (!this.active || !input || input.key !== this.state.measurement.key ||
        !['measuring', 'geometry_checked'].includes(this.state.measurement.phase)) {
      this.clearDeadline(); return;
    }
    if (this.deadline?.key === input.key) return;
    this.clearDeadline();
    const key = input.key;
    const deadline = { key, handle: null };
    this.deadline = deadline;
    deadline.handle = setTimeout(() => {
      if (this.deadline !== deadline) return;
      this.deadline = null;
      if (!this.active || preparePieceNativePreview(this.props.display)?.key !== key) return;
      const generation = this.state.measurement.generation;
      this.setState(previous => this.active && preparePieceNativePreview(this.props.display)?.key === key &&
        previous.measurement.key === key && previous.measurement.generation === generation &&
        ['measuring', 'geometry_checked'].includes(previous.measurement.phase)
        ? { measurement: { ...previous.measurement, phase: 'unavailable', blocks: {}, compositionHeight: null, reason: 'measurement_timeout' } }
        : null);
    }, 8000);
  };

  inspectDrawing = async () => {
    const snapshot = this.state.measurement, input = preparePieceNativePreview(this.props.display);
    if (!this.active || !input || input.key !== snapshot.key || snapshot.phase !== 'geometry_checked' || this.inspection?.snapshot === snapshot) return;
    const operation = { snapshot }; this.inspection = operation;
    const current = () => this.active && this.inspection === operation && this.state.measurement === snapshot &&
      preparePieceNativePreview(this.props.display)?.key === input.key;
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
      const overflow = evidence.some(result => result.overflow);
      this.setState(previous => current() && previous.measurement === snapshot ? { measurement: overflow ? snapshot.sizeIndex + 1 < input.sizes.length
        ? { ...createPieceNativeMeasurement(input), sizeIndex: snapshot.sizeIndex + 1 }
        : { ...snapshot, phase: 'unavailable', blocks: {}, compositionHeight: null, reason: 'native_ink_overflow' }
        : { ...snapshot, phase: 'native_checked', inspection: evidence } } : null);
    } catch {
      if (current()) this.setState(previous => current() && previous.measurement === snapshot
        ? { measurement: { ...snapshot, phase: 'unavailable', blocks: {}, compositionHeight: null, reason: 'native_measurement_unavailable' } } : null);
    }
  };

  measure = (ticket, index, kind, value) => {
    if (!this.active) return;
    const input = preparePieceNativePreview(this.props.display);
    this.setState(previous => {
      const measurement = recordPieceNativeMeasurement(input, previous.measurement, ticket, index, kind, value);
      return measurement === previous.measurement ? null : { measurement };
    });
  };

  render() {
    const input = preparePieceNativePreview(this.props.display), measurement = this.state.measurement;
    if (!input || input.key !== measurement.key) return null;
    const element = React.createElement, ready = measurement.phase === 'native_checked';
    const { fontSize, lineHeight, gap } = pieceNativeTypography(input, measurement.sizeIndex);
    const ticket = { key: input.key, sizeIndex: measurement.sizeIndex, generation: measurement.generation };
    const scale = this.state.width / input.width;
    const textProps = index => ({
      key: `${input.key}:${measurement.sizeIndex}:${index}`, testID: `piece-visual-block-${index}`,
      ref: value => {
        if (value) this.textNodes.set(index, { value, generation: measurement.generation });
        else if (this.textNodes.get(index)?.generation === measurement.generation) this.textNodes.delete(index);
      },
      collapsable: false,
      allowFontScaling: false, adjustsFontSizeToFit: false, accessible: false,
      android_hyphenationFrequency: 'none', textBreakStrategy: 'highQuality', lineBreakStrategyIOS: 'standard',
      onLayout: event => this.measure(ticket, index, 'box', event.nativeEvent?.layout),
      onTextLayout: event => this.measure(ticket, index, 'lines', event.nativeEvent?.lines),
    });
    return element(View, { testID: 'piece-visual-preview', style: { marginBottom: 20 },
      onLayout: event => {
        const width = event.nativeEvent?.layout?.width;
        if (this.active && Number.isFinite(width) && width > 0 && Math.min(width, 1080) !== this.state.width) {
          this.setState({ width: Math.min(width, 1080) });
        }
      } },
      element(Text, { style: { fontSize: 16, color: '#202020', marginBottom: 8 } }, '画像レイアウト（確認用）'),
      element(View, { style: { width: this.state.width, height: measurement.phase === 'unavailable' ? 0 : input.height * scale },
        accessible: false, accessibilityElementsHidden: true, importantForAccessibility: 'no-hide-descendants' },
        measurement.phase !== 'unavailable' && this.state.width > 0 ? element(View, {
          testID: 'piece-logical-canvas', pointerEvents: 'none',
          style: { position: 'absolute', width: input.width, height: input.height,
            left: (this.state.width - input.width) / 2, top: (input.height * scale - input.height) / 2,
            transform: [{ scale }], opacity: ready ? 1 : 0, backgroundColor: input.colors.canvas },
        },
        element(View, { style: { position: 'absolute', left: input.margin / 2, top: input.margin / 2,
          right: input.margin / 2, bottom: input.margin / 2, backgroundColor: input.colors.surface,
          borderColor: input.colors.border, borderWidth: 2 } }),
        element(View, { style: { position: 'absolute', left: input.margin, width: input.contentWidth,
          top: input.margin + (ready ? (input.contentHeight - measurement.compositionHeight) / 2 : 0) } },
          ...input.blocks.map((body, index) => element(Text, { ...textProps(index), style: {
            width: input.contentWidth, fontSize, lineHeight, fontWeight: '400', fontStyle: 'normal',
            letterSpacing: 0, includeFontPadding: false, textAlign: input.alignment, color: input.colors.text,
            marginBottom: index < input.blocks.length - 1 ? gap : 0,
          } }, body))),
        input.brandingMode === 'off' ? null : element(Text, { ...textProps(input.blocks.length), style: {
          position: 'absolute', left: input.margin, width: input.contentWidth,
          top: input.height - input.margin - input.brandingZone,
          fontSize: 28, lineHeight: 40, includeFontPadding: false, textAlign: 'center',
          color: input.colors.branding, opacity: input.brandingMode === 'required_subtle' ? 0.8 : 1,
        } }, 'Cocolon')) : null),
      element(Text, { testID: 'piece-visual-status', accessibilityLiveRegion: 'polite',
        style: { fontSize: 14, lineHeight: 22, color: '#494949', marginTop: 8 } },
        measurement.phase === 'unavailable' ? '画像レイアウトを確認できませんでした。本文は下で確認できます。' :
          ready ? '画像レイアウトの確認用表示です。保存・書き出しはまだ利用できません。' : '画像レイアウトを確認しています。'),
    );
  }
}
