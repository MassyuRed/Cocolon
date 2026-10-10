'use strict';
// Actual JS export orchestration; filesystem/native/OS calls are synthetic.
// This suite does not certify pixels, fonts, native compatibility or OS handoff.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const crypto = require('node:crypto');
const ROOT = path.resolve(__dirname, '..');
const clone = x => JSON.parse(JSON.stringify(x));
const deferred = () => { let resolve; const promise = new Promise(r => { resolve = r; }); return {promise, resolve}; };
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
  const calls = [], files = new Map(), state = {current:true, canvas:true, validPng:true, hash:'a'.repeat(64), granted:true};
  const header = Buffer.alloc(24); Buffer.from([137,80,78,71,13,10,26,10]).copy(header); header.writeUInt32BE(13,8);
  header.write('IHDR',12); header.writeUInt32BE(1080,16); header.writeUInt32BE(1350,20);
  const FileSystem = {
    exists: async p => files.has(p),
    mkdir: async p => {calls.push(['mkdir',p]); if(files.has(p)) throw Error('EEXIST'); files.set(p,'directory');},
    ls: async p => {calls.push(['ls',p]); return ['piece-old.png','foreign.png'];},
    unlink: async p => { calls.push(['unlink',p]); files.delete(p); },
    cp: async (a,b) => {calls.push(['cp',a,b]);files.set(b,'file');},
    stat: async p => ({type:files.get(p),size:100}),
    readFileChunk: async () => state.validPng ? header.toString('base64') : 'bad',
    hash: async () => { if(state.hashWait) await state.hashWait.promise; return state.hash; },
  };
  const context = vm.createContext({ crypto:crypto.webcrypto, Uint8Array, FileSystem, Dirs:{CacheDir:'/cache'},
    Platform:{OS:os,Version:version},
    PermissionsAndroid:{PERMISSIONS:{WRITE_EXTERNAL_STORAGE:'write'},RESULTS:{GRANTED:'granted'},request:async()=>{
      calls.push(['permission']); if(state.permissionWait) await state.permissionWait.promise; return state.granted?'granted':'denied';}},
    captureRef: async (node, options) => {calls.push(['capture',clone(options)]); if(state.captureWait) await state.captureWait.promise;
      return state.raw || '/cache/piece-capture/piece-new.png';},
    releaseCapture:p=>calls.push(['release',p]),
    Share:{open:async options=>{calls.push(['share',clone(options)]); if(state.shareWait) await state.shareWait.promise; if(state.shareError) throw Error('PRIVATE');}},
    CameraRoll:{saveAsset:async(...args)=>{calls.push(['photo',...args]); if(state.photoWait) await state.photoWait.promise;}},
    NativeModules:{RNCCameraRoll:{saveToCameraRoll:async(...args)=>{calls.push(['photo',...args]); return {saved:true};}}},
  });
  for (const [file,names] of [
    ['features/piece/pieceApi.js',['PieceApiError','readPiecePreviewSnapshot','readPieceOwnerSnapshot']],
    ['features/piece/piecePreviewModel.js',['verifyPieceArtifactHashes']],
    ['features/piece/pieceOwnerModel.js',['readPieceOwnerDisplay']],
    ['features/piece/pieceLayout.js',['preparePieceNativeSavedDisplay','PIECE_NATIVE_PREVIEW_VERSION']],
  ]) {
    const source=fs.readFileSync(path.join(ROOT,file),'utf8').replace(/^import .*;$/gm,'').replace(/^export /gm,'');
    vm.runInContext(`{${source}\n${names.map(n=>`globalThis.${n}=${n};`).join('\n')}}`,context);
  }
  context.requestPieceOwner=async(action,body,options)=>{calls.push(['detail',action,clone(body),clone(options)]);return record;};
  const source=fs.readFileSync(path.join(ROOT,'features/piece/pieceExport.js'),'utf8').replace(/^import .*;$/gm,'').replace(/^export /gm,'');
  vm.runInContext(`{${source}\nglobalThis.prepare=preparePieceExportPrototype;}`,context);
  const target=()=>({...context.preparePieceNativeSavedDisplay(record),node:{},isCurrent:()=>state.canvas});
  return {calls,state,files,record,target, prepare:()=>context.prepare({pieceId:record.piece_id,expectedUserId:'owner',isCurrent:()=>{ state.currentCalls=(state.currentCalls||0)+1; if(state.currentCalls===state.revokeAtCurrent) queueMicrotask(()=>{state.current=false;}); return state.current; }})};
}
const count=(h,kind)=>h.calls.filter(c=>c[0]===kind).length;
const failure=p=>assert.rejects(p,e=>e.code==='PIECE_TEMPORARILY_UNAVAILABLE');
async function image(h) {return (await h.prepare()).capture(h.target());}

test('fresh owner detail, verified saved canvas, exact PNG and body-free identity precede iOS add-only save', async()=>{
  const h=harness(), job=await h.prepare(), asset=await job.capture(h.target());
  assert.equal(h.calls[0][1],'detail'); assert.equal(h.calls[0][3].expectedUserId,'owner');
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
  const h=harness(),asset=await image(h);h.state.hashWait=deferred();
  const share=asset.openShare();await failure(asset.saveToPhotos());h.state.hashWait.resolve();await share;
  await asset.dispose();assert.equal(count(h,'share'),1);assert.equal(count(h,'photo'),0);
  assert.equal(h.calls.some(c=>c[0]==='unlink'&&c[1].startsWith('/cache/piece-export/')),false);
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
