/** B13 native export prototype. No product caller or admission is added here.
 * The future host must supply current owner/runtime/lifecycle checks, mount the
 * saved-record canvas, and establish renderer admission before exposing actions.
 * No receipt is sent; local native checks are not formal fit or export success.
 */
import { Platform, PermissionsAndroid, NativeModules } from 'react-native';
import { captureRef, releaseCapture } from 'react-native-view-shot';
import Share from 'react-native-share';
import { CameraRoll } from '@react-native-camera-roll/camera-roll';
import { Dirs, FileSystem } from 'react-native-file-access';
import { requestPieceOwner, PieceApiError } from './pieceApi';
import { readPieceOwnerDisplay } from './pieceOwnerModel';
import { preparePieceNativeSavedDisplay, PIECE_NATIVE_PREVIEW_VERSION } from './pieceLayout';

const failed = () => new PieceApiError('PIECE_TEMPORARILY_UNAVAILABLE');
const hashPattern = /^[0-9a-f]{64}$/;
let rawCleanup;

function roots() {
  const base = Dirs.CacheDir;
  if (typeof base !== 'string' || !base.startsWith('/') || base.endsWith('/')) throw failed();
  return { raw: `${base}/piece-capture`, exports: `${base}/piece-export` };
}

function rawPath(value, root) {
  if (typeof value !== 'string') throw failed();
  const path = value.startsWith('file://') ? value.slice(7) : value;
  if (!path.startsWith(`${root}/`) || !/^piece-[A-Za-z0-9-]+\.png$/.test(path.slice(root.length + 1))) throw failed();
  return path;
}

// First use in a fresh JS process, before any prototype capture. Only exact
// owned raw names are removed; shared files, common caches and photos are not.
async function prepareRawCache(root) {
  if (!rawCleanup) rawCleanup = (async () => {
    await FileSystem.mkdir(root);
    const names = await FileSystem.ls(root);
    for (const name of names) {
      if (/^piece-[A-Za-z0-9-]+\.png$/.test(name)) await FileSystem.unlink(`${root}/${name}`);
    }
  })();
  await rawCleanup;
}

function sessionId() {
  const bytes = new Uint8Array(16);
  globalThis.crypto.getRandomValues(bytes);
  return Array.from(bytes, b => b.toString(16).padStart(2, '0')).join('');
}

async function pngIdentity(path, width, height) {
  const stat = await FileSystem.stat(path);
  if (stat.type !== 'file' || stat.size <= 33) throw failed();
  // Inspect only the 24-byte PNG signature/IHDR prefix, not image/base64 data.
  const header = await FileSystem.readFileChunk(path, 0, 24, 'base64');
  if (typeof header !== 'string' || !/^[A-Za-z0-9+/]{32}$/.test(header)) throw failed();
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
  const bytes = [];
  for (let i = 0; i < 32; i += 4) {
    const value = [...header.slice(i, i + 4)].reduce((n, c) => n * 64 + alphabet.indexOf(c), 0);
    bytes.push((value >>> 16) & 255, (value >>> 8) & 255, value & 255);
  }
  const uint32 = offset => bytes.slice(offset, offset + 4).reduce((n, b) => n * 256 + b, 0);
  if (bytes.length !== 24 || bytes.slice(0, 8).join() !== '137,80,78,71,13,10,26,10' ||
      uint32(8) !== 13 || bytes.slice(12, 16).join() !== '73,72,68,82' || uint32(16) !== width || uint32(20) !== height) throw failed();
  const hash = await FileSystem.hash(path, 'SHA-256');
  if (!hashPattern.test(hash)) throw failed();
  return hash;
}

export async function preparePieceExportPrototype({ pieceId, expectedUserId, isCurrent, signal } = {}) {
  if (!['ios', 'android'].includes(Platform.OS)) throw failed();
  const current = () => {
    if (signal?.aborted || typeof isCurrent !== 'function' || isCurrent() !== true) throw failed();
  };
  current();
  const record = readPieceOwnerDisplay(await requestPieceOwner('detail', { piece_id: pieceId }, { expectedUserId, signal }));
  current();
  const input = preparePieceNativeSavedDisplay(record);
  if (!input) throw failed();
  const dirs = roots();
  try { await prepareRawCache(dirs.raw); } catch { throw failed(); }
  current();
  let busy = false, captured = false;
  return Object.freeze({ record, async capture(target) {
    current();
    if (busy || captured || target?.key !== input.key || target.width !== input.width ||
        target.height !== input.height || typeof target.isCurrent !== 'function' || !target.node) throw failed();
    const check = () => { current(); if (target.isCurrent() !== true) throw failed(); };
    check(); busy = true;
    let raw = null, directory = null, path = null, handedOff = false, operating = false;
    const cleanup = async () => {
      if (directory && !handedOff && !operating) {
        const owned = directory; directory = null;
        try { await FileSystem.unlink(owned); } catch { throw failed(); }
      }
    };
    try {
      raw = await captureRef(target.node, { format: 'png', result: 'tmpfile', quality: 1,
        width: input.width, height: input.height, snapshotContentContainer: false, cocolonPieceCache: true });
      const source = rawPath(raw, dirs.raw);
      check();
      const token = sessionId();
      directory = `${dirs.exports}/${token}`;
      await FileSystem.mkdir(directory);
      check();
      const filename = `cocolon-piece_${record.piece_id.replace(/-/g, '')}_${record.visual_recipe_hash.slice(0, 12)}_${record.visual_recipe.aspect_ratio.replace(':', 'x')}.png`;
      path = `${directory}/${filename}`;
      await FileSystem.cp(source, path);
      check();
      const assetHash = await pngIdentity(path, input.width, input.height);
      check();
      captured = true;
      let consumed = false, disposed = false;
      const begin = () => {
        current();
        if (consumed || disposed) throw failed();
        consumed = true; operating = true;
      };
      const verify = async () => {
        current();
        if (await pngIdentity(path, input.width, input.height) !== assetHash) throw failed();
        current(); if (disposed) throw failed();
      };
      return Object.freeze({
        // Candidate metadata only. No body, local URI, recipient or formal receipt.
        candidate: Object.freeze({ piece_id: record.public_id, piece_text_hash: record.piece_text_hash,
          visual_recipe_hash: record.visual_recipe_hash, renderer_version: PIECE_NATIVE_PREVIEW_VERSION,
          asset_sha256: assetHash, mime_type: 'image/png', width: input.width, height: input.height }),
        async saveToPhotos() {
          begin();
          try {
            await verify();
            if (Platform.OS === 'android' && Number(Platform.Version) < 29) {
              const status = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE);
              current();
              if (status !== PermissionsAndroid.RESULTS.GRANTED) throw failed();
            }
            current(); if (disposed) throw failed();
            // No album/read permission: CameraRoll requests iOS add-only itself.
            if (Platform.OS === 'ios') {
              // Pinned 7.10.2 old-architecture opt-in avoids the public API's
              // post-save PHAsset read; the patch returns no asset metadata.
              const result = await NativeModules.RNCCameraRoll.saveToCameraRoll(`file://${path}`,
                { type: 'photo', album: '', cocolonAddOnly: true });
              if (result?.saved !== true) throw failed();
            } else await CameraRoll.saveAsset(`file://${path}`, { type: 'photo' });
            current();
            return Object.freeze({ outcome: 'saved_to_photos' });
          } catch { throw failed(); }
          finally { operating = false; disposed = true; await cleanup(); }
        },
        async openShare() {
          begin();
          try {
            await verify();
            current(); if (disposed) throw failed();
            // Android resolves when a target is selected, not when it stops
            // reading. Neither callback, backgrounding nor dispose deletes this.
            handedOff = true;
            await Share.open({ url: `file://${path}`, type: 'image/png', filename, failOnCancel: false });
            return Object.freeze({ outcome: 'share_result_returned' });
          } catch { throw failed(); }
          finally { operating = false; disposed = true; await cleanup(); }
        },
        async dispose() { disposed = true; await cleanup(); },
      });
    } catch {
      try { await cleanup(); } catch { /* Confined leftovers remain recoverable. */ }
      throw failed();
    } finally {
      busy = false;
      if (raw) {
        // Never pass an arbitrary returned URI to library cleanup.
        try { rawPath(raw, dirs.raw); releaseCapture(raw); } catch { /* Next-process cleanup. */ }
      }
    }
  } });
}
