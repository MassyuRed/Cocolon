'use strict';
// Actual JS export orchestration; filesystem/native/OS calls are synthetic.
// This suite does not certify pixels, fonts, native compatibility or OS handoff.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const crypto = require('node:crypto');
const { crc32, deflateSync } = require('node:zlib');
const ROOT = path.resolve(__dirname, '..');
const clone = x => JSON.parse(JSON.stringify(x));
const deferred = () => { let resolve; const promise = new Promise(r => { resolve = r; }); return {promise, resolve}; };
function pngChunk(type, data = Buffer.alloc(0)) {
  const payload = Buffer.concat([Buffer.from(type), data]);
  const result = Buffer.alloc(12 + data.length);
  result.writeUInt32BE(data.length); payload.copy(result, 4); result.writeUInt32BE(crc32(payload), result.length - 4);
  return result;
}
const width = 1080, height = 1350;
const header = Buffer.alloc(13); header.writeUInt32BE(width); header.writeUInt32BE(height, 4); header[8] = 8;
const legacyPng = Buffer.concat([Buffer.from([137,80,78,71,13,10,26,10]), pngChunk('IHDR', header),
  pngChunk('IDAT', deflateSync(Buffer.alloc((width + 1) * height))), pngChunk('IEND')]);
function fixture() {
  const context = vm.createContext({require, __dirname});
  const prefix = fs.readFileSync(path.join(__dirname, 'piece-v2-preview-display.test.js'), 'utf8').split('function deferredPieceResponse')[0];
  vm.runInContext(prefix + '\nglobalThis.value = response();', context);
  const p = clone(context.value);
  for (const k of ['preview_id','preview_revision','expires_at','eligible_formats','quota','plan_capabilities']) delete p[k];
  const id = '30000000-0000-4000-8000-000000000003';
  return {...p, piece_id:id, public_id:'piece:'+id, lifecycle_status:'saved', saved_at:'2026-01-01T00:00:00Z',
    export_contract_version:'piece.export_contract.v1', render_interface_version:'piece.render_interface.v1',
    render_reproducibility_version:'piece.render_reproducibility.v1', renderer_version:'piece.rn_native_preview.prototype.v3'};
}
function harness({os='ios', version=35, record=fixture()} = {}) {
  const calls = [], files = new Map(), state = {current:true, canvas:true, png:legacyPng, validPng:true, hash:'a'.repeat(64), granted:true};
  const FileSystem = {
    exists: async p => files.has(p),
    mkdir: async p => {calls.push(['mkdir',p]); if(files.has(p)) throw Error('EEXIST'); files.set(p,'directory');},
    ls: async p => {calls.push(['ls',p]); if(state.rawListWait) await state.rawListWait.promise;
      if(state.rawListError) throw Error('PRIVATE '+p); return ['piece-old.png','foreign.png'];},
    unlink: async p => { calls.push(['unlink',p]);
      if(state.cleanupError && p.startsWith('/cache/piece-export/') || state.rawUnlinkError && p.startsWith('/cache/piece-capture/')) throw Error('PRIVATE '+p);
      files.delete(p); },
    cp: async (a,b) => {calls.push(['cp',a,b]);files.set(b,'file');},
    stat: async p => ({type:files.get(p),size:state.png.length}),
    readFileChunk: async (p, offset, length) => state.validPng ? state.png.subarray(offset, offset + length).toString('base64') : 'bad',
    hash: async () => { if(state.hashWait) await state.hashWait.promise; return state.hash; },
  };
  const context = vm.createContext({ crypto:crypto.webcrypto, Uint8Array, FileSystem, Dirs:{CacheDir:'/cache'},
    Platform:{OS:os,Version:version},
    PermissionsAndroid:{PERMISSIONS:{WRITE_EXTERNAL_STORAGE:'write'},RESULTS:{GRANTED:'granted'},request:async()=>{
      calls.push(['permission']); if(state.permissionWait) await state.permissionWait.promise; return state.granted?'granted':'denied';}},
    captureRef: async (node, options) => {calls.push(['capture',clone(options)]); if(state.captureWait) await state.captureWait.promise;
      if (state.captureError) throw state.captureError;
      return state.raw || '/cache/piece-capture/piece-new.png';},
    releaseCapture:p=>calls.push(['release',p]),
    Share:{open:async options=>{calls.push(['share',clone(options)]); if(state.shareWait) await state.shareWait.promise; if(state.shareError) throw Error('PRIVATE'); return state.shareResult;}},
    CameraRoll:{saveAsset:async(...args)=>{calls.push(['photo',...args]); if(state.photoWait) await state.photoWait.promise;
      if(state.photoError) throw Error('PRIVATE_PHOTO');}},
    NativeModules:{RNCCameraRoll:{saveToCameraRoll:async(...args)=>{calls.push(['photo',...args]);
      if(state.photoWait) await state.photoWait.promise; if(state.photoError) throw Error('PRIVATE_PHOTO');
      return Object.hasOwn(state,'photoResult') ? state.photoResult : {saved:true};}}},
  });
  for (const [file,names] of [
    ['features/piece/piecePalette.js', ['PIECE_THEME_COLORS', 'PIECE_LEGACY_THEME_IDS', 'PIECE_THEME_IDS', 'PIECE_VISUAL_CATALOG_V1']],
    ['features/piece/pieceApi.js',['PieceApiError','readPiecePreviewSnapshot','readPieceOwnerSnapshot']],
    ['features/piece/piecePreviewModel.js',['verifyPieceArtifactHashes']],
    ['features/piece/pieceOwnerModel.js',['readPieceOwnerDisplay']],
    ['features/piece/pieceLayout.js',['preparePieceNativeSavedDisplay','PIECE_NATIVE_PREVIEW_VERSION','PIECE_BITMAP_RENDERER_VERSION','PIECE_BITMAP_RENDERER_V2_VERSION']],
    ['features/piece/pieceExportPngProfile.js',['verifyPieceExportPngStructure']],
  ]) {
    const source=fs.readFileSync(path.join(ROOT,file),'utf8').replace(/^import .*;$/gm,'').replace(/^export /gm,'');
    vm.runInContext(`{${source}\n${names.map(n=>`globalThis.${n}=${n};`).join('\n')}}`,context);
  }
  context.verifyPieceExportPngSrgb=async()=>{ calls.push(['profile']); if(state.profileError) throw Error('bad profile'); return true; };
  context.requestPieceOwner=async(action,body,options)=>{
    if (action === 'exportReceipt') {
      calls.push(['receipt',clone(body),clone(options)]);
      if (state.receiptWait) await state.receiptWait.promise;
      if (state.receiptError) throw state.receiptError;
      return {export_id:'a0a5bf38-ef0d-49d1-acb3-047d163388c3'};
    }
    calls.push(['detail',action,clone(body),clone(options)]);
    options.onExportReceiptSupport?.(state.receiptSupported);
    if(state.exportWait) await state.exportWait.promise;
    if(state.exportError) throw state.exportError;
    return state.latestRecord || record;
  };
  const source=fs.readFileSync(path.join(ROOT,'features/piece/pieceExport.js'),'utf8').replace(/^import .*;$/gm,'').replace(/^export /gm,'');
  vm.runInContext(`{${source}\nglobalThis.prepare=preparePieceExportPrototype;}`,context);
  const target=()=>({...context.preparePieceNativeSavedDisplay(record),node:{},isCurrent:()=>state.canvas});
  return {calls,state,files,record,target, prepare:()=>context.prepare({pieceId:record.piece_id,expectedUserId:'owner',isCurrent:()=>{ state.currentCalls=(state.currentCalls||0)+1; if(state.currentCalls===state.revokeAtCurrent) queueMicrotask(()=>{state.current=false;}); return state.current; }})};
}
const count=(h,kind)=>h.calls.filter(c=>c[0]===kind).length;
const failure=p=>assert.rejects(p,e=>e.code==='PIECE_TEMPORARILY_UNAVAILABLE');
for (const version of ['piece.rn_bitmap_renderer.ios.v1','piece.rn_bitmap_renderer.ios.v2']) test(`explicit iOS bitmap ${version} capture preserves renderer and requires private native identity options`, async()=>{
  const h=harness({record:{...fixture(),renderer_version:version}}),job=await h.prepare();
  await failure(job.capture(h.target()));assert.equal(count(h,'capture'),0);
  const target={...h.target(),bitmapToken:'saved-artifact',bitmapBinding:'saved-binding'};
  const asset=await job.capture(target);
  const options=h.calls.find(c=>c[0]==='capture')[1];
  assert.equal(options.useRenderInContext,true);assert.equal(options.cocolonPieceBitmapToken,'saved-artifact');assert.equal(options.cocolonPieceBitmapBinding,'saved-binding');
  assert.equal(asset.candidate.renderer_version,version);await asset.dispose();
  const android=harness({os:'android',record:{...fixture(),renderer_version:version}});
  await failure(android.prepare());assert.equal(count(android,'capture'),0);
});
async function image(h) {return (await h.prepare()).capture(h.target());}

for (const os of ['android', 'ios']) test(`rejected ${os} native capture cannot create an export copy or reach the OS and can be retried`, async () => {
  const h = harness({ os });
  const job = await h.prepare();
  h.state.captureError = new Error('PRIVATE native encoder diagnostic');
  await failure(job.capture(h.target()));
  assert.equal(count(h, 'capture'), 1);
  assert.equal(count(h, 'cp'), 0);
  assert.equal(count(h, 'release'), 0);
  assert.equal(h.calls.some(call => call[0] === 'mkdir' && call[1].startsWith('/cache/piece-export/')), false);
  assert.equal(count(h, 'profile') + count(h, 'receipt'), 0);
  assert.equal(count(h, 'photo') + count(h, 'share'), 0);

  h.state.captureError = null;
  const asset = await job.capture(h.target());
  assert.equal((await asset.saveToPhotos()).outcome, 'saved_to_photos');
  assert.equal(count(h, 'capture'), 2);
  assert.equal(count(h, 'photo'), 1);
});

test('Android and legacy iOS exports reject truncated PNGs before capture acceptance or OS handoff', async () => {
  for (const os of ['android', 'ios']) {
    const valid = harness({os}), asset = await image(valid);
    assert.equal((await asset.saveToPhotos()).outcome, 'saved_to_photos');
    assert.equal(count(valid, 'profile') + count(valid, 'receipt'), 0);
    for (const length of [legacyPng.length - 12, legacyPng.length - 1]) {
      const corrupt = harness({os}); corrupt.state.png = legacyPng.subarray(0, length);
      await failure(image(corrupt));
      assert.equal(count(corrupt, 'photo') + count(corrupt, 'share'), 0);
      assert.equal(count(corrupt, 'release'), 1);
    }
    const changed = harness({os}), prepared = await image(changed);
    changed.state.png = legacyPng.subarray(0, legacyPng.length - 12);
    await failure(prepared.openShare());
    assert.equal(count(changed, 'share'), 0);
  }
});

test('fresh owner detail, verified saved canvas, exact PNG and body-free identity precede iOS add-only save', async()=>{
  const h=harness(), job=await h.prepare(), asset=await job.capture(h.target());
  assert.equal(h.calls[0][1],'export'); assert.equal(h.calls[0][3].expectedUserId,'owner');
  const capture=h.calls.find(c=>c[0]==='capture')[1]; assert.equal(capture.cocolonPieceCache,true);
  assert.deepEqual([capture.width,capture.height],[1080,1350]);
  assert.equal(asset.candidate.piece_id,h.record.public_id); assert.equal(asset.candidate.asset_sha256,'a'.repeat(64));
  assert.equal(JSON.stringify(asset.candidate).includes(h.record.piece_text),false);
  assert.equal(asset.candidate.layout_state,undefined);
  const filename=h.calls.find(c=>c[0]==='cp')[2];
  assert.match(filename,/^\/cache\/piece-export\/[a-f0-9]{32}\/cocolon-piece_30000000000040008000000000000003_[a-f0-9]{12}_4x5\.png$/);
  assert.equal((await asset.saveToPhotos()).outcome,'saved_to_photos');
  assert.deepEqual(clone(h.calls.find(c=>c[0]==='photo')[2]),{type:'photo',album:'',cocolonAddOnly:true});
  assert.equal(count(h,'permission'),0); assert.equal(count(h,'release'),1);
  assert.ok(h.calls.some(c=>c[0]==='unlink'&&/^\/cache\/piece-export\//.test(c[1])));
  await failure(asset.saveToPhotos()); await failure(job.capture(h.target()));
});

for (const action of ['saveToPhotos','openShare']) {
  test(`server export stop or lost ownership before ${action} prevents OS handoff`,async()=>{
    for (const code of ['PIECE_FEATURE_DISABLED','PIECE_AUTH_REQUIRED','PIECE_NOT_FOUND']) {
      const h=harness(), asset=await image(h);
      h.state.exportError=Object.assign(new Error(code),{code});
      if (code === 'PIECE_FEATURE_DISABLED') await assert.rejects(asset[action](), error => error.code === code);
      else await failure(asset[action]());
      assert.equal(count(h,'photo'),0);assert.equal(count(h,'share'),0);
    }
  });
  test(`changed saved artifact before ${action} prevents OS handoff`,async()=>{
    const h=harness(), asset=await image(h);
    h.state.latestRecord={...h.record,row_version:h.record.row_version+1};
    await failure(asset[action]());
    assert.equal(count(h,'photo'),0);assert.equal(count(h,'share'),0);
  });
}

test('server export stop during Android permission dialog prevents saving',async()=>{
  const h=harness({os:'android',version:28}),asset=await image(h);
  h.state.permissionWait=deferred();
  const saving=asset.saveToPhotos();
  await new Promise(r=>setImmediate(r));
  h.state.exportError=new Error('stopped');h.state.permissionWait.resolve();
  await failure(saving);assert.equal(count(h,'photo'),0);
});
test('first-use raw cleanup owns only its exact filenames and dispose is idempotent',async()=>{
  const h=harness(), asset=await image(h); await asset.dispose(); await asset.dispose();
  assert.equal(h.calls.some(c=>c[0]==='unlink'&&c[1].endsWith('foreign.png')),false);
  assert.equal(h.calls.filter(c=>c[0]==='unlink'&&c[1].startsWith('/cache/piece-export/')).length,1);
  await failure(asset.openShare());
});
test('existing raw directory survives restart and is cleaned once before new captures',async()=>{
  const h=harness({os:'android'}); h.files.set('/cache/piece-capture','directory');
  const first=await h.prepare(); await h.prepare();
  assert.equal(h.calls.some(c=>c[0]==='mkdir'&&c[1]==='/cache/piece-capture'),false);
  assert.equal(count(h,'ls'),1);
  assert.equal(h.calls.filter(c=>c[0]==='unlink'&&c[1]==='/cache/piece-capture/piece-old.png').length,1);
  const asset=await first.capture(h.target()); await asset.dispose();
  assert.equal(count(h,'capture'),1);
});
test('a file occupying the raw directory cannot be enumerated or deleted as a directory',async()=>{
  const h=harness({os:'android'}); h.files.set('/cache/piece-capture','file');
  await failure(h.prepare());
  assert.equal(count(h,'ls'),0); assert.equal(count(h,'unlink'),0); assert.equal(count(h,'capture'),0);
});
for (const stage of ['rawListError','rawUnlinkError']) test(`failed raw cleanup at ${stage} recovers only on the next explicit preparation`,async()=>{
  const h=harness(); h.state[stage]=true;
  await assert.rejects(h.prepare(),e=>e.code==='PIECE_TEMPORARILY_UNAVAILABLE'&&!/PRIVATE|cache/.test(e.message));
  assert.equal(count(h,'ls'),1); assert.equal(count(h,'capture'),0);
  h.state[stage]=false;
  await new Promise(r=>setImmediate(r));
  assert.equal(count(h,'ls'),1); assert.equal(count(h,'capture'),0);
  const job=await h.prepare();
  assert.equal(count(h,'ls'),2); assert.equal(count(h,'capture'),0);
  const asset=await job.capture(h.target()); await asset.dispose();
  await h.prepare();
  assert.equal(count(h,'ls'),2); assert.equal(count(h,'capture'),1);
  assert.equal(h.calls.some(c=>c[0]==='unlink'&&c[1].endsWith('foreign.png')),false);
});
test('concurrent preparations share a failed cleanup and its later pending recovery before capture',async()=>{
  const h=harness(); h.state.rawListWait=deferred(); h.state.rawListError=true;
  const initial=Promise.all([failure(h.prepare()),failure(h.prepare())]);
  await new Promise(r=>setImmediate(r));
  assert.equal(count(h,'ls'),1); assert.equal(count(h,'capture'),0);
  h.state.rawListWait.resolve(); await initial;
  h.state.rawListWait=deferred(); h.state.rawListError=false;
  let ready=0;
  const retries=Promise.all([h.prepare(),h.prepare()].map(p=>p.then(job=>{ready++;return job;})));
  await new Promise(r=>setImmediate(r));
  assert.equal(count(h,'ls'),2); assert.equal(ready,0); assert.equal(count(h,'capture'),0);
  h.state.rawListWait.resolve();
  const [job]=await retries;
  assert.equal(ready,2);
  const asset=await job.capture(h.target()); await asset.dispose();
  await h.prepare();
  assert.equal(count(h,'ls'),2); assert.equal(count(h,'capture'),1);
});
test('bad saved hashes, unsupported platform and stale runtime never capture',async()=>{
  for(const mutate of [h=>h.record.piece_text_hash='0'.repeat(64), h=>h.state.current=false]) {
    const h=harness();mutate(h);await assert.rejects(h.prepare(),e=>/^PIECE_/.test(e.code));assert.equal(count(h,'capture'),0);
  }
  const h=harness({os:'web'});await failure(h.prepare());assert.equal(count(h,'detail'),0);
});
test('wrong or revoked canvas cannot be captured or handed off',async()=>{
  const h=harness(),job=await h.prepare(); await failure(job.capture({...h.target(),key:'wrong'}));
  h.state.captureWait=deferred();const pending=job.capture(h.target()); h.state.canvas=false;h.state.captureWait.resolve();
  await failure(pending);assert.equal(count(h,'cp'),0);assert.equal(count(h,'release'),1);
});
test('capture may only release exact owned raw PNG paths',async()=>{
  for(const raw of ['/cache/other.png','/cache/piece-capture/../other.png','file:///cache/piece-capture/sub/x.png']) {
    const h=harness();h.state.raw=raw;await failure(image(h));assert.equal(count(h,'release'),0);assert.equal(count(h,'cp'),0);
  }
});
test('invalid pixels and changed bytes cannot reach either OS action',async()=>{
  const h=harness();h.state.validPng=false;await failure(image(h));assert.equal(count(h,'photo'),0);
  const changed=harness(),asset=await image(changed);changed.state.hash='b'.repeat(64);
  await failure(asset.openShare());assert.equal(count(changed,'share'),0);
  assert.ok(changed.calls.some(c=>c[0]==='unlink'&&c[1].startsWith('/cache/piece-export/')));
});
test('share reserves one action before asynchronous verification and retains handed-off bytes',async()=>{
  const h=harness({os:'android'}),asset=await image(h);h.state.hashWait=deferred();h.state.shareResult={success:true};
  const share=asset.openShare();await failure(asset.saveToPhotos());h.state.hashWait.resolve();await share;
  await asset.dispose();assert.equal(count(h,'share'),1);assert.equal(count(h,'photo'),0);
  assert.equal(h.calls.some(c=>c[0]==='unlink'&&c[1].startsWith('/cache/piece-export/')),false);
});
for (const completed of [true,false]) test(`iOS ${completed?'completed':'cancelled'} share clears only its copy after the native session ends`,async()=>{
  const h=harness(),asset=await image(h);
  h.state.shareWait=deferred();h.state.shareResult=completed?{success:true,message:'PRIVATE_APP'}:{success:false,dismissedAction:true,message:'PRIVATE_APP'};
  const pending=asset.openShare();await new Promise(r=>setImmediate(r));
  const copied=h.calls.find(c=>c[0]==='cp')[2],directory=path.dirname(copied);
  assert.equal(count(h,'share'),1);
  await asset.dispose();h.state.current=false;
  assert.equal(h.calls.some(c=>c[0]==='unlink'&&c[1]===directory),false);
  h.state.shareWait.resolve();
  assert.deepEqual(clone(await pending),{outcome:completed?'share_result_returned':'cancelled'});
  assert.equal(h.calls.filter(c=>c[0]==='unlink'&&c[1]===directory).length,1);
  await asset.dispose();assert.equal(h.calls.filter(c=>c[0]==='unlink'&&c[1]===directory).length,1);
  assert.equal(h.calls.some(c=>c[0]==='unlink'&&c[1]==='/cache/piece-export'),false);
  await failure(asset.openShare());
});
test('Android cancellation is distinct from failure but does not prove the external file can be deleted',async()=>{
  const h=harness({os:'android'}),asset=await image(h);
  h.state.shareResult={success:false,dismissedAction:true,message:'PRIVATE_APP'};
  assert.deepEqual(clone(await asset.openShare()),{outcome:'cancelled'});await asset.dispose();
  assert.equal(h.calls.some(c=>c[0]==='unlink'&&c[1].startsWith('/cache/piece-export/')),false);
});
test('unknown or contradictory iOS share results do not authorize cleanup or cancellation',async()=>{
  for(const result of [undefined,null,{}, {success:'true'}, {success:false}, {success:true,dismissedAction:true}]) {
    const h=harness(),asset=await image(h);h.state.shareResult=result;
    assert.deepEqual(clone(await asset.openShare()),{outcome:'share_result_returned'});await asset.dispose();
    assert.equal(h.calls.some(c=>c[0]==='unlink'&&c[1].startsWith('/cache/piece-export/')),false);
  }
});
test('cleanup failure preserves iOS completion or cancellation without exposing details or sharing again',async()=>{
  for(const completed of [true,false]) {
    const h=harness(),asset=await image(h);
    h.state.shareResult=completed?{success:true}:{success:false,dismissedAction:true};h.state.cleanupError=true;
    assert.deepEqual(clone(await asset.openShare()),{outcome:completed?'share_result_returned':'cancelled',cleanup_failed:true});
    await failure(asset.openShare());assert.equal(count(h,'share'),1);
  }
});
test('new export retries only known-safe cleanup; a copy with unknown share completion stays available', async () => {
  const h = harness();
  const shared = await image(h);
  const sharedDirectory = h.calls.find(call => call[0] === 'cp')[2].split('/').slice(0, -1).join('/');
  await shared.openShare(); // Missing native result does not establish session end.
  const finished = await image(h);
  const finishedDirectory = h.calls.filter(call => call[0] === 'cp').at(-1)[2].split('/').slice(0, -1).join('/');
  h.state.shareResult = { success: true };
  h.state.cleanupError = true;
  assert.deepEqual(clone(await finished.openShare()), { outcome: 'share_result_returned', cleanup_failed: true });
  assert.ok(h.files.has(finishedDirectory));
  h.state.cleanupError = false;
  await Promise.all([h.prepare(), finished.dispose(), finished.dispose()]);
  assert.equal(h.files.has(finishedDirectory), false);
  assert.equal(h.calls.filter(call => call[0] === 'unlink' && call[1] === finishedDirectory).length, 2);
  assert.equal(h.calls.filter(call => call[0] === 'unlink' && call[1] === sharedDirectory).length, 0);
  assert.ok(h.files.has(sharedDirectory));
  assert.equal(count(h, 'share'), 2);
});
test('dispose while verifying prevents OS handoff and waits before deleting the file',async()=>{
  const h=harness(),asset=await image(h);h.state.hashWait=deferred();const share=asset.openShare();
  await asset.dispose();assert.equal(h.calls.some(c=>c[0]==='unlink'&&c[1].startsWith('/cache/piece-export/')),false);
  h.state.hashWait.resolve();await failure(share);assert.equal(count(h,'share'),0);
  assert.ok(h.calls.some(c=>c[0]==='unlink'&&c[1].startsWith('/cache/piece-export/')));
});
test('Android legacy permission denial and runtime revocation after permission do not save',async()=>{
  for(const revoked of [false,true]) {
    const h=harness({os:'android',version:28}),asset=await image(h);h.state.permissionWait=deferred();h.state.granted=revoked;
    const pending=asset.saveToPhotos();await new Promise(r=>setImmediate(r));if(revoked)h.state.current=false;
    h.state.permissionWait.resolve();await failure(pending);assert.equal(count(h,'photo'),0);
  }
});
test('Android scoped storage needs no read permission and pending save retains its file',async()=>{
  const h=harness({os:'android'}),asset=await image(h);h.state.photoWait=deferred();const pending=asset.saveToPhotos();
  await new Promise(r=>setImmediate(r));await asset.dispose();
  assert.equal(count(h,'photo'),1);assert.equal(count(h,'permission'),0);
  assert.equal(h.calls.some(c=>c[0]==='unlink'&&c[1].startsWith('/cache/piece-export/')),false);
  h.state.photoWait.resolve();await pending;
  assert.ok(h.calls.some(c=>c[0]==='unlink'&&c[1].startsWith('/cache/piece-export/')));
});
test('share errors expose no native details and retain a possibly-consumed file',async()=>{
  const h=harness(),asset=await image(h);h.state.shareError=true;await failure(asset.openShare());await asset.dispose();
  assert.equal(h.calls.some(c=>c[0]==='unlink'&&c[1].startsWith('/cache/piece-export/')),false);
});

test('owner change between verification return and share continuation prevents handoff',async()=>{
  const h=harness(),asset=await image(h);
  h.state.revokeAtCurrent=h.state.currentCalls+3;
  await failure(asset.openShare());assert.equal(count(h,'share'),0);
});

for (const os of ['ios','android']) {
  test(`${os} photo success survives copy cleanup failure without another OS save`,async()=>{
    const h=harness({os}),asset=await image(h);h.state.cleanupError=true;
    assert.deepEqual(clone(await asset.saveToPhotos()),{outcome:'saved_to_photos',cleanup_failed:true});
    await failure(asset.saveToPhotos());await failure(asset.openShare());
    h.state.cleanupError=false; await asset.dispose();
    assert.equal(count(h,'photo'),1);assert.equal(count(h,'share'),0);
  });
  test(`${os} confirmed photo result survives owner loss and dispose during native save`,async()=>{
    const h=harness({os}),asset=await image(h);h.state.photoWait=deferred();
    const pending=asset.saveToPhotos();await new Promise(r=>setImmediate(r));
    assert.equal(count(h,'photo'),1);h.state.current=false;await asset.dispose();
    assert.equal(h.calls.some(c=>c[0]==='unlink'&&c[1].startsWith('/cache/piece-export/')),false);
    h.state.photoWait.resolve();assert.deepEqual(clone(await pending),{outcome:'saved_to_photos'});
    assert.equal(h.calls.filter(c=>c[0]==='unlink'&&c[1].startsWith('/cache/piece-export/')).length,1);
    await failure(asset.saveToPhotos());assert.equal(count(h,'photo'),1);
  });
  test(`${os} rejected native photo save remains an error even when cleanup also fails`,async()=>{
    const h=harness({os}),asset=await image(h);h.state.photoError=true;h.state.cleanupError=true;
    await assert.rejects(asset.saveToPhotos(),e=>e.code==='PIECE_TEMPORARILY_UNAVAILABLE'&&
      !/PRIVATE|cache|piece-export/.test(e.message));
    await failure(asset.saveToPhotos());assert.equal(count(h,'photo'),1);
  });
  test(`${os} owner loss before photo handoff prevents saving`,async()=>{
    const h=harness({os}),asset=await image(h);h.state.hashWait=deferred();
    const pending=asset.saveToPhotos();h.state.current=false;h.state.hashWait.resolve();
    await failure(pending);assert.equal(count(h,'photo'),0);
  });
}

test('iOS missing or non-boolean save acknowledgement never becomes photo success',async()=>{
  for(const result of [undefined,null,{}, {saved:false}, {saved:'true'}, {saved:1}]) {
    const h=harness(),asset=await image(h);h.state.photoResult=result;h.state.cleanupError=true;
    await failure(asset.saveToPhotos());assert.equal(count(h,'photo'),1);
  }
});


const receiptRenderer = 'piece.rn_bitmap_renderer.ios.v2';
const bitmapTarget = h => ({...h.target(), bitmapToken:'saved-artifact', bitmapBinding:'saved-binding'});

test('receipt acknowledgement precedes OS handoff, and a lost response retries the same image, key and request', async()=>{
  const h=harness({record:{...fixture(),renderer_version:receiptRenderer}});
  h.state.receiptSupported=true;
  const job=await h.prepare(), asset=await job.capture(bitmapTarget(h));
  h.state.receiptError={code:'PIECE_TEMPORARILY_UNAVAILABLE'};
  await assert.rejects(asset.saveToPhotos(), e=>e.constructor.name==='PieceExportReceiptRetryError');
  assert.equal(count(h,'photo'),0);
  assert.equal(count(h,'receipt'),1);
  assert.equal(count(h,'capture'),1);
  assert.ok([...h.files.keys()].some(path=>path.endsWith('.png')));
  h.state.receiptError=null;
  assert.equal((await asset.saveToPhotos()).outcome,'saved_to_photos');
  const receipts=h.calls.filter(call=>call[0]==='receipt');
  assert.equal(receipts.length,2);
  assert.deepEqual(receipts[0],receipts[1]);
  const payload=receipts[0][1].receipt;
  assert.equal(payload.output_profile,'png_1080x1350_srgb_v1');
  assert.equal(payload.piece_id,h.record.public_id);
  assert.equal(payload.expected_row_version,h.record.row_version);
  assert.equal(payload.asset_sha256,'a'.repeat(64));
  assert.equal(payload.renderer_version,receiptRenderer);
  assert.equal(payload.persistent_server_asset,false);
  assert.equal(payload.body_free,true);
  assert.match(receipts[0][2].idempotencyKey,/^[0-9a-f]{32}$/);
  assert.doesNotMatch(JSON.stringify(receipts), /\/cache\/|file:\/\/|recipient|outcome|piece_text":/);
  assert.ok(h.calls.lastIndexOf(receipts[1]) < h.calls.findIndex(call=>call[0]==='photo'));
  assert.equal(count(h,'photo'),1);
  assert.equal(count(h,'profile'),3);
});

test('unsupported server keeps existing export behavior; strict invalid PNG sends no receipt or OS call', async()=>{
  const record={...fixture(),renderer_version:receiptRenderer};
  const old=harness({record});
  const oldAsset=await (await old.prepare()).capture(bitmapTarget(old));
  assert.equal((await oldAsset.saveToPhotos()).outcome,'saved_to_photos');
  assert.equal(count(old,'receipt')+count(old,'profile'),0);

  const invalid=harness({record});
  invalid.state.receiptSupported=true;
  invalid.state.profileError=true;
  await failure((await invalid.prepare()).capture(bitmapTarget(invalid)));
  assert.equal(count(invalid,'receipt')+count(invalid,'photo')+count(invalid,'share'),0);
});

test('terminal receipt rejection removes copy; unknown OS outcome cannot rewrite the generation receipt', async()=>{
  const h=harness({record:{...fixture(),renderer_version:receiptRenderer}});
  h.state.receiptSupported=true;
  h.state.receiptError={code:'PIECE_CONFLICT'};
  const asset=await (await h.prepare()).capture(bitmapTarget(h));
  await failure(asset.openShare());
  assert.equal(count(h,'receipt'),1);
  assert.equal(count(h,'share'),0);
  assert.ok(h.calls.some(c=>c[0]==='unlink' && c[1].startsWith('/cache/piece-export/')));
  await failure(asset.openShare());

  const uncertain=harness({record:{...fixture(),renderer_version:receiptRenderer}});
  uncertain.state.receiptSupported=true;
  uncertain.state.shareError=true;
  const uncertainAsset=await (await uncertain.prepare()).capture(bitmapTarget(uncertain));
  await failure(uncertainAsset.openShare());
  assert.equal(count(uncertain,'receipt'),1);
  assert.equal(count(uncertain,'share'),1);
  assert.equal(Object.hasOwn(uncertain.calls.find(c=>c[0]==='receipt')[1].receipt,'outcome'),false);
});


for (const during of ['fresh export read', 'receipt acknowledgement']) {
  test(`revoking the captured Text target during ${during} blocks external image handoff`, async () => {
    const h = harness({record:{...fixture(),renderer_version:receiptRenderer}});
    h.state.receiptSupported = true;
    const asset = await (await h.prepare()).capture(bitmapTarget(h));
    const pending = deferred();
    if (during === 'fresh export read') h.state.exportWait = pending;
    else h.state.receiptWait = pending;
    const saving = asset.saveToPhotos();
    await new Promise(resolve => setImmediate(resolve));
    assert.equal(count(h, 'detail'), 2);
    assert.equal(count(h, 'receipt'), during === 'fresh export read' ? 0 : 1);
    h.state.canvas = false;
    pending.resolve();
    await failure(saving);
    assert.equal(count(h, 'receipt'), during === 'fresh export read' ? 0 : 1);
    assert.equal(count(h, 'photo'), 0);
    assert.equal(count(h, 'share'), 0);
    assert.ok(h.calls.some(c => c[0] === 'unlink' && c[1].startsWith('/cache/piece-export/')));
  });
}


for (const action of ['saveToPhotos', 'openShare']) {
  for (const stage of ['export', 'receipt']) for (const cleanupError of [false, true]) {
    test(`known export stop at ${stage} survives ${action}${cleanupError ? ' and cleanup failure' : ''} without an OS handoff`, async () => {
      const h = harness({ record: { ...fixture(), renderer_version: receiptRenderer } });
      h.state.receiptSupported = true;
      const asset = await (await h.prepare()).capture(bitmapTarget(h));
      h.state[stage === 'export' ? 'exportError' : 'receiptError'] = { code: 'PIECE_FEATURE_DISABLED' };
      h.state.cleanupError = cleanupError;
      await assert.rejects(asset[action](), error => error.code === 'PIECE_FEATURE_DISABLED' &&
        !/PRIVATE|cache/.test(error.message));
      assert.equal(asset.nativeStatus, 'not_started');
      assert.equal(count(h, 'receipt'), stage === 'receipt' ? 1 : 0);
      assert.equal(count(h, 'photo') + count(h, 'share'), 0);
      assert.ok(h.calls.some(call => call[0] === 'unlink' && call[1].startsWith('/cache/piece-export/')));
      await failure(asset[action]());
      if (cleanupError) {
        h.state.cleanupError = false;
        await h.prepare().catch(error => { assert.equal(error.code, 'PIECE_FEATURE_DISABLED'); });
        await asset.dispose();
        assert.equal([...h.files.keys()].some(path => /^\/cache\/piece-export\/[a-f0-9]{32}$/.test(path)), false);
      }
    });
  }
}
