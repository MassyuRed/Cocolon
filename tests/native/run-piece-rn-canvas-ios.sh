#!/bin/bash
# Only run in a disposable checkout: build isolation replaces the app launch
# source there. The actual Piece/RN rendering sources and native patch stay intact.
set -euo pipefail
: "${RUNNER_TEMP:?Requires an isolated CI checkout}"
test "${GITHUB_ACTIONS:-}" = true
ROOT="$PWD"
OUT="$RUNNER_TEMP/piece-rn-canvas"
mkdir -p "$OUT"
node tests/native/piece-rn-canvas-fixtures.cjs > tests/native/piece-rn-canvas-fixtures.json
cat > tests/native/piece-rn-no-transport.js <<'JS'
export const apiFetch = () => { throw new Error('TRANSPORT_FORBIDDEN_IN_RENDER_TEST'); };
export const getAccessToken = () => { throw new Error('AUTH_FORBIDDEN_IN_RENDER_TEST'); };
JS
cat > metro.piece-canvas.config.js <<'JS'
const path = require('node:path');
const { mergeConfig } = require('@react-native/metro-config');
const config = require('./metro.config');
module.exports = mergeConfig(config, { resolver: { resolveRequest(context, name, platform) {
  const resolved = context.resolveRequest(context, name, platform);
  if (resolved.type === 'sourceFile' && resolved.filePath === path.join(__dirname, 'lib/apiClient.js')) {
    return { type: 'sourceFile', filePath: path.join(__dirname, 'tests/native/piece-rn-no-transport.js') };
  }
  return resolved;
} } });
JS
node node_modules/react-native/cli.js bundle --platform ios --dev false --minify false --max-workers 2 \
  --entry-file tests/native/piece-rn-canvas-entry.js --config metro.piece-canvas.config.js \
  --bundle-output "$OUT/piece-canvas.jsbundle"
# Same old-architecture slider compatibility operation as ios-build.yml.
python3 - <<'PY'
from pathlib import Path
for p in Path('node_modules/@react-native-community/slider').rglob('RNCSliderComponentView.*'):
    p.unlink()
PY
# This is a simulator-only hosted-test launcher. No Firebase or normal JS app starts.
cat > ios/tempCocolon/AppDelegate.mm <<'OBJC'
#import "AppDelegate.h"
@implementation AppDelegate
- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)options {
  self.window = [[UIWindow alloc] initWithFrame:UIScreen.mainScreen.bounds];
  self.window.rootViewController = [UIViewController new];
  [self.window makeKeyAndVisible];
  return YES;
}
@end
OBJC
cd ios
pod install
git diff --exit-code -- Podfile.lock
# Add the test and local bundle only to this disposable project, keeping the
# historical welcome test untouched and excluded by -only-testing below.
ruby - "$OUT" <<'RUBY'
require 'xcodeproj'
p = Xcodeproj::Project.open('tempCocolon.xcodeproj')
tests = p.targets.find { |t| t.name == 'tempCocolonTests' }
# Hosted tests resolve RN from TEST_HOST via the existing BUNDLE_LOADER.
# Inheriting all static Pod frameworks with -ObjC creates a second RN runtime
# in the test binary (including RCTBridge/RCTTextView/RCTUIManager).
tests.build_configurations.each do |config|
  config.build_settings['OTHER_LDFLAGS'] = ['-lc++']
end
ref = p.main_group.new_file('../tests/native/piece-rn-canvas-ios.m')
tests.source_build_phase.add_file_reference(ref)
app = p.targets.find { |t| t.name == 'tempCocolon' }
bundle = p.main_group.new_file(File.join(ARGV[0], 'piece-canvas.jsbundle'))
app.resources_build_phase.add_file_reference(bundle)
p.save
RUBY
xcrun simctl list devices available --json > "$OUT/devices.json"
DEVICE=$(python3 - "$OUT/devices.json" <<'PY'
import json,re,sys
c=[]
for runtime,devices in json.load(open(sys.argv[1]))['devices'].items():
    m=re.search(r'\.iOS-(\d+)(?:-(\d+))?',runtime)
    if m:
        for d in devices:
            if d.get('isAvailable') and d['name'].startswith('iPhone'):
                c.append((tuple(int(v or 0) for v in m.groups()),d['udid']))
if not c: raise SystemExit('No iPhone simulator')
print(max(c)[1])
PY
)
# Export inspection PNG/JSON even when the assertion fails. No app archive or upload.
collect() {
  container=$(xcrun simctl get_app_container "$DEVICE" org.reactjs.native.example.tempCocolon data 2>/dev/null || true)
  if [ -n "$container" ] && [ -d "$container/Documents/piece-rn-canvas" ]; then
    cp -R "$container/Documents/piece-rn-canvas" "$OUT/evidence"
    cat "$OUT/evidence/results.json"
  fi
  if [ -d "$OUT/result.xcresult" ]; then
    xcrun xcresulttool get --legacy --path "$OUT/result.xcresult" --format json 2>&1 | tee -a "$OUT/xcodebuild.log" || true
  fi
  xcrun simctl shutdown "$DEVICE" >/dev/null 2>&1 || true
}
trap collect EXIT
export SKIP_BUNDLING=1 RCT_NEW_ARCH_ENABLED=0
XCODE=(xcodebuild -quiet -jobs 3 -workspace tempCocolon.xcworkspace -scheme tempCocolon \
  -configuration Debug -destination "platform=iOS Simulator,id=$DEVICE" \
  -derivedDataPath "$OUT/build" \
  -parallel-testing-enabled NO -only-testing:tempCocolonTests/PieceRNCanvasTests \
  CODE_SIGNING_ALLOWED=NO CODE_SIGNING_REQUIRED=NO CODE_SIGN_IDENTITY= \
  ONLY_ACTIVE_ARCH=YES ENABLE_DEBUG_DYLIB=NO)
# Compile before booting the simulator, so its memory/CPU does not compete
# with the first full native build. The draw deadline/assertions stay unchanged.
echo 'PIECE_RN_PHASE build_started'
"${XCODE[@]}" build-for-testing 2>&1 | tee "$OUT/xcodebuild.log"
echo 'PIECE_RN_PHASE build_completed'
xcrun simctl boot "$DEVICE"
xcrun simctl bootstatus "$DEVICE" -b
echo 'PIECE_RN_PHASE test_started'
"${XCODE[@]}" -resultBundlePath "$OUT/result.xcresult" test-without-building 2>&1 | tee -a "$OUT/xcodebuild.log"
