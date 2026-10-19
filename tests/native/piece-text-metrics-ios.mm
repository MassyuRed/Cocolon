// Execute the ACTUAL PieceTextMetrics methods with real iOS TextKit/CoreText.
// Only RN bridge dispatch and the mounted-view wrapper are doubles. This is
// not a React render, physical-device check, capture-library or admission test.
#import "piece-ios-react-shim.h"
#import <CoreText/CoreText.h>
#include <mach/mach_time.h>
#include <math.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>
#include <atomic>
#include <float.h>
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
// Only the included production calls see these scoped v4 observations/faults.
// The independent uncached oracle below remains outside all wrappers.
static std::atomic_bool widthProbeActive{false}, widthFaultInkNull{false};
static std::atomic<int> widthFaultAdvance{0};
static std::atomic<uint64_t> widthCreates{0}, widthAdvances{0}, widthImages{0};
static void beginWidthProbe(int advanceFault = 0, BOOL inkFault = NO) {
  widthCreates = 0; widthAdvances = 0; widthImages = 0;
  widthFaultAdvance = advanceFault; widthFaultInkNull = inkFault; widthProbeActive = true;
}
static void endWidthProbe(void) {
  widthProbeActive = false; widthFaultAdvance = 0; widthFaultInkNull = false;
}
// Additional v5-only probes. The original 97 checks run with these disabled.
static std::atomic_bool v5Probe{false}, v5BudgetStub{false}, v5OwnershipFault{false}, v5ThrowImage{false}, v5ExpireQueue{false};
static std::atomic<int> v5InkFault{0};
static std::atomic<uint64_t> v5TypesetterCreates{0}, v5TypesetterReleases{0}, v5LineCreates{0}, v5LineReleases{0},
  v5IndependentCreates{0}, v5ClockReads{0}, v5Workers{0};
static thread_local CTTypesetterRef v5OwnedTypesetter = NULL;
static thread_local CTLineRef v5OwnedLine = NULL;
static void beginV5Probe(BOOL budget = NO) {
  v5TypesetterCreates = 0; v5TypesetterReleases = 0; v5LineCreates = 0; v5LineReleases = 0;
  v5IndependentCreates = 0; v5ClockReads = 0; v5Workers = 0; v5OwnershipFault = false;
  v5BudgetStub = budget; v5InkFault = 0; v5ThrowImage = false; v5ExpireQueue = false; v5Probe = true;
}
static BOOL balancedV5Probe(void) {
  return !v5OwnershipFault.load() && v5TypesetterCreates.load() == v5TypesetterReleases.load() &&
    v5LineCreates.load() + v5IndependentCreates.load() == v5LineReleases.load();
}
static void endV5Probe(void) { v5Probe = false; v5BudgetStub = false; v5InkFault = 0; v5ThrowImage = false; v5ExpireQueue = false; }
static CTTypesetterRef profiledTypesetter(CFAttributedStringRef text) {
  CTTypesetterRef result = CTTypesetterCreateWithAttributedString(text);
  if (v5Probe && result) {
    if (v5OwnedTypesetter) v5OwnershipFault = true;
    v5OwnedTypesetter = result; v5TypesetterCreates++;
  }
  return result;
}
static CTLineRef profiledTypesetterLine(CTTypesetterRef typesetter, CFRange range) {
  if (v5Probe && typesetter != v5OwnedTypesetter) v5OwnershipFault = true;
  CTLineRef line;
  if (v5BudgetStub) {
    // Only the two real-budget enumeration/reference checks use this short
    // real line. These checks are neither numeric parity nor speed evidence.
    NSAttributedString *shortText = [[NSAttributedString alloc] initWithString:@"A"
      attributes:@{NSFontAttributeName:[UIFont systemFontOfSize:48]}];
    line = CTLineCreateWithAttributedString((__bridge CFAttributedStringRef)shortText);
  } else line = CTTypesetterCreateLine(typesetter, range);
  if (v5Probe && line) {
    if (v5OwnedLine) v5OwnershipFault = true;
    v5OwnedLine = line; v5LineCreates++;
  }
  return line;
}
static struct {
  std::atomic<uint64_t> creates{0}, units{0}, createTicks{0}, typographicTicks{0}, imageTicks{0};
  std::atomic<uint64_t> queuedAt{0}, queueStarted{0}, workersStarted{0}, workersJoined{0}, resolvedAt{0}, decodeTicks{0};
  std::atomic<uint64_t> substringTicks{0}, cfSubstringTicks{0}, releaseTicks{0}, uptimeTicks{0}, uptimeCalls{0};
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
  if (v5Probe) v5Workers = count;
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
  if (v5ExpireQueue && v5ClockReads.fetch_add(1) > 0) return self.systemUptime + 9;
  if (!profileCandidates) return self.systemUptime;
  uint64_t start = mach_absolute_time();
  NSTimeInterval result = self.systemUptime;
  candidateProfile.uptimeTicks += mach_absolute_time() - start;
  candidateProfile.uptimeCalls++;
  return result;
}
@end
static void profiledRelease(CFTypeRef value) {
  if (v5Probe) {
    if (value == v5OwnedTypesetter) { v5OwnedTypesetter = NULL; v5TypesetterReleases++; }
    if (value == v5OwnedLine) { v5OwnedLine = NULL; v5LineReleases++; }
  }
  if (!profileCandidates) { CFRelease(value); return; }
  uint64_t start = mach_absolute_time();
  CFRelease(value);
  candidateProfile.releaseTicks += mach_absolute_time() - start;
}
static CFAttributedStringRef profiledCFSubstring(CFAllocatorRef allocator, CFAttributedStringRef text, CFRange range) {
  if (!profileCandidates) return CFAttributedStringCreateWithSubstring(allocator, text, range);
  uint64_t start = mach_absolute_time();
  CFAttributedStringRef result = CFAttributedStringCreateWithSubstring(allocator, text, range);
  candidateProfile.cfSubstringTicks += mach_absolute_time() - start;
  return result;
}
static CTLineRef v5TrackIndependentLine(CTLineRef line) {
  if (v5Probe && line) {
    if (v5OwnedLine) v5OwnershipFault = true;
    v5OwnedLine = line; v5IndependentCreates++;
  }
  return line;
}
static CTLineRef profiledCreateLine(CFAttributedStringRef text) {
  if (widthProbeActive) widthCreates++;
  if (!profileCandidates) return v5TrackIndependentLine(CTLineCreateWithAttributedString(text));
  uint64_t start = mach_absolute_time();
  CTLineRef result = CTLineCreateWithAttributedString(text);
  candidateProfile.createTicks += mach_absolute_time() - start;
  candidateProfile.creates++; candidateProfile.units += CFAttributedStringGetLength(text);
  return v5TrackIndependentLine(result);
}
static double profiledTypographicBounds(CTLineRef line, CGFloat *ascent, CGFloat *descent, CGFloat *leading) {
  if (widthProbeActive) {
    widthAdvances++;
    const int fault = widthFaultAdvance;
    if (fault) return fault == 1 ? NAN : fault == 2 ? INFINITY : fault == 3 ? -1 : -INFINITY;
  }
  if (!profileCandidates) return CTLineGetTypographicBounds(line, ascent, descent, leading);
  uint64_t start = mach_absolute_time();
  double result = CTLineGetTypographicBounds(line, ascent, descent, leading);
  candidateProfile.typographicTicks += mach_absolute_time() - start;
  return result;
}
static CGRect profiledImageBounds(CTLineRef line, CGContextRef context) {
  if (v5InkFault == 1) return CGRectMake(NAN, 0, 1, 1);
  if (v5InkFault == 2) return CGRectMake(DBL_MAX, 0, DBL_MAX, 1);
  if (v5ThrowImage.exchange(false)) @throw [NSException exceptionWithName:@"PieceV5InjectedImageFailure" reason:@"test-only" userInfo:nil];
  if (widthProbeActive) { widthImages++; if (widthFaultInkNull) return CGRectNull; }
  if (!profileCandidates) return CTLineGetImageBounds(line, context);
  uint64_t start = mach_absolute_time();
  CGRect result = CTLineGetImageBounds(line, context);
  candidateProfile.imageTicks += mach_absolute_time() - start;
  return result;
}
#define CTLineCreateWithAttributedString profiledCreateLine
#define CTTypesetterCreateWithAttributedString profiledTypesetter
#define CTTypesetterCreateLine profiledTypesetterLine
#define CTLineGetTypographicBounds profiledTypographicBounds
#define CTLineGetImageBounds profiledImageBounds
#define dispatch_async profiledAsync
#define dispatch_apply profiledApply
#define attributedSubstringFromRange pieceProfiledSubstringFromRange
#define systemUptime pieceProfiledSystemUptime
#define CFRelease profiledRelease
#define CFAttributedStringCreateWithSubstring profiledCFSubstring
#include "../../ios/tempCocolon/PieceTextMetrics.mm"
#undef CTLineCreateWithAttributedString
#undef CTTypesetterCreateWithAttributedString
#undef CTTypesetterCreateLine
#undef CTLineGetTypographicBounds
#undef CTLineGetImageBounds
#undef dispatch_async
#undef dispatch_apply
#undef attributedSubstringFromRange
#undef systemUptime
#undef CFRelease
#undef CFAttributedStringCreateWithSubstring

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
// Keep the old v3 decoder/call/oracle untouched. v4 stays a tagged union and
// compares with those already oracle-checked v3 rows, never fabricated ink.
static NSDictionary *callWidth(PieceTextMetrics *module, NSString *text, double size, double width, NSString **code) {
  __block NSDictionary *result = nil; __block NSString *error = nil;
  dispatch_semaphore_t done = dispatch_semaphore_create(0);
  [module measureCandidatesForWidth:@1 text:text fontSize:size contentWidth:width resolver:^(id value) {
    if ([value isKindOfClass:NSDictionary.class]) result = value; else error = @"INVALID_RESULT";
    dispatch_semaphore_signal(done);
  } rejecter:^(NSString *value, __unused NSString *message, __unused NSError *cause) {
    error = value; dispatch_semaphore_signal(done);
  }];
  if (dispatch_semaphore_wait(done, dispatch_time(DISPATCH_TIME_NOW, 10 * NSEC_PER_SEC)) != 0) {
    *code = @"TEST_CALLBACK_TIMEOUT"; return nil;
  }
  *code = error; return result;
}
static BOOL matchesWidthCandidates(NSDictionary *result, NSDictionary *legacy, NSString *text, double width) {
  NSSet *fields = [NSSet setWithArray:@[@"version", @"platform", @"font_size", @"utf16_length", @"boundaries", @"glyph_check",
    @"content_width", @"metric_count", @"full_metric_count", @"metric_records_le", @"row_indices_u32le"]];
  if (!result || !validCandidates(legacy, text) || ![[NSSet setWithArray:result.allKeys] isEqual:fields] ||
      ![result[@"version"] isEqual:@"piece.native_candidates.v4"] || !isfinite(width) || width <= 0 ||
      ![result[@"content_width"] isKindOfClass:NSNumber.class] || [result[@"content_width"] doubleValue] != width ||
      ![result[@"metric_records_le"] isKindOfClass:NSString.class] || ![result[@"row_indices_u32le"] isKindOfClass:NSString.class]) return NO;
  for (NSString *key in @[@"platform", @"font_size", @"utf16_length", @"boundaries", @"glyph_check"])
    if (![result[key] isEqual:legacy[key]]) return NO;
  const NSUInteger count = [legacy[@"rows"] count];
  const double uniqueNumber = [result[@"metric_count"] doubleValue], fullNumber = [result[@"full_metric_count"] doubleValue];
  if (!isfinite(uniqueNumber) || uniqueNumber < 1 || uniqueNumber > count || uniqueNumber != floor(uniqueNumber) ||
      !isfinite(fullNumber) || fullNumber < 0 || fullNumber > uniqueNumber || fullNumber != floor(fullNumber)) return NO;
  const NSUInteger unique = (NSUInteger)uniqueNumber, full = (NSUInteger)fullNumber;
  NSData *data = [[NSData alloc] initWithBase64EncodedString:result[@"metric_records_le"] options:0];
  NSData *indices = [[NSData alloc] initWithBase64EncodedString:result[@"row_indices_u32le"] options:0];
  if (data.length != unique * 9 + full * 32 || indices.length != count * 4) return NO;
  NSMutableArray<NSArray *> *metrics = [NSMutableArray new];
  NSUInteger offset = 0, fullSeen = 0;
  for (NSUInteger i = 0; i < unique; i++) {
    if (offset + 9 > data.length) return NO;
    uint8_t tag = ((const uint8_t *)data.bytes)[offset++];
    if (tag != 0 && tag != 1) return NO;
    const NSUInteger values = tag == 1 ? 1 : 5;
    if (offset + values * 8 > data.length) return NO;
    NSMutableArray *record = [NSMutableArray arrayWithObject:@(tag)];
    for (NSUInteger j = 0; j < values; j++, offset += 8) {
      uint64_t bits; memcpy(&bits, (const uint8_t *)data.bytes + offset, sizeof(bits));
      bits = CFSwapInt64LittleToHost(bits);
      double value; memcpy(&value, &bits, sizeof(value));
      if (!isfinite(value)) return NO;
      [record addObject:@(value)];
    }
    const double advance = [record[1] doubleValue];
    if (advance < 0 || (tag == 1) != (advance > width)) return NO;
    if (tag == 0) {
      if ([record[4] doubleValue] < [record[2] doubleValue] || [record[5] doubleValue] < [record[3] doubleValue]) return NO;
      fullSeen++;
    }
    [metrics addObject:record];
  }
  if (offset != data.length || fullSeen != full) return NO;
  NSMutableIndexSet *used = [NSMutableIndexSet new];
  NSArray *rows = legacy[@"rows"];
  for (NSUInteger i = 0; i < count; i++) {
    uint32_t index; memcpy(&index, (const uint8_t *)indices.bytes + i * 4, sizeof(index));
    index = CFSwapInt32LittleToHost(index);
    if (index >= unique) return NO;
    [used addIndex:index];
    NSArray *record = metrics[index], *row = rows[i];
    const BOOL overflow = [row[2] doubleValue] > width;
    if ([record[0] boolValue] != overflow || record.count != (overflow ? 2 : 6)) return NO;
    for (NSUInteger j = 0; j < (overflow ? 1 : 5); j++) {
      double actual = [record[j + 1] doubleValue], expected = [row[j + 2] doubleValue];
      if (memcmp(&actual, &expected, sizeof(double)) != 0) return NO;
    }
  }
  return used.count == unique;
}
static BOOL widthParity(PieceTextMetrics *module, NSDictionary *legacy, RCTTextView *view, double size, double width) {
  NSString *code = nil;
  NSDictionary *result = callWidth(module, view.fixtureStorage.string, size, width, &code);
  if (code) printf("v4 rejection %s\n", code.UTF8String);
  return code == nil && matchesWidthCandidates(result, legacy, view.fixtureStorage.string, width);
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
// v5 additions do not change the old independent oracle or its 97 checks.
static NSDictionary *callV5(PieceTextMetrics *module, BOOL candidates, NSString *text, double font, NSString **code) {
  __block NSDictionary *result = nil; __block NSString *error = nil;
  dispatch_semaphore_t done = dispatch_semaphore_create(0);
  RCTPromiseResolveBlock resolve = ^(id value) { if ([value isKindOfClass:NSDictionary.class]) result = value;
    else error = @"INVALID_RESULT"; dispatch_semaphore_signal(done); };
  RCTPromiseRejectBlock reject = ^(NSString *value, __unused NSString *message, __unused NSError *cause) {
    error = value; dispatch_semaphore_signal(done); };
  if (candidates) [module measureExplorationCandidates:@1 text:text fontSize:font resolver:resolve rejecter:reject];
  else [module inspectSelectedLine:@1 text:text fontSize:font resolver:resolve rejecter:reject];
  if (dispatch_semaphore_wait(done, dispatch_time(DISPATCH_TIME_NOW, 10 * NSEC_PER_SEC)) != 0) {
    *code = @"TEST_CALLBACK_TIMEOUT"; return nil;
  }
  *code = error; return result;
}
static NSDictionary *decodeV5(NSDictionary *wire, NSString **code) {
  NSArray *keys = @[@"version", @"platform", @"font_size", @"utf16_length", @"boundaries", @"glyph_check",
    @"metric_count", @"metrics_f64le", @"row_indices_u32le"];
  if (![wire isKindOfClass:NSDictionary.class] || ![wire[@"version"] isEqual:@"piece.native_candidates.v5"] ||
      ![[NSSet setWithArray:wire.allKeys] isEqual:[NSSet setWithArray:keys]]) { *code = @"INVALID_V5_WIRE"; return nil; }
  NSMutableDictionary *oldWire = [wire mutableCopy]; oldWire[@"version"] = @"piece.native_candidates.v3";
  return decodeCandidates(oldWire, code);
}
static BOOL contextMetrics(CTLineRef line, NSString *text, double values[5]) {
  if (!line) return NO;
  double advance = CTLineGetTypographicBounds(line, NULL, NULL, NULL);
  CGRect ink = CTLineGetImageBounds(line, NULL);
  if (CGRectIsNull(ink)) {
    if ([text rangeOfCharacterFromSet:NSCharacterSet.whitespaceAndNewlineCharacterSet.invertedSet].location != NSNotFound) return NO;
    ink = CGRectZero;
  }
  const double expected[] = {advance, CGRectGetMinX(ink), -CGRectGetMaxY(ink), CGRectGetMaxX(ink), -CGRectGetMinY(ink)};
  for (double value : expected) if (!isfinite(value)) return NO;
  if (advance < 0 || expected[3] < expected[1] || expected[4] < expected[2]) return NO;
  memcpy(values, expected, sizeof(expected)); return YES;
}
static uint32_t v5Reference(NSDictionary *wire, NSUInteger start, NSUInteger end) {
  NSUInteger n = [wire[@"boundaries"] count] - 1;
  NSUInteger offset = start * n - start * (start - 1) / 2 + end - start - 1;
  NSData *bytes = [[NSData alloc] initWithBase64EncodedString:wire[@"row_indices_u32le"] options:0];
  if (offset >= bytes.length / 4) return UINT32_MAX;
  uint32_t reference; memcpy(&reference, (const uint8_t *)bytes.bytes + offset * 4, 4);
  return CFSwapInt32LittleToHost(reference);
}
// A straightforward attributed-string dictionary oracle, independent of the
// implementation's rolling hashes, attribute IDs and worker reuse. Each miss
// builds a fresh suffix typesetter; each retained hit reuses its first value.
static BOOL matchesExploration(NSDictionary *wire, RCTTextView *view) {
  NSString *code = nil; NSDictionary *decoded = decodeV5(wire, &code);
  if (code || !validCandidates(decoded, view.fixtureStorage.string)) return NO;
  NSAttributedString *snapshot = [view.fixtureStorage copy];
  NSMutableDictionary<NSAttributedString *, NSDictionary *> *cache = [NSMutableDictionary new];
  NSUInteger retainedUnits = 0, jobs = 0, rowIndex = 0;
  NSArray *boundaries = decoded[@"boundaries"];
  NSData *references = [[NSData alloc] initWithBase64EncodedString:wire[@"row_indices_u32le"] options:0];
  for (NSArray *row in decoded[@"rows"]) {
    @autoreleasepool {
      NSUInteger start = [boundaries[[row[0] unsignedIntegerValue]] unsignedIntegerValue];
      NSUInteger end = [boundaries[[row[1] unsignedIntegerValue]] unsignedIntegerValue];
      NSAttributedString *part = [snapshot attributedSubstringFromRange:NSMakeRange(start, end - start)];
      NSDictionary *record = cache[part];
      if (!record) {
        NSAttributedString *suffix = [snapshot attributedSubstringFromRange:NSMakeRange(start, snapshot.length - start)];
        CTTypesetterRef typesetter = CTTypesetterCreateWithAttributedString((__bridge CFAttributedStringRef)suffix);
        if (!typesetter) return NO;
        CTLineRef line = CTTypesetterCreateLine(typesetter, CFRangeMake(0, part.length));
        double values[5]; BOOL valid = contextMetrics(line, part.string, values);
        if (line) CFRelease(line); CFRelease(typesetter);
        if (!valid) return NO;
        record = @{@"index":@(jobs++), @"metrics":[NSData dataWithBytes:values length:sizeof(values)]};
        if (cache.count < 16384 && retainedUnits + part.length <= 4194304) { cache[part] = record; retainedUnits += part.length; }
      }
      uint32_t reference; memcpy(&reference, (const uint8_t *)references.bytes + rowIndex * 4, 4);
      if (CFSwapInt32LittleToHost(reference) != [record[@"index"] unsignedIntegerValue]) return NO;
      double expected[5]; [record[@"metrics"] getBytes:expected length:sizeof(expected)];
      for (NSUInteger i = 0; i < 5; i++) {
        double actual = [row[i + 2] doubleValue];
        if (memcmp(&actual, &expected[i], sizeof(actual)) != 0) return NO;
      }
      rowIndex++;
    }
  }
  return rowIndex == [decoded[@"rows"] count] && jobs == [wire[@"metric_count"] unsignedIntegerValue];
}
static BOOL selectedMatchesOriginalOracle(PieceTextMetrics *module, RCTBridge *bridge, RCTTextView *view, double font, NSString *name) {
  bridge.uiManager.registry = @{@1:view}; NSString *code = nil;
  NSDictionary *legacy = call(module, YES, view.fixtureStorage.string, font, &code);
  if (code || !matchesUncachedCandidates(legacy, view)) return NO;
  NSDictionary *oldInspection = call(module, NO, view.fixtureStorage.string, font, &code);
  if (code || oldInspection.count != 10) return NO;
  beginV5Probe(); beginWidthProbe();
  NSDictionary *selected = callV5(module, NO, view.fixtureStorage.string, font, &code);
  BOOL reused = v5IndependentCreates.load() == 1 && v5LineCreates.load() == 0 && balancedV5Probe() &&
    widthCreates.load() == 1 && widthAdvances.load() == 1 && widthImages.load() == 1;
  endWidthProbe(); endV5Probe();
  if (code || !reused || selected.count != 11 || ![selected[@"version"] isEqual:@"piece.native_selected_line.v1"] ||
      ![selected[@"independent_metrics_f64le"] isKindOfClass:NSString.class] ||
      ![selected[@"line_ends"] isEqual:@[@(view.fixtureStorage.length)]] ||
      ![selected[@"boundaries"] isEqual:legacy[@"boundaries"]]) return NO;
  NSData *bytes = [[NSData alloc] initWithBase64EncodedString:selected[@"independent_metrics_f64le"] options:0];
  if (bytes.length != 40) return NO;
  NSMutableDictionary *common = [selected mutableCopy]; [common removeObjectForKey:@"independent_metrics_f64le"];
  common[@"version"] = @"piece.native_text.v1";
  if (![common isEqual:oldInspection] || !inkEnclosesPaint(view, selected)) return NO;
  NSArray *fullRow = legacy[@"rows"][[legacy[@"boundaries"] count] - 2];
  printf("V5_SELECTED_BITS %s", name.UTF8String);
  for (NSUInteger i = 0; i < 5; i++) {
    uint64_t actual; memcpy(&actual, (const uint8_t *)bytes.bytes + i * 8, 8); actual = CFSwapInt64LittleToHost(actual);
    double expectedValue = [fullRow[i + 2] doubleValue]; uint64_t expected; memcpy(&expected, &expectedValue, 8);
    printf(" %016llx", (unsigned long long)actual);
    if (actual != expected) { printf(" mismatch\n"); return NO; }
  }
  printf("\n"); return YES;
}
static void runV5Checks(PieceTextMetrics *module, RCTBridge *bridge) {
  NSArray *cases = @[@[@"spaces", @"  keep spaces  "], @[@"max420_prefix8", [@"あ" stringByPaddingToLength:420 withString:@"あ" startingAtIndex:0]],
    @[@"latin_ligature", @"office affinity AV To"], @[@"hebrew", @"שלום עולם"], @[@"arabic", @"مرحبا بالعالم"],
    @[@"mixed_bidi", @"abc (אבג) 12"], @[@"paragraph_direction", @"fi AV 12 שלום"]];
  for (NSArray *fixture in cases) {
    NSString *name = fixture[0], *text = fixture[1], *code = nil;
    RCTTextView *view = makeView(text, 48);
    if ([name isEqual:@"paragraph_direction"]) {
      NSMutableParagraphStyle *paragraph = [[view.fixtureStorage attribute:NSParagraphStyleAttributeName atIndex:0 effectiveRange:NULL] mutableCopy];
      paragraph.baseWritingDirection = NSWritingDirectionRightToLeft; paragraph.firstLineHeadIndent = 12;
      paragraph.headIndent = 6; paragraph.tailIndent = -8; paragraph.defaultTabInterval = 42;
      paragraph.tabStops = @[[[NSTextTab alloc] initWithTextAlignment:NSTextAlignmentRight location:96 options:@{}]];
      [view.fixtureStorage addAttributes:@{NSParagraphStyleAttributeName:paragraph, NSLigatureAttributeName:@2,
        NSKernAttributeName:@1.25, NSBaselineOffsetAttributeName:@3} range:NSMakeRange(0, text.length)];
    }
    bridge.uiManager.registry = @{@1:view};
    NSDictionary *wire = callV5(module, YES, text, 48, &code);
    check([@"v5_" stringByAppendingFormat:@"%@_all_range_suffix_representatives", name], code == nil && matchesExploration(wire, view));
    NSUInteger selectedLength = [name isEqual:@"max420_prefix8"] ? 8 : text.length;
    NSAttributedString *attributes = [view.fixtureStorage attributedSubstringFromRange:NSMakeRange(0, selectedLength)];
    RCTTextView *selected = makeView(attributes.string, 48); [selected.fixtureStorage setAttributedString:attributes];
    check([@"v5_" stringByAppendingFormat:@"%@_selected_original_bits_and_paint", name],
      selectedMatchesOriginalOracle(module, bridge, selected, 48, name));
    // Observe exploration vs independently shaped selected prefix without
    // asserting the old OS-specific mismatch count or blessing equivalence.
    NSDictionary *decoded = decodeV5(wire, &code);
    if (decoded) {
      NSArray *bounds = decoded[@"boundaries"];
      NSUInteger end = [bounds indexOfObject:@(selectedLength)];
      NSArray *row = end != NSNotFound && end ? decoded[@"rows"][end - 1] : nil;
      printf("V5_EXPLORATION_BITS %s", name.UTF8String);
      for (NSUInteger i = 2; i < row.count; i++) { double value = [row[i] doubleValue]; uint64_t bits; memcpy(&bits, &value, 8); printf(" %016llx", (unsigned long long)bits); }
      printf("\n");
      // Record the historically different range itself as numeric context
      // evidence. A whitespace-only range is not made into a paint fixture.
      NSDictionary *historicalRanges = @{@"spaces":@[@0,@3], @"max420_prefix8":@[@0,@8], @"latin_ligature":@[@0,@17],
        @"hebrew":@[@0,@8], @"arabic":@[@0,@1], @"mixed_bidi":@[@3,@4], @"paragraph_direction":@[@0,@4]};
      NSArray *range = historicalRanges[name]; NSUInteger start = [range[0] unsignedIntegerValue], finish = [range[1] unsignedIntegerValue];
      NSUInteger startIndex = [bounds indexOfObject:@(start)], endIndex = [bounds indexOfObject:@(finish)], n = bounds.count - 1;
      if (startIndex != NSNotFound && endIndex != NSNotFound && startIndex < endIndex) {
        NSArray *explored = decoded[@"rows"][startIndex * n - startIndex * (startIndex - 1) / 2 + endIndex - startIndex - 1];
        NSAttributedString *part = [view.fixtureStorage attributedSubstringFromRange:NSMakeRange(start, finish - start)];
        CTLineRef independent = CTLineCreateWithAttributedString((__bridge CFAttributedStringRef)part); double independentMetrics[5];
        BOOL valid = contextMetrics(independent, part.string, independentMetrics); if (independent) CFRelease(independent);
        if (valid) {
          printf("V5_HISTORICAL_RANGE_BITS %s utf16_start=%lu utf16_end=%lu", name.UTF8String, (unsigned long)start, (unsigned long)finish);
          for (NSUInteger i = 0; i < 5; i++) { double actual = [explored[i + 2] doubleValue]; uint64_t a, b;
            memcpy(&a, &actual, 8); memcpy(&b, &independentMetrics[i], 8); printf(" %016llx/%016llx", (unsigned long long)a, (unsigned long long)b); }
          printf("\n");
        }
      }
    }
  }
  for (NSUInteger variant = 0; variant < 2; variant++) {
    RCTTextView *view = makeView(@"ABCDEFGHIJKLMNOPQRSTUVWX", 48);
    if (variant) [view.fixtureStorage addAttributes:@{NSBaselineOffsetAttributeName:@3, NSKernAttributeName:@1.25}
      range:NSMakeRange(8, 8)];
    bridge.uiManager.registry = @{@1:view}; NSString *code = nil;
    beginV5Probe(); NSDictionary *wire = callV5(module, YES, view.fixtureStorage.string, 48, &code);
    BOOL owned = balancedV5Probe() && v5Workers.load() == 4 && v5LineCreates.load() == 300;
    endV5Probe();
    check(variant ? @"v5_nonuniform_worker_ownership_and_oracle" : @"v5_uniform_worker_ownership_and_oracle",
      code == nil && owned && matchesExploration(wire, view));
  }
  RCTTextView *attributes = makeView(@"AaAaAaAaAaAa", 48);
  [attributes.fixtureStorage addAttribute:NSKernAttributeName value:@4 range:NSMakeRange(2, 2)];
  [attributes.fixtureStorage addAttribute:NSBaselineOffsetAttributeName value:@3 range:NSMakeRange(4, 2)];
  [attributes.fixtureStorage addAttribute:NSFontAttributeName value:[UIFont monospacedSystemFontOfSize:48 weight:UIFontWeightRegular] range:NSMakeRange(6, 2)];
  bridge.uiManager.registry = @{@1:attributes}; NSString *code = nil;
  NSDictionary *attrWire = callV5(module, YES, attributes.fixtureStorage.string, 48, &code);
  check(@"v5_cache_full_pointwise_attributes", code == nil && matchesExploration(attrWire, attributes) &&
    v5Reference(attrWire, 0, 2) == v5Reference(attrWire, 8, 10) && v5Reference(attrWire, 0, 2) != v5Reference(attrWire, 2, 4));
  for (NSUInteger units = 0; units < 2; units++) {
    NSString *cluster = units ? @"A\u0301" : @"A";
    NSString *text = [@"" stringByPaddingToLength:420 * cluster.length withString:cluster startingAtIndex:0];
    RCTTextView *view = makeView(text, 48);
    for (NSUInteger i = 0; i < 420; i++) {
      NSUInteger attribute = units ? (i <= 25 ? i : (i == 400 || i == 410 ? 27 : 26)) : MIN(i, 40);
      [view.fixtureStorage addAttribute:NSBaselineOffsetAttributeName value:@((double)attribute / 1000)
        range:NSMakeRange(i * cluster.length, cluster.length)];
    }
    bridge.uiManager.registry = @{@1:view}; beginV5Probe(YES);
    NSDictionary *wire = callV5(module, YES, text, 48, &code);
    BOOL balanced = balancedV5Probe(); endV5Probe();
    NSDictionary *decoded = decodeV5(wire, &code);
    BOOL valid = code == nil && balanced && validCandidates(decoded, text) && [decoded[@"rows"] count] == 88410;
    if (!units) valid = valid && [wire[@"metric_count"] unsignedIntegerValue] == 16520 &&
      v5Reference(wire, 40, 404) == 16383 && v5Reference(wire, 41, 405) == 16383 &&
      v5Reference(wire, 40, 405) == 16384 && v5Reference(wire, 41, 406) != 16384;
    else valid = valid && [wire[@"metric_count"] unsignedIntegerValue] == 86484 &&
      v5Reference(wire, 25, 170) == 10344 && v5Reference(wire, 25, 171) == 10345 &&
      v5Reference(wire, 26, 31) == 10599 && v5Reference(wire, 27, 32) == 10599 &&
      v5Reference(wire, 26, 32) == 10600 && v5Reference(wire, 27, 33) == 10989 &&
      v5Reference(wire, 399, 401) == 86325 && v5Reference(wire, 409, 411) == 86325 &&
      v5Reference(wire, 400, 401) == 86345 && v5Reference(wire, 410, 411) == 86464;
    check(units ? @"v5_real_utf16_budget_later_short_key_and_uncached_references_synthetic_metrics"
      : @"v5_real_key_budget_retained_hit_uncached_miss_synthetic_metrics", valid);
  }
  // The historical eighth mismatch has mixed 48/37pt attributes. Preserve
  // those exact attributes for direct observation and keep product rejection.
  NSMutableParagraphStyle *rtl = [NSMutableParagraphStyle new]; rtl.baseWritingDirection = NSWritingDirectionRightToLeft;
  NSAttributedString *candidate = [[NSAttributedString alloc] initWithString:@" \t " attributes:@{
    NSFontAttributeName:[UIFont systemFontOfSize:48], NSLigatureAttributeName:@2}];
  NSMutableAttributedString *suffix = [candidate mutableCopy];
  [suffix appendAttributedString:[[NSAttributedString alloc] initWithString:@"שלום (مرحبا)" attributes:@{
    NSFontAttributeName:[UIFont systemFontOfSize:37], NSParagraphStyleAttributeName:rtl, NSBaselineOffsetAttributeName:@4}]];
  CTTypesetterRef typesetter = CTTypesetterCreateWithAttributedString((__bridge CFAttributedStringRef)suffix);
  CTLineRef contextual = typesetter ? CTTypesetterCreateLine(typesetter, CFRangeMake(0, candidate.length)) : NULL;
  CTLineRef independent = CTLineCreateWithAttributedString((__bridge CFAttributedStringRef)candidate);
  double contextValues[5], independentValues[5];
  BOOL observed = contextMetrics(contextual, candidate.string, contextValues) && contextMetrics(independent, candidate.string, independentValues);
  if (contextual) CFRelease(contextual); if (typesetter) CFRelease(typesetter); if (independent) CFRelease(independent);
  if (observed) {
    printf("V5_HISTORICAL_WHITESPACE_NEIGHBOR2_BITS");
    for (NSUInteger i = 0; i < 5; i++) { uint64_t a, b; memcpy(&a, &contextValues[i], 8); memcpy(&b, &independentValues[i], 8);
      printf(" %016llx/%016llx", (unsigned long long)a, (unsigned long long)b); } printf("\n");
  }
  check(@"v5_historical_whitespace_neighbor2_original_attributes_observed", observed);
  RCTTextView *mixed = makeView(suffix.string, 48); [mixed.fixtureStorage setAttributedString:suffix]; bridge.uiManager.registry = @{@1:mixed};
  BOOL rejectedMixed = callV5(module, YES, suffix.string, 48, &code) == nil && [code isEqual:@"PIECE_NATIVE_MEASUREMENT_UNAVAILABLE"];
  check(@"v5_historical_mixed_font_input_remains_rejected", rejectedMixed);
  for (NSString *kind in @[@"wrong_text", @"wrong_font", @"detached", @"unsupported"]) {
    NSString *text = [kind isEqual:@"unsupported"] ? @"\u0378" : @"Cocolon";
    RCTTextView *view = makeView(text, 48); if ([kind isEqual:@"detached"]) view.fixtureAttached = NO;
    bridge.uiManager.registry = @{@1:view};
    NSString *expected = [kind isEqual:@"wrong_text"] ? @"other" : text;
    double font = [kind isEqual:@"wrong_font"] ? 49 : 48;
    BOOL rejected = YES;
    for (NSUInteger method = 0; method < 2; method++) rejected = (callV5(module, method == 0, expected, font, &code) == nil &&
      [code isEqual:@"PIECE_NATIVE_MEASUREMENT_UNAVAILABLE"]) && rejected;
    check([@"v5_" stringByAppendingFormat:@"%@_both_methods_reject", kind], rejected);
  }
  RCTTextView *wrapped = makeView(@"Cocolon Cocolon Cocolon", 48);
  wrapped.bounds = CGRectMake(0, 0, 100, 800); wrapped.fixtureContentFrame = wrapped.bounds;
  wrapped.fixtureStorage.layoutManagers.firstObject.textContainers.firstObject.size = CGSizeMake(100, 800);
  bridge.uiManager.registry = @{@1:wrapped};
  NSDictionary *oldWrapped = call(module, NO, wrapped.fixtureStorage.string, 48, &code);
  BOOL oldAllowsMultiple = code == nil && [oldWrapped[@"line_ends"] count] > 1;
  check(@"v5_selected_actual_rewrap_rejected", oldAllowsMultiple && callV5(module, NO, wrapped.fixtureStorage.string, 48, &code) == nil &&
    [code isEqual:@"PIECE_NATIVE_MEASUREMENT_UNAVAILABLE"]);
  bridge.uiManager.registry = @{@1:makeView(@"A", 48)};
  BOOL badAdvance = YES;
  for (NSUInteger method = 0; method < 2; method++) for (int fault = 1; fault <= 4; fault++) {
    beginWidthProbe(fault); NSDictionary *value = callV5(module, method == 0, @"A", 48, &code); endWidthProbe();
    badAdvance = (value == nil && [code isEqual:@"PIECE_NATIVE_MEASUREMENT_UNAVAILABLE"]) && badAdvance;
  }
  check(@"v5_nonfinite_negative_advance_both_methods_rejected", badAdvance);
  BOOL nullInk = YES;
  for (NSUInteger method = 0; method < 2; method++) {
    beginWidthProbe(0, YES); NSDictionary *value = callV5(module, method == 0, @"A", 48, &code); endWidthProbe();
    nullInk = (value == nil && [code isEqual:@"PIECE_NATIVE_MEASUREMENT_UNAVAILABLE"]) && nullInk;
  }
  check(@"v5_nonwhitespace_null_ink_both_methods_rejected", nullInk);
  for (NSUInteger method = 0; method < 2; method++) {
    beginV5Probe(); v5ThrowImage = true;
    NSDictionary *value = callV5(module, method == 0, @"A", 48, &code);
    BOOL released = balancedV5Probe(); endV5Probe();
    check(method ? @"v5_selected_exception_releases_existing_line" : @"v5_candidate_exception_releases_line_and_typesetter",
      value == nil && [code isEqual:@"PIECE_NATIVE_MEASUREMENT_UNAVAILABLE"] && released);
  }
  BOOL invalidInk = YES;
  for (NSUInteger method = 0; method < 2; method++) for (int fault = 1; fault <= 2; fault++) {
    beginV5Probe(); v5InkFault = fault;
    NSDictionary *value = callV5(module, method == 0, @"A", 48, &code);
    BOOL released = balancedV5Probe(); endV5Probe();
    invalidInk = (value == nil && [code isEqual:@"PIECE_NATIVE_MEASUREMENT_UNAVAILABLE"] && released) && invalidInk;
  }
  check(@"v5_nonfinite_ink_and_computed_overflow_both_methods_rejected", invalidInk);
  beginV5Probe(); v5ExpireQueue = true;
  NSDictionary *expired = callV5(module, YES, @"A", 48, &code);
  BOOL noWork = v5LineCreates.load() == 0 && v5IndependentCreates.load() == 0; endV5Probe();
  check(@"v5_original_native_deadline_includes_queue", expired == nil && [code isEqual:@"PIECE_NATIVE_MEASUREMENT_UNAVAILABLE"] && noWork);
}

static int runNativeMetricsChecks(void) {
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
      check([name stringByAppendingString:@"_v4_all_range_bit_parity"], widthParity(module, candidates, view, font, 120));
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
    check(@"unsupported_v4_candidates", callWidth(module, unsupported, 48, 1, &code) == nil && [code isEqual:@"PIECE_NATIVE_MEASUREMENT_UNAVAILABLE"]);
    NSString *longText = [@"あ" stringByPaddingToLength:420 withString:@"あ" startingAtIndex:0];
    bridge.uiManager.registry = @{@1:makeView(longText, 48)};
    NSTimeInterval started = NSProcessInfo.processInfo.systemUptime;
    NSDictionary *longResult = call(module, YES, longText, 48, &code);
    printf("max420_candidate_elapsed_ms=%.3f\n", (NSProcessInfo.processInfo.systemUptime-started)*1000);
    check(@"max420_complete_metrics", code == nil && validCandidates(longResult, longText));
    check(@"max420_uncached_equivalence", matchesUncachedCandidates(longResult, (RCTTextView *)bridge.uiManager.registry[@1]));
    check(@"max420_v4_all_range_bit_parity", widthParity(module, longResult, (RCTTextView *)bridge.uiManager.registry[@1], 48, 888));
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
    printf("mixed420_phase_profile queue_ms=%.3f glyph_and_group_ms=%.3f workers_wall_ms=%.3f pack_and_resolve_ms=%.3f test_decode_ms=%.3f generic_substring_sum_ms=%.3f cf_substring_sum_ms=%.3f release_sum_ms=%.3f uptime_sum_ms=%.3f uptime_calls=%llu\n",
      profileMilliseconds(candidateProfile.queuedAt.load(), candidateProfile.queueStarted.load(), millisecondsPerTick),
      profileMilliseconds(candidateProfile.queueStarted.load(), candidateProfile.workersStarted.load(), millisecondsPerTick),
      profileMilliseconds(candidateProfile.workersStarted.load(), candidateProfile.workersJoined.load(), millisecondsPerTick),
      profileMilliseconds(candidateProfile.workersJoined.load(), candidateProfile.resolvedAt.load(), millisecondsPerTick),
      candidateProfile.decodeTicks.load()*millisecondsPerTick,
      candidateProfile.substringTicks.load()*millisecondsPerTick,
      candidateProfile.cfSubstringTicks.load()*millisecondsPerTick,
      candidateProfile.releaseTicks.load()*millisecondsPerTick,
      candidateProfile.uptimeTicks.load()*millisecondsPerTick,
      (unsigned long long)candidateProfile.uptimeCalls.load());
    check(@"mixed420_complete_metrics", code == nil && validCandidates(mixedResult, mixedText));
    check(@"mixed420_uncached_equivalence", matchesUncachedCandidates(mixedResult, (RCTTextView *)bridge.uiManager.registry[@1]));
    started = NSProcessInfo.processInfo.systemUptime;
    NSDictionary *mixedWidthResult = callWidth(module, mixedText, 48, 888, &code);
    printf("mixed420_v4_candidate_elapsed_ms=%.3f metric_count=%lu full_metric_count=%lu\n",
      (NSProcessInfo.processInfo.systemUptime - started) * 1000,
      (unsigned long)[mixedWidthResult[@"metric_count"] unsignedIntegerValue], (unsigned long)[mixedWidthResult[@"full_metric_count"] unsignedIntegerValue]);
    check(@"mixed420_v4_all_range_bit_parity", code == nil && matchesWidthCandidates(mixedWidthResult, mixedResult, mixedText, 888));
    RCTTextView *uniform = makeView(@"AaAaAaAa", 48);
    [uniform.fixtureStorage addAttributes:@{ NSKernAttributeName:@4, NSBaselineOffsetAttributeName:@3,
      NSFontAttributeName:[UIFont monospacedSystemFontOfSize:48 weight:UIFontWeightRegular] }
      range:NSMakeRange(0, uniform.fixtureStorage.length)];
    bridge.uiManager.registry = @{@1:uniform};
    NSDictionary *uniformResult = call(module, YES, uniform.fixtureStorage.string, 48, &code);
    check(@"uniform_complete_attributes_uncached_equivalence", code == nil && matchesUncachedCandidates(uniformResult, uniform));
    check(@"uniform_complete_attributes_v4_parity", widthParity(module, uniformResult, uniform, 48, 120));
    RCTTextView *variants = makeView(@"AaAaAaAa", 48);
    [variants.fixtureStorage addAttribute:NSKernAttributeName value:@4 range:NSMakeRange(2, 2)];
    [variants.fixtureStorage addAttribute:NSBaselineOffsetAttributeName value:@3 range:NSMakeRange(4, 2)];
    [variants.fixtureStorage addAttribute:NSFontAttributeName value:[UIFont monospacedSystemFontOfSize:48 weight:UIFontWeightRegular] range:NSMakeRange(6, 2)];
    bridge.uiManager.registry = @{@1:variants};
    NSDictionary *variantResult = call(module, YES, variants.fixtureStorage.string, 48, &code);
    check(@"same_text_different_attributes_uncached_equivalence", code == nil && matchesUncachedCandidates(variantResult, variants));
    check(@"same_text_different_attributes_v4_parity", widthParity(module, variantResult, variants, 48, 120));
    NSMutableAttributedString *repeatedAttributes = [variants.fixtureStorage mutableCopy];
    [repeatedAttributes appendAttributedString:[variants.fixtureStorage copy]];
    RCTTextView *repeatedView = makeView(repeatedAttributes.string, 48);
    [repeatedView.fixtureStorage setAttributedString:repeatedAttributes];
    bridge.uiManager.registry = @{@1:repeatedView};
    NSDictionary *repeatedResult = call(module, YES, repeatedView.fixtureStorage.string, 48, &code);
    check(@"repeated_mixed_attributes_uncached_equivalence", code == nil && matchesUncachedCandidates(repeatedResult, repeatedView));
    check(@"repeated_mixed_attributes_v4_parity", widthParity(module, repeatedResult, repeatedView, 48, 120));
    NSArray *contextFixtures = @[
      @[@"latin_ligature_context", @"office affinity AV To"],
      @[@"hebrew_context", @"שלום עולם"], @[@"arabic_context", @"مرحبا بالعالم"],
      @[@"mixed_bidi_context", @"abc (אבג) 12"], @[@"unicode_context", @"A👩‍💻☕️e\u0301 fi "] ];
    for (NSArray *fixture in contextFixtures) {
      printf("CASE %s\n", [fixture[0] UTF8String]);
      RCTTextView *contextView = makeView(fixture[1], 48); bridge.uiManager.registry = @{@1:contextView};
      NSDictionary *contextResult = call(module, YES, fixture[1], 48, &code);
      check([fixture[0] stringByAppendingString:@"_uncached_equivalence"], code == nil && matchesUncachedCandidates(contextResult, contextView));
      check([fixture[0] stringByAppendingString:@"_v4_all_range_bit_parity"], widthParity(module, contextResult, contextView, 48, 120));
    }
    RCTTextView *paragraphView = makeView(@"fi AV 12 שלום", 48);
    NSMutableParagraphStyle *paragraph = [[paragraphView.fixtureStorage attribute:NSParagraphStyleAttributeName atIndex:0 effectiveRange:NULL] mutableCopy];
    paragraph.baseWritingDirection = NSWritingDirectionRightToLeft;
    paragraph.firstLineHeadIndent = 12; paragraph.headIndent = 6; paragraph.tailIndent = -8;
    paragraph.defaultTabInterval = 42;
    paragraph.tabStops = @[[[NSTextTab alloc] initWithTextAlignment:NSTextAlignmentRight location:96 options:@{}]];
    [paragraphView.fixtureStorage addAttributes:@{ NSParagraphStyleAttributeName:paragraph,
      NSLigatureAttributeName:@2, NSKernAttributeName:@1.25, NSBaselineOffsetAttributeName:@3 }
      range:NSMakeRange(0, paragraphView.fixtureStorage.length)];
    bridge.uiManager.registry = @{@1:paragraphView};
    NSDictionary *paragraphResult = call(module, YES, paragraphView.fixtureStorage.string, 48, &code);
    check(@"paragraph_direction_attributes_uncached_equivalence", code == nil && matchesUncachedCandidates(paragraphResult, paragraphView));
    check(@"paragraph_direction_attributes_v4_parity", widthParity(module, paragraphResult, paragraphView, 48, 120));
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
    // The same overlapping font requests use the explicit width entry, with
    // independent widths/results and unchanged legacy oracle comparisons.
    dispatch_semaphore_t widthDone = dispatch_semaphore_create(0);
    __block NSDictionary *widthFirst = nil, *widthNext = nil;
    __block NSUInteger widthErrors = 0;
    RCTPromiseRejectBlock widthReject = ^(__unused NSString *value, __unused NSString *message, __unused NSError *cause) {
      widthErrors++; dispatch_semaphore_signal(widthDone);
    };
    [module measureCandidatesForWidth:@1 text:overlapText fontSize:48 contentWidth:888 resolver:^(id value) {
      widthFirst = value; dispatch_semaphore_signal(widthDone);
    } rejecter:widthReject];
    [nextModule measureCandidatesForWidth:@1 text:overlapText fontSize:44 contentWidth:864 resolver:^(id value) {
      widthNext = value; dispatch_semaphore_signal(widthDone);
    } rejecter:widthReject];
    BOOL widthCompleted = dispatch_semaphore_wait(widthDone, dispatch_time(DISPATCH_TIME_NOW, 10 * NSEC_PER_SEC)) == 0;
    widthCompleted = (dispatch_semaphore_wait(widthDone, dispatch_time(DISPATCH_TIME_NOW, 10 * NSEC_PER_SEC)) == 0) && widthCompleted;
    check(@"queued_v4_fonts_all_range_bit_parity", widthCompleted && widthErrors == 0 &&
      matchesWidthCandidates(widthFirst, firstResult, overlapText, 888) && matchesWidthCandidates(widthNext, nextResult, overlapText, 864));

    RCTTextView *singleView = makeView(@"A", 48); bridge.uiManager.registry = @{@1:singleView};
    NSDictionary *singleResult = call(module, YES, @"A", 48, &code);
    const double advance = [singleResult[@"rows"][0][2] doubleValue];
    BOOL exactWidths = code == nil && isfinite(advance) && advance > 0 && matchesUncachedCandidates(singleResult, singleView);
    for (NSNumber *widthValue in @[@(advance), @(nextafter(advance, 0)), @(nextafter(advance, INFINITY))]) {
      const double width = widthValue.doubleValue;
      NSDictionary *result = callWidth(module, @"A", 48, width, &code);
      BOOL current = code == nil && matchesWidthCandidates(result, singleResult, @"A", width) &&
        [result[@"full_metric_count"] unsignedIntegerValue] == (advance <= width ? 1 : 0);
      exactWidths = current && exactWidths;
    }
    check(@"v4_exact_and_adjacent_double_width_boundaries", exactWidths);
    BOOL invalidWidths = YES;
    for (NSNumber *width in @[@0, @(-1), @(NAN), @(INFINITY), @(-INFINITY)]) {
      NSDictionary *result = callWidth(module, @"A", 48, width.doubleValue, &code);
      invalidWidths = (result == nil && [code isEqual:@"PIECE_NATIVE_MEASUREMENT_UNAVAILABLE"]) && invalidWidths;
    }
    check(@"v4_invalid_widths_rejected", invalidWidths);

    RCTTextView *pairView = makeView(@"AA", 48); bridge.uiManager.registry = @{@1:pairView};
    NSDictionary *pairResult = call(module, YES, @"AA", 48, &code);
    beginWidthProbe();
    NSDictionary *pairWidthResult = callWidth(module, @"AA", 48, advance, &code);
    endWidthProbe();
    const NSUInteger pairUnique = [pairWidthResult[@"metric_count"] unsignedIntegerValue];
    const NSUInteger pairFull = [pairWidthResult[@"full_metric_count"] unsignedIntegerValue];
    check(@"v4_all_independent_lines_all_advances_only_full_ink_calls", code == nil &&
      matchesWidthCandidates(pairWidthResult, pairResult, @"AA", advance) && pairFull > 0 && pairFull < pairUnique &&
      widthCreates.load() == pairUnique + 1 && widthAdvances.load() == pairUnique && widthImages.load() == pairFull);

    bridge.uiManager.registry = @{@1:singleView};
    beginWidthProbe(0, YES);
    NSDictionary *invalidLegacy = call(module, YES, @"A", 48, &code);
    endWidthProbe();
    BOOL inkDifference = invalidLegacy == nil && [code isEqual:@"PIECE_NATIVE_MEASUREMENT_UNAVAILABLE"] && widthImages.load() == 1;
    beginWidthProbe(0, YES);
    NSDictionary *invalidFull = callWidth(module, @"A", 48, advance, &code);
    endWidthProbe();
    inkDifference = (invalidFull == nil && [code isEqual:@"PIECE_NATIVE_MEASUREMENT_UNAVAILABLE"] && widthImages.load() == 1) && inkDifference;
    beginWidthProbe(0, YES);
    NSDictionary *omittedInk = callWidth(module, @"A", 48, nextafter(advance, 0), &code);
    endWidthProbe();
    inkDifference = (code == nil && widthImages.load() == 0 &&
      matchesWidthCandidates(omittedInk, singleResult, @"A", nextafter(advance, 0))) && inkDifference;
    check(@"v4_approved_overflow_ink_rejection_difference", inkDifference);
    BOOL invalidAdvances = YES;
    for (int fault = 1; fault <= 4; fault++) {
      beginWidthProbe(fault);
      NSDictionary *result = callWidth(module, @"A", 48, 1, &code);
      endWidthProbe();
      invalidAdvances = (result == nil && [code isEqual:@"PIECE_NATIVE_MEASUREMENT_UNAVAILABLE"] &&
        widthAdvances.load() == 1 && widthImages.load() == 0) && invalidAdvances;
    }
    check(@"v4_nonfinite_negative_advances_cannot_be_overflow", invalidAdvances);
    printf("LEGACY_NATIVE_CHECKS=%lu PASS=%lu FAIL=%lu SKIP=0\n", (unsigned long)checks,
      (unsigned long)(checks-failures), (unsigned long)failures);
    runV5Checks(module, bridge);
    printf("NATIVE_CHECKS=%lu PASS=%lu FAIL=%lu SKIP=0\n", (unsigned long)checks,
      (unsigned long)(checks-failures), (unsigned long)failures);
    return failures ? 1 : 0;
  }
}

// This UIKit-only host does not load React Native. Start the unchanged checks
// after normal application activation, once, on the same main thread as before.
@interface PieceNativeMetricsAppDelegate : UIResponder <UIApplicationDelegate>
@property(nonatomic, strong) UIWindow *window;
@property(nonatomic) BOOL checksStarted;
@end
@implementation PieceNativeMetricsAppDelegate
- (BOOL)application:(__unused UIApplication *)application didFinishLaunchingWithOptions:(__unused NSDictionary *)options {
  printf("STAGE application_launch\n");
  self.window = [[UIWindow alloc] initWithFrame:UIScreen.mainScreen.bounds];
  self.window.rootViewController = [UIViewController new];
  [self.window makeKeyAndVisible];
  return YES;
}
- (void)applicationDidBecomeActive:(__unused UIApplication *)application {
  if (self.checksStarted) return;
  self.checksStarted = YES;
  printf("STAGE application_active\n");
  dispatch_async(dispatch_get_main_queue(), ^{ exit(runNativeMetricsChecks()); });
}
@end

int main(int argc, char *argv[]) {
  // The original 90-second bound includes UIKit launch; activation never
  // resets it. Missing launch/check completion is a CI failure too.
  setvbuf(stdout, NULL, _IONBF, 0);
  alarm(90);
  printf("STAGE main_entered\n");
  @autoreleasepool {
    return UIApplicationMain(argc, argv, nil, NSStringFromClass(PieceNativeMetricsAppDelegate.class));
  }
}
