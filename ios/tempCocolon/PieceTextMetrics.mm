#import <React/RCTBridgeModule.h>
#import <React/RCTBridge.h>
#import <React/RCTUIManager.h>
#import <React/RCTUIManagerUtils.h>
#import <React/RCTTextView.h>
#import <CoreText/CoreText.h>
#import <QuartzCore/QuartzCore.h>
#import <objc/runtime.h>
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
- (void)measureCandidateSnapshot:(NSNumber *)tag text:(NSString *)expected fontSize:(double)fontSize
                   boundedWidth:(BOOL)boundedWidth contentWidth:(double)contentWidth exploration:(BOOL)exploration
                       deadline:(NSTimeInterval)deadline
                       resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject;
- (void)inspectSnapshot:(NSNumber *)tag text:(NSString *)expected fontSize:(double)fontSize
          selectedLine:(BOOL)selectedLine pixelRequest:(NSDictionary *)pixelRequest resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject;
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


// v9 keeps only one short-lived local snapshot on each selected mounted view.
// The canvas reference is weak: canvas -> Text -> snapshot must not form a cycle.
static char PieceSelectedPixelSnapshotKey;
static BOOL PiecePixelRect(CGRect rect) {
  return !CGRectIsNull(rect) && !CGRectIsInfinite(rect) && isfinite(rect.origin.x) && isfinite(rect.origin.y) &&
    isfinite(rect.size.width) && isfinite(rect.size.height) && rect.size.width > 0 && rect.size.height > 0;
}
static NSArray *PiecePixelRectArray(CGRect rect) {
  return @[@(rect.origin.x), @(rect.origin.y), @(rect.size.width), @(rect.size.height)];
}
static BOOL PiecePixelCanvasFrame(RCTTextView *view, UIView *canvas, CGRect *result) {
  if (!canvas || canvas == view || !canvas.window || view.window != canvas.window ||
      ![view isDescendantOfView:canvas] || !PiecePixelRect(view.bounds) ||
      !CGPointEqualToPoint(view.bounds.origin, CGPointZero) || !PiecePixelRect(canvas.bounds) ||
      !CGPointEqualToPoint(canvas.bounds.origin, CGPointZero) || canvas.bounds.size.width != 1080 ||
      canvas.bounds.size.height > 1920) return NO;
  // Only translation is supported inside the logical canvas. The small
  // convertPoint tolerance below handles arithmetic, not a scale allowance.
  for (UIView *ancestor = view; ancestor; ancestor = ancestor.superview) {
    CATransform3D childTransform = ancestor.layer.sublayerTransform;
    if (!CATransform3DIsAffine(childTransform)) return NO;
    CGAffineTransform child = CATransform3DGetAffineTransform(childTransform);
    if (child.a != 1 || child.b != 0 || child.c != 0 || child.d != 1) return NO;
    if (ancestor == canvas) break;
    if (!CATransform3DIsAffine(ancestor.layer.transform)) return NO;
    CGAffineTransform transform = ancestor.transform;
    if (transform.a != 1 || transform.b != 0 || transform.c != 0 || transform.d != 1) return NO;
  }
  CGPoint origin = [view convertPoint:CGPointZero toView:canvas];
  CGPoint x = [view convertPoint:CGPointMake(1, 0) toView:canvas], y = [view convertPoint:CGPointMake(0, 1) toView:canvas];
  if (!isfinite(origin.x) || !isfinite(origin.y) || !isfinite(x.x) || !isfinite(x.y) || !isfinite(y.x) || !isfinite(y.y) ||
      fabs(x.x - origin.x - 1) > 0.000001 || fabs(x.y - origin.y) > 0.000001 ||
      fabs(y.y - origin.y - 1) > 0.000001 || fabs(y.x - origin.x) > 0.000001) return NO;
  *result = (CGRect){origin, view.bounds.size};
  return YES;
}
static NSDictionary *PieceSelectedPixels(RCTTextView *view, UIView *canvas, NSNumber *tag, NSDictionary *request,
    NSTextStorage *storage, NSLayoutManager *layout, NSTextContainer *container, NSRange glyphs,
    CGRect textKitInk, double fontSize, NSData *independent) {
  @autoreleasepool {
    NSDictionary *prior = objc_getAssociatedObject(view, &PieceSelectedPixelSnapshotKey);
    // Consume even an invalid placed request. No replay and no implicit retry.
    objc_setAssociatedObject(view, &PieceSelectedPixelSnapshotKey, nil, OBJC_ASSOCIATION_RETAIN_NONATOMIC);
    NSArray *keys = @[@"stage", @"canvas_tag", @"expires_at_ms", @"snapshot_token"];
    if (![request isKindOfClass:NSDictionary.class] ||
        ![[NSSet setWithArray:request.allKeys] isEqualToSet:[NSSet setWithArray:keys]]) return nil;
    NSString *stage = request[@"stage"];
    BOOL placed = [stage isEqual:@"placed"];
    NSNumber *canvasTag = request[@"canvas_tag"], *expires = request[@"expires_at_ms"];
    if ((!placed && ![stage isEqual:@"local"]) || ![canvasTag isKindOfClass:NSNumber.class] ||
        !isfinite(canvasTag.doubleValue) || canvasTag.doubleValue <= 0 || canvasTag.doubleValue != floor(canvasTag.doubleValue) ||
        [canvasTag isEqual:tag] || ![expires isKindOfClass:NSNumber.class] || !isfinite(expires.doubleValue)) return nil;
    const double deadline = expires.doubleValue;
    const NSTimeInterval monotonicDeadline = placed ? [prior[@"monotonic_deadline"] doubleValue]
      : NSProcessInfo.processInfo.systemUptime + (deadline - NSDate.date.timeIntervalSince1970 * 1000) / 1000;
    BOOL (^withinDeadline)(void) = ^{ return NSDate.date.timeIntervalSince1970 * 1000 < deadline &&
      NSProcessInfo.processInfo.systemUptime < monotonicDeadline; };
    if (!withinDeadline() || deadline > NSDate.date.timeIntervalSince1970 * 1000 + 8000) return nil;
    CGRect canvasFrame, bounds = view.bounds, frame = view.cocolonPieceContentFrame;
    CGRect canvasBounds = canvas.bounds, canvasViewFrame = canvas.frame;
    CGAffineTransform canvasTransform = canvas.transform;
    if (!PiecePixelCanvasFrame(view, canvas, &canvasFrame) || !PiecePixelRect(frame) || !PiecePixelRect(textKitInk)) return nil;
    NSAttributedString *attributes = [storage copy];
    const CGSize containerSize = container.size;
    const CGFloat padding = container.lineFragmentPadding;
    const NSLineBreakMode lineBreak = container.lineBreakMode;
    const BOOL fontLeading = layout.usesFontLeading;
    NSString *token;
    if (placed) {
      token = request[@"snapshot_token"];
      BOOL (^sameCanvas)(UIView *) = prior[@"same_canvas"];
      if (![token isKindOfClass:NSString.class] || ![prior[@"token"] isEqual:token] || !sameCanvas || !sameCanvas(canvas) ||
          prior[@"storage"] != storage || prior[@"layout"] != layout || prior[@"container"] != container ||
          ![prior[@"attributes"] isEqualToAttributedString:attributes] ||
          !CGRectEqualToRect([prior[@"bounds"] CGRectValue], bounds) || !CGRectEqualToRect([prior[@"frame"] CGRectValue], frame) ||
          !CGSizeEqualToSize([prior[@"container_size"] CGSizeValue], container.size) ||
          [prior[@"padding"] doubleValue] != container.lineFragmentPadding ||
          [prior[@"line_break"] integerValue] != container.lineBreakMode ||
          [prior[@"font_leading"] boolValue] != layout.usesFontLeading ||
          !CGRectEqualToRect([prior[@"canvas_bounds"] CGRectValue], canvasBounds) ||
          !CGRectEqualToRect([prior[@"canvas_frame"] CGRectValue], canvasViewFrame) ||
          !CGAffineTransformEqualToTransform([prior[@"canvas_transform"] CGAffineTransformValue], canvasTransform) ||
          ![prior[@"independent"] isEqualToData:independent] || ![prior[@"deadline"] isEqual:expires]) return nil;
    } else {
      if (request[@"snapshot_token"] != NSNull.null) return nil;
      token = NSUUID.UUID.UUIDString;
    }
    // Local placement is selected at phase zero. The final draw uses the
    // actual canvas-relative phase, with an integer bitmap origin. A parent
    // preview scale cancels in convertPoint:toView: and is never UIScreen.scale.
    CGPoint phase = placed ? canvasFrame.origin : CGPointZero;
    CGRect extent = CGRectIntegral(CGRectOffset(CGRectInset(CGRectUnion(bounds, textKitInk),
      -2 * fontSize, -2 * fontSize), phase.x, phase.y));
    if (!PiecePixelRect(extent) || extent.size.width > 4096 || extent.size.height > 4096 ||
        extent.size.width * extent.size.height > 4 * 1024 * 1024) return nil;
    UIGraphicsImageRendererFormat *format = [UIGraphicsImageRendererFormat defaultFormat];
    format.scale = 1; format.opaque = NO; format.preferredRange = UIGraphicsImageRendererFormatRangeStandard;
    UIGraphicsImageRenderer *renderer = [[UIGraphicsImageRenderer alloc] initWithSize:extent.size format:format];
    UIImage *image = [renderer imageWithActions:^(UIGraphicsImageRendererContext *context) {
      CGContextSaveGState(context.CGContext);
      @try {
        CGContextTranslateCTM(context.CGContext, phase.x - extent.origin.x, phase.y - extent.origin.y);
        [layout drawGlyphsForGlyphRange:glyphs atPoint:frame.origin];
      } @finally { CGContextRestoreGState(context.CGContext); }
    }];
    CGImageRef cg = image.CGImage;
    if (!cg || CGImageIsMask(cg) || !withinDeadline() || CGImageGetWidth(cg) != (size_t)extent.size.width ||
        CGImageGetHeight(cg) != (size_t)extent.size.height || CGImageGetBitsPerComponent(cg) != 8) return nil;
    const size_t width = CGImageGetWidth(cg), height = CGImageGetHeight(cg), stride = CGImageGetBytesPerRow(cg);
    CGBitmapInfo info = CGImageGetBitmapInfo(cg), order = info & kCGBitmapByteOrderMask;
    CGImageAlphaInfo alpha = CGImageGetAlphaInfo(cg);
    size_t bytesPerPixel, alphaIndex;
    if (alpha == kCGImageAlphaOnly && CGImageGetBitsPerPixel(cg) == 8 && order == kCGBitmapByteOrderDefault) {
      bytesPerPixel = 1; alphaIndex = 0;
    } else {
      BOOL first = alpha == kCGImageAlphaFirst || alpha == kCGImageAlphaPremultipliedFirst;
      BOOL last = alpha == kCGImageAlphaLast || alpha == kCGImageAlphaPremultipliedLast;
      if (CGImageGetBitsPerPixel(cg) != 32 || (!first && !last) ||
          (order != kCGBitmapByteOrderDefault && order != kCGBitmapByteOrder32Big && order != kCGBitmapByteOrder32Little)) return nil;
      bytesPerPixel = 4; alphaIndex = order == kCGBitmapByteOrder32Little ? (first ? 3 : 0) : (first ? 0 : 3);
    }
    if (info & kCGBitmapFloatComponents || width > SIZE_MAX / bytesPerPixel || stride < width * bytesPerPixel ||
        height > SIZE_MAX / stride || stride * height > 32 * 1024 * 1024) return nil;
    CFDataRef data = CGDataProviderCopyData(CGImageGetDataProvider(cg));
    if (!data) return nil;
    size_t minX = width, minY = height, maxX = 0, maxY = 0;
    BOOL seen = NO, edge = NO, expired = NO;
    @try {
      if (CFDataGetLength(data) < 0 || (size_t)CFDataGetLength(data) < stride * height) return nil;
      const UInt8 *bytes = CFDataGetBytePtr(data);
      if (!bytes) return nil;
      for (size_t y = 0; y < height; y++) {
        if (!withinDeadline()) { expired = YES; break; }
        for (size_t x = 0; x < width; x++) if (bytes[y * stride + x * bytesPerPixel + alphaIndex] > 0) {
          seen = YES; minX = MIN(minX, x); minY = MIN(minY, y); maxX = MAX(maxX, x); maxY = MAX(maxY, y);
          if (x == 0 || y == 0 || x + 1 == width || y + 1 == height) edge = YES;
        }
      }
    } @finally { CFRelease(data); }
    CGRect afterFrame;
    if (!seen || edge || expired || !withinDeadline() || view.cocolonPieceTextStorage != storage ||
        storage.layoutManagers.firstObject != layout || layout.textContainers.firstObject != container ||
        ![storage isEqualToAttributedString:attributes] || !CGSizeEqualToSize(container.size, containerSize) ||
        container.lineFragmentPadding != padding || container.lineBreakMode != lineBreak || container.maximumNumberOfLines != 0 ||
        layout.usesFontLeading != fontLeading || !NSEqualRanges([layout glyphRangeForTextContainer:container], glyphs) ||
        !CGRectEqualToRect(view.bounds, bounds) ||
        !CGRectEqualToRect(view.cocolonPieceContentFrame, frame) ||
        !PiecePixelCanvasFrame(view, canvas, &afterFrame) || !CGRectEqualToRect(canvasFrame, afterFrame) ||
        !CGRectEqualToRect(canvas.bounds, canvasBounds) || !CGRectEqualToRect(canvas.frame, canvasViewFrame) ||
        !CGAffineTransformEqualToTransform(canvas.transform, canvasTransform)) return nil;
    if (!placed) {
      __weak UIView *weakCanvas = canvas;
      BOOL (^sameCanvas)(UIView *) = ^BOOL(UIView *value) { return weakCanvas && value == weakCanvas; };
      objc_setAssociatedObject(view, &PieceSelectedPixelSnapshotKey, @{
        @"token":token, @"same_canvas":[sameCanvas copy], @"storage":storage, @"layout":layout, @"container":container,
        @"attributes":attributes, @"bounds":[NSValue valueWithCGRect:bounds], @"frame":[NSValue valueWithCGRect:frame],
        @"container_size":[NSValue valueWithCGSize:container.size], @"padding":@(container.lineFragmentPadding),
        @"line_break":@(container.lineBreakMode), @"font_leading":@(layout.usesFontLeading),
        @"canvas_bounds":[NSValue valueWithCGRect:canvasBounds], @"canvas_frame":[NSValue valueWithCGRect:canvasViewFrame],
        @"canvas_transform":[NSValue valueWithCGAffineTransform:canvasTransform], @"independent":independent, @"deadline":expires,
        @"monotonic_deadline":@(monotonicDeadline)
      }, OBJC_ASSOCIATION_RETAIN_NONATOMIC);
    }
    return @{ @"version":@"piece.native_selected_line.v2", @"stage":stage, @"tag":tag, @"canvas_tag":canvasTag,
      @"canvas_frame":PiecePixelRectArray(canvasFrame), @"content_frame":PiecePixelRectArray(frame),
      @"raster_scale":@1, @"snapshot_token":token,
      @"ink":@[@(minX + extent.origin.x - phase.x), @(minY + extent.origin.y - phase.y),
        @(maxX + 1 + extent.origin.x - phase.x), @(maxY + 1 + extent.origin.y - phase.y)] };
  }
}

@implementation PieceTextMetrics
RCT_EXPORT_MODULE();
@synthesize bridge = _bridge;
+ (BOOL)requiresMainQueueSetup { return NO; }
- (dispatch_queue_t)methodQueue { return RCTGetUIManagerQueue(); }

RCT_EXPORT_METHOD(measureCandidates:(nonnull NSNumber *)tag text:(NSString *)expected fontSize:(double)fontSize
                  resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
{
  const NSTimeInterval deadline = NSProcessInfo.processInfo.systemUptime + 8;
  [self measureCandidateSnapshot:tag text:expected fontSize:fontSize boundedWidth:NO contentWidth:0 exploration:NO
    deadline:deadline resolver:resolve rejecter:reject];
}

// Explicit iOS preview v4 only. The legacy entry keeps all five metrics.
RCT_EXPORT_METHOD(measureCandidatesForWidth:(nonnull NSNumber *)tag text:(NSString *)expected fontSize:(double)fontSize
                  contentWidth:(double)contentWidth resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
{
  const NSTimeInterval deadline = NSProcessInfo.processInfo.systemUptime + 8;
  [self measureCandidateSnapshot:tag text:expected fontSize:fontSize boundedWidth:YES contentWidth:contentWidth exploration:NO
    deadline:deadline resolver:resolve rejecter:reject];
}

// Explicit v5 exploration only. These suffix-context representatives are not
// independent metrics of every range; selected mounted lines are checked below.
RCT_EXPORT_METHOD(measureExplorationCandidates:(nonnull NSNumber *)tag text:(NSString *)expected fontSize:(double)fontSize
                  resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
{
  const NSTimeInterval deadline = NSProcessInfo.processInfo.systemUptime + 8;
  [self measureCandidateSnapshot:tag text:expected fontSize:fontSize boundedWidth:NO contentWidth:0 exploration:YES
    deadline:deadline resolver:resolve rejecter:reject];
}

- (void)measureCandidateSnapshot:(NSNumber *)tag text:(NSString *)expected fontSize:(double)fontSize
                   boundedWidth:(BOOL)boundedWidth contentWidth:(double)contentWidth exploration:(BOOL)exploration
                       deadline:(NSTimeInterval)deadline
                       resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject
{
  void (^unavailable)(void) = ^{ reject(@"PIECE_NATIVE_MEASUREMENT_UNAVAILABLE", @"Text measurement unavailable", nil); };
  if (!isfinite(tag.doubleValue) || tag.doubleValue <= 0 || tag.doubleValue != floor(tag.doubleValue) ||
      (boundedWidth && (!isfinite(contentWidth) || contentWidth <= 0)) ||
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
          // In v5, this fixed order/budget also selects the exploration context:
          // cache hits use the retained first representative; misses use this range.
          struct MetricJob { NSRange range; double values[5]; bool widthOverflow; };
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
                  jobs.push_back({range, {0, 0, 0, 0, 0}, false});
                  if (cachedKeys < 16384 && cachedUnits + range.length <= 4 * 1024 * 1024) {
                    cache[key].push_back(index); cachedUnits += range.length; cachedKeys++;
                  }
                }
                rowJobs.push_back(index);
              }
            }
          }
          // Each worker owns its candidate buffer and CTLine. Only immutable font and
          // attributed-string snapshots are shared; UIKit stays on its UI queue.
          // Fixed workers avoid one dispatch block per candidate and write only
          // disjoint metrics. dispatch_apply joins before any buffer is released.
          MetricJob *jobData = jobs.data();
          const NSUInteger jobCount = jobs.size(), workers = jobCount < 256 ? 1 : 4;
          // A single complete attribute class proves uniform pointwise
          // attributes. Build the same immutable substring directly instead
          // of slicing attributed runs.
          NSDictionary *uniformAttributes = attributeClasses.count == 1 ? attributeClasses[0] : nil;
          NSMutableArray<NSAttributedString *> *workerSnapshots = [NSMutableArray new];
          if (!uniformAttributes) {
            // Build independent CF storage for each worker. Do not share a
            // CF run-array's internal lookup cache across concurrent substring
            // calls, or rely on immutable copy to detach its backing storage.
            for (NSUInteger worker = 0; worker < workers; worker++) {
              if (NSProcessInfo.processInfo.systemUptime >= deadline) { unavailable(); return; }
              NSMutableAttributedString *nativeMutable = CFBridgingRelease(CFAttributedStringCreateMutable(NULL, 0));
              if (!nativeMutable) { unavailable(); return; }
              CFAttributedStringReplaceString((__bridge CFMutableAttributedStringRef)nativeMutable,
                CFRangeMake(0, 0), (__bridge CFStringRef)snapshotText);
              [snapshot enumerateAttributesInRange:NSMakeRange(0, snapshot.length) options:0
                usingBlock:^(NSDictionary *attributes, NSRange range, BOOL *stop) {
                  CFAttributedStringSetAttributes((__bridge CFMutableAttributedStringRef)nativeMutable,
                    CFRangeMake(range.location, range.length), (__bridge CFDictionaryRef)attributes, true);
                }];
              NSAttributedString *nativeSnapshot = CFBridgingRelease(CFAttributedStringCreateCopy(NULL,
                (__bridge CFAttributedStringRef)nativeMutable));
              if (!nativeSnapshot) { unavailable(); return; }
              [workerSnapshots addObject:nativeSnapshot];
            }
          }
          NSArray<NSAttributedString *> *nativeSnapshots = [workerSnapshots copy];
          std::atomic_bool failed(false);
          std::atomic_bool *failure = &failed;
          dispatch_apply(workers, dispatch_get_global_queue(QOS_CLASS_USER_INITIATED, 0), ^(size_t worker) {
            CTTypesetterRef suffixTypesetter = NULL;
            CTLineRef explorationLine = NULL;
            NSUInteger suffixStart = NSNotFound;
            @try {
              NSAttributedString *nativeSnapshot = uniformAttributes ? nil : nativeSnapshots[worker];
              NSMutableAttributedString *part = nil;
              NSRange previous = NSMakeRange(NSNotFound, 0);
              for (NSUInteger index = worker; index < jobCount; index += workers) {
                @autoreleasepool {
                  if (failure->load(std::memory_order_relaxed)) return;
                  if (NSProcessInfo.processInfo.systemUptime >= deadline) { failure->store(true, std::memory_order_relaxed); return; }
                  NSRange range = jobData[index].range;
                  CTLineRef line = NULL;
                  if (exploration) {
                    if (!suffixTypesetter || suffixStart != range.location) {
                      if (suffixTypesetter) { CFRelease(suffixTypesetter); suffixTypesetter = NULL; }
                      NSRange suffixRange = NSMakeRange(range.location, snapshot.length - range.location);
                      NSAttributedString *suffix = uniformAttributes
                        ? [[NSAttributedString alloc] initWithString:[snapshotText substringWithRange:suffixRange] attributes:uniformAttributes]
                        : CFBridgingRelease(CFAttributedStringCreateWithSubstring(NULL,
                            (__bridge CFAttributedStringRef)nativeSnapshot, CFRangeMake(suffixRange.location, suffixRange.length)));
                      if (!suffix) { failure->store(true, std::memory_order_relaxed); return; }
                      suffixTypesetter = CTTypesetterCreateWithAttributedString((__bridge CFAttributedStringRef)suffix);
                      if (!suffixTypesetter) { failure->store(true, std::memory_order_relaxed); return; }
                      suffixStart = range.location;
                    }
                    line = CTTypesetterCreateLine(suffixTypesetter, CFRangeMake(0, range.length));
                    explorationLine = line;
                  } else {
                    // Jobs with the same start grow in first-occurrence order.
                    // Append only their new attributed suffix, retaining exactly
                    // the same full candidate text and pointwise attributes.
                    // Never share this mutable buffer between workers or mutate
                    // it until the preceding independent CTLine is released.
                    BOOL append = part && previous.location == range.location && previous.length < range.length;
                    NSRange added = append
                      ? NSMakeRange(NSMaxRange(previous), range.length - previous.length) : range;
                    NSAttributedString *addition = uniformAttributes
                      ? [[NSAttributedString alloc] initWithString:[snapshotText substringWithRange:added] attributes:uniformAttributes]
                      : CFBridgingRelease(CFAttributedStringCreateWithSubstring(NULL,
                          (__bridge CFAttributedStringRef)nativeSnapshot, CFRangeMake(added.location, added.length)));
                    if (!addition) { failure->store(true, std::memory_order_relaxed); return; }
                    if (append) {
                      CFAttributedStringReplaceAttributedString((__bridge CFMutableAttributedStringRef)part,
                        CFRangeMake(part.length, 0), (__bridge CFAttributedStringRef)addition);
                    } else {
                      part = CFBridgingRelease(CFAttributedStringCreateMutableCopy(NULL, 0,
                        (__bridge CFAttributedStringRef)addition));
                    }
                    if (!part || part.length != range.length) { failure->store(true, std::memory_order_relaxed); return; }
                    previous = range;
                    // Shaping still starts from the complete standalone candidate.
                    line = CTLineCreateWithAttributedString((__bridge CFAttributedStringRef)part);
                  }
                  if (!line) { failure->store(true, std::memory_order_relaxed); return; }
                  double advance = CTLineGetTypographicBounds(line, NULL, NULL, NULL);
                  if (boundedWidth) {
                    if (!isfinite(advance) || advance < 0) {
                      CFRelease(line); failure->store(true, std::memory_order_relaxed); return;
                    }
                    // Width is always at least advance. Keep independent shaping
                    // and this exact advance for EVERY range; omit only ink that
                    // cannot be selected at this exact width. Equality is full5.
                    if (advance > contentWidth) {
                      CFRelease(line);
                      jobData[index].values[0] = advance;
                      jobData[index].widthOverflow = true;
                      continue;
                    }
                  }
                  CGRect ink = CTLineGetImageBounds(line, NULL);
                  CFRelease(line);
                  explorationLine = NULL;
                  if (CGRectIsNull(ink)) {
                    NSString *candidateText = exploration ? [snapshotText substringWithRange:range] : part.string;
                    if ([candidateText rangeOfCharacterFromSet:NSCharacterSet.whitespaceAndNewlineCharacterSet.invertedSet].location != NSNotFound) {
                      failure->store(true, std::memory_order_relaxed); return;
                    }
                    ink = CGRectZero;
                  }
                  if (!isfinite(advance) || !isfinite(ink.origin.x) || !isfinite(ink.origin.y) ||
                      !isfinite(ink.size.width) || !isfinite(ink.size.height)) {
                    failure->store(true, std::memory_order_relaxed); return;
                  }
                  if (exploration && advance < 0) {
                    failure->store(true, std::memory_order_relaxed); return;
                  }
                  const double metrics[] = {advance, CGRectGetMinX(ink), -CGRectGetMaxY(ink),
                    CGRectGetMaxX(ink), -CGRectGetMinY(ink)};
                  if (exploration && (!isfinite(metrics[1]) || !isfinite(metrics[2]) || !isfinite(metrics[3]) ||
                      !isfinite(metrics[4]) || metrics[3] < metrics[1] || metrics[4] < metrics[2])) {
                    failure->store(true, std::memory_order_relaxed); return;
                  }
                  memcpy(jobData[index].values, metrics, sizeof(metrics));
                }
              }
            } @catch (__unused NSException *exception) { failure->store(true, std::memory_order_relaxed); }
            @finally {
              if (explorationLine) CFRelease(explorationLine);
              if (suffixTypesetter) CFRelease(suffixTypesetter);
            }
          });
          if (failed.load(std::memory_order_relaxed)) { unavailable(); return; }
          std::vector<uint32_t> references;
          references.reserve(rowJobs.size());
          for (NSUInteger index : rowJobs) {
            if (NSProcessInfo.processInfo.systemUptime >= deadline) { unavailable(); return; }
            references.push_back(CFSwapInt32HostToLittle((uint32_t)index));
          }
          NSData *referenceBytes = [NSData dataWithBytes:references.data() length:references.size() * sizeof(uint32_t)];
          if (boundedWidth) {
            std::vector<uint8_t> records;
            records.reserve(jobCount * 41);
            NSUInteger fullCount = 0;
            for (NSUInteger index = 0; index < jobCount; index++) {
              if (NSProcessInfo.processInfo.systemUptime >= deadline) { unavailable(); return; }
              const bool overflow = jobData[index].widthOverflow;
              records.push_back(overflow ? 1 : 0);
              if (!overflow) fullCount++;
              for (NSUInteger j = 0; j < (overflow ? 1 : 5); j++) {
                uint64_t bits; memcpy(&bits, &jobData[index].values[j], sizeof(bits));
                bits = CFSwapInt64HostToLittle(bits);
                const uint8_t *bytes = (const uint8_t *)&bits;
                records.insert(records.end(), bytes, bytes + sizeof(bits));
              }
            }
            NSData *recordBytes = [NSData dataWithBytes:records.data() length:records.size()];
            resolve(@{ @"version": @"piece.native_candidates.v4", @"platform": @"ios", @"font_size": @(fontSize),
              @"utf16_length": @(expected.length), @"boundaries": boundaries, @"content_width": @(contentWidth),
              @"metric_count": @(jobCount), @"full_metric_count": @(fullCount),
              @"metric_records_le": [recordBytes base64EncodedStringWithOptions:0],
              @"row_indices_u32le": [referenceBytes base64EncodedStringWithOptions:0], @"glyph_check": @"no_missing_observed" });
            return;
          }
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
          NSData *metricBytes = [NSData dataWithBytes:metrics.data() length:metrics.size() * sizeof(uint64_t)];
          resolve(@{ @"version": exploration ? @"piece.native_candidates.v5" : @"piece.native_candidates.v3", @"platform": @"ios", @"font_size": @(fontSize),
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
  [self inspectSnapshot:tag text:expected fontSize:fontSize selectedLine:NO pixelRequest:nil resolver:resolve rejecter:reject];
}

RCT_EXPORT_METHOD(inspectSelectedLine:(nonnull NSNumber *)tag text:(NSString *)expected fontSize:(double)fontSize
                  resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
{
  [self inspectSnapshot:tag text:expected fontSize:fontSize selectedLine:YES pixelRequest:nil resolver:resolve rejecter:reject];
}

RCT_EXPORT_METHOD(inspectSelectedLineV2:(nonnull NSNumber *)tag text:(NSString *)expected fontSize:(double)fontSize
                  request:(NSDictionary *)request resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
{
  [self inspectSnapshot:tag text:expected fontSize:fontSize selectedLine:YES
    pixelRequest:[request isKindOfClass:NSDictionary.class] ? request : @{} resolver:resolve rejecter:reject];
}

- (void)inspectSnapshot:(NSNumber *)tag text:(NSString *)expected fontSize:(double)fontSize
          selectedLine:(BOOL)selectedLine pixelRequest:(NSDictionary *)pixelRequest resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject
{
  __block __weak RCTTextView *pixelView = nil;
  void (^unavailable)(void) = ^{
    if (pixelRequest && pixelView) objc_setAssociatedObject(pixelView, &PieceSelectedPixelSnapshotKey, nil, OBJC_ASSOCIATION_RETAIN_NONATOMIC);
    reject(@"PIECE_NATIVE_MEASUREMENT_UNAVAILABLE", @"Text measurement unavailable", nil);
  };
  if (!isfinite(tag.doubleValue) || tag.doubleValue <= 0 || tag.doubleValue != floor(tag.doubleValue) ||
      expected.length == 0 || expected.length > 4096 || !isfinite(fontSize) || fontSize < 1 || fontSize > 100 || !_bridge.uiManager) {
    if (pixelRequest && _bridge.uiManager && isfinite(tag.doubleValue) && tag.doubleValue > 0 && tag.doubleValue == floor(tag.doubleValue)) {
      [_bridge.uiManager addUIBlock:^(__unused RCTUIManager *manager, NSDictionary<NSNumber *, UIView *> *registry) {
        UIView *view = registry[tag];
        if ([view isKindOfClass:RCTTextView.class]) objc_setAssociatedObject(view, &PieceSelectedPixelSnapshotKey, nil, OBJC_ASSOCIATION_RETAIN_NONATOMIC);
        unavailable();
      }];
    } else unavailable();
    return;
  }
  [_bridge.uiManager addUIBlock:^(__unused RCTUIManager *manager, NSDictionary<NSNumber *, UIView *> *registry) {
    @try {
      RCTTextView *view = (RCTTextView *)registry[tag];
      if ([view isKindOfClass:RCTTextView.class]) pixelView = view;
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
      __block NSData *independentBytes = nil;
      __block NSUInteger previous = 0;
      [layout enumerateLineFragmentsForGlyphRange:all usingBlock:^(CGRect rect, CGRect used, NSTextContainer *c, NSRange glyphs, BOOL *stop) {
        NSRange line = [layout characterRangeForGlyphRange:glyphs actualGlyphRange:NULL];
        if (line.location != previous || line.length == 0 || NSMaxRange(line) > expected.length ||
            [layout truncatedGlyphRangeInLineFragmentForGlyphAtIndex:glyphs.location].location != NSNotFound) { valid = NO; *stop = YES; return; }
        if (selectedLine && (line.location != 0 || line.length != expected.length)) { valid = NO; *stop = YES; return; }
        previous = NSMaxRange(line); [ends addObject:@(previous)];
        // Inspect the fallback fonts for this exact attributed line as well.
        // This is an absence-of-observed-missing-glyph check, not device acceptance.
        NSAttributedString *attributed = [storage attributedSubstringFromRange:line];
        CTLineRef shaped = CTLineCreateWithAttributedString((__bridge CFAttributedStringRef)attributed);
        if (!shaped) { valid = NO; *stop = YES; return; }
        @try {
        for (id object in (__bridge NSArray *)CTLineGetGlyphRuns(shaped)) {
          CTRunRef run = (__bridge CTRunRef)object;
          CTFontRef font = (CTFontRef)CFDictionaryGetValue(CTRunGetAttributes(run), kCTFontAttributeName);
          NSString *name = font ? CFBridgingRelease(CTFontCopyPostScriptName(font)) : nil;
          if (!font || [name rangeOfString:@"LastResort" options:NSCaseInsensitiveSearch].location != NSNotFound) valid = NO;
          CFIndex count = CTRunGetGlyphCount(run);
          for (CFIndex i = 0; i < count; i++) { CGGlyph glyph; CTRunGetGlyphs(run, CFRangeMake(i, 1), &glyph); if (glyph == 0) valid = NO; }
        }
        if (selectedLine && valid) {
          double advance = CTLineGetTypographicBounds(shaped, NULL, NULL, NULL);
          CGRect independentInk = CTLineGetImageBounds(shaped, NULL);
          if (CGRectIsNull(independentInk)) {
            if ([attributed.string rangeOfCharacterFromSet:NSCharacterSet.whitespaceAndNewlineCharacterSet.invertedSet].location != NSNotFound) valid = NO;
            independentInk = CGRectZero;
          }
          if (!isfinite(advance) || advance < 0 || !isfinite(independentInk.origin.x) || !isfinite(independentInk.origin.y) ||
              !isfinite(independentInk.size.width) || !isfinite(independentInk.size.height)) valid = NO;
          if (valid) {
            const double values[] = {advance, CGRectGetMinX(independentInk), -CGRectGetMaxY(independentInk),
              CGRectGetMaxX(independentInk), -CGRectGetMinY(independentInk)};
            for (NSUInteger i = 0; i < 5; i++) if (!isfinite(values[i])) valid = NO;
            if (values[3] < values[1] || values[4] < values[2]) valid = NO;
            uint64_t packed[5];
            for (NSUInteger i = 0; i < 5; i++) {
              uint64_t bits; memcpy(&bits, &values[i], sizeof(bits)); packed[i] = CFSwapInt64HostToLittle(bits);
            }
            if (valid) independentBytes = [NSData dataWithBytes:packed length:sizeof(packed)];
          }
        }
        } @finally { CFRelease(shaped); }
      }];
      if (!valid || previous != expected.length || (selectedLine && (ends.count != 1 || independentBytes.length != 40))) { unavailable(); return; }
      NSMutableArray *boundaries = [NSMutableArray arrayWithObject:@0];
      [expected enumerateSubstringsInRange:NSMakeRange(0, expected.length) options:NSStringEnumerationByComposedCharacterSequences
        usingBlock:^(NSString *substring, NSRange range, NSRange enclosing, BOOL *stop) { [boundaries addObject:@(NSMaxRange(range))]; }];
      CGRect ink = CGRectOffset([layout boundingRectForGlyphRange:all inTextContainer:container], frame.origin.x, frame.origin.y);
      if (CGRectIsNull(ink) || CGRectIsEmpty(ink) || !isfinite(ink.origin.x) || !isfinite(ink.origin.y) ||
          !isfinite(ink.size.width) || !isfinite(ink.size.height)) { unavailable(); return; }
      NSDictionary *result = @{ @"version": selectedLine ? @"piece.native_selected_line.v1" : @"piece.native_text.v1", @"platform": @"ios", @"font_size": @(fontSize),
        @"width": @(view.bounds.size.width), @"height": @(view.bounds.size.height), @"utf16_length": @(expected.length),
        @"boundaries": boundaries, @"line_ends": ends, @"ink": @[@(CGRectGetMinX(ink)), @(CGRectGetMinY(ink)), @(CGRectGetMaxX(ink)), @(CGRectGetMaxY(ink))],
        @"glyph_check": @"no_missing_observed" };
      if (selectedLine) {
        NSMutableDictionary *selected = [result mutableCopy];
        selected[@"independent_metrics_f64le"] = [independentBytes base64EncodedStringWithOptions:0];
        if (pixelRequest) {
          id canvasTag = pixelRequest[@"canvas_tag"];
          UIView *canvas = [canvasTag isKindOfClass:NSNumber.class] ? registry[canvasTag] : nil;
          NSDictionary *pixels = PieceSelectedPixels(view, canvas, tag, pixelRequest, storage, layout, container, all, ink, fontSize, independentBytes);
          if (!pixels || registry[tag] != view || registry[canvasTag] != canvas) { unavailable(); return; }
          [selected addEntriesFromDictionary:pixels];
        }
        resolve(selected);
      } else resolve(result);
    } @catch (__unused NSException *exception) { unavailable(); }
  }];
}
@end
