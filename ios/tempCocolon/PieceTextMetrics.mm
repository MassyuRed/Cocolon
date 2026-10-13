#import <React/RCTBridgeModule.h>
#import <React/RCTBridge.h>
#import <React/RCTUIManager.h>
#import <React/RCTUIManagerUtils.h>
#import <React/RCTTextView.h>
#import <CoreText/CoreText.h>
#include <math.h>
#include <string.h>
#include <vector>
#include <atomic>
#include <unordered_map>

// Read-only accessors added by the pinned RN patch; no KVC/private-ivar read.
@interface RCTTextView (CocolonPieceMetrics)
- (NSTextStorage *)cocolonPieceTextStorage;
- (CGRect)cocolonPieceContentFrame;
@end

@interface PieceTextMetrics : NSObject <RCTBridgeModule>
@property(nonatomic, weak) RCTBridge *bridge;
@end

// One candidate call at a time across every module/card. Its joined workers
// remain capped at four while JS decodes/plans the preceding font size.
static dispatch_queue_t PieceCandidateQueue(void) {
  static dispatch_queue_t queue;
  static dispatch_once_t once;
  dispatch_once(&once, ^{
    queue = dispatch_queue_create("com.cocolon.piece.candidates",
      dispatch_queue_attr_make_with_qos_class(DISPATCH_QUEUE_SERIAL, QOS_CLASS_USER_INITIATED, 0));
  });
  return queue;
}

@implementation PieceTextMetrics
RCT_EXPORT_MODULE();
@synthesize bridge = _bridge;
+ (BOOL)requiresMainQueueSetup { return NO; }
- (dispatch_queue_t)methodQueue { return RCTGetUIManagerQueue(); }

RCT_EXPORT_METHOD(measureCandidates:(nonnull NSNumber *)tag text:(NSString *)expected fontSize:(double)fontSize
                  resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
{
  void (^unavailable)(void) = ^{ reject(@"PIECE_NATIVE_MEASUREMENT_UNAVAILABLE", @"Text measurement unavailable", nil); };
  const NSTimeInterval deadline = NSProcessInfo.processInfo.systemUptime + 8;
  if (!isfinite(tag.doubleValue) || tag.doubleValue <= 0 || tag.doubleValue != floor(tag.doubleValue) ||
      expected.length == 0 || expected.length > 4096 || !isfinite(fontSize) || fontSize < 1 || fontSize > 100 || !_bridge.uiManager) {
    unavailable(); return;
  }
  [_bridge.uiManager addUIBlock:^(__unused RCTUIManager *manager, NSDictionary<NSNumber *, UIView *> *registry) {
    @try {
      RCTTextView *view = (RCTTextView *)registry[tag];
      if (![view isKindOfClass:RCTTextView.class] || !view.window ||
          ![view respondsToSelector:@selector(cocolonPieceTextStorage)]) { unavailable(); return; }
      NSTextStorage *storage = [view cocolonPieceTextStorage];
      if (![storage.string isEqualToString:expected]) { unavailable(); return; }
      __block BOOL valid = YES;
      [storage enumerateAttribute:NSFontAttributeName inRange:NSMakeRange(0, expected.length) options:0
        usingBlock:^(UIFont *font, NSRange range, BOOL *stop) {
          if (![font isKindOfClass:UIFont.class] || fabs(font.pointSize - fontSize) > 0.5) { valid = NO; *stop = YES; }
        }];
      if (!valid) { unavailable(); return; }
      // A private immutable snapshot; never access UIView/TextKit off its UI queue.
      NSAttributedString *snapshot = [storage copy];
      dispatch_async(PieceCandidateQueue(), ^{
        @try {
          // Queueing never renews the call's original deadline.
          if (NSProcessInfo.processInfo.systemUptime >= deadline) { unavailable(); return; }
          NSMutableArray<NSNumber *> *boundaries = [NSMutableArray arrayWithObject:@0];
          [expected enumerateSubstringsInRange:NSMakeRange(0, expected.length) options:NSStringEnumerationByComposedCharacterSequences
            usingBlock:^(NSString *substring, NSRange range, NSRange enclosing, BOOL *stop) { [boundaries addObject:@(NSMaxRange(range))]; }];
          NSUInteger count = boundaries.count - 1;
          if (count < 1 || count > 420) { unavailable(); return; }
          CTLineRef full = CTLineCreateWithAttributedString((__bridge CFAttributedStringRef)snapshot);
          if (!full) { unavailable(); return; }
          BOOL glyphs = YES;
          for (id object in (__bridge NSArray *)CTLineGetGlyphRuns(full)) {
            CTRunRef run = (__bridge CTRunRef)object;
            CTFontRef font = (CTFontRef)CFDictionaryGetValue(CTRunGetAttributes(run), kCTFontAttributeName);
            NSString *name = font ? CFBridgingRelease(CTFontCopyPostScriptName(font)) : nil;
            if (!font || [name rangeOfString:@"LastResort" options:NSCaseInsensitiveSearch].location != NSNotFound) glyphs = NO;
            for (CFIndex i = 0; i < CTRunGetGlyphCount(run); i++) { CGGlyph glyph; CTRunGetGlyphs(run, CFRangeMake(i, 1), &glyph); if (glyph == 0) glyphs = NO; }
          }
          CFRelease(full);
          if (!glyphs) { unavailable(); return; }
          NSString *snapshotText = snapshot.string;
          // Canonicalize complete attribute dictionaries once. Equal ID spans
          // prove pointwise equality even when a substring has many font runs.
          std::vector<NSUInteger> attributeIds(snapshot.length);
          NSUInteger *attributeIdData = attributeIds.data();
          NSMutableArray<NSDictionary *> *attributeClasses = [NSMutableArray new];
          [snapshot enumerateAttributesInRange:NSMakeRange(0, snapshot.length) options:0
            usingBlock:^(NSDictionary *attributes, NSRange range, BOOL *stop) {
              NSUInteger index = [attributeClasses indexOfObject:attributes];
              if (index == NSNotFound) { index = attributeClasses.count; [attributeClasses addObject:attributes]; }
              for (NSUInteger i = range.location; i < NSMaxRange(range); i++) attributeIdData[i] = index + 1;
            }];
          std::vector<unichar> textUnits(snapshot.length);
          [snapshotText getCharacters:textUnits.data() range:NSMakeRange(0, snapshot.length)];
          // Hashes only locate possible matches. Raw text AND complete attribute
          // spans must still match; even a hash collision never reuses metrics.
          const uint64_t hashBase = 1099511628211ULL;
          std::vector<uint64_t> prefixes(snapshot.length + 1, 0), powers(snapshot.length + 1, 1);
          for (NSUInteger i = 0; i < snapshot.length; i++) {
            prefixes[i + 1] = prefixes[i] * hashBase + textUnits[i] + attributeIds[i] * 65537ULL;
            powers[i + 1] = powers[i] * hashBase;
          }
          // Group only exact text/attribute matches before any parallel work.
          // Keep the existing retained-key budget; uncached ranges remain jobs.
          struct MetricJob { NSRange range; double values[5]; };
          std::vector<MetricJob> jobs;
          std::vector<NSUInteger> rowJobs;
          rowJobs.reserve(count * (count + 1) / 2);
          std::unordered_map<uint64_t, std::vector<NSUInteger>> cache;
          NSUInteger cachedUnits = 0, cachedKeys = 0;
          for (NSUInteger start = 0; start < count; start++) {
            @autoreleasepool {
              for (NSUInteger end = start + 1; end <= count; end++) {
                if (NSProcessInfo.processInfo.systemUptime >= deadline) { unavailable(); return; }
                NSUInteger offset = boundaries[start].unsignedIntegerValue;
                NSRange range = NSMakeRange(offset, boundaries[end].unsignedIntegerValue - offset);
                uint64_t key = prefixes[NSMaxRange(range)] - prefixes[offset] * powers[range.length];
                auto bucket = cache.find(key);
                NSUInteger index = jobs.size();
                if (bucket != cache.end()) for (NSUInteger candidate : bucket->second) {
                  NSRange prior = jobs[candidate].range;
                  if (prior.length == range.length &&
                      memcmp(textUnits.data() + prior.location, textUnits.data() + offset, range.length * sizeof(unichar)) == 0 &&
                      memcmp(attributeIds.data() + prior.location, attributeIds.data() + offset, range.length * sizeof(NSUInteger)) == 0) {
                    index = candidate; break;
                  }
                }
                if (index == jobs.size()) {
                  jobs.push_back({range, {0, 0, 0, 0, 0}});
                  if (cachedKeys < 16384 && cachedUnits + range.length <= 4 * 1024 * 1024) {
                    cache[key].push_back(index); cachedUnits += range.length; cachedKeys++;
                  }
                }
                rowJobs.push_back(index);
              }
            }
          }
          // Each worker owns its substring and CTLine. Only immutable font and
          // attributed-string snapshots are shared; UIKit stays on its UI queue.
          // Fixed workers avoid one dispatch block per candidate and write only
          // disjoint metrics. dispatch_apply joins before any buffer is released.
          MetricJob *jobData = jobs.data();
          const NSUInteger jobCount = jobs.size(), workers = jobCount < 256 ? 1 : 4;
          // A single complete attribute class proves uniform pointwise
          // attributes. Build the same immutable substring directly instead
          // of slicing attributed runs.
          NSDictionary *uniformAttributes = attributeClasses.count == 1 ? attributeClasses[0] : nil;
          NSAttributedString *nativeSnapshot = nil;
          if (!uniformAttributes) {
            // Build the complete attribute runs once in CF storage. Merely
            // casting the TextKit copy may route substring creation back to
            // its generic Objective-C run-copying implementation.
            NSMutableAttributedString *nativeMutable = CFBridgingRelease(CFAttributedStringCreateMutable(NULL, 0));
            if (!nativeMutable) { unavailable(); return; }
            CFAttributedStringReplaceString((__bridge CFMutableAttributedStringRef)nativeMutable,
              CFRangeMake(0, 0), (__bridge CFStringRef)snapshotText);
            [snapshot enumerateAttributesInRange:NSMakeRange(0, snapshot.length) options:0
              usingBlock:^(NSDictionary *attributes, NSRange range, BOOL *stop) {
                CFAttributedStringSetAttributes((__bridge CFMutableAttributedStringRef)nativeMutable,
                  CFRangeMake(range.location, range.length), (__bridge CFDictionaryRef)attributes, true);
              }];
            nativeSnapshot = CFBridgingRelease(CFAttributedStringCreateCopy(NULL,
              (__bridge CFAttributedStringRef)nativeMutable));
            if (!nativeSnapshot) { unavailable(); return; }
          }
          std::atomic_bool failed(false);
          std::atomic_bool *failure = &failed;
          dispatch_apply(workers, dispatch_get_global_queue(QOS_CLASS_USER_INITIATED, 0), ^(size_t worker) {
            @try {
              for (NSUInteger index = worker; index < jobCount; index += workers) {
                @autoreleasepool {
                  if (failure->load(std::memory_order_relaxed)) return;
                  if (NSProcessInfo.processInfo.systemUptime >= deadline) { failure->store(true, std::memory_order_relaxed); return; }
                  NSRange range = jobData[index].range;
                  NSAttributedString *part = uniformAttributes
                    ? [[NSAttributedString alloc] initWithString:[snapshotText substringWithRange:range] attributes:uniformAttributes]
                    : CFBridgingRelease(CFAttributedStringCreateWithSubstring(NULL,
                        (__bridge CFAttributedStringRef)nativeSnapshot, CFRangeMake(range.location, range.length)));
                  if (!part) { failure->store(true, std::memory_order_relaxed); return; }
                  CTLineRef line = CTLineCreateWithAttributedString((__bridge CFAttributedStringRef)part);
                  if (!line) { failure->store(true, std::memory_order_relaxed); return; }
                  double advance = CTLineGetTypographicBounds(line, NULL, NULL, NULL);
                  CGRect ink = CTLineGetImageBounds(line, NULL);
                  CFRelease(line);
                  if (CGRectIsNull(ink)) {
                    if ([part.string rangeOfCharacterFromSet:NSCharacterSet.whitespaceAndNewlineCharacterSet.invertedSet].location != NSNotFound) {
                      failure->store(true, std::memory_order_relaxed); return;
                    }
                    ink = CGRectZero;
                  }
                  if (!isfinite(advance) || !isfinite(ink.origin.x) || !isfinite(ink.origin.y) ||
                      !isfinite(ink.size.width) || !isfinite(ink.size.height)) {
                    failure->store(true, std::memory_order_relaxed); return;
                  }
                  const double metrics[] = {advance, CGRectGetMinX(ink), -CGRectGetMaxY(ink),
                    CGRectGetMaxX(ink), -CGRectGetMinY(ink)};
                  memcpy(jobData[index].values, metrics, sizeof(metrics));
                }
              }
            } @catch (__unused NSException *exception) { failure->store(true, std::memory_order_relaxed); }
          });
          if (failed.load(std::memory_order_relaxed)) { unavailable(); return; }
          // Send each exact job once plus one reference for EVERY ordered range.
          // The adapter restores the complete seven-value rows before B9.
          std::vector<uint64_t> metrics;
          metrics.reserve(jobCount * 5);
          for (NSUInteger index = 0; index < jobCount; index++) {
            if (NSProcessInfo.processInfo.systemUptime >= deadline) { unavailable(); return; }
            for (double value : jobData[index].values) {
              uint64_t bits; memcpy(&bits, &value, sizeof(bits));
              metrics.push_back(CFSwapInt64HostToLittle(bits));
            }
          }
          std::vector<uint32_t> references;
          references.reserve(rowJobs.size());
          for (NSUInteger index : rowJobs) {
            if (NSProcessInfo.processInfo.systemUptime >= deadline) { unavailable(); return; }
            references.push_back(CFSwapInt32HostToLittle((uint32_t)index));
          }
          NSData *metricBytes = [NSData dataWithBytes:metrics.data() length:metrics.size() * sizeof(uint64_t)];
          NSData *referenceBytes = [NSData dataWithBytes:references.data() length:references.size() * sizeof(uint32_t)];
          resolve(@{ @"version": @"piece.native_candidates.v3", @"platform": @"ios", @"font_size": @(fontSize),
            @"utf16_length": @(expected.length), @"boundaries": boundaries,
            @"metric_count": @(jobCount), @"metrics_f64le": [metricBytes base64EncodedStringWithOptions:0],
            @"row_indices_u32le": [referenceBytes base64EncodedStringWithOptions:0], @"glyph_check": @"no_missing_observed" });
        } @catch (__unused NSException *exception) { unavailable(); }
      });
    } @catch (__unused NSException *exception) { unavailable(); }
  }];
}

RCT_EXPORT_METHOD(inspect:(nonnull NSNumber *)tag text:(NSString *)expected fontSize:(double)fontSize
                  resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
{
  void (^unavailable)(void) = ^{ reject(@"PIECE_NATIVE_MEASUREMENT_UNAVAILABLE", @"Text measurement unavailable", nil); };
  if (!isfinite(tag.doubleValue) || tag.doubleValue <= 0 || tag.doubleValue != floor(tag.doubleValue) ||
      expected.length == 0 || expected.length > 4096 || !isfinite(fontSize) || fontSize < 1 || fontSize > 100 || !_bridge.uiManager) {
    unavailable(); return;
  }
  [_bridge.uiManager addUIBlock:^(__unused RCTUIManager *manager, NSDictionary<NSNumber *, UIView *> *registry) {
    @try {
      RCTTextView *view = (RCTTextView *)registry[tag];
      if (![view isKindOfClass:RCTTextView.class] || !view.window ||
          ![view respondsToSelector:@selector(cocolonPieceTextStorage)] ||
          ![view respondsToSelector:@selector(cocolonPieceContentFrame)]) { unavailable(); return; }
      NSTextStorage *storage = [view cocolonPieceTextStorage];
      CGRect frame = [view cocolonPieceContentFrame];
      NSLayoutManager *layout = storage.layoutManagers.firstObject;
      NSTextContainer *container = layout.textContainers.firstObject;
      if (![storage.string isEqualToString:expected] || !layout || !container || container.maximumNumberOfLines != 0 ||
          view.bounds.size.width <= 0 || view.bounds.size.width > 1080 || view.bounds.size.height <= 0 || view.bounds.size.height > 1920) {
        unavailable(); return;
      }
      [layout ensureLayoutForTextContainer:container];
      NSRange all = [layout glyphRangeForTextContainer:container];
      NSRange chars = [layout characterRangeForGlyphRange:all actualGlyphRange:NULL];
      if (all.location != 0 || NSMaxRange(all) != layout.numberOfGlyphs || chars.location != 0 || chars.length != expected.length) {
        unavailable(); return;
      }
      __block BOOL valid = YES;
      [storage enumerateAttribute:NSFontAttributeName inRange:chars options:0 usingBlock:^(UIFont *font, NSRange range, BOOL *stop) {
        if (![font isKindOfClass:UIFont.class] || fabs(font.pointSize - fontSize) > 0.5) { valid = NO; *stop = YES; }
      }];
      for (NSUInteger i = 0; valid && i < layout.numberOfGlyphs; i++) {
        NSGlyphProperty property = [layout propertyForGlyphAtIndex:i];
        if ([layout CGGlyphAtIndex:i] == 0 && !(property & (NSGlyphPropertyNull | NSGlyphPropertyControlCharacter))) valid = NO;
      }
      NSMutableArray *ends = [NSMutableArray new];
      __block NSUInteger previous = 0;
      [layout enumerateLineFragmentsForGlyphRange:all usingBlock:^(CGRect rect, CGRect used, NSTextContainer *c, NSRange glyphs, BOOL *stop) {
        NSRange line = [layout characterRangeForGlyphRange:glyphs actualGlyphRange:NULL];
        if (line.location != previous || line.length == 0 || NSMaxRange(line) > expected.length ||
            [layout truncatedGlyphRangeInLineFragmentForGlyphAtIndex:glyphs.location].location != NSNotFound) { valid = NO; *stop = YES; return; }
        previous = NSMaxRange(line); [ends addObject:@(previous)];
        // Inspect the fallback fonts for this exact attributed line as well.
        // This is an absence-of-observed-missing-glyph check, not device acceptance.
        NSAttributedString *attributed = [storage attributedSubstringFromRange:line];
        CTLineRef shaped = CTLineCreateWithAttributedString((__bridge CFAttributedStringRef)attributed);
        if (!shaped) { valid = NO; *stop = YES; return; }
        for (id object in (__bridge NSArray *)CTLineGetGlyphRuns(shaped)) {
          CTRunRef run = (__bridge CTRunRef)object;
          CTFontRef font = (CTFontRef)CFDictionaryGetValue(CTRunGetAttributes(run), kCTFontAttributeName);
          NSString *name = font ? CFBridgingRelease(CTFontCopyPostScriptName(font)) : nil;
          if (!font || [name rangeOfString:@"LastResort" options:NSCaseInsensitiveSearch].location != NSNotFound) valid = NO;
          CFIndex count = CTRunGetGlyphCount(run);
          for (CFIndex i = 0; i < count; i++) { CGGlyph glyph; CTRunGetGlyphs(run, CFRangeMake(i, 1), &glyph); if (glyph == 0) valid = NO; }
        }
        CFRelease(shaped);
      }];
      if (!valid || previous != expected.length) { unavailable(); return; }
      NSMutableArray *boundaries = [NSMutableArray arrayWithObject:@0];
      [expected enumerateSubstringsInRange:NSMakeRange(0, expected.length) options:NSStringEnumerationByComposedCharacterSequences
        usingBlock:^(NSString *substring, NSRange range, NSRange enclosing, BOOL *stop) { [boundaries addObject:@(NSMaxRange(range))]; }];
      CGRect ink = CGRectOffset([layout boundingRectForGlyphRange:all inTextContainer:container], frame.origin.x, frame.origin.y);
      if (CGRectIsNull(ink) || CGRectIsEmpty(ink) || !isfinite(ink.origin.x) || !isfinite(ink.origin.y) ||
          !isfinite(ink.size.width) || !isfinite(ink.size.height)) { unavailable(); return; }
      resolve(@{ @"version": @"piece.native_text.v1", @"platform": @"ios", @"font_size": @(fontSize),
        @"width": @(view.bounds.size.width), @"height": @(view.bounds.size.height), @"utf16_length": @(expected.length),
        @"boundaries": boundaries, @"line_ends": ends, @"ink": @[@(CGRectGetMinX(ink)), @(CGRectGetMinY(ink)), @(CGRectGetMaxX(ink)), @(CGRectGetMaxY(ink))],
        @"glyph_check": @"no_missing_observed" });
    } @catch (__unused NSException *exception) { unavailable(); }
  }];
}
@end
