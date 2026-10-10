/** Fixed logical canvas shared by native measurement and preview display.
 * No image file, export completion, missing-glyph proof or save permission.
 */
import React from 'react';
import { View, Text } from 'react-native';
import { preparePieceNativePreview, createPieceNativeMeasurement, pieceNativeTypography, recordPieceNativeMeasurement } from '../../features/piece/pieceLayout';

export default class PieceVisualCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = { measurement: createPieceNativeMeasurement(preparePieceNativePreview(props.display)), width: 0 };
    this.active = true;
  }

  static getDerivedStateFromProps(props, state) {
    const input = preparePieceNativePreview(props.display);
    return state.measurement.key === (input?.key ?? null) ? null : { measurement: createPieceNativeMeasurement(input) };
  }

  componentDidMount() { this.active = true; this.syncDeadline(); }
  componentDidUpdate() { this.syncDeadline(); }
  componentWillUnmount() { this.active = false; this.clearDeadline(); }

  clearDeadline = () => {
    if (this.deadline) clearTimeout(this.deadline.handle);
    this.deadline = null;
  };

  syncDeadline = () => {
    const input = preparePieceNativePreview(this.props.display);
    if (!this.active || !input || input.key !== this.state.measurement.key || this.state.measurement.phase !== 'measuring') {
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
      this.setState(previous => previous.measurement.key === key && previous.measurement.phase === 'measuring'
        ? { measurement: { ...previous.measurement, phase: 'unavailable', blocks: {}, compositionHeight: null, reason: 'measurement_timeout' } }
        : null);
    }, 8000);
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
    const element = React.createElement, ready = measurement.phase === 'geometry_checked';
    const { fontSize, lineHeight, gap } = pieceNativeTypography(input, measurement.sizeIndex);
    const ticket = { key: input.key, sizeIndex: measurement.sizeIndex, generation: measurement.generation };
    const scale = this.state.width / input.width;
    const textProps = index => ({
      key: `${input.key}:${measurement.sizeIndex}:${index}`, testID: `piece-visual-block-${index}`,
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
