// Execute the ACTUAL PieceTextMetrics methods with real iOS TextKit/CoreText.
// Only RN bridge dispatch and the mounted-view wrapper are doubles. This is
// not a React render, physical-device check, capture-library or admission test.
#import "piece-ios-react-shim.h"
#import <CoreText/CoreText.h>
#include <mach/mach_time.h>
#include <math.h>
#include <stdio.h>
#include <string.h>
#include <unistd.h>
#include <atomic>
@implementation RCTBridge
@end
@implementation RCTUIManager
- (void)addUIBlock:(void (^)(RCTUIManager *, NSDictionary<NSNumber *, UIView *> *))block {
  NSCAssert(NSThread.isMainThread, @"Fixture dispatch must stay on main");
  block(self, self.registry);
}
@end
@implementation RCTTextView
- (UIWindow *)window { return self.fixtureAttached ? (UIWindow *)self : nil; }
- (NSTextStorage *)cocolonPieceTextStorage { return self.fixtureStorage; }
- (CGRect)cocolonPieceContentFrame { return self.fixtureContentFrame; }
@end
// Aggregate only the mixed420 candidate call, without changing native results.
// Atomic counters sum per-operation time across workers, not wall-clock time.
// Undefine these wrappers before the independent uncached reference below.
static std::atomic_bool profileCandidates{false};
static struct {
  std::atomic<uint64_t> creates{0}, units{0}, createTicks{0}, typographicTicks{0}, imageTicks{0};
  std::atomic<uint64_t> queuedAt{0}, queueStarted{0}, workersStarted{0}, workersJoined{0}, resolvedAt{0}, decodeTicks{0};
  std::atomic<uint64_t> substringTicks{0}, releaseTicks{0}, uptimeTicks{0}, uptimeCalls{0};
} candidateProfile;
static double profileMilliseconds(uint64_t start, uint64_t end, double scale) {
  return start && end >= start ? (end - start) * scale : NAN;
}
// Only the included production source uses these transparent wrappers. Keep
// worker wall time separate from per-operation sums and the test's decoder.
static void profiledAsync(dispatch_queue_t queue, dispatch_block_t block) {
  if (!profileCandidates) { dispatch_async(queue, block); return; }
  candidateProfile.queuedAt = mach_absolute_time();
  dispatch_async(queue, ^{
    candidateProfile.queueStarted = mach_absolute_time();
    block();
  });
}
static void profiledApply(size_t count, dispatch_queue_t queue, void (^block)(size_t)) {
  if (!profileCandidates) { dispatch_apply(count, queue, block); return; }
  candidateProfile.workersStarted = mach_absolute_time();
  dispatch_apply(count, queue, block);
  candidateProfile.workersJoined = mach_absolute_time();
}
@interface NSAttributedString (PieceCandidateProfile)
- (NSAttributedString *)pieceProfiledSubstringFromRange:(NSRange)range;
@end
@implementation NSAttributedString (PieceCandidateProfile)
- (NSAttributedString *)pieceProfiledSubstringFromRange:(NSRange)range {
  if (!profileCandidates) return [self attributedSubstringFromRange:range];
  uint64_t start = mach_absolute_time();
  NSAttributedString *result = [self attributedSubstringFromRange:range];
  candidateProfile.substringTicks += mach_absolute_time() - start;
  return result;
}
@end
@interface NSProcessInfo (PieceCandidateProfile)
- (NSTimeInterval)pieceProfiledSystemUptime;
@end
@implementation NSProcessInfo (PieceCandidateProfile)
- (NSTimeInterval)pieceProfiledSystemUptime {
  if (!profileCandidates) return self.systemUptime;
  uint64_t start = mach_absolute_time();
  NSTimeInterval result = self.systemUptime;
  candidateProfile.uptimeTicks += mach_absolute_time() - start;
  candidateProfile.uptimeCalls++;
  return result;
}
@end
static void profiledRelease(CFTypeRef value) {
  if (!profileCandidates) { CFRelease(value); return; }
  uint64_t start = mach_absolute_time();
  CFRelease(value);
  candidateProfile.releaseTicks += mach_absolute_time() - start;
}
static CTLineRef profiledCreateLine(CFAttributedStringRef text) {
  if (!profileCandidates) return CTLineCreateWithAttributedString(text);
  uint64_t start = mach_absolute_time();
  CTLineRef result = CTLineCreateWithAttributedString(text);
  candidateProfile.createTicks += mach_absolute_time() - start;
  candidateProfile.creates++; candidateProfile.units += CFAttributedStringGetLength(text);
  return result;
}
static double profiledTypographicBounds(CTLineRef line, CGFloat *ascent, CGFloat *descent, CGFloat *leading) {
  if (!profileCandidates) return CTLineGetTypographicBounds(line, ascent, descent, leading);
  uint64_t start = mach_absolute_time();
  double result = CTLineGetTypographicBounds(line, ascent, descent, leading);
  candidateProfile.typographicTicks += mach_absolute_time() - start;
  return result;
}
static CGRect profiledImageBounds(CTLineRef line, CGContextRef context) {
  if (!profileCandidates) return CTLineGetImageBounds(line, context);
  uint64_t start = mach_absolute_time();
  CGRect result = CTLineGetImageBounds(line, context);
  candidateProfile.imageTicks += mach_absolute_time() - start;
  return result;
}
#define CTLineCreateWithAttributedString profiledCreateLine
#define CTLineGetTypographicBounds profiledTypographicBounds
#define CTLineGetImageBounds profiledImageBounds
#define dispatch_async profiledAsync
#define dispatch_apply profiledApply
#define attributedSubstringFromRange pieceProfiledSubstringFromRange
#define systemUptime pieceProfiledSystemUptime
#define CFRelease profiledRelease
#include "../../ios/tempCocolon/PieceTextMetrics.mm"
#undef CTLineCreateWithAttributedString
#undef CTLineGetTypographicBounds
#undef CTLineGetImageBounds
#undef dispatch_async
#undef dispatch_apply
#undef attributedSubstringFromRange
#undef systemUptime
#undef CFRelease

static NSUInteger checks = 0, failures = 0;
static void check(NSString *name, BOOL passed) {
  checks++; if (!passed) failures++;
  printf("%s %s\n", passed ? "PASS" : "FAIL", name.UTF8String); fflush(stdout);
}
static RCTTextView *makeView(NSString *text, CGFloat size) {
  printf("STAGE view_init\n");
  RCTTextView *view = [[RCTTextView alloc] initWithFrame:CGRectMake(0, 0, 888, 140)];
  printf("STAGE view_ready\n");
  view.fixtureAttached = YES; view.fixtureContentFrame = view.bounds;
  NSMutableParagraphStyle *paragraph = [NSMutableParagraphStyle new];
  paragraph.minimumLineHeight = ceil(size * 1.55);
  paragraph.maximumLineHeight = paragraph.minimumLineHeight;
  paragraph.lineBreakMode = NSLineBreakByWordWrapping;
  printf("STAGE font_init\n");
  UIFont *font = [UIFont systemFontOfSize:size];
  printf("STAGE font_ready\n");
  view.fixtureStorage = [[NSTextStorage alloc] initWithString:text attributes:@{
    NSFontAttributeName: font, NSForegroundColorAttributeName: UIColor.blackColor,
    NSParagraphStyleAttributeName: paragraph }];
  NSLayoutManager *layout = [NSLayoutManager new];
  NSTextContainer *container = [[NSTextContainer alloc] initWithSize:view.bounds.size];
  container.lineFragmentPadding = 0; container.maximumNumberOfLines = 0;
  [layout addTextContainer:container]; [view.fixtureStorage addLayoutManager:layout];
  printf("STAGE layout_init\n");
  [layout ensureLayoutForTextContainer:container];
  printf("STAGE layout_ready\n");
  return view;
}
static NSDictionary *decodeCandidates(NSDictionary *result, NSString **code) {
  // Decode the actual wire bytes before every pre-existing candidate check
  // and bit-for-bit uncached oracle comparison. No numeric JSON round-trip.
  if (result) {
    NSData *data = [[NSData alloc] initWithBase64EncodedString:result[@"metrics_f64le"] options:0];
    NSData *indices = [[NSData alloc] initWithBase64EncodedString:result[@"row_indices_u32le"] options:0];
    NSArray *boundaries = result[@"boundaries"];
    NSUInteger n = boundaries.count ? boundaries.count - 1 : 0;
    NSUInteger unique = [result[@"metric_count"] unsignedIntegerValue], count = n * (n + 1) / 2;
    if (![result[@"version"] isEqual:@"piece.native_candidates.v3"] || n < 1 || n > 420 ||
        unique < 1 || unique > count || data.length != unique * 5 * sizeof(uint64_t) ||
        indices.length != count * sizeof(uint32_t)) {
      *code = @"INVALID_PACKED_RESULT"; return nil;
    }
    NSMutableArray *rows = [NSMutableArray new];
    NSMutableIndexSet *used = [NSMutableIndexSet new];
    for (NSUInteger start = 0; start < n; start++) for (NSUInteger end = start + 1; end <= n; end++) {
      uint32_t index; memcpy(&index, (const uint8_t *)indices.bytes + rows.count * sizeof(index), sizeof(index));
      index = CFSwapInt32LittleToHost(index);
      if (index >= unique) { *code = @"INVALID_PACKED_RESULT"; return nil; }
      [used addIndex:index];
      NSMutableArray *row = [NSMutableArray arrayWithObjects:@(start), @(end), nil];
      for (NSUInteger j = 0; j < 5; j++) {
        uint64_t bits; memcpy(&bits, (const uint8_t *)data.bytes + (index * 5 + j) * sizeof(bits), sizeof(bits));
        bits = CFSwapInt64LittleToHost(bits);
        double value; memcpy(&value, &bits, sizeof(value)); [row addObject:@(value)];
      }
      [rows addObject:row];
    }
    if (used.count != unique) { *code = @"INVALID_PACKED_RESULT"; return nil; }
    NSMutableDictionary *decoded = [result mutableCopy];
    decoded[@"version"] = @"piece.native_candidates.v1"; decoded[@"rows"] = rows;
    [decoded removeObjectsForKeys:@[@"metric_count", @"metrics_f64le", @"row_indices_u32le"]]; result = decoded;
  }
  return result;
}
static NSDictionary *call(PieceTextMetrics *module, BOOL candidates, NSString *text, double size, NSString **code) {
  __block NSDictionary *result = nil; __block NSString *error = nil;
  dispatch_semaphore_t done = dispatch_semaphore_create(0);
  RCTPromiseResolveBlock resolve = ^(id value) {
    if (profileCandidates) candidateProfile.resolvedAt = mach_absolute_time();
    if ([value isKindOfClass:NSDictionary.class]) result = value;
    else error = @"INVALID_RESULT";
    dispatch_semaphore_signal(done);
  };
  RCTPromiseRejectBlock reject = ^(NSString *value, __unused NSString *message, __unused NSError *cause) {
    error = value; dispatch_semaphore_signal(done);
  };
  printf("STAGE %s_call\n", candidates ? "candidate" : "inspection");
  if (candidates) [module measureCandidates:@1 text:text fontSize:size resolver:resolve rejecter:reject];
  else [module inspect:@1 text:text fontSize:size resolver:resolve rejecter:reject];
  printf("STAGE callback_wait\n");
  if (dispatch_semaphore_wait(done, dispatch_time(DISPATCH_TIME_NOW, 10 * NSEC_PER_SEC)) != 0) {
    *code = @"TEST_CALLBACK_TIMEOUT"; return nil;
  }
  printf("STAGE callback_ready\n");
  *code = error;
  uint64_t decodeStarted = mach_absolute_time();
  NSDictionary *decoded = candidates ? decodeCandidates(result, code) : result;
  if (profileCandidates) candidateProfile.decodeTicks = mach_absolute_time() - decodeStarted;
  return decoded;
}
static BOOL validCandidates(NSDictionary *result, NSString *text) {
  if (![result[@"version"] isEqual:@"piece.native_candidates.v1"] ||
      ![result[@"platform"] isEqual:@"ios"] || ![result[@"glyph_check"] isEqual:@"no_missing_observed"] ||
      [result[@"utf16_length"] unsignedIntegerValue] != text.length) return NO;
  NSArray *boundaries = result[@"boundaries"], *rows = result[@"rows"];
  NSUInteger n = boundaries.count ? boundaries.count - 1 : 0;
  if (!n || [boundaries.firstObject unsignedIntegerValue] != 0 ||
      [boundaries.lastObject unsignedIntegerValue] != text.length || rows.count != n * (n + 1) / 2) return NO;
  NSUInteger rowIndex = 0;
  for (NSUInteger start = 0; start < n; start++) {
    if ([boundaries[start] unsignedIntegerValue] >= [boundaries[start + 1] unsignedIntegerValue]) return NO;
    for (NSUInteger end = start + 1; end <= n; end++) {
      NSArray *row = rows[rowIndex++];
      if (row.count != 7 || [row[0] unsignedIntegerValue] != start || [row[1] unsignedIntegerValue] != end) return NO;
      for (NSNumber *number in row) if (!isfinite(number.doubleValue)) return NO;
      if ([row[2] doubleValue] < 0 || [row[5] doubleValue] < [row[3] doubleValue] ||
          [row[6] doubleValue] < [row[4] doubleValue]) return NO;
    }
  }
  return YES;
}
// Independent uncached shaping, using the pre-optimization calculation for
// EVERY returned range. Compare boxed doubles bit-for-bit, not a tolerance.
static BOOL matchesUncachedCandidates(NSDictionary *result, RCTTextView *view) {
  if (!validCandidates(result, view.fixtureStorage.string)) return NO;
  NSAttributedString *snapshot = [view.fixtureStorage copy];
  NSArray *boundaries = result[@"boundaries"];
  for (NSArray *row in result[@"rows"]) {
    @autoreleasepool {
      NSUInteger start = [boundaries[[row[0] unsignedIntegerValue]] unsignedIntegerValue];
      NSUInteger end = [boundaries[[row[1] unsignedIntegerValue]] unsignedIntegerValue];
      NSAttributedString *part = [snapshot attributedSubstringFromRange:NSMakeRange(start, end - start)];
      CTLineRef line = CTLineCreateWithAttributedString((__bridge CFAttributedStringRef)part);
      if (!line) return NO;
      double advance = CTLineGetTypographicBounds(line, NULL, NULL, NULL);
      CGRect ink = CTLineGetImageBounds(line, NULL); CFRelease(line);
      if (CGRectIsNull(ink)) {
        if ([part.string rangeOfCharacterFromSet:NSCharacterSet.whitespaceAndNewlineCharacterSet.invertedSet].location != NSNotFound) return NO;
        ink = CGRectZero;
      }
      NSArray *expected = @[@(advance), @(CGRectGetMinX(ink)), @(-CGRectGetMaxY(ink)), @(CGRectGetMaxX(ink)), @(-CGRectGetMinY(ink))];
      for (NSUInteger i = 0; i < 5; i++) {
        double actualValue = [row[i + 2] doubleValue], expectedValue = [expected[i] doubleValue];
        if (memcmp(&actualValue, &expectedValue, sizeof(double)) != 0) return NO;
      }
    }
  }
  return YES;
}
// Independent paint observation of the same TextKit layout, at logical scale.
// Check outward-rounded reported bounds: fractional antialiasing may occupy
// the edge pixel. No extra content-pixel or clipping tolerance is introduced.
static BOOL inkEnclosesPaint(RCTTextView *view, NSDictionary *inspection) {
  NSArray *ink = inspection[@"ink"];
  if (ink.count != 4) return NO;
  const CGFloat pad = 120;
  CGSize size = CGSizeMake(view.bounds.size.width + 2 * pad, view.bounds.size.height + 2 * pad);
  UIGraphicsBeginImageContextWithOptions(size, NO, 1);
  NSLayoutManager *layout = view.fixtureStorage.layoutManagers.firstObject;
  NSRange all = [layout glyphRangeForTextContainer:layout.textContainers.firstObject];
  [layout drawGlyphsForGlyphRange:all atPoint:CGPointMake(pad, pad)];
  UIImage *image = UIGraphicsGetImageFromCurrentImageContext();
  UIGraphicsEndImageContext();
  CGImageRef cg = image.CGImage;
  if (!cg || CGImageGetBitsPerPixel(cg) != 32) return NO;
  CGBitmapInfo info = CGImageGetBitmapInfo(cg);
  CGImageAlphaInfo alpha = (CGImageAlphaInfo)(info & kCGBitmapAlphaInfoMask);
  BOOL first = alpha == kCGImageAlphaPremultipliedFirst || alpha == kCGImageAlphaFirst;
  BOOL last = alpha == kCGImageAlphaPremultipliedLast || alpha == kCGImageAlphaLast;
  if (!first && !last) return NO;
  BOOL little = (info & kCGBitmapByteOrderMask) == kCGBitmapByteOrder32Little;
  NSUInteger alphaIndex = first ? (little ? 3 : 0) : (little ? 0 : 3);
  NSData *data = CFBridgingRelease(CGDataProviderCopyData(CGImageGetDataProvider(cg)));
  NSUInteger width = CGImageGetWidth(cg), height = CGImageGetHeight(cg), stride = CGImageGetBytesPerRow(cg);
  if (data.length < stride * height) return NO;
  const unsigned char *bytes = (const unsigned char *)data.bytes;
  NSInteger left = (NSInteger)width, top = (NSInteger)height, right = -1, bottom = -1;
  for (NSUInteger y = 0; y < height; y++) for (NSUInteger x = 0; x < width; x++) {
    if (bytes[y * stride + 4 * x + alphaIndex]) {
      left = MIN(left, (NSInteger)x); right = MAX(right, (NSInteger)x);
      top = MIN(top, (NSInteger)y); bottom = MAX(bottom, (NSInteger)y);
    }
  }
  BOOL enclosed = right >= 0 && left > 0 && top > 0 && right < (NSInteger)width - 1 && bottom < (NSInteger)height - 1 &&
    left - pad >= floor([ink[0] doubleValue]) && top - pad >= floor([ink[1] doubleValue]) &&
    right + 1 - pad <= ceil([ink[2] doubleValue]) && bottom + 1 - pad <= ceil([ink[3] doubleValue]);
  if (!enclosed) printf("bounds reported=%.3f,%.3f,%.3f,%.3f paint=%ld,%ld,%ld,%ld\n",
    [ink[0] doubleValue], [ink[1] doubleValue], [ink[2] doubleValue], [ink[3] doubleValue],
    (long)(left-pad), (long)(top-pad), (long)(right+1-pad), (long)(bottom+1-pad));
  return enclosed;
}
int main(void) {
  // Diagnose startup/UI work before the first assertion, even when simctl
  // pipes stdout. The alarm bounds a synchronous UIKit stall in this test only.
  setvbuf(stdout, NULL, _IONBF, 0);
  alarm(90);
  printf("STAGE main_entered\n");
  @autoreleasepool {
    printf("iOS native metrics source test; synthetic RN boundary; real UIKit/TextKit/CoreText\n");
    printf("OS=%s\n", NSProcessInfo.processInfo.operatingSystemVersionString.UTF8String);
    RCTBridge *bridge = [RCTBridge new]; bridge.uiManager = [RCTUIManager new];
    PieceTextMetrics *module = [PieceTextMetrics new]; module.bridge = bridge;
    NSArray *cases = @[
      @[@"japanese", @"私は考える時間を大切にしています。"],
      @[@"latin", @"A thoughtful choice."], @[@"spaces", @"  keep spaces  "],
      @[@"combining", @"e\u0301"], @[@"emoji_zwj", @"👩‍💻"],
      @[@"emoji_modifier", @"👍🏽"], @[@"regional_pair", @"🇯🇵"],
      @[@"variation_selector", @"☕️"], @[@"supplementary_han", @"𠮷"], @[@"branding", @"Cocolon"] ];
    for (NSArray *fixture in cases) {
      NSString *name = fixture[0], *text = fixture[1], *code = nil;
      printf("CASE %s\n", name.UTF8String);
      CGFloat font = [name isEqual:@"branding"] ? 28 : 48;
      RCTTextView *view = makeView(text, font); bridge.uiManager.registry = @{@1:view};
      NSDictionary *candidates = call(module, YES, text, font, &code);
      check([name stringByAppendingString:@"_candidate_metrics"], code == nil && validCandidates(candidates, text));
      check([name stringByAppendingString:@"_uncached_equivalence"], matchesUncachedCandidates(candidates, view));
      if (!candidates) printf("native rejection %s candidates %s\n", name.UTF8String, code.UTF8String);
      if ([@[@"combining",@"emoji_zwj",@"emoji_modifier",@"regional_pair",@"variation_selector",@"supplementary_han"] containsObject:name]) {
        check([name stringByAppendingString:@"_one_grapheme"], [candidates[@"boundaries"] isEqual:@[@0,@(text.length)]]);
      }
      NSDictionary *inspection = call(module, NO, text, font, &code);
      check([name stringByAppendingString:@"_mounted_inspection"], code == nil &&
        [inspection[@"glyph_check"] isEqual:@"no_missing_observed"] &&
        [inspection[@"line_ends"] isEqual:@[@(text.length)]]);
      printf("STAGE paint\n");
      check([name stringByAppendingString:@"_paint_bounds"], inspection && inkEnclosesPaint(view, inspection));
    }
    for (NSString *name in @[@"wrong_text", @"wrong_font", @"detached", @"limited_lines", @"oversized_view"]) {
      RCTTextView *view = makeView(@"Cocolon", 48); bridge.uiManager.registry = @{@1:view};
      if ([name isEqual:@"detached"]) view.fixtureAttached = NO;
      if ([name isEqual:@"limited_lines"]) view.fixtureStorage.layoutManagers.firstObject.textContainers.firstObject.maximumNumberOfLines = 1;
      if ([name isEqual:@"oversized_view"]) view.bounds = CGRectMake(0, 0, 1081, 140);
      NSString *code = nil;
      NSDictionary *result = call(module, NO, [name isEqual:@"wrong_text"] ? @"other" : @"Cocolon",
        [name isEqual:@"wrong_font"] ? 49 : 48, &code);
      check(name, result == nil && [code isEqual:@"PIECE_NATIVE_MEASUREMENT_UNAVAILABLE"]);
    }
    NSString *unsupported = @"\u0378", *code = nil;
    bridge.uiManager.registry = @{@1:makeView(unsupported, 48)};
    check(@"unsupported_candidates", call(module, YES, unsupported, 48, &code) == nil && [code isEqual:@"PIECE_NATIVE_MEASUREMENT_UNAVAILABLE"]);
    check(@"unsupported_inspection", call(module, NO, unsupported, 48, &code) == nil && [code isEqual:@"PIECE_NATIVE_MEASUREMENT_UNAVAILABLE"]);
    NSString *longText = [@"あ" stringByPaddingToLength:420 withString:@"あ" startingAtIndex:0];
    bridge.uiManager.registry = @{@1:makeView(longText, 48)};
    NSTimeInterval started = NSProcessInfo.processInfo.systemUptime;
    NSDictionary *longResult = call(module, YES, longText, 48, &code);
    printf("max420_candidate_elapsed_ms=%.3f\n", (NSProcessInfo.processInfo.systemUptime-started)*1000);
    check(@"max420_complete_metrics", code == nil && validCandidates(longResult, longText));
    check(@"max420_uncached_equivalence", matchesUncachedCandidates(longResult, (RCTTextView *)bridge.uiManager.registry[@1]));
    // Same mixed Japanese input as the full RN case, so a homogeneous glyph
    // benchmark cannot hide native shaping cost. Existing 420 test stays intact.
    NSString *mixedText = [[[@"考える時間と対話を大切にしながら、自分の言葉で伝えたい。"
      stringByPaddingToLength:419 withString:@"考える時間と対話を大切にしながら、自分の言葉で伝えたい。" startingAtIndex:0]
      stringByAppendingString:@"。"] copy];
    bridge.uiManager.registry = @{@1:makeView(mixedText, 48)};
    candidateProfile.creates = 0; candidateProfile.units = 0; candidateProfile.createTicks = 0;
    candidateProfile.typographicTicks = 0; candidateProfile.imageTicks = 0; profileCandidates = YES;
    started = NSProcessInfo.processInfo.systemUptime;
    NSDictionary *mixedResult = call(module, YES, mixedText, 48, &code);
    profileCandidates = NO;
    printf("mixed420_candidate_elapsed_ms=%.3f\n", (NSProcessInfo.processInfo.systemUptime-started)*1000);
    mach_timebase_info_data_t timebase; mach_timebase_info(&timebase);
    double millisecondsPerTick = (double)timebase.numer / timebase.denom / 1000000;
    printf("mixed420_coretext_profile creates=%llu units=%llu create_ms=%.3f typographic_ms=%.3f image_ms=%.3f includes_full_glyph_line=1\n",
      (unsigned long long)candidateProfile.creates.load(), (unsigned long long)candidateProfile.units.load(),
      candidateProfile.createTicks.load()*millisecondsPerTick, candidateProfile.typographicTicks.load()*millisecondsPerTick,
      candidateProfile.imageTicks.load()*millisecondsPerTick);
    printf("mixed420_phase_profile queue_ms=%.3f glyph_and_group_ms=%.3f workers_wall_ms=%.3f pack_and_resolve_ms=%.3f test_decode_ms=%.3f generic_substring_sum_ms=%.3f release_sum_ms=%.3f uptime_sum_ms=%.3f uptime_calls=%llu\n",
      profileMilliseconds(candidateProfile.queuedAt.load(), candidateProfile.queueStarted.load(), millisecondsPerTick),
      profileMilliseconds(candidateProfile.queueStarted.load(), candidateProfile.workersStarted.load(), millisecondsPerTick),
      profileMilliseconds(candidateProfile.workersStarted.load(), candidateProfile.workersJoined.load(), millisecondsPerTick),
      profileMilliseconds(candidateProfile.workersJoined.load(), candidateProfile.resolvedAt.load(), millisecondsPerTick),
      candidateProfile.decodeTicks.load()*millisecondsPerTick,
      candidateProfile.substringTicks.load()*millisecondsPerTick,
      candidateProfile.releaseTicks.load()*millisecondsPerTick,
      candidateProfile.uptimeTicks.load()*millisecondsPerTick,
      (unsigned long long)candidateProfile.uptimeCalls.load());
    check(@"mixed420_complete_metrics", code == nil && validCandidates(mixedResult, mixedText));
    check(@"mixed420_uncached_equivalence", matchesUncachedCandidates(mixedResult, (RCTTextView *)bridge.uiManager.registry[@1]));
    RCTTextView *uniform = makeView(@"AaAaAaAa", 48);
    [uniform.fixtureStorage addAttributes:@{ NSKernAttributeName:@4, NSBaselineOffsetAttributeName:@3,
      NSFontAttributeName:[UIFont monospacedSystemFontOfSize:48 weight:UIFontWeightRegular] }
      range:NSMakeRange(0, uniform.fixtureStorage.length)];
    bridge.uiManager.registry = @{@1:uniform};
    NSDictionary *uniformResult = call(module, YES, uniform.fixtureStorage.string, 48, &code);
    check(@"uniform_complete_attributes_uncached_equivalence", code == nil && matchesUncachedCandidates(uniformResult, uniform));
    RCTTextView *variants = makeView(@"AaAaAaAa", 48);
    [variants.fixtureStorage addAttribute:NSKernAttributeName value:@4 range:NSMakeRange(2, 2)];
    [variants.fixtureStorage addAttribute:NSBaselineOffsetAttributeName value:@3 range:NSMakeRange(4, 2)];
    [variants.fixtureStorage addAttribute:NSFontAttributeName value:[UIFont monospacedSystemFontOfSize:48 weight:UIFontWeightRegular] range:NSMakeRange(6, 2)];
    bridge.uiManager.registry = @{@1:variants};
    NSDictionary *variantResult = call(module, YES, variants.fixtureStorage.string, 48, &code);
    check(@"same_text_different_attributes_uncached_equivalence", code == nil && matchesUncachedCandidates(variantResult, variants));
    NSMutableAttributedString *repeatedAttributes = [variants.fixtureStorage mutableCopy];
    [repeatedAttributes appendAttributedString:[variants.fixtureStorage copy]];
    RCTTextView *repeatedView = makeView(repeatedAttributes.string, 48);
    [repeatedView.fixtureStorage setAttributedString:repeatedAttributes];
    bridge.uiManager.registry = @{@1:repeatedView};
    NSDictionary *repeatedResult = call(module, YES, repeatedView.fixtureStorage.string, 48, &code);
    check(@"repeated_mixed_attributes_uncached_equivalence", code == nil && matchesUncachedCandidates(repeatedResult, repeatedView));
    // Issue two fonts before either resolves, as the mounted RN lookahead does.
    // Compare each result independently with the original uncached calculation.
    NSString *overlapText = @"考える時間と対話を大切にしながら、自分の言葉で伝えたい。";
    RCTTextView *firstView = makeView(overlapText, 48), *nextView = makeView(overlapText, 44);
    bridge.uiManager.registry = @{@1:firstView};
    RCTBridge *nextBridge = [RCTBridge new]; nextBridge.uiManager = [RCTUIManager new];
    nextBridge.uiManager.registry = @{@1:nextView};
    PieceTextMetrics *nextModule = [PieceTextMetrics new]; nextModule.bridge = nextBridge;
    dispatch_semaphore_t overlapDone = dispatch_semaphore_create(0);
    __block NSDictionary *firstResult = nil, *nextResult = nil;
    __block NSUInteger overlapErrors = 0;
    RCTPromiseRejectBlock overlapReject = ^(__unused NSString *value, __unused NSString *message, __unused NSError *cause) {
      overlapErrors++; dispatch_semaphore_signal(overlapDone);
    };
    [module measureCandidates:@1 text:overlapText fontSize:48 resolver:^(id value) {
      firstResult = value; dispatch_semaphore_signal(overlapDone);
    } rejecter:overlapReject];
    [nextModule measureCandidates:@1 text:overlapText fontSize:44 resolver:^(id value) {
      nextResult = value; dispatch_semaphore_signal(overlapDone);
    } rejecter:overlapReject];
    BOOL bothCompleted = dispatch_semaphore_wait(overlapDone, dispatch_time(DISPATCH_TIME_NOW, 10 * NSEC_PER_SEC)) == 0;
    bothCompleted = (dispatch_semaphore_wait(overlapDone, dispatch_time(DISPATCH_TIME_NOW, 10 * NSEC_PER_SEC)) == 0) && bothCompleted;
    NSString *firstCode = nil, *nextCode = nil;
    firstResult = decodeCandidates(firstResult, &firstCode); nextResult = decodeCandidates(nextResult, &nextCode);
    check(@"queued_two_fonts_complete", bothCompleted && overlapErrors == 0 && firstCode == nil && nextCode == nil);
    check(@"queued_current_font_uncached_equivalence", matchesUncachedCandidates(firstResult, firstView));
    check(@"queued_next_font_uncached_equivalence", matchesUncachedCandidates(nextResult, nextView));
    printf("NATIVE_CHECKS=%lu PASS=%lu FAIL=%lu SKIP=0\n", (unsigned long)checks,
      (unsigned long)(checks-failures), (unsigned long)failures);
    return failures ? 1 : 0;
  }
}
