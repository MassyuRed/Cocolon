/** Fixed logical canvas shared by native measurement and preview display.
 * No image file, export completion, missing-glyph proof or save permission.
 */
import React from 'react';
import { View, Text } from 'react-native';
import { PIECE_NATIVE_PREVIEW_VERSION, PIECE_NATIVE_PREVIEW_V5_VERSION, preparePieceNativeCard, createPieceNativeMeasurement, pieceNativeTypography, recordPieceNativeMeasurement } from '../../features/piece/pieceLayout';
import { inspectPieceText, inspectPieceSelectedLine, measurePieceCandidates } from '../../features/piece/pieceRenderer';
import { planPieceMeasuredRows } from '../../features/piece/pieceMeasuredWrap';

export default class PieceVisualCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = { measurement: createPieceNativeMeasurement(preparePieceNativeCard(props)),
      width: props.exportCanvas === true ? 1080 : 0, visualToken: props.display?.visualToken,
      binding: Object.freeze({}), bindingSerial: 0 };
    this.active = true;
    this.textNodes = new Map();
    this.probeReady = new Map();
    this.candidates = { key: this.state.measurement.key, binding: this.state.binding, entries: new Map() };
    this.saveFit = null;
  }

  static getDerivedStateFromProps(props, state) {
    const input = preparePieceNativeCard(props);
    return state.measurement.key === (input?.key ?? null) && state.visualToken === props.display?.visualToken
      ? null : { measurement: createPieceNativeMeasurement(input), visualToken: props.display?.visualToken,
        binding: Object.freeze({}), bindingSerial: state.bindingSerial + 1 };
  }

  componentDidMount() { this.active = true; this.syncDeadline(); this.syncSaveFit(); }
  componentDidUpdate() { this.syncDeadline(); this.syncSaveFit(); this.inspectDrawing(); }
  componentWillUnmount() { this.active = false; this.clearSaveFit(); this.clearDeadline(); this.inspection = null; this.planning = null; this.textNodes.clear(); this.probeReady.clear(); }

  bindingCurrent = binding => this.active && this.state.binding === binding &&
    this.state.visualToken === this.props.display?.visualToken;

  clearSaveFit = () => {
    const previous = this.saveFit;
    this.saveFit = null;
    if (!previous) return;
    previous.valid = false;
    try { previous.listener(null, previous.handle); } catch { /* Notification cannot restore a revoked handle. */ }
  };

  // Local evidence of this exact mounted drawing, never renderer admission.
  // Only lifecycle methods publish it; reading it performs no native work or
  // notification and adds nothing to a save request or a persistent record.
  syncSaveFit = () => {
    const listener = this.props.onSaveFitChange, display = this.props.display;
    if (this.saveFit && (listener !== this.saveFit.listener ||
        !this.saveFit.handle.isCurrent(display?.preview, display?.visualToken))) this.clearSaveFit();
    // Revocation can synchronously update the parent. Do not publish to the
    // listener or display captured before that notification changed props.
    if (this.saveFit || typeof listener !== 'function' || listener !== this.props.onSaveFitChange ||
        display !== this.props.display) return;
    const snapshot = this.state.measurement, binding = this.state.binding, operation = this.inspection;
    const node = this.canvasNode, token = display?.visualToken;
    if (!this.bindingCurrent(binding) || !token || !node || this.props.exportCanvas === true ||
        Object.prototype.hasOwnProperty.call(this.props, 'savedRecord') || snapshot.phase !== 'native_checked' ||
        !snapshot.plan || !operation?.nodes || operation.evidence !== snapshot.inspection ||
        operation.snapshot.plan !== snapshot.plan || operation.snapshot.generation !== snapshot.generation ||
        operation.snapshot.blocks !== snapshot.blocks) return;
    const input = preparePieceNativeCard(this.props);
    if (!input || input.key !== snapshot.key || display?.preview?.renderer_version !== input.candidateProfile) return;
    const plan = snapshot.plan, inspection = snapshot.inspection, generation = snapshot.generation;
    const record = { valid: true, listener, handle: null };
    record.handle = Object.freeze({ isCurrent: (preview, displayToken) => {
      try {
        if (!record.valid || this.props.onSaveFitChange !== listener || !this.bindingCurrent(binding) || this.state.measurement !== snapshot ||
            this.inspection !== operation || snapshot.plan !== plan || snapshot.inspection !== inspection ||
            snapshot.generation !== generation || operation.evidence !== inspection || this.canvasNode !== node ||
            this.props.exportCanvas === true || Object.prototype.hasOwnProperty.call(this.props, 'savedRecord') ||
            this.props.display?.visualToken !== token || displayToken !== token ||
            preview?.renderer_version !== input.candidateProfile ||
            operation.nodes.some((value, index) => this.textNodes.get(index)?.value !== value ||
              this.textNodes.get(index)?.generation !== snapshot.generation)) return false;
        const current = preparePieceNativeCard(this.props);
        const requested = preparePieceNativeCard({ display: { phase: 'received', preview, visualToken: displayToken } });
        return current?.key === input.key && requested?.key === input.key;
      } catch { return false; }
    } });
    if (!record.handle.isCurrent(display.preview, token)) return;
    this.saveFit = record;
    try { listener(record.handle, null); }
    catch { if (this.saveFit === record) this.saveFit = null; record.valid = false; }
  };

  clearDeadline = () => {
    if (this.deadline) clearTimeout(this.deadline.handle);
    this.deadline = null;
    this.candidates = null;
  };

  syncDeadline = () => {
    const input = preparePieceNativeCard(this.props);
    if (!this.bindingCurrent(this.state.binding) || !input || input.key !== this.state.measurement.key ||
        !['planning', 'measuring', 'geometry_checked'].includes(this.state.measurement.phase)) {
      this.clearDeadline(); return;
    }
    if (this.deadline?.key === input.key && this.deadline.binding === this.state.binding) return;
    const batch = this.candidates;
    this.clearDeadline();
    const key = input.key, binding = this.state.binding;
    const deadline = { key, binding, handle: null, expiresAt: Date.now() + 8000 };
    this.deadline = deadline;
    // Separate from the per-font/drawing generation. A -> B -> A must create
    // a new batch even when the artifact key eventually returns to A.
    this.candidates = batch?.key === key && batch.binding === binding ? batch : { key, binding, entries: new Map() };
    deadline.handle = setTimeout(() => {
      if (this.deadline !== deadline) return;
      this.deadline = null;
      if (!this.bindingCurrent(binding) || preparePieceNativeCard(this.props)?.key !== key) return;
      const generation = this.state.measurement.generation;
      this.setState(previous => this.bindingCurrent(binding) && preparePieceNativeCard(this.props)?.key === key &&
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

  candidatesCurrent = batch => batch && this.bindingCurrent(batch.binding) && this.candidates === batch &&
    preparePieceNativeCard(this.props)?.key === batch.key && this.deadline &&
    Date.now() < this.deadline.expiresAt && this.state.measurement.phase !== 'unavailable';

  measureCandidateBlocks = (input, sizeIndex, nodes) => Promise.all(input.blocks.map((text, index) =>
    input.candidateProfile === PIECE_NATIVE_PREVIEW_VERSION
      ? measurePieceCandidates(nodes[index], text, input.sizes[sizeIndex])
      : measurePieceCandidates(nodes[index], text, input.sizes[sizeIndex],
        input.candidateProfile === PIECE_NATIVE_PREVIEW_V5_VERSION ? { candidateProfile: input.candidateProfile }
          : { candidateProfile: input.candidateProfile, contentWidth: input.contentWidth })))
    // Speculation may fail after a larger font has already succeeded. Handle
    // it immediately; only adoption of this font may make the card unavailable.
    .then(measurements => ({ measurements }), () => ({ failed: true }));

  prefetchCandidates = () => {
    const batch = this.candidates, snapshot = this.state.measurement, input = preparePieceNativeCard(this.props);
    if (!this.candidatesCurrent(batch) || !input || snapshot.phase !== 'planning' ||
        this.planning?.snapshot !== snapshot) return;
    const entry = batch.entries.get(snapshot.sizeIndex + 1);
    if (!entry || entry.promise || input.blocks.some((_, index) => !entry.ready.has(index) || !entry.nodes.has(index))) return;
    entry.promise = this.measureCandidateBlocks(input, snapshot.sizeIndex + 1,
      input.blocks.map((_, index) => entry.nodes.get(index)));
  };

  planDrawing = async () => {
    const snapshot = this.state.measurement, input = preparePieceNativeCard(this.props);
    if (!this.active || !input || input.key !== snapshot.key || snapshot.phase !== 'planning' ||
        this.planning?.snapshot === snapshot || input.blocks.some((_, i) => this.probeReady.get(i) !== snapshot.generation)) return;
    const operation = { snapshot }, binding = this.state.binding; this.planning = operation;
    const current = () => this.bindingCurrent(binding) && this.planning === operation && this.state.measurement === snapshot &&
      preparePieceNativeCard(this.props)?.key === input.key && this.deadline && Date.now() < this.deadline.expiresAt;
    try {
      const batch = this.candidates;
      if (!current() || !this.candidatesCurrent(batch)) return;
      const prefetched = batch.entries.get(snapshot.sizeIndex);
      const pending = prefetched?.promise || this.measureCandidateBlocks(input, snapshot.sizeIndex,
        input.blocks.map((_, index) => {
          const node = this.textNodes.get(index);
          if (node?.generation !== snapshot.generation) throw new Error('PIECE_NATIVE_MEASUREMENT_UNAVAILABLE');
          return node.value;
        }));
      // Enqueue every current paragraph before any speculative next font.
      this.prefetchCandidates();
      const { measurements, failed } = await pending;
      if (!current()) return;
      if (failed) throw new Error('PIECE_NATIVE_MEASUREMENT_UNAVAILABLE');
      batch.entries.delete(snapshot.sizeIndex);
      const plan = planPieceMeasuredRows(input, snapshot.sizeIndex, measurements);
      if (!current()) return;
      this.setState(previous => current() && previous.measurement === snapshot ? {
        measurement: plan ? { ...snapshot, phase: 'measuring', plan, generation: Object.freeze({}), blocks: {} }
          : snapshot.sizeIndex + 1 < input.sizes.length ? { ...createPieceNativeMeasurement(input), sizeIndex: snapshot.sizeIndex + 1 }
          : { ...snapshot, phase: 'unavailable', reason: input.candidateProfile === PIECE_NATIVE_PREVIEW_V5_VERSION
            ? 'layout_search_unavailable' : 'font_floor_overflow' },
      } : null);
    } catch {
      if (current()) this.setState(previous => current() && previous.measurement === snapshot
        ? { measurement: { ...snapshot, phase: 'unavailable', reason: 'native_candidates_unavailable' } } : null);
    }
  };

  inspectDrawing = async () => {
    const snapshot = this.state.measurement, raw = preparePieceNativeCard(this.props), input = raw && this.drawingInput(raw, snapshot);
    if (!this.active || !input || input.key !== snapshot.key || snapshot.phase !== 'geometry_checked' || this.inspection?.snapshot === snapshot) return;
    const operation = { snapshot }, binding = this.state.binding; this.inspection = operation;
    const exploration = input.candidateProfile === PIECE_NATIVE_PREVIEW_V5_VERSION;
    const current = () => this.bindingCurrent(binding) && this.inspection === operation && this.state.measurement === snapshot &&
      preparePieceNativeCard(this.props)?.key === input.key && this.deadline && Date.now() < this.deadline.expiresAt &&
      (!exploration || !operation.nodes || operation.nodes.every((node, index) =>
        this.textNodes.get(index)?.value === node && this.textNodes.get(index)?.generation === snapshot.generation));
    try {
      const count = input.blocks.length + (input.brandingMode === 'off' ? 0 : 1);
      // Freeze every target before dispatch. These are read-only UI-queue
      // inspections of one generation; awaiting each row separately forces
      // another native bridge round trip before the next row can even start.
      const targets = Array.from({ length: count }, (_, index) => {
        const node = this.textNodes.get(index);
        if (node?.generation !== snapshot.generation) throw new Error('PIECE_NATIVE_MEASUREMENT_UNAVAILABLE');
        return { node: node.value, expected: {
          text: index < input.blocks.length ? input.blocks[index] : 'Cocolon',
          fontSize: index < input.blocks.length ? input.sizes[snapshot.sizeIndex] : 28,
          box: snapshot.blocks[index].box, lineEnds: snapshot.blocks[index].lines.map(line => line.end),
        } };
      });
      if (!current()) return;
      operation.nodes = Object.freeze(targets.map(target => target.node));
      // Promise.all retains row order and observes every rejection. A single
      // missing/invalid result still rejects the entire image, never a subset.
      const inspector = exploration ? inspectPieceSelectedLine : inspectPieceText;
      const evidence = await Promise.all(targets.map(target => inspector(target.node, target.expected)));
      if (!current()) return;
      operation.evidence = evidence;
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
        rowOffsets.some(row => row.width > input.contentWidth || row.height > lineHeight) ||
        exploration && evidence.some((result, index) => {
          const [advance, left, top, right, bottom] = result.independentMetrics;
          return Math.max(advance, right) - Math.min(0, left) > input.contentWidth ||
            bottom - top > (index < input.blocks.length ? lineHeight : 40);
        });
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
    if (!this.bindingCurrent(this.state.binding)) return;
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
    if (!input || input.key !== measurement.key || this.state.visualToken !== this.props.display?.visualToken) return Object.prototype.hasOwnProperty.call(this.props, 'savedRecord')
      ? React.createElement(Text, { testID: 'piece-visual-unavailable', style: { color: '#494949', fontSize: 14, lineHeight: 22, marginBottom: 12 } },
        'このPieceの画像レイアウトは現在確認できません。本文は下で確認できます。') : null;
    const element = React.createElement, ready = measurement.phase === 'native_checked', planning = measurement.phase === 'planning';
    const { fontSize, lineHeight, gap } = pieceNativeTypography(input, measurement.sizeIndex);
    // Reinspection revokes visibility, not this generation's existing placement.
    // Moving the rows back to zero would trigger another layout/inspection cycle.
    const positioned = !!measurement.rowOffsets;
    const ticket = { key: input.key, sizeIndex: measurement.sizeIndex, generation: measurement.generation };
    const scale = this.state.width / input.width;
    if (planning && (this.candidates?.key !== input.key || this.candidates.binding !== this.state.binding)) {
      this.candidates = { key: input.key, binding: this.state.binding, entries: new Map() };
    }
    const batch = this.candidates, nextSize = measurement.sizeIndex + 1;
    const nextTypography = nextSize < raw.sizes.length ? pieceNativeTypography(raw, nextSize) : null;
    let nextEntry;
    if (planning && batch?.key === input.key && nextSize < raw.sizes.length) {
      nextEntry = batch.entries.get(nextSize);
      if (!nextEntry) {
        nextEntry = { nodes: new Map(), ready: new Set(), promise: null };
        batch.entries.set(nextSize, nextEntry);
      }
    }
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
          // A token-only replacement also needs new native layout callbacks.
          // Remount the measurement subtree once per binding, not per font.
          key: this.state.bindingSerial,
          testID: 'piece-logical-canvas', pointerEvents: 'none', collapsable: false,
          ref: node => { this.canvasNode = node; },
          style: { position: 'absolute', width: input.width, height: input.height,
            left: (this.state.width - input.width) / 2, top: (input.height * scale - input.height) / 2,
            transform: [{ scale }], opacity: ready ? 1 : 0, backgroundColor: input.colors.canvas },
        },
        nextEntry ? element(View, { key: `prefetch:${input.key}:${nextSize}`, pointerEvents: 'none',
          style: { position: 'absolute', left: 0, top: 0, opacity: 0 },
          accessible: false, accessibilityElementsHidden: true, importantForAccessibility: 'no-hide-descendants' },
          ...raw.blocks.map((body, index) => element(Text, {
            key: index, testID: `piece-prefetch-${nextSize}-block-${index}`,
            ref: value => {
              if (value) nextEntry.nodes.set(index, value);
              else nextEntry.nodes.delete(index);
            },
            collapsable: false, allowFontScaling: false, adjustsFontSizeToFit: false, accessible: false,
            android_hyphenationFrequency: 'none', textBreakStrategy: 'highQuality', lineBreakStrategyIOS: 'standard',
            onLayout: () => {
              if (!this.candidatesCurrent(batch) || batch.entries.get(nextSize) !== nextEntry) return;
              nextEntry.ready.add(index); this.prefetchCandidates();
            },
            style: { width: raw.contentWidth, fontSize: nextTypography.fontSize, lineHeight: nextTypography.lineHeight,
              fontWeight: '400', fontStyle: 'normal', letterSpacing: 0, includeFontPadding: false, textAlign: 'left', color: raw.colors.text },
          }, body))) : null,
        element(View, { style: { position: 'absolute', left: input.margin / 2, top: input.margin / 2,
          right: input.margin / 2, bottom: input.margin / 2, backgroundColor: input.colors.surface,
          borderColor: input.colors.border, borderWidth: 2 } }),
        element(View, { style: { position: 'absolute', left: input.margin, width: input.contentWidth,
          top: input.margin + (positioned ? (input.contentHeight - measurement.plan.totalHeight) / 2 : 0) } },
          ...input.blocks.map((body, index) => element(View, {
            key: `row:${index}`, style: { height: planning ? undefined : lineHeight, marginBottom: input.rowGaps?.[index] ?? (index < input.blocks.length - 1 ? gap : 0) },
          }, element(Text, { ...textProps(index), style: {
            width: input.contentWidth, fontSize, lineHeight, fontWeight: '400', fontStyle: 'normal',
            letterSpacing: 0, includeFontPadding: false, textAlign: 'left', color: input.colors.text,
            position: planning ? 'relative' : 'absolute', left: positioned ? measurement.rowOffsets[index].x : 0,
            top: positioned ? measurement.rowOffsets[index].y : 0,
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
            ? '保存済みPieceの画像レイアウトの確認用表示です。'
            : '画像レイアウトの確認用表示です。'
          : '画像レイアウトを確認しています。'),
    );
  }
}
