// Standalone Android verification entry. This is never imported by index.js.
import React, { useMemo, useRef, useState } from 'react';
import { AppRegistry, Button, Platform, ScrollView, Text, View } from 'react-native';
import { Dirs, FileSystem } from 'react-native-file-access';
import { releaseCapture } from 'react-native-view-shot';
import { name as appName } from '../../app.json';
import PieceVisualCard from '../../components/piece/PieceVisualCard';
import { verifyPieceExportPngSrgb } from '../../features/piece/pieceExportPngProfile';
import fixtures from './piece-rn-android-bitmap-fixtures.json';

function androidCachePath(uri) {
  const path = typeof uri === 'string' && uri.startsWith('file://') ? uri.slice(7) : null;
  const prefix = Dirs.CacheDir + '/piece-capture/';
  if (!path?.startsWith(prefix) || !/^piece-[A-Za-z0-9_-]+\.png$/.test(path.slice(prefix.length))) {
    throw new Error('unexpected_android_piece_file');
  }
  return path;
}

function AndroidBitmapCases() {
  const [index, setIndex] = useState(0);
  const [report, setReport] = useState('');
  const card = useRef(null);
  const busy = useRef(false);
  const fixture = fixtures[index];
  const display = useMemo(() => ({ ...fixture.props.display, visualToken: Object.freeze({}) }), [fixture]);

  async function verifyCapture() {
    if (busy.current) return;
    const current = card.current, target = current?.getAndroidRasterTarget();
    if (!target?.isCurrent()) { setReport('描画の準備ができていません。'); return; }
    busy.current = true;
    let uri, path;
    try {
      uri = await target.capture();
      path = androidCachePath(uri);
      const { size } = await FileSystem.stat(path);
      await verifyPieceExportPngSrgb({ size, width: target.width, height: target.height,
        readChunk: (offset, length) => FileSystem.readFileChunk(path, offset, length, 'base64') }, { opaqueRgb: true });
      const hash = await FileSystem.hash(path, 'SHA-256');
      if (card.current !== current || !target.isCurrent() || !/^[0-9a-f]{64}$/.test(hash)) {
        throw new Error('stale_android_piece_capture');
      }
      const result = { name: fixture.name, width: target.width, height: target.height, sha256: hash };
      console.log('PIECE_ANDROID_BITMAP', JSON.stringify(result));
      setReport(`${target.width} × ${target.height}\n${hash}`);
    } catch {
      if (card.current === current) setReport('この描画からPNGを確認できませんでした。');
    } finally {
      try { if (path && uri) releaseCapture(uri); }
      finally { busy.current = false; }
    }
  }

  if (Platform.OS !== 'android') return <Text>Android検証用です。</Text>;
  return <ScrollView contentContainerStyle={{ padding: 16 }}>
    <Text>{fixture.name}</Text>
    <View style={{ width: '100%' }}>
      <PieceVisualCard key={fixture.name} ref={card} {...fixture.props} display={display} />
    </View>
    <Button title="同じ描画のPNGを検証" onPress={verifyCapture} />
    <Button title="次のケース" onPress={() => {
      setReport(''); setIndex(i => (i + 1) % fixtures.length);
    }} />
    <Text accessibilityLiveRegion="polite">{report}</Text>
  </ScrollView>;
}

AppRegistry.registerComponent(appName, () => AndroidBitmapCases);
