/** B9 measured wrap selection, ported from piece_v2_layout.py.
 * Native owns grapheme segmentation and actual substring metrics. This module
 * selects exact existing substrings; it neither normalizes the body nor grants
 * save/export/renderer admission. Unknown/missing metrics are unavailable.
 */
const unavailable = () => { throw new Error('PIECE_NATIVE_MEASUREMENT_UNAVAILABLE'); };
const finite = value => typeof value === 'number' && Number.isFinite(value);
const noStart = new Set(Array.from('、。，．,？！!?：；:;)]）］｝】〉》」』〕〗〙〛ー々ぁぃぅぇぉっゃゅょァィゥェォッャュョ'));
const noEnd = new Set(Array.from('([（［｛【〈《「『〔〖〘〚'));
const bridges = new Set(Array.from('いきぎしじちぢびぴみりえけげせぜねべぺめれ'));
const first = text => String.fromCodePoint(text.codePointAt(0));
const last = text => Array.from(text).pop();
const ranges = text => text.split(',').map(pair => {
  const [a, b = a] = pair.split('-'); return [parseInt(a, 16), parseInt(b, 16)];
});
// Python 3.12's Unicode 15.0.0: exact name/category/combining/isspace sets.
// Script property escapes would also admit radicals/marks absent from B9.
const unicode = {
  han: ranges('3400-4dbf,4e00-9fff,f900-fa6d,fa70-fad9,20000-2a6df,2a700-2b739,2b740-2b81d,2b820-2cea1,2ceb0-2ebe0,2f800-2fa1d,30000-3134a,31350-323af'),
  katakana: ranges('30a1-30fa,31f0-31ff,ff66-ff6f,ff71-ff9d,1aff0-1aff3,1aff5-1affb,1affd-1affe,1b000,1b120-1b122,1b155,1b164-1b167'),
  hiragana: ranges('3041-3096,1b001,1b11f,1b132,1b150-1b152'),
  letter: ranges('41-5a,61-7a,aa,b5,ba,c0-d6,d8-f6,f8-2c1,2c6-2d1,2e0-2e4,2ec,2ee,370-374,376-377,37a-37d,37f,386,388-38a,38c,38e-3a1,3a3-3f5,3f7-481,48a-52f,531-556,559,560-588,5d0-5ea,5ef-5f2,620-64a,66e-66f,671-6d3,6d5,6e5-6e6,6ee-6ef,6fa-6fc,6ff,710,712-72f,74d-7a5,7b1,7ca-7ea,7f4-7f5,7fa,800-815,81a,824,828,840-858,860-86a,870-887,889-88e,8a0-8c9,904-939,93d,950,958-961,971-980,985-98c,98f-990,993-9a8,9aa-9b0,9b2,9b6-9b9,9bd,9ce,9dc-9dd,9df-9e1,9f0-9f1,9fc,a05-a0a,a0f-a10,a13-a28,a2a-a30,a32-a33,a35-a36,a38-a39,a59-a5c,a5e,a72-a74,a85-a8d,a8f-a91,a93-aa8,aaa-ab0,ab2-ab3,ab5-ab9,abd,ad0,ae0-ae1,af9,b05-b0c,b0f-b10,b13-b28,b2a-b30,b32-b33,b35-b39,b3d,b5c-b5d,b5f-b61,b71,b83,b85-b8a,b8e-b90,b92-b95,b99-b9a,b9c,b9e-b9f,ba3-ba4,ba8-baa,bae-bb9,bd0,c05-c0c,c0e-c10,c12-c28,c2a-c39,c3d,c58-c5a,c5d,c60-c61,c80,c85-c8c,c8e-c90,c92-ca8,caa-cb3,cb5-cb9,cbd,cdd-cde,ce0-ce1,cf1-cf2,d04-d0c,d0e-d10,d12-d3a,d3d,d4e,d54-d56,d5f-d61,d7a-d7f,d85-d96,d9a-db1,db3-dbb,dbd,dc0-dc6,e01-e30,e32-e33,e40-e46,e81-e82,e84,e86-e8a,e8c-ea3,ea5,ea7-eb0,eb2-eb3,ebd,ec0-ec4,ec6,edc-edf,f00,f40-f47,f49-f6c,f88-f8c,1000-102a,103f,1050-1055,105a-105d,1061,1065-1066,106e-1070,1075-1081,108e,10a0-10c5,10c7,10cd,10d0-10fa,10fc-1248,124a-124d,1250-1256,1258,125a-125d,1260-1288,128a-128d,1290-12b0,12b2-12b5,12b8-12be,12c0,12c2-12c5,12c8-12d6,12d8-1310,1312-1315,1318-135a,1380-138f,13a0-13f5,13f8-13fd,1401-166c,166f-167f,1681-169a,16a0-16ea,16f1-16f8,1700-1711,171f-1731,1740-1751,1760-176c,176e-1770,1780-17b3,17d7,17dc,1820-1878,1880-1884,1887-18a8,18aa,18b0-18f5,1900-191e,1950-196d,1970-1974,1980-19ab,19b0-19c9,1a00-1a16,1a20-1a54,1aa7,1b05-1b33,1b45-1b4c,1b83-1ba0,1bae-1baf,1bba-1be5,1c00-1c23,1c4d-1c4f,1c5a-1c7d,1c80-1c88,1c90-1cba,1cbd-1cbf,1ce9-1cec,1cee-1cf3,1cf5-1cf6,1cfa,1d00-1dbf,1e00-1f15,1f18-1f1d,1f20-1f45,1f48-1f4d,1f50-1f57,1f59,1f5b,1f5d,1f5f-1f7d,1f80-1fb4,1fb6-1fbc,1fbe,1fc2-1fc4,1fc6-1fcc,1fd0-1fd3,1fd6-1fdb,1fe0-1fec,1ff2-1ff4,1ff6-1ffc,2071,207f,2090-209c,2102,2107,210a-2113,2115,2119-211d,2124,2126,2128,212a-212d,212f-2139,213c-213f,2145-2149,214e,2183-2184,2c00-2ce4,2ceb-2cee,2cf2-2cf3,2d00-2d25,2d27,2d2d,2d30-2d67,2d6f,2d80-2d96,2da0-2da6,2da8-2dae,2db0-2db6,2db8-2dbe,2dc0-2dc6,2dc8-2dce,2dd0-2dd6,2dd8-2dde,2e2f,3005-3006,3031-3035,303b-303c,3041-3096,309d-309f,30a1-30fa,30fc-30ff,3105-312f,3131-318e,31a0-31bf,31f0-31ff,3400-4dbf,4e00-a48c,a4d0-a4fd,a500-a60c,a610-a61f,a62a-a62b,a640-a66e,a67f-a69d,a6a0-a6e5,a717-a71f,a722-a788,a78b-a7ca,a7d0-a7d1,a7d3,a7d5-a7d9,a7f2-a801,a803-a805,a807-a80a,a80c-a822,a840-a873,a882-a8b3,a8f2-a8f7,a8fb,a8fd-a8fe,a90a-a925,a930-a946,a960-a97c,a984-a9b2,a9cf,a9e0-a9e4,a9e6-a9ef,a9fa-a9fe,aa00-aa28,aa40-aa42,aa44-aa4b,aa60-aa76,aa7a,aa7e-aaaf,aab1,aab5-aab6,aab9-aabd,aac0,aac2,aadb-aadd,aae0-aaea,aaf2-aaf4,ab01-ab06,ab09-ab0e,ab11-ab16,ab20-ab26,ab28-ab2e,ab30-ab5a,ab5c-ab69,ab70-abe2,ac00-d7a3,d7b0-d7c6,d7cb-d7fb,f900-fa6d,fa70-fad9,fb00-fb06,fb13-fb17,fb1d,fb1f-fb28,fb2a-fb36,fb38-fb3c,fb3e,fb40-fb41,fb43-fb44,fb46-fbb1,fbd3-fd3d,fd50-fd8f,fd92-fdc7,fdf0-fdfb,fe70-fe74,fe76-fefc,ff21-ff3a,ff41-ff5a,ff66-ffbe,ffc2-ffc7,ffca-ffcf,ffd2-ffd7,ffda-ffdc,10000-1000b,1000d-10026,10028-1003a,1003c-1003d,1003f-1004d,10050-1005d,10080-100fa,10280-1029c,102a0-102d0,10300-1031f,1032d-10340,10342-10349,10350-10375,10380-1039d,103a0-103c3,103c8-103cf,10400-1049d,104b0-104d3,104d8-104fb,10500-10527,10530-10563,10570-1057a,1057c-1058a,1058c-10592,10594-10595,10597-105a1,105a3-105b1,105b3-105b9,105bb-105bc,10600-10736,10740-10755,10760-10767,10780-10785,10787-107b0,107b2-107ba,10800-10805,10808,1080a-10835,10837-10838,1083c,1083f-10855,10860-10876,10880-1089e,108e0-108f2,108f4-108f5,10900-10915,10920-10939,10980-109b7,109be-109bf,10a00,10a10-10a13,10a15-10a17,10a19-10a35,10a60-10a7c,10a80-10a9c,10ac0-10ac7,10ac9-10ae4,10b00-10b35,10b40-10b55,10b60-10b72,10b80-10b91,10c00-10c48,10c80-10cb2,10cc0-10cf2,10d00-10d23,10e80-10ea9,10eb0-10eb1,10f00-10f1c,10f27,10f30-10f45,10f70-10f81,10fb0-10fc4,10fe0-10ff6,11003-11037,11071-11072,11075,11083-110af,110d0-110e8,11103-11126,11144,11147,11150-11172,11176,11183-111b2,111c1-111c4,111da,111dc,11200-11211,11213-1122b,1123f-11240,11280-11286,11288,1128a-1128d,1128f-1129d,1129f-112a8,112b0-112de,11305-1130c,1130f-11310,11313-11328,1132a-11330,11332-11333,11335-11339,1133d,11350,1135d-11361,11400-11434,11447-1144a,1145f-11461,11480-114af,114c4-114c5,114c7,11580-115ae,115d8-115db,11600-1162f,11644,11680-116aa,116b8,11700-1171a,11740-11746,11800-1182b,118a0-118df,118ff-11906,11909,1190c-11913,11915-11916,11918-1192f,1193f,11941,119a0-119a7,119aa-119d0,119e1,119e3,11a00,11a0b-11a32,11a3a,11a50,11a5c-11a89,11a9d,11ab0-11af8,11c00-11c08,11c0a-11c2e,11c40,11c72-11c8f,11d00-11d06,11d08-11d09,11d0b-11d30,11d46,11d60-11d65,11d67-11d68,11d6a-11d89,11d98,11ee0-11ef2,11f02,11f04-11f10,11f12-11f33,11fb0,12000-12399,12480-12543,12f90-12ff0,13000-1342f,13441-13446,14400-14646,16800-16a38,16a40-16a5e,16a70-16abe,16ad0-16aed,16b00-16b2f,16b40-16b43,16b63-16b77,16b7d-16b8f,16e40-16e7f,16f00-16f4a,16f50,16f93-16f9f,16fe0-16fe1,16fe3,17000-187f7,18800-18cd5,18d00-18d08,1aff0-1aff3,1aff5-1affb,1affd-1affe,1b000-1b122,1b132,1b150-1b152,1b155,1b164-1b167,1b170-1b2fb,1bc00-1bc6a,1bc70-1bc7c,1bc80-1bc88,1bc90-1bc99,1d400-1d454,1d456-1d49c,1d49e-1d49f,1d4a2,1d4a5-1d4a6,1d4a9-1d4ac,1d4ae-1d4b9,1d4bb,1d4bd-1d4c3,1d4c5-1d505,1d507-1d50a,1d50d-1d514,1d516-1d51c,1d51e-1d539,1d53b-1d53e,1d540-1d544,1d546,1d54a-1d550,1d552-1d6a5,1d6a8-1d6c0,1d6c2-1d6da,1d6dc-1d6fa,1d6fc-1d714,1d716-1d734,1d736-1d74e,1d750-1d76e,1d770-1d788,1d78a-1d7a8,1d7aa-1d7c2,1d7c4-1d7cb,1df00-1df1e,1df25-1df2a,1e030-1e06d,1e100-1e12c,1e137-1e13d,1e14e,1e290-1e2ad,1e2c0-1e2eb,1e4d0-1e4eb,1e7e0-1e7e6,1e7e8-1e7eb,1e7ed-1e7ee,1e7f0-1e7fe,1e800-1e8c4,1e900-1e943,1e94b,1ee00-1ee03,1ee05-1ee1f,1ee21-1ee22,1ee24,1ee27,1ee29-1ee32,1ee34-1ee37,1ee39,1ee3b,1ee42,1ee47,1ee49,1ee4b,1ee4d-1ee4f,1ee51-1ee52,1ee54,1ee57,1ee59,1ee5b,1ee5d,1ee5f,1ee61-1ee62,1ee64,1ee67-1ee6a,1ee6c-1ee72,1ee74-1ee77,1ee79-1ee7c,1ee7e,1ee80-1ee89,1ee8b-1ee9b,1eea1-1eea3,1eea5-1eea9,1eeab-1eebb,20000-2a6df,2a700-2b739,2b740-2b81d,2b820-2cea1,2ceb0-2ebe0,2f800-2fa1d,30000-3134a,31350-323af'),
  combining: ranges('300-34e,350-36f,483-487,591-5bd,5bf,5c1-5c2,5c4-5c5,5c7,610-61a,64b-65f,670,6d6-6dc,6df-6e4,6e7-6e8,6ea-6ed,711,730-74a,7eb-7f3,7fd,816-819,81b-823,825-827,829-82d,859-85b,898-89f,8ca-8e1,8e3-8ff,93c,94d,951-954,9bc,9cd,9fe,a3c,a4d,abc,acd,b3c,b4d,bcd,c3c,c4d,c55-c56,cbc,ccd,d3b-d3c,d4d,dca,e38-e3a,e48-e4b,eb8-eba,ec8-ecb,f18-f19,f35,f37,f39,f71-f72,f74,f7a-f7d,f80,f82-f84,f86-f87,fc6,1037,1039-103a,108d,135d-135f,1714-1715,1734,17d2,17dd,18a9,1939-193b,1a17-1a18,1a60,1a75-1a7c,1a7f,1ab0-1abd,1abf-1ace,1b34,1b44,1b6b-1b73,1baa-1bab,1be6,1bf2-1bf3,1c37,1cd0-1cd2,1cd4-1ce0,1ce2-1ce8,1ced,1cf4,1cf8-1cf9,1dc0-1dff,20d0-20dc,20e1,20e5-20f0,2cef-2cf1,2d7f,2de0-2dff,302a-302f,3099-309a,a66f,a674-a67d,a69e-a69f,a6f0-a6f1,a806,a82c,a8c4,a8e0-a8f1,a92b-a92d,a953,a9b3,a9c0,aab0,aab2-aab4,aab7-aab8,aabe-aabf,aac1,aaf6,abed,fb1e,fe20-fe2f,101fd,102e0,10376-1037a,10a0d,10a0f,10a38-10a3a,10a3f,10ae5-10ae6,10d24-10d27,10eab-10eac,10efd-10eff,10f46-10f50,10f82-10f85,11046,11070,1107f,110b9-110ba,11100-11102,11133-11134,11173,111c0,111ca,11235-11236,112e9-112ea,1133b-1133c,1134d,11366-1136c,11370-11374,11442,11446,1145e,114c2-114c3,115bf-115c0,1163f,116b6-116b7,1172b,11839-1183a,1193d-1193e,11943,119e0,11a34,11a47,11a99,11c3f,11d42,11d44-11d45,11d97,11f41-11f42,16af0-16af4,16b30-16b36,16ff0-16ff1,1bc9e,1d165-1d169,1d16d-1d172,1d17b-1d182,1d185-1d18b,1d1aa-1d1ad,1d242-1d244,1e000-1e006,1e008-1e018,1e01b-1e021,1e023-1e024,1e026-1e02a,1e08f,1e130-1e136,1e2ae,1e2ec-1e2ef,1e4ec-1e4ef,1e8d0-1e8d6,1e944-1e94a'),
  space: ranges('9-d,1c-20,85,a0,1680,2000-200a,2028-2029,202f,205f,3000'),
  fullwidthLatin: ranges('ff21-ff3a,ff41-ff5a'),
};

function inRange(char, table) {
  const cp = char.codePointAt(0);
  let low = 0, high = table.length - 1;
  while (low <= high) {
    const mid = (low + high) >>> 1, [start, end] = table[mid];
    if (cp < start) high = mid - 1;
    else if (cp > end) low = mid + 1;
    else return true;
  }
  return false;
}
const isSpace = text => text.length > 0 && Array.from(text).every(c => inRange(c, unicode.space));
const isHiragana = cluster => inRange(first(cluster), unicode.hiragana);
const asciiWord = char => /^[A-Za-z0-9]$/.test(char);
const scriptKind = cluster => inRange(first(cluster), unicode.han) ? 'han'
  : inRange(first(cluster), unicode.katakana) || 'ーｰヽヾ'.includes(first(cluster)) ? 'katakana' : '';
const flags = n => new Array(n + 1).fill(false);
const some = (array, start, end) => array.slice(start, end).some(Boolean);
const mark = (array, start, end) => { for (let i = start + 1; i < end; i++) array[i] = true; };
const less = (left, right) => {
  for (let i = 0; i < left.length; i++) if (left[i] !== right[i]) return left[i] < right[i];
  return false;
};
const measuredWidth = row => Math.max(row[2], row[5]) - Math.min(0, row[3]);

function blockContext(text, table, width) {
  if (typeof text !== 'string' || !text.length || !table || !Array.isArray(table.boundaries) ||
      !Array.isArray(table.rows)) unavailable();
  const boundaries = table.boundaries, n = boundaries.length - 1;
  if (n < 1 || n > 420 || boundaries[0] !== 0 || boundaries[n] !== text.length ||
      boundaries.some((v, i) => !Number.isInteger(v) || v < 0 || v > text.length || i > 0 && v <= boundaries[i - 1]) ||
      table.rows.length !== n * (n + 1) / 2) unavailable();
  const clusters = boundaries.slice(0, -1).map((start, i) => text.slice(start, boundaries[i + 1]));
  for (let i = 0; i < n; i++) {
    const scalars = Array.from(clusters[i]), cp = scalars[0].codePointAt(0);
    if (scalars.some(c => { const value = c.codePointAt(0); return value >= 0xd800 && value <= 0xdfff; }) ||
        i > 0 && (inRange(first(clusters[i]), unicode.combining) || cp === 0x200d ||
          cp >= 0xfe00 && cp <= 0xfe0f || clusters[i - 1].endsWith('\u200d'))) unavailable();
  }
  const rows = Array.from({ length: n }, () => new Array(n + 1));
  for (const row of table.rows) {
    if (!Array.isArray(row) || row.length !== 7 || !row.every(finite) ||
        !Number.isInteger(row[0]) || !Number.isInteger(row[1]) || row[0] < 0 || row[1] > n || row[0] >= row[1] ||
        row[2] < 0 || row[5] < row[3] || row[6] < row[4] || rows[row[0]][row[1]]) unavailable();
    rows[row[0]][row[1]] = row;
  }
  const metric = (start, end) => rows[start]?.[end] || unavailable();
  const part = (start, end) => text.slice(boundaries[start], boundaries[end]);
  const fits = (start, end) => {
    while (start && noEnd.has(last(clusters[start - 1]))) start--;
    while (end < n && noStart.has(first(clusters[end]))) end++;
    return measuredWidth(metric(start, end)) <= width;
  };
  return { text, clusters, boundaries, n, metric, part, fits, width, scripts: clusters.map(scriptKind) };
}

function attachmentHints(ctx) {
  const result = flags(ctx.n);
  let attached = false;
  ctx.clusters.forEach((cluster, index) => {
    if (isHiragana(cluster)) result[index] = attached;
    else attached = !!ctx.scripts[index];
  });
  return result;
}

function bridgeHints(ctx) {
  const result = flags(ctx.n);
  for (let i = 2; i < ctx.n; i++) {
    result[i] = ctx.scripts[i] === 'han' && !!ctx.scripts[i - 2] &&
      bridges.has(first(ctx.clusters[i - 1].normalize('NFC')));
  }
  return result;
}

function fittingBridges(ctx, attachments, shortBridges) {
  const result = flags(ctx.n);
  let start = 0, hasBridge = false;
  for (let end = 1; end <= ctx.n; end++) {
    const connected = end < ctx.n && (attachments[end] || shortBridges[end] ||
      !!ctx.scripts[end - 1] && ctx.scripts[end - 1] === ctx.scripts[end]);
    if (connected) { hasBridge = hasBridge || shortBridges[end]; continue; }
    if (hasBridge && ctx.fits(start, end)) mark(result, start, end);
    start = end; hasBridge = false;
  }
  return result;
}

function fittingDeterminers(ctx) {
  const { clusters, scripts, n } = ctx, result = flags(n);
  const delimiters = new Set([...noEnd, ...Array.from('、。，．？！!?：；:;')]);
  const delimited = new Set([0]);
  for (let i = 1; i < n; i++) if (isSpace(last(clusters[i - 1])) || delimiters.has(last(clusters[i - 1]))) delimited.add(i);
  const starts = new Set(delimited), viewpoints = new Map();
  for (const start of delimited) for (const speaker of ['私', 'わたし', '僕', 'ぼく', '俺', 'おれ']) {
    for (const marker of ['は', 'にとって']) {
      const viewpoint = speaker + marker, end = start + Array.from(viewpoint).length;
      if (clusters.slice(start, end).join('') === viewpoint) { starts.add(end); viewpoints.set(end, start); }
    }
  }
  const written = clusters.map(c => first(c.normalize('NFC')));
  const compactPair = /^(?:その|この)(?:時間|こと|もの)(?:と|より)(?:その|この)(?:時間|こと|もの)[はがをにでのも]/u;
  const protectViewpoint = start => {
    if (!viewpoints.has(start)) return;
    const viewpointStart = viewpoints.get(start);
    let left = viewpointStart;
    // B9 extends only the opening marks here. The following determiner is
    // a separate measured run; do not attach its closing marks/viewpoint.
    while (left && noEnd.has(last(clusters[left - 1]))) left--;
    if (measuredWidth(ctx.metric(left, start)) <= ctx.width) mark(result, viewpointStart, start);
  };
  let expandedTail = false;
  for (let start = 0; start < n - 2; start++) {
    if (!starts.has(start)) continue;
    const pair = compactPair.exec(written.slice(start).join(''));
    const pairEnd = pair ? start + Array.from(pair[0]).length : null;
    if (pair && (pairEnd === n || !!scripts[pairEnd] || isSpace(first(clusters[pairEnd])) ||
        noStart.has(first(clusters[pairEnd]))) && ctx.fits(start, pairEnd)) {
      mark(result, start, pairEnd); expandedTail = true; protectViewpoint(start);
    }
    const prefix = clusters.slice(start, start + 2).join('').normalize('NFC');
    if (!['この', 'その', 'あの', 'どの'].includes(prefix) || !scripts[start + 2]) continue;
    const kind = scripts[start + 2];
    let end = start + 3;
    while (end < n && scripts[end] === kind) end++;
    let tailEnd = end;
    while (tailEnd < n && isHiragana(clusters[tailEnd])) tailEnd++;
    const ends = tailEnd - end >= 1 && tailEnd - end <= 2 ? [tailEnd, end] : [end];
    for (const candidateEnd of ends) if (ctx.fits(start, candidateEnd)) {
      mark(result, start, candidateEnd); expandedTail = expandedTail || candidateEnd > end;
      protectViewpoint(start); break;
    }
  }
  if (expandedTail) {
    let start = 0;
    while (start < n) {
      const kind = scripts[start];
      if (!kind) { start++; continue; }
      let end = start + 1;
      while (end < n && scripts[end] === kind) end++;
      let tailEnd = end;
      while (tailEnd < n && isHiragana(clusters[tailEnd])) tailEnd++;
      if (tailEnd - end >= 1 && tailEnd - end <= 2 && ctx.fits(start, tailEnd)) mark(result, start, tailEnd);
      start = tailEnd;
    }
  }
  return result;
}

function fittingLongKana(ctx, existing) {
  const result = flags(ctx.n);
  let start = 0;
  while (start < ctx.n) {
    const kind = ctx.scripts[start];
    if (!kind) { start++; continue; }
    let end = start + 1;
    while (end < ctx.n && ctx.scripts[end] === kind) end++;
    let tailEnd = end;
    while (tailEnd < ctx.n && isHiragana(ctx.clusters[tailEnd])) tailEnd++;
    if (tailEnd - end >= 3 && !some(existing, start, tailEnd) && ctx.fits(start, tailEnd)) mark(result, start, tailEnd);
    start = tailEnd;
  }
  return result;
}

function fittingCompetingKana(ctx, existing) {
  const result = flags(ctx.n);
  let start = 0;
  while (start < ctx.n) {
    const kind = ctx.scripts[start];
    let end = start + 1;
    if (kind) {
      while (end < ctx.n && ctx.scripts[end] === kind) end++;
      if (end - start > 1 && !some(existing, start, end) && ctx.fits(start, end)) mark(result, start, end);
    }
    start = end;
  }
  start = 0;
  while (start < ctx.n) {
    if (!isHiragana(ctx.clusters[start])) { start++; continue; }
    let end = start + 1;
    while (end < ctx.n && isHiragana(ctx.clusters[end])) end++;
    let runStart = start;
    if (start && ctx.scripts[start - 1]) {
      const kind = ctx.scripts[start - 1];
      while (runStart && ctx.scripts[runStart - 1] === kind) runStart--;
    }
    if (some(existing, runStart, end)) runStart = start;
    if (end - start >= 2 && !some(existing, runStart, end) && ctx.fits(runStart, end)) mark(result, runStart, end);
    start = end;
  }
  return result;
}

function fittingDurations(ctx) {
  const result = flags(ctx.n), offsets = new Map(ctx.boundaries.map((offset, index) => [offset, index]));
  const expression = /[0-9０-９]+(?:秒|分|時|日|週|[かヶ箇]月|年)間/gu;
  const identifier = char => asciiWord(char) || char === '_' || '０１２３４５６７８９'.includes(char) || inRange(char, unicode.fullwidthLatin);
  let match;
  while ((match = expression.exec(ctx.text)) !== null) {
    const start = offsets.get(match.index), end = offsets.get(match.index + match[0].length);
    if (start === undefined || end === undefined) continue;
    if (start && (identifier(last(ctx.clusters[start - 1])) || '.,．，/／+＋-－−'.includes(last(ctx.clusters[start - 1])))) continue;
    if (end < ctx.n && (identifier(first(ctx.clusters[end])) || !!ctx.scripts[end])) continue;
    if (ctx.fits(start, end)) mark(result, start, end);
  }
  return result;
}

function prepareHints(ctx) {
  const attachments = attachmentHints(ctx), shortBridges = bridgeHints(ctx);
  const bridgeRuns = fittingBridges(ctx, attachments, shortBridges), determiners = fittingDeterminers(ctx);
  let fitting = bridgeRuns.map((v, i) => v || determiners[i]);
  const longKana = fittingLongKana(ctx, fitting), hasLongKana = longKana.some(Boolean);
  fitting = fitting.map((v, i) => v || longKana[i]);
  if (hasLongKana) { const competing = fittingCompetingKana(ctx, fitting); fitting = fitting.map((v, i) => v || competing[i]); }
  const durations = fittingDurations(ctx);
  fitting = fitting.map((v, i) => v || durations[i]);
  return { attachments, shortBridges, fitting, hasLongKana, hasFitting: fitting.some(Boolean),
    words: ctx.clusters.map(c => asciiWord(first(c))), spaces: ctx.clusters.map(isSpace) };
}

function wrapSolutions(ctx, maxLines = null, lineHeight = null) {
  const { n, clusters, scripts, width } = ctx, h = ctx.hints;
  const costs = new Map([[n, new Map([[0, [0, 0, 0, 0, 0, 0, 0, 0]]])]]), choices = new Map();
  for (let start = n - 1; start >= 0; start--) {
    let best = new Map();
    for (let end = start + 1; end <= n; end++) {
      if (!costs.has(end) || end < n && (noStart.has(first(clusters[end])) || noEnd.has(last(clusters[end - 1])))) continue;
      const m = ctx.metric(start, end), measured = measuredWidth(m);
      if (measured > width || lineHeight !== null && m[6] - m[4] > lineHeight) continue;
      const split = Number(end < n && (h.words[end - 1] && h.words[end] ||
        h.spaces[end] && (h.spaces[end - 1] || end + 1 < n && h.spaces[end + 1])));
      const scriptSplit = Number(end < n && (!!scripts[end - 1] && scripts[end - 1] === scripts[end] ||
        'っッ'.includes(last(clusters[end - 1])) && inRange(first(clusters[end]), unicode.letter)));
      const orphan = Number(end < n && end >= 2 && '。！？!?'.includes(last(clusters[end - 2])));
      const singleton = Number(h.hasFitting && end - start === 1);
      for (const [tailCount, tail] of costs.get(end)) {
        const count = tailCount + 1;
        if (maxLines !== null && count > maxLines) continue;
        const score = [tail[0] + Number(h.fitting[end]) + singleton + Number(h.hasLongKana && orphan), count,
          tail[2] + split, tail[3] + scriptSplit, tail[4] + orphan, tail[5] + Number(h.attachments[end]),
          tail[6] + Number(h.shortBridges[end]), tail[7] + (width - measured) ** 2];
        if (!best.has(count) || less(score, best.get(count))) {
          best.set(count, score); choices.set(start + ':' + count, [end, tailCount]);
        }
      }
    }
    if (best.size) {
      if (maxLines === null) {
        let winner = null;
        for (const [count, score] of best) if (winner === null || less(score, best.get(winner))) winner = count;
        best = new Map([[winner, best.get(winner)]]);
      }
      costs.set(start, best);
    }
  }
  if (!costs.has(0)) return null;
  const solutions = new Map();
  for (const [count, score] of costs.get(0)) {
    const rows = [];
    let start = 0, remaining = count;
    while (start < n) {
      const [end, tail] = choices.get(start + ':' + remaining);
      rows.push({ text: ctx.part(start, end), metric: ctx.metric(start, end) }); start = end; remaining = tail;
    }
    solutions.set(count, { score, rows });
  }
  return solutions;
}

function minimum(values) {
  let best = null;
  for (const value of values) if (best === null || less(value.score, best.score)) best = value;
  return best;
}

function fitGroups(contexts, lineHeight, gap, availableHeight) {
  const paragraphHeight = (contexts.length - 1) * gap;
  let maxLines = Math.floor((availableHeight - paragraphHeight) / lineHeight);
  if ((maxLines + 1) * lineHeight + paragraphHeight <= availableHeight) maxLines++;
  if (maxLines * lineHeight + paragraphHeight > availableHeight) maxLines--;
  if (maxLines < contexts.length) return null;
  let choices = new Map([[0, { score: [0, 0, 0, 0, 0, 0, 0, 0], groups: [] }]]);
  for (let index = 0; index < contexts.length; index++) {
    const remaining = contexts.length - index - 1;
    const limit = maxLines - Math.min(...choices.keys()) - remaining;
    const solutions = wrapSolutions(contexts[index], limit, lineHeight);
    if (!solutions) return null;
    const next = new Map();
    for (const [used, prior] of [...choices].sort((a, b) => a[0] - b[0])) {
      for (const [count, current] of [...solutions].sort((a, b) => a[0] - b[0])) {
        const total = used + count;
        if (total + remaining > maxLines) continue;
        const score = prior.score.map((value, i) => value + current.score[i]);
        if (!next.has(total) || less(score, next.get(total).score)) next.set(total, { score, groups: [...prior.groups, current.rows] });
      }
    }
    if (!next.size) return null;
    choices = next;
  }
  return minimum(choices.values()).groups;
}

/** One catalog font candidate. Tables contain all contiguous grapheme ranges:
 * {boundaries:[UTF16 offsets including 0/end], rows:[[startIndex,endIndex,
 * advance,left,top,right,bottom],...]}. Missing/duplicate/nonfinite metrics
 * throw; a measured font that cannot fit returns null for the next size.
 */
export function planPieceMeasuredRows(input, sizeIndex, measurements) {
  if (!input || !Array.isArray(input.blocks) || !input.blocks.length || !Array.isArray(input.sizes) ||
      !Number.isInteger(sizeIndex) || sizeIndex < 0 || sizeIndex >= input.sizes.length ||
      !finite(input.sizes[sizeIndex]) || input.sizes[sizeIndex] <= 0 ||
      !finite(input.contentWidth) || input.contentWidth <= 0 || !finite(input.contentHeight) || input.contentHeight <= 0 ||
      !finite(input.lineRatio) || input.lineRatio <= 0 || !finite(input.paragraphRatio) || input.paragraphRatio < 0 ||
      !Array.isArray(measurements) || measurements.length !== input.blocks.length) unavailable();
  const lineHeight = Math.ceil(input.sizes[sizeIndex] * input.lineRatio), gap = lineHeight * input.paragraphRatio;
  if (!finite(lineHeight) || lineHeight <= 0 || !finite(gap)) unavailable();
  const contexts = input.blocks.map((text, index) => blockContext(text, measurements[index], input.contentWidth));
  for (const context of contexts) context.hints = prepareHints(context);
  let groups = [];
  for (const context of contexts) {
    const solutions = wrapSolutions(context);
    if (!solutions) return null;
    groups.push(minimum(solutions.values()).rows);
  }
  const height = candidate => candidate.reduce((sum, group) => sum + group.length, 0) * lineHeight + (candidate.length - 1) * gap;
  if (height(groups) > input.contentHeight || groups.some(group => group.some(row => row.metric[6] - row.metric[4] > lineHeight))) {
    groups = fitGroups(contexts, lineHeight, gap, input.contentHeight);
    if (!groups) return null;
  }
  const result = groups.map(group => group.map(row => row.text));
  if (result.some((group, index) => group.join('') !== input.blocks[index])) unavailable();
  return { groups: result, lineHeight, gap, totalHeight: height(groups) };
}
