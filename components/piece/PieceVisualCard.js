/** Fixed logical canvas shared by native measurement and preview display.
 * No image file, export completion, missing-glyph proof or save permission.
 */
import React from 'react';
import { View, Text } from 'react-native';
import { PIECE_NATIVE_PREVIEW_VERSION, PIECE_NATIVE_PREVIEW_V5_VERSION, PIECE_NATIVE_PREVIEW_V6_VERSION, PIECE_NATIVE_PREVIEW_V7_VERSION, PIECE_NATIVE_PREVIEW_V8_VERSION, PIECE_NATIVE_PREVIEW_V9_VERSION, PIECE_NATIVE_PREVIEW_CONTAINMENT_V1_VERSION, PIECE_NATIVE_PREVIEW_CONTAINMENT_V2_VERSION, PIECE_BITMAP_PREVIEW_VERSION, preparePieceNativeCard, createPieceNativeMeasurement, pieceNativeTypography, recordPieceNativeMeasurement } from '../../features/piece/pieceLayout';
import { inspectPieceText, inspectPieceSelectedLine, inspectPieceSelectedLineV2, inspectPieceSelectedLineV3, inspectPieceSelectedLineV4, pieceContainmentV2DeadlineCurrent, measurePieceCandidates, pieceBitmapNativeView, pieceBitmapDeadlineCurrent, renderPieceBitmapCanvas, releasePieceBitmapCanvas } from '../../features/piece/pieceRenderer';
import { planPieceMeasuredRows } from '../../features/piece/pieceMeasuredWrap';

let pieceBitmapBindingSerial = 0;

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
    this.placementEpoch = 0;
    this.placementLayouts = new Map();
    this.textRefs = new Map();
    this.bitmapBindings = new WeakMap();
  }

  static getDerivedStateFromProps(props, state) {
    const input = preparePieceNativeCard(props);
    return state.measurement.key === (input?.key ?? null) && state.visualToken === props.display?.visualToken
      ? null : { measurement: createPieceNativeMeasurement(input), visualToken: props.display?.visualToken,
        binding: Object.freeze({}), bindingSerial: state.bindingSerial + 1 };
  }

  componentDidMount() { this.active = true; this.syncDeadline(); this.syncSaveFit(); }
  componentDidUpdate() { this.syncBitmapArtifact(); this.syncDeadline(); this.syncSaveFit(); this.inspectDrawing(); }
  componentWillUnmount() { this.active = false; this.clearBitmapArtifact(); this.clearSaveFit(); this.clearDeadline(); this.inspection = null; this.planning = null; this.textNodes.clear(); this.probeReady.clear(); this.placementLayouts.clear(); this.textRefs.clear(); }

  bitmapBindingFor = generation => {
    if (!this.bitmapBindings.has(generation)) this.bitmapBindings.set(generation, `piece-bitmap-${++pieceBitmapBindingSerial}`);
    return this.bitmapBindings.get(generation);
  };
  clearBitmapArtifact = () => {
    const old = this.bitmapArtifact; this.bitmapArtifact = null;
    if (old) releasePieceBitmapCanvas(old.node, old.token);
  };
  syncBitmapArtifact = () => {
    const old = this.bitmapArtifact;
    if (old && (!this.bindingCurrent(old.binding) || this.state.measurement.generation !== old.generation ||
        this.state.measurement.phase !== 'native_checked' || this.bitmapNode !== old.node ||
        preparePieceNativeCard(this.props)?.key !== old.key)) this.clearBitmapArtifact();
  };
  setBitmapNode = node => {
    if (this.bitmapNode === node) return;
    const old = this.bitmapNode; this.bitmapNode = node;
    if (old) { this.clearBitmapArtifact(); this.invalidatePlacement(); }
  };
  bitmapInvalidated = event => {
    const value = event?.nativeEvent, snapshot = this.state.measurement;
    if (value?.binding_token === this.bitmapBindingFor(snapshot.generation) &&
        preparePieceNativeCard(this.props)?.candidateProfile === PIECE_BITMAP_PREVIEW_VERSION) this.invalidatePlacement('native_bitmap_invalidated');
  };

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
    if (preparePieceNativeCard(this.props)?.candidateProfile === PIECE_BITMAP_PREVIEW_VERSION) { this.syncBitmapSaveFit(); return; }
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
    const pixels = [PIECE_NATIVE_PREVIEW_V9_VERSION, PIECE_NATIVE_PREVIEW_CONTAINMENT_V1_VERSION, PIECE_NATIVE_PREVIEW_CONTAINMENT_V2_VERSION].includes(input.candidateProfile);
    if (pixels && (operation.placementEpoch !== this.placementEpoch || operation.canvas !== node ||
        snapshot.inspection.some(row => row.stage !== 'placed') || !this.deadline ||
        !this.deadlineCurrent())) {
      this.invalidatePlacement('measurement_timeout'); return;
    }
    const plan = snapshot.plan, inspection = snapshot.inspection, generation = snapshot.generation;
    const fitDeadline = this.deadline;
    const record = { valid: true, listener, handle: null };
    record.handle = Object.freeze({ isCurrent: (preview, displayToken) => {
      try {
        if (!record.valid || this.props.onSaveFitChange !== listener || !this.bindingCurrent(binding) || this.state.measurement !== snapshot ||
            this.inspection !== operation || input.candidateProfile === PIECE_NATIVE_PREVIEW_CONTAINMENT_V1_VERSION &&
              (!fitDeadline || this.deadline !== fitDeadline || Date.now() >= fitDeadline.expiresAt) ||
            input.candidateProfile === PIECE_NATIVE_PREVIEW_CONTAINMENT_V2_VERSION &&
              (!fitDeadline || this.deadline !== fitDeadline || !this.deadlineCurrent(fitDeadline)) ||
            pixels && (operation.placementEpoch !== this.placementEpoch || operation.canvas !== this.canvasNode) ||
            snapshot.plan !== plan || snapshot.inspection !== inspection ||
            snapshot.generation !== generation || operation.evidence !== inspection || this.canvasNode !== node ||
            this.props.exportCanvas === true || Object.prototype.hasOwnProperty.call(this.props, 'savedRecord') ||
            this.props.display?.visualToken !== token || displayToken !== token ||
            preview?.renderer_version !== input.candidateProfile ||
            operation.nodes.some((value, index) => this.textNodes.get(index)?.value !== value ||
              this.textNodes.get(index)?.generation !== snapshot.generation)) return false;
        const current = preparePieceNativeCard(this.props);
        const requested = preparePieceNativeCard({ display: { phase: 'received', preview, visualToken: displayToken } });
        return current?.key === input.key && requested?.key === input.key &&
          (input.candidateProfile !== PIECE_NATIVE_PREVIEW_CONTAINMENT_V2_VERSION ||
            this.deadline === fitDeadline && this.deadlineCurrent(fitDeadline));
      } catch { return false; }
    } });
    if (!record.handle.isCurrent(display.preview, token)) return;
    if (pixels && (!this.deadline || !this.deadlineCurrent())) {
      record.valid = false; this.invalidatePlacement('measurement_timeout'); return;
    }
    this.saveFit = record;
    try { listener(record.handle, null); }
    catch { if (this.saveFit === record) this.saveFit = null; record.valid = false; }
  };

  syncBitmapSaveFit = () => {
    const listener = this.props.onSaveFitChange, display = this.props.display;
    if (this.saveFit && (listener !== this.saveFit.listener || !this.saveFit.handle.isCurrent(display?.preview, display?.visualToken))) this.clearSaveFit();
    if (this.saveFit || typeof listener !== 'function' || this.props.exportCanvas === true || this.props.savedRecord) return;
    const snapshot = this.state.measurement, binding = this.state.binding, operation = this.inspection, artifact = this.bitmapArtifact;
    const input = preparePieceNativeCard(this.props), token = display?.visualToken;
    if (!input || !token || !artifact || !operation?.bitmap || operation.evidence !== snapshot.inspection ||
        !this.bindingCurrent(binding) || snapshot.phase !== 'native_checked' || !pieceBitmapDeadlineCurrent(this.deadline)) return;
    const deadline = this.deadline, record = { valid: true, listener, handle: null };
    record.handle = Object.freeze({ isCurrent: (preview, visualToken) => {
      try {
        if (!record.valid || this.props.onSaveFitChange !== listener || !this.bindingCurrent(binding) ||
            this.state.measurement !== snapshot || this.inspection !== operation || this.bitmapArtifact !== artifact ||
            this.bitmapNode !== artifact.node || this.canvasNode !== operation.canvas ||
            this.deadline !== deadline || !pieceBitmapDeadlineCurrent(deadline) || visualToken !== token ||
            this.props.display?.visualToken !== token || this.props.exportCanvas === true || this.props.savedRecord ||
            operation.nodes.some((node, i) => this.textNodes.get(i)?.value !== node || this.textNodes.get(i)?.generation !== snapshot.generation)) return false;
        const current = preparePieceNativeCard(this.props), requested = preparePieceNativeCard({ display: { phase: 'received', preview, visualToken } });
        return current?.key === input.key && requested?.key === input.key && preview?.renderer_version === input.rendererVersion;
      } catch { return false; }
    } });
    if (!record.handle.isCurrent(display.preview, token)) return;
    this.saveFit = record;
    try { listener(record.handle, null); } catch { record.valid = false; if (this.saveFit === record) this.saveFit = null; }
  };

  deadlineCurrent = (deadline = this.deadline) => !!deadline &&
    (preparePieceNativeCard(this.props)?.candidateProfile === PIECE_BITMAP_PREVIEW_VERSION ? pieceBitmapDeadlineCurrent(deadline)
    : this.props.display?.preview?.renderer_version === PIECE_NATIVE_PREVIEW_CONTAINMENT_V2_VERSION
      ? pieceContainmentV2DeadlineCurrent(deadline) : Date.now() < deadline.expiresAt);

  clearDeadline = () => {
    if (this.deadline) clearTimeout(this.deadline.handle);
    this.deadline = null;
    this.candidates = null;
  };

  syncDeadline = () => {
    const phase = this.state.measurement.phase;
    if (!this.bindingCurrent(this.state.binding) ||
        ![PIECE_BITMAP_PREVIEW_VERSION, PIECE_NATIVE_PREVIEW_V9_VERSION, PIECE_NATIVE_PREVIEW_CONTAINMENT_V1_VERSION, PIECE_NATIVE_PREVIEW_CONTAINMENT_V2_VERSION].includes(preparePieceNativeCard(this.props)?.candidateProfile) &&
        !['planning', 'measuring', 'geometry_checked'].includes(phase)) {
      this.clearDeadline(); return;
    }
    const input = preparePieceNativeCard(this.props);
    const pixels = [PIECE_BITMAP_PREVIEW_VERSION, PIECE_NATIVE_PREVIEW_V9_VERSION, PIECE_NATIVE_PREVIEW_CONTAINMENT_V1_VERSION, PIECE_NATIVE_PREVIEW_CONTAINMENT_V2_VERSION].includes(input?.candidateProfile);
    if (!this.bindingCurrent(this.state.binding) || !input || input.key !== this.state.measurement.key) {
      this.clearDeadline(); return;
    }
    if (!['planning', 'measuring', 'geometry_checked', ...(pixels ? ['positioning'] : [])].includes(phase)) {
      if (pixels && this.deadline?.key === input.key && this.deadline.binding === this.state.binding) {
        // Keep the original construction expiry; never start a new window.
        // A completed saved image has no save fit and stays readable until its
        // binding or native configuration changes. Preview fit still expires.
        if (input.candidateProfile !== PIECE_BITMAP_PREVIEW_VERSION ||
            this.props.savedRecord && phase === 'native_checked' && this.bitmapArtifact) {
          clearTimeout(this.deadline.handle); this.deadline.handle = null;
        }
        this.candidates = null;
      } else this.clearDeadline();
      return;
    }
    if (this.deadline?.key === input.key && this.deadline.binding === this.state.binding) {
      if (pixels && !this.deadlineCurrent()) this.invalidatePlacement('measurement_timeout');
      return;
    }
    const batch = this.candidates;
    this.clearDeadline();
    const key = input.key, binding = this.state.binding;
    const startedAt = Date.now();
    const deadline = { key, binding, handle: null, expiresAt: startedAt + 8000,
      ...([PIECE_NATIVE_PREVIEW_CONTAINMENT_V2_VERSION, PIECE_BITMAP_PREVIEW_VERSION].includes(input.candidateProfile) ? {
        profile: input.candidateProfile, startedAt,
        monotonicStartedAt: typeof globalThis.performance?.now === 'function' ? globalThis.performance.now() : NaN,
      } : {}) };
    this.deadline = deadline;
    if ([PIECE_NATIVE_PREVIEW_CONTAINMENT_V2_VERSION, PIECE_BITMAP_PREVIEW_VERSION].includes(input.candidateProfile) && !this.deadlineCurrent(deadline)) {
      this.invalidatePlacement('measurement_timeout'); return;
    }
    this.candidates = batch?.key === key && batch.binding === binding ? batch : { key, binding, entries: new Map() };
    deadline.handle = setTimeout(() => {
      if (this.deadline !== deadline || deadline.handle === null) return;
      if (input.candidateProfile === PIECE_BITMAP_PREVIEW_VERSION) { this.invalidatePlacement('measurement_timeout'); return; }
      if (!pixels) this.deadline = null;
      if (!this.bindingCurrent(binding) || preparePieceNativeCard(this.props)?.key !== key) return;
      const generation = this.state.measurement.generation;
      this.setState(previous => this.bindingCurrent(binding) && preparePieceNativeCard(this.props)?.key === key &&
        previous.measurement.key === key && previous.measurement.generation === generation &&
        ['planning', 'measuring', 'geometry_checked', ...(pixels ? ['positioning'] : [])].includes(previous.measurement.phase)
        ? { measurement: { ...previous.measurement, phase: 'unavailable', blocks: {}, compositionHeight: null, reason: 'measurement_timeout' } }
        : null);
    }, 8000);
  };

  invalidatePlacement = (reason = 'native_placement_unstable') => {
    const snapshot = this.state.measurement, binding = this.state.binding;
    this.placementEpoch++;
    this.clearSaveFit();
    this.clearBitmapArtifact();
    if (!this.bindingCurrent(binding) || this.state.measurement !== snapshot || snapshot.phase === 'unavailable') return;
    this.setState(previous => this.bindingCurrent(binding) && previous.measurement === snapshot ? { measurement: {
      ...snapshot, phase: 'unavailable', reason, inspection: null,
    } } : null);
  };

  notePlacement = (ticket, key, value) => {
    const input = preparePieceNativeCard(this.props), snapshot = this.state.measurement;
    if (![PIECE_NATIVE_PREVIEW_V9_VERSION, PIECE_NATIVE_PREVIEW_CONTAINMENT_V1_VERSION, PIECE_NATIVE_PREVIEW_CONTAINMENT_V2_VERSION].includes(input?.candidateProfile) || !this.active ||
        ticket.key !== snapshot.key || ticket.generation !== snapshot.generation || snapshot.phase === 'unavailable') return;
    if (!value || !['x', 'y', 'width', 'height'].every(k => Number.isFinite(value[k]))) {
      this.invalidatePlacement(); return;
    }
    const rect = ['x', 'y', 'width', 'height'].map(k => value[k]), old = this.placementLayouts.get(key);
    if (old?.generation === ticket.generation && rect.every((n, i) => n === old.rect[i])) return;
    this.placementLayouts.set(key, { generation: ticket.generation, rect });
    this.placementEpoch++;
    // Before dispatch, layout callbacks can settle during the two animation
    // frames. Once dispatched, any new geometry fails closed; no offset loop.
    if (snapshot.phase === 'native_checked' || this.inspection?.dispatched && this.inspection.stage === 'placed' &&
        this.inspection.snapshot.generation === snapshot.generation && this.inspection.snapshot.key === snapshot.key) {
      this.invalidatePlacement();
    }
  };

  setCanvasNode = node => {
    if (node === this.canvasNode) return;
    const changed = !!this.canvasNode;
    this.canvasNode = node; this.placementEpoch++;
    if (changed && [PIECE_BITMAP_PREVIEW_VERSION, PIECE_NATIVE_PREVIEW_V9_VERSION, PIECE_NATIVE_PREVIEW_CONTAINMENT_V1_VERSION, PIECE_NATIVE_PREVIEW_CONTAINMENT_V2_VERSION].includes(preparePieceNativeCard(this.props)?.candidateProfile) &&
        ['positioning', 'native_checked'].includes(this.state.measurement.phase)) this.invalidatePlacement();
  };

  textRef = (index, generation) => {
    const old = this.textRefs.get(index);
    if (old?.generation === generation) return old.callback;
    const callback = value => {
      const previous = this.textNodes.get(index);
      if (value) this.textNodes.set(index, { value, generation });
      else if (previous?.generation === generation) this.textNodes.delete(index);
      if (previous?.generation === generation && previous.value !== value &&
          [PIECE_BITMAP_PREVIEW_VERSION, PIECE_NATIVE_PREVIEW_V9_VERSION, PIECE_NATIVE_PREVIEW_CONTAINMENT_V1_VERSION, PIECE_NATIVE_PREVIEW_CONTAINMENT_V2_VERSION].includes(preparePieceNativeCard(this.props)?.candidateProfile) &&
          this.state.measurement.generation === generation &&
          ['positioning', 'native_checked'].includes(this.state.measurement.phase)) this.invalidatePlacement();
    };
    this.textRefs.set(index, { generation, callback });
    return callback;
  };

  placedFrame = (input, snapshot, index) => {
    const box = snapshot.blocks[index].box;
    if (index === input.blocks.length) return [input.margin, input.height - input.margin - input.brandingZone, box.width, box.height];
    const { lineHeight } = pieceNativeTypography(input, snapshot.sizeIndex);
    const top = input.margin + (input.contentHeight - snapshot.plan.totalHeight) / 2 +
      index * lineHeight + input.rowGaps.slice(0, index).reduce((sum, value) => sum + value, 0);
    return [snapshot.rowOffsets[index].x, top + snapshot.rowOffsets[index].y, box.width, box.height];
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
    this.deadlineCurrent() && this.state.measurement.phase !== 'unavailable';

  measureCandidateBlocks = (input, sizeIndex, nodes) => Promise.all(input.blocks.map((text, index) =>
    input.candidateProfile === PIECE_NATIVE_PREVIEW_VERSION
      ? measurePieceCandidates(nodes[index], text, input.sizes[sizeIndex])
      : measurePieceCandidates(nodes[index], text, input.sizes[sizeIndex],
        [PIECE_BITMAP_PREVIEW_VERSION, PIECE_NATIVE_PREVIEW_V5_VERSION, PIECE_NATIVE_PREVIEW_V6_VERSION, PIECE_NATIVE_PREVIEW_V7_VERSION, PIECE_NATIVE_PREVIEW_V8_VERSION, PIECE_NATIVE_PREVIEW_V9_VERSION, PIECE_NATIVE_PREVIEW_CONTAINMENT_V1_VERSION, PIECE_NATIVE_PREVIEW_CONTAINMENT_V2_VERSION].includes(input.candidateProfile)
          ? { candidateProfile: PIECE_NATIVE_PREVIEW_V5_VERSION }
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
      preparePieceNativeCard(this.props)?.key === input.key && this.deadline && this.deadlineCurrent();
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
          : { ...snapshot, phase: 'unavailable', reason: [PIECE_BITMAP_PREVIEW_VERSION, PIECE_NATIVE_PREVIEW_V5_VERSION, PIECE_NATIVE_PREVIEW_V6_VERSION, PIECE_NATIVE_PREVIEW_V7_VERSION, PIECE_NATIVE_PREVIEW_V8_VERSION, PIECE_NATIVE_PREVIEW_V9_VERSION, PIECE_NATIVE_PREVIEW_CONTAINMENT_V1_VERSION, PIECE_NATIVE_PREVIEW_CONTAINMENT_V2_VERSION].includes(input.candidateProfile)
            ? 'layout_search_unavailable' : 'font_floor_overflow' },
      } : null);
    } catch {
      if (current()) this.setState(previous => current() && previous.measurement === snapshot
        ? { measurement: { ...snapshot, phase: 'unavailable', reason: 'native_candidates_unavailable' } } : null);
    }
  };

  inspectBitmapDrawing = async () => {
    const snapshot = this.state.measurement, raw = preparePieceNativeCard(this.props);
    if (!raw || raw.candidateProfile !== PIECE_BITMAP_PREVIEW_VERSION || snapshot.phase !== 'geometry_checked' ||
        !snapshot.plan || this.inspection?.snapshot === snapshot || !this.bitmapNode) return;
    const input = this.drawingInput(raw, snapshot), binding = this.state.binding, deadline = this.deadline;
    const operation = { bitmap: true, snapshot, canvas: this.canvasNode, bitmapNode: this.bitmapNode,
      bindingToken: this.bitmapBindingFor(snapshot.generation) };
    this.inspection = operation;
    const count = input.blocks.length + (input.brandingMode === 'off' ? 0 : 1);
    const current = () => this.bindingCurrent(binding) && this.inspection === operation && this.state.measurement === snapshot &&
      preparePieceNativeCard(this.props)?.key === input.key && this.deadline === deadline && pieceBitmapDeadlineCurrent(deadline) &&
      this.canvasNode === operation.canvas && this.bitmapNode === operation.bitmapNode &&
      (!operation.nodes || operation.nodes.every((node, index) => this.textNodes.get(index)?.value === node &&
        this.textNodes.get(index)?.generation === snapshot.generation));
    try {
      await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
      if (!current()) return;
      const rows = Array.from({ length: count }, (_, index) => {
        const source = this.textNodes.get(index), brand = index === input.blocks.length;
        if (!source || source.generation !== snapshot.generation) throw new Error('PIECE_NATIVE_MEASUREMENT_UNAVAILABLE');
        return { node: source.value, text: brand ? 'Cocolon' : input.blocks[index],
          fontSize: brand ? 28 : input.sizes[snapshot.sizeIndex], box: snapshot.blocks[index].box,
          lineEnds: snapshot.blocks[index].lines.map(line => line.end), lineWidth: snapshot.blocks[index].lines[0].width,
          gapAfter: brand ? 0 : input.rowGaps[index], kind: brand ? 'branding' : 'body' };
      });
      operation.nodes = Object.freeze(rows.map(row => row.node));
      const result = await renderPieceBitmapCanvas(operation.bitmapNode, { input, rows, deadline,
        bindingToken: operation.bindingToken, totalHeight: snapshot.plan.totalHeight, lineHeight: snapshot.plan.lineHeight });
      if (!current()) { releasePieceBitmapCanvas(operation.bitmapNode, result.artifactToken); return; }
      operation.evidence = result.rows; operation.result = result;
      if (!result.overflow) this.bitmapArtifact = { node: operation.bitmapNode, token: result.artifactToken,
        binding, generation: snapshot.generation, key: input.key, result };
      this.setState(previous => current() && previous.measurement === snapshot ? { measurement: result.overflow
        ? snapshot.sizeIndex + 1 < input.sizes.length ? { ...createPieceNativeMeasurement(raw), sizeIndex: snapshot.sizeIndex + 1 }
          : { ...snapshot, phase: 'unavailable', reason: 'native_ink_overflow', inspection: null }
        : { ...snapshot, phase: 'native_checked', inspection: result.rows, bitmapCanvas: result } } : null);
    } catch {
      if (current()) this.invalidatePlacement('native_bitmap_unavailable');
    }
  };

  inspectDrawing = async () => {
    if (preparePieceNativeCard(this.props)?.candidateProfile === PIECE_BITMAP_PREVIEW_VERSION) { await this.inspectBitmapDrawing(); return; }
    const snapshot = this.state.measurement;
    if (!this.active || !['geometry_checked', 'positioning'].includes(snapshot.phase) || this.inspection?.snapshot === snapshot) return;
    const raw = preparePieceNativeCard(this.props), input = raw && this.drawingInput(raw, snapshot);
    if (!input || input.key !== snapshot.key) return;
    const pixels = [PIECE_NATIVE_PREVIEW_V9_VERSION, PIECE_NATIVE_PREVIEW_CONTAINMENT_V1_VERSION, PIECE_NATIVE_PREVIEW_CONTAINMENT_V2_VERSION].includes(input.candidateProfile);
    const stage = pixels && snapshot.rowOffsets ? 'placed' : 'local';
    const operation = { snapshot, stage, canvas: this.canvasNode }, binding = this.state.binding; this.inspection = operation;
    const exploration = [PIECE_BITMAP_PREVIEW_VERSION, PIECE_NATIVE_PREVIEW_V5_VERSION, PIECE_NATIVE_PREVIEW_V6_VERSION, PIECE_NATIVE_PREVIEW_V7_VERSION, PIECE_NATIVE_PREVIEW_V8_VERSION, PIECE_NATIVE_PREVIEW_V9_VERSION, PIECE_NATIVE_PREVIEW_CONTAINMENT_V1_VERSION, PIECE_NATIVE_PREVIEW_CONTAINMENT_V2_VERSION].includes(input.candidateProfile);
    const current = () => this.bindingCurrent(binding) && this.inspection === operation && this.state.measurement === snapshot &&
      preparePieceNativeCard(this.props)?.key === input.key && this.deadline && this.deadlineCurrent() &&
      (!pixels || this.canvasNode === operation.canvas && (!operation.dispatched || operation.placementEpoch === this.placementEpoch)) &&
      (!exploration || !operation.nodes || operation.nodes.every((node, index) =>
        this.textNodes.get(index)?.value === node && this.textNodes.get(index)?.generation === snapshot.generation));
    try {
      if (pixels && (stage === 'placed' || [PIECE_NATIVE_PREVIEW_CONTAINMENT_V1_VERSION, PIECE_NATIVE_PREVIEW_CONTAINMENT_V2_VERSION].includes(input.candidateProfile))) {
        await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
        if (!current()) return;
      }
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
          ...(pixels ? { stage, canvasNode: operation.canvas, expiresAt: this.deadline?.expiresAt,
            ...(input.candidateProfile === PIECE_NATIVE_PREVIEW_CONTAINMENT_V2_VERSION ? { deadline: this.deadline } : {}),
            ...(stage === 'placed' ? { local: snapshot.localInspection[index],
              canvasFrame: this.placedFrame(input, snapshot, index) } : {}) } : {}),
        } };
      });
      if (!current()) return;
      operation.nodes = Object.freeze(targets.map(target => target.node));
      // Promise.all retains row order and observes every rejection. A single
      // missing/invalid result still rejects the entire image, never a subset.
      operation.placementEpoch = this.placementEpoch;
      operation.dispatched = pixels && stage === 'placed';
      const inspector = input.candidateProfile === PIECE_NATIVE_PREVIEW_CONTAINMENT_V2_VERSION ? inspectPieceSelectedLineV4
        : input.candidateProfile === PIECE_NATIVE_PREVIEW_CONTAINMENT_V1_VERSION ? inspectPieceSelectedLineV3
        : pixels ? inspectPieceSelectedLineV2 : exploration ? inspectPieceSelectedLine : inspectPieceText;
      const evidence = await Promise.all(targets.map(target => inspector(target.node, target.expected)));
      if (!current()) return;
      operation.evidence = evidence;
      const { lineHeight } = pieceNativeTypography(input, snapshot.sizeIndex);
      const rowOffsets = pixels && stage === 'placed' ? snapshot.rowOffsets : evidence.slice(0, input.blocks.length).map((result, index) => {
        const [rawLeft, top, rawRight, bottom] = result.ink;
        // Only placement uses content coordinates. Keep raw ink and the actual
        // outer view bounds intact for strict own-view overflow rejection.
        const inset = [PIECE_NATIVE_PREVIEW_V6_VERSION, PIECE_NATIVE_PREVIEW_V7_VERSION, PIECE_NATIVE_PREVIEW_V8_VERSION, PIECE_NATIVE_PREVIEW_V9_VERSION, PIECE_NATIVE_PREVIEW_CONTAINMENT_V1_VERSION, PIECE_NATIVE_PREVIEW_CONTAINMENT_V2_VERSION].includes(input.candidateProfile) ? input.margin : 0;
        const left = rawLeft - inset, right = rawRight - inset;
        const width = Math.max(snapshot.blocks[index].lines[0].width, right) - Math.min(0, left);
        return { x: -Math.min(0, left) + (input.alignment === 'center' ? (input.contentWidth - width) / 2 : 0),
          y: (lineHeight - (bottom - top)) / 2 - top, width, height: bottom - top };
      });
      // Moving a Text view cannot recover ink clipped by its own bounds.
      // Only already-contained ink may be repositioned within its row.
      const overflow = evidence.some(result => result.overflow) ||
        [PIECE_NATIVE_PREVIEW_CONTAINMENT_V1_VERSION, PIECE_NATIVE_PREVIEW_CONTAINMENT_V2_VERSION].includes(input.candidateProfile) && evidence.some((result, index) =>
          result.ink[2] - result.ink[0] > input.contentWidth ||
          result.ink[3] - result.ink[1] > (index < input.blocks.length ? lineHeight : 40)) ||
        pixels && stage === 'placed' && evidence.some((result, index) => {
          const [x, y] = result.canvasFrame, [left, top, right, bottom] = result.ink;
          return right - left > input.contentWidth || bottom - top > (index < input.blocks.length ? lineHeight : 40) ||
            x + left < input.margin - 0.5 || x + right > input.width - input.margin + 0.5 ||
            y + top < input.margin - 0.5 || y + bottom > input.height - input.margin -
              (index < input.blocks.length ? input.brandingZone : 0) + 0.5;
        }) ||
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
        : pixels && stage === 'local' ? { ...snapshot, phase: 'positioning', localInspection: evidence, rowOffsets }
        : { ...snapshot, phase: 'native_checked', inspection: evidence, rowOffsets } } : null);
    } catch {
      if (current()) this.setState(previous => current() && previous.measurement === snapshot
        ? { measurement: { ...snapshot, phase: 'unavailable', blocks: {}, compositionHeight: null, reason: 'native_measurement_unavailable' } } : null);
    }
  };

  measure = (ticket, index, kind, value) => {
    if (!this.bindingCurrent(this.state.binding) || this.state.measurement.phase === 'planning') return;
    const raw = preparePieceNativeCard(this.props), input = raw && this.drawingInput(raw);
    if (input?.candidateProfile === PIECE_BITMAP_PREVIEW_VERSION && this.inspection?.bitmap &&
        this.inspection.snapshot.generation === ticket.generation && this.state.measurement.generation === ticket.generation &&
        recordPieceNativeMeasurement(input, this.state.measurement, ticket, index, kind, value) !== this.state.measurement) {
      this.invalidatePlacement('native_bitmap_source_changed'); return;
    }
    if ([PIECE_NATIVE_PREVIEW_V9_VERSION, PIECE_NATIVE_PREVIEW_CONTAINMENT_V1_VERSION, PIECE_NATIVE_PREVIEW_CONTAINMENT_V2_VERSION].includes(input?.candidateProfile) && kind === 'box') {
      this.notePlacement(ticket, `text:${index}`, value);
    }
    const snapshot = this.state.measurement;
    if ([PIECE_NATIVE_PREVIEW_V9_VERSION, PIECE_NATIVE_PREVIEW_CONTAINMENT_V1_VERSION, PIECE_NATIVE_PREVIEW_CONTAINMENT_V2_VERSION].includes(input?.candidateProfile) && kind === 'lines' &&
        (snapshot.phase === 'native_checked' || this.inspection?.dispatched &&
          this.inspection.snapshot.generation === snapshot.generation) &&
        recordPieceNativeMeasurement(input, snapshot, ticket, index, kind, value) !== snapshot) {
      this.invalidatePlacement(); return;
    }
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
    const bitmap = input.candidateProfile === PIECE_BITMAP_PREVIEW_VERSION;
    const BitmapCanvas = bitmap ? pieceBitmapNativeView() : null;
    // Reinspection revokes visibility, not this generation's existing placement.
    // Moving the rows back to zero would trigger another layout/inspection cycle.
    const positioned = !!measurement.rowOffsets, pixels = [PIECE_NATIVE_PREVIEW_V9_VERSION, PIECE_NATIVE_PREVIEW_CONTAINMENT_V1_VERSION, PIECE_NATIVE_PREVIEW_CONTAINMENT_V2_VERSION].includes(input.candidateProfile);
    const drawingInset = !planning && [PIECE_BITMAP_PREVIEW_VERSION, PIECE_NATIVE_PREVIEW_V6_VERSION, PIECE_NATIVE_PREVIEW_V7_VERSION, PIECE_NATIVE_PREVIEW_V8_VERSION, PIECE_NATIVE_PREVIEW_V9_VERSION, PIECE_NATIVE_PREVIEW_CONTAINMENT_V1_VERSION, PIECE_NATIVE_PREVIEW_CONTAINMENT_V2_VERSION].includes(input.candidateProfile) ? input.margin : 0;
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
      ref: this.textRef(index, measurement.generation),
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
          if (bitmap && this.state.measurement.phase === 'native_checked') this.invalidatePlacement();
          if ([PIECE_NATIVE_PREVIEW_V9_VERSION, PIECE_NATIVE_PREVIEW_CONTAINMENT_V1_VERSION, PIECE_NATIVE_PREVIEW_CONTAINMENT_V2_VERSION].includes(input.candidateProfile)) {
            this.placementEpoch++;
            if (['positioning', 'native_checked'].includes(this.state.measurement.phase)) this.invalidatePlacement();
          }
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
          ref: this.setCanvasNode,
          ...(pixels ? { onLayout: event => this.notePlacement(ticket, 'canvas', event.nativeEvent?.layout) } : {}),
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
        bitmap && BitmapCanvas ? element(BitmapCanvas, { testID: 'piece-bitmap-canvas', ref: this.setBitmapNode,
          bitmapBinding: this.bitmapBindingFor(measurement.generation), onBitmapInvalidated: this.bitmapInvalidated,
          collapsable: false, accessible: false, pointerEvents: 'none',
          style: { position: 'absolute', left: 0, top: 0, width: input.width, height: input.height },
          onLayout: event => {
            const rect = event.nativeEvent?.layout;
            if (bitmap && this.bindingCurrent(this.state.binding) && measurement.generation === this.state.measurement.generation &&
                (!rect || rect.x !== 0 || rect.y !== 0 || rect.width !== input.width || rect.height !== input.height)) this.invalidatePlacement();
          },
        }) : null,
        element(View, { ...(pixels ? { testID: 'piece-body-composition', collapsable: false,
          onLayout: event => this.notePlacement(ticket, 'composition', event.nativeEvent?.layout) } : {}),
          style: { position: 'absolute', left: input.margin, width: input.contentWidth, ...(bitmap ? { opacity: 0 } : {}),
          top: input.margin + (!pixels && positioned ? (input.contentHeight - measurement.plan.totalHeight) / 2 : 0),
          ...(pixels ? { transform: [{ translateY: positioned ? (input.contentHeight - measurement.plan.totalHeight) / 2 : 0 }] } : {}) } },
          ...input.blocks.map((body, index) => element(View, {
            key: `row:${index}`, ...(pixels ? { testID: `piece-logical-row-${index}`, collapsable: false,
              onLayout: event => this.notePlacement(ticket, `row:${index}`, event.nativeEvent?.layout) } : {}),
            style: { height: planning ? undefined : lineHeight, marginBottom: input.rowGaps?.[index] ?? (index < input.blocks.length - 1 ? gap : 0),
              ...(pixels ? { transform: [{ translateX: positioned ? measurement.rowOffsets[index].x : 0 },
                { translateY: positioned ? measurement.rowOffsets[index].y : 0 }] } : {}) },
          }, element(Text, { ...textProps(index), style: {
            width: input.contentWidth + 2 * drawingInset,
            ...(drawingInset ? { paddingHorizontal: drawingInset } : {}),
            // v7 retains RN's natural Text measurement and pixel-grid sizing.
            // Logical row height and strict ink-height checks remain unchanged.
            ...(drawingInset && input.candidateProfile === PIECE_NATIVE_PREVIEW_V6_VERSION ? { height: lineHeight } : {}),
            fontSize, lineHeight, fontWeight: '400', fontStyle: 'normal',
            letterSpacing: 0, includeFontPadding: false, textAlign: 'left', color: input.colors.text,
            position: planning ? 'relative' : 'absolute', left: (!pixels && positioned ? measurement.rowOffsets[index].x : 0) - drawingInset,
            // v9 moves only existing ancestor Views. Changing Text props here
            // would dirty RN's TextStorage and invalidate the local snapshot.
            top: !pixels && positioned ? measurement.rowOffsets[index].y : 0,
          } }, body)))),
        planning || input.brandingMode === 'off' ? null : element(Text, { ...textProps(input.blocks.length), style: {
          position: 'absolute', left: input.margin, width: input.contentWidth,
          top: input.height - input.margin - input.brandingZone,
          fontSize: 28, lineHeight: 40, includeFontPadding: false, textAlign: 'center',
          color: input.colors.branding, opacity: bitmap ? 0 : input.brandingMode === 'required_subtle' ? 0.8 : 1,
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
