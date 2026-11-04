// Read only the metadata needed to attest the native capture's PNG profile.
const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
const signature = [137, 80, 78, 71, 13, 10, 26, 10];
const unavailable = () => new Error('PIECE_EXPORT_PNG_PROFILE_UNAVAILABLE');
const conflicting = new Set(['iCCP', 'cICP', 'mDCV', 'cLLI', 'acTL', 'fcTL', 'fdAT']);
const chromaticity = [31270, 32900, 64000, 33000, 30000, 60000, 15000, 6000];
const u32 = (bytes, offset) => bytes[offset] * 16777216 + bytes[offset + 1] * 65536 +
  bytes[offset + 2] * 256 + bytes[offset + 3];

function decode(value, length) {
  if (typeof value !== 'string' || value.length !== Math.ceil(length / 3) * 4 ||
      !/^[A-Za-z0-9+/]+={0,2}$/.test(value) || !value.endsWith('='.repeat((3 - length % 3) % 3)) ||
      value.replace(/=+$/, '').length !== Math.ceil(length * 8 / 6)) throw unavailable();
  const bytes = new Uint8Array(length);
  for (let offset = 0, index = 0; offset < value.length; offset += 4) {
    const a = alphabet.indexOf(value[offset]), b = alphabet.indexOf(value[offset + 1]);
    const c = Math.max(alphabet.indexOf(value[offset + 2]), 0), d = Math.max(alphabet.indexOf(value[offset + 3]), 0);
    bytes[index++] = (a << 2) | (b >> 4);
    if (index < length) bytes[index++] = (b << 4) | (c >> 2);
    if (index < length) bytes[index++] = (c << 6) | d;
  }
  return bytes;
}

function crc32(type, data) {
  let crc = 0xffffffff;
  for (const byte of [...type, ...data]) {
    crc ^= byte;
    for (let bit = 0; bit < 8; bit++) crc = (crc >>> 1) ^ ((crc & 1) ? 0xedb88320 : 0);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

// Resolves true only for a PNG with explicit sRGB metadata at the expected
// dimensions. Does not decode pixels or infer an absent color profile.
export async function verifyPieceExportPngSrgb({ readChunk, size, width, height }) {
  if (typeof readChunk !== 'function' || !Number.isSafeInteger(size) || size < 71 ||
      !Number.isSafeInteger(width) || width < 1 || !Number.isSafeInteger(height) || height < 1) throw unavailable();
  const read = async (offset, length) => {
    if (offset + length > size) throw unavailable();
    try { return decode(await readChunk(offset, length), length); }
    catch { throw unavailable(); }
  };
  const start = await read(0, 33);
  if (!signature.every((byte, index) => byte === start[index]) || u32(start, 8) !== 13 ||
      String.fromCharCode(...start.subarray(12, 16)) !== 'IHDR' ||
      u32(start, 16) !== width || u32(start, 20) !== height ||
      start[24] !== 8 || ![2, 6].includes(start[25]) || start[26] !== 0 || start[27] !== 0 || start[28] > 1 ||
      crc32(start.subarray(12, 16), start.subarray(16, 29)) !== u32(start, 29)) throw unavailable();

  const profiles = new Set();
  let offset = 33, imageStarted = false, imageBytes = 0, imageEnded = false;
  for (let chunks = 0; chunks < 1024; chunks++) {
    if (!imageBytes && (chunks >= 32 || offset > 65536)) throw unavailable();
    const header = await read(offset, 8);
    const length = u32(header, 0), typeBytes = header.subarray(4), type = String.fromCharCode(...typeBytes);
    const end = offset + 12 + length;
    if (length > 0x7fffffff || end > size || !/^[A-Za-z]{2}[A-Z][A-Za-z]$/.test(type) ||
        conflicting.has(type)) throw unavailable();
    if (type === 'IDAT') {
      if (!profiles.has('sRGB') || imageEnded) throw unavailable();
      imageStarted = true;
      imageBytes += length;
    } else {
      if (type === 'IEND') {
        if (length !== 0 || !imageBytes || end !== size ||
            u32(await read(offset + 8, 4), 0) !== crc32(typeBytes, [])) throw unavailable();
        return true;
      }
      if (imageStarted) imageEnded = true;
      const profileSize = { sRGB: 1, gAMA: 4, cHRM: 32 }[type];
      if (profileSize) {
        if (length !== profileSize || imageEnded || profiles.has(type)) throw unavailable();
        const value = await read(offset + 8, length + 4);
        if (crc32(typeBytes, value.subarray(0, length)) !== u32(value, length) ||
            type === 'sRGB' && value[0] > 3 ||
            type === 'gAMA' && u32(value, 0) !== 45455 ||
            type === 'cHRM' && !chromaticity.every((n, index) => u32(value, index * 4) === n)) throw unavailable();
        profiles.add(type);
      } else if (/^[A-Z]/.test(type)) throw unavailable();
    }
    offset = end;
  }
  throw unavailable();
}
