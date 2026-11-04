'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');
const { crc32 } = require('node:zlib');

const source = fs.readFileSync(path.join(__dirname, '../features/piece/pieceExportPngProfile.js'), 'utf8');
const verify = vm.runInNewContext(source.replace(/^export /gm, '') + '\nverifyPieceExportPngSrgb');
const verifyStructure = vm.runInNewContext(source.replace(/^export /gm, '') + '\nverifyPieceExportPngStructure');
const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
const width = 1080, height = 1350;
const unsigned = values => {
  const bytes = Buffer.alloc(values.length * 4);
  values.forEach((value, index) => bytes.writeUInt32BE(value, index * 4));
  return bytes;
};
const chunk = (type, data = Buffer.alloc(0)) => {
  const payload = Buffer.concat([Buffer.from(type), data]);
  return Buffer.concat([unsigned([data.length]), payload, unsigned([crc32(payload)])]);
};
const header = chunk('IHDR', Buffer.concat([unsigned([width, height]), Buffer.from([8, 6, 0, 0, 0])]));
const srgb = chunk('sRGB', Buffer.from([0]));
const idat = chunk('IDAT', Buffer.alloc(150, 42));
const end = chunk('IEND');
const png = (...chunks) => Buffer.concat([signature, header, ...chunks]);
const check = (bytes, overrides = {}) => verify({
  readChunk: async (offset, length) => bytes.subarray(offset, offset + length).toString('base64'),
  size: bytes.length, width, height, ...overrides,
});
const checkStructure = bytes => verifyStructure({
  readChunk: async (offset, length) => bytes.subarray(offset, offset + length).toString('base64'),
  size: bytes.length, width, height,
});
const unavailable = { message: 'PIECE_EXPORT_PNG_PROFILE_UNAVAILABLE' };

test('attests a fixed-size sRGB PNG using metadata and skipping all IDAT bytes', async () => {
  const gamma = chunk('gAMA', unsigned([45455]));
  const chroma = chunk('cHRM', unsigned([31270, 32900, 64000, 33000, 30000, 60000, 15000, 6000]));
  const exif = chunk('eXIf', Buffer.alloc(132));
  const bytes = png(gamma, chroma, srgb, exif, idat, idat, end);
  const start = signature.length + header.length + gamma.length + chroma.length + srgb.length + exif.length;
  const payloads = [start, start + idat.length].map(offset => [offset + 8, offset + idat.length - 4]);
  assert.equal(await check(bytes, { readChunk: async (offset, length) => {
    assert.ok(payloads.every(([from, to]) => offset + length <= from || offset >= to));
    assert.ok(length <= 36);
    return bytes.subarray(offset, offset + length).toString('base64');
  } }), true);
});

test('rejects missing, ambiguous, displaced or corrupt sRGB metadata', async () => {
  const corrupt = Buffer.from(srgb);
  corrupt[corrupt.length - 1] ^= 1;
  for (const bytes of [
    png(idat, end), png(srgb, srgb, idat, end), png(idat, srgb, end),
    png(srgb, idat, srgb, end), png(corrupt, idat, end),
    png(chunk('sRGB', Buffer.from([4])), idat, end),
    png(chunk('sRGB', Buffer.from([0, 1])), idat, end),
    png(chunk('gAMA', unsigned([100000])), srgb, idat, end),
    png(srgb, chunk('iCCP', Buffer.from([1, 2, 3])), idat, end),
    png(srgb, idat, chunk('cICP', Buffer.from([1, 13, 0, 1])), end),
  ]) await assert.rejects(check(bytes), unavailable);
});

test('rejects invalid dimensions, chunk structure and short native reads', async () => {
  const valid = png(srgb, idat, end);
  const corruptHeader = Buffer.from(valid);
  corruptHeader[32] ^= 1;
  const badLength = Buffer.from(valid);
  badLength.writeUInt32BE(0xffffffff, signature.length + header.length + srgb.length);
  for (const bytes of [
    corruptHeader, badLength, png(srgb, idat), png(srgb, idat, end, end),
    png(srgb, idat, chunk('tEXt'), idat, end), png(srgb, chunk('acTL'), idat, end),
    png(...Array(32).fill(chunk('tEXt')), srgb, idat, end),
  ]) await assert.rejects(check(bytes), unavailable);
  await assert.rejects(check(valid, { height: 1920 }), unavailable);
  await assert.rejects(check(valid, { readChunk: async () => 'AAAA' }), unavailable);
});

test('accepts complete legacy PNGs without requiring a receipt profile or narrowing valid color types', async () => {
  const metadata = chunk('tEXt', Buffer.from('encoder\0legacy'));
  const palette = chunk('PLTE', Buffer.from([0, 0, 0, 255, 255, 255]));
  const indexed = chunk('IHDR', Buffer.concat([unsigned([width, height]), Buffer.from([1, 3, 0, 0, 0])]));
  const gray = chunk('IHDR', Buffer.concat([unsigned([width, height]), Buffer.from([16, 4, 0, 0, 0])]));
  const indexedPng = (...chunks) => Buffer.concat([signature, indexed, ...chunks]);
  for (const bytes of [png(idat, end), png(metadata, idat, metadata, end), png(srgb, idat, end),
    indexedPng(palette, idat, end), Buffer.concat([signature, gray, idat, end])]) {
    assert.equal(await checkStructure(bytes), true);
  }
  for (const bytes of [png(idat), png(idat, end, metadata), png(chunk('IDAT'), end),
    png(idat, metadata, idat, end), png(chunk('ABCD'), idat, end), indexedPng(idat, end),
    indexedPng(palette, palette, idat, end)]) await assert.rejects(checkStructure(bytes), unavailable);
});
