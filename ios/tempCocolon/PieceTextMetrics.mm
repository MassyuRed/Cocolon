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
#include <memory>
#include <new>

// Read-only accessors added by the pinned RN patch; no KVC/private-ivar read.
@interface RCTTextView (CocolonPieceMetrics)
- (NSTextStorage *)cocolonPieceTextStorage;
- (CGRect)cocolonPieceContentFrame;
- (void)cocolonPiecePaintGlyphRange:(NSRange)glyphs;
- (BOOL)cocolonPieceIsPlainText;
- (NSDictionary *)cocolonPiecePaintGrid;
@end

@interface PieceTextMetrics : NSObject <RCTBridgeModule>
@property(nonatomic, weak) RCTBridge *bridge;
- (void)measureCandidateSnapshot:(NSNumber *)tag text:(NSString *)expected fontSize:(double)fontSize
                   boundedWidth:(BOOL)boundedWidth contentWidth:(double)contentWidth exploration:(BOOL)exploration
                       deadline:(NSTimeInterval)deadline
                       resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject;
- (void)inspectSnapshot:(NSNumber *)tag text:(NSString *)expected fontSize:(double)fontSize
          selectedLine:(BOOL)selectedLine pixelRequest:(NSDictionary *)pixelRequest resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject;
- (void)inspectSnapshot:(NSNumber *)tag text:(NSString *)expected fontSize:(double)fontSize
          selectedLine:(BOOL)selectedLine pixelRequest:(NSDictionary *)pixelRequest containment:(BOOL)containment
          resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject;
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
  const auto isTranslation = [](CATransform3D value) {
    // Compare every component directly so this guard has no additional
    // QuartzCore function-link dependency in the standalone metrics target.
    return value.m11 == 1 && value.m22 == 1 && value.m33 == 1 && value.m44 == 1 &&
      value.m12 == 0 && value.m13 == 0 && value.m14 == 0 &&
      value.m21 == 0 && value.m23 == 0 && value.m24 == 0 &&
      value.m31 == 0 && value.m32 == 0 && value.m34 == 0 && value.m43 == 0 &&
      isfinite(value.m41) && isfinite(value.m42);
  };
  for (UIView *ancestor = view; ancestor; ancestor = ancestor.superview) {
    if (!isTranslation(ancestor.layer.sublayerTransform)) return NO;
    if (ancestor == canvas) break;
    if (!isTranslation(ancestor.layer.transform)) return NO;
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
// Pure v2 raster primitive. Neither snapshot nor mounted geometry is mutated.
static NSArray *PieceDirectPixelInk(NSLayoutManager *layout, NSRange glyphs, CGRect frame,
    CGRect extent, CGPoint phase, BOOL (^withinDeadline)(void), BOOL boundedOwnership = NO) {
  @autoreleasepool {
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
    if (boundedOwnership && stride * height > 16 * 1024 * 1024) return nil;
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
    if (!seen || edge || expired || !withinDeadline()) return nil;
    return @[@(minX + extent.origin.x - phase.x), @(minY + extent.origin.y - phase.y),
      @(maxX + 1 + extent.origin.x - phase.x), @(maxY + 1 + extent.origin.y - phase.y)];
  }
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
    NSArray *directInk = PieceDirectPixelInk(layout, glyphs, frame, extent, phase, withinDeadline);
    if (!directInk) return nil;
    CGRect afterFrame;
    if (!withinDeadline() || view.cocolonPieceTextStorage != storage ||
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
      @"ink":directInk };
  }
}

// The v3 reference is temporary measurement, never the displayed renderer.
// Owned buffers/providers share one checked 32MiB budget. CA's private caches
// are not claimed to be measurable code-owned allocations.
static char PieceContainmentSnapshotKey;
static constexpr size_t PieceContainmentMemoryLimit = 32 * 1024 * 1024;
struct PieceRasterBudget {
  std::atomic<size_t> live{0};
  bool reserve(size_t n) {
    size_t old = live.load(std::memory_order_relaxed);
    do {
      if (old > PieceContainmentMemoryLimit || n > PieceContainmentMemoryLimit - old) return false;
    } while (!live.compare_exchange_weak(old, old + n, std::memory_order_relaxed));
    return true;
  }
  void release(size_t n) { live.fetch_sub(n, std::memory_order_relaxed); }
};
using PieceRasterBudgetOwner = std::shared_ptr<PieceRasterBudget>;
static BOOL PieceRasterPlan(CGSize size, CGFloat scale, size_t *width, size_t *height, size_t *length) {
  double w = ceil(size.width * scale), h = ceil(size.height * scale);
  if (!isfinite(scale) || scale <= 0 || !isfinite(w) || !isfinite(h) || w < 1 || h < 1 ||
      w > 4096 || h > 4096 || w * h > 4 * 1024 * 1024) return NO;
  *width = (size_t)w; *height = (size_t)h;
  if (*width > SIZE_MAX / 4 || *height > SIZE_MAX / (*width * 4)) return NO;
  *length = *width * 4 * *height;
  return *length <= PieceContainmentMemoryLimit;
}
struct PieceOwnedPixels {
  PieceRasterBudgetOwner budget;
  bool owns = true;
  UInt8 *data = nullptr;
  CGContextRef context = nullptr;
  size_t width = 0, height = 0, stride = 0, length = 0;
  PieceOwnedPixels() = default;
  PieceOwnedPixels(const PieceOwnedPixels &) = delete;
  PieceOwnedPixels &operator=(const PieceOwnedPixels &) = delete;
  void reset() {
    if (context) CGContextRelease(context);
    if (owns && data) free(data);
    if (owns && budget) budget->release(length);
    budget.reset(); owns = true; data = nullptr; context = nullptr; width = height = stride = length = 0;
  }
  ~PieceOwnedPixels() { reset(); }
  bool make(CGSize size, CGFloat scale, const PieceRasterBudgetOwner &owner) {
    size_t w, h, n;
    if (!PieceRasterPlan(size, scale, &w, &h, &n)) return false;
    return makeExact(w, h, scale, owner);
  }
  bool makeExact(size_t w, size_t h, CGFloat scale, const PieceRasterBudgetOwner &owner,
      const CGAffineTransform *paintTransform = nullptr) {
    if (!w || !h || w > 4096 || h > 4096 || w > (4 * 1024 * 1024) / h ||
        w > SIZE_MAX / 4 || h > SIZE_MAX / (w * 4)) return false;
    size_t n = w * 4 * h;
    if (!owner->reserve(n)) return false;
    budget = owner; width = w; height = h; stride = w * 4; length = n;
    data = (UInt8 *)calloc(height, stride);
    CGColorSpaceRef space = data ? CGColorSpaceCreateWithName(kCGColorSpaceSRGB) : NULL;
    context = space ? CGBitmapContextCreate(data, width, height, 8, stride, space,
      kCGBitmapByteOrder32Big | kCGImageAlphaPremultipliedLast) : NULL;
    if (space) CGColorSpaceRelease(space);
    if (!context) { reset(); return false; }
    if (paintTransform) CGContextConcatCTM(context, *paintTransform);
    else {
      CGContextTranslateCTM(context, 0, height);
      CGContextScaleCTM(context, scale, -scale);
    }
    return true;
  }
};
// Provider ownership follows the last CGImage/CA reference. A detached layer
// retaining an old contents image cannot outlive/free its pixel allocation.
struct PieceProviderAllocation {
  PieceRasterBudgetOwner budget;
  size_t length;
};
static void PieceProviderPixelsRelease(void *info, const void *data, __unused size_t size) {
  auto *allocation = (PieceProviderAllocation *)info;
  free((void *)data); allocation->budget->release(allocation->length); delete allocation;
}
static CGImageRef PiecePixelsImage(PieceOwnedPixels &pixels) {
  if (!pixels.data || !pixels.owns) return NULL;
  if (pixels.context) { CGContextRelease(pixels.context); pixels.context = nullptr; }
  auto *allocation = new (std::nothrow) PieceProviderAllocation{pixels.budget, pixels.length};
  if (!allocation) return NULL;
  CGDataProviderRef provider = CGDataProviderCreateWithData(allocation, pixels.data, pixels.length, PieceProviderPixelsRelease);
  if (!provider) { delete allocation; return NULL; }
  pixels.owns = false;
  CGColorSpaceRef space = CGColorSpaceCreateWithName(kCGColorSpaceSRGB);
  CGImageRef image = space ? CGImageCreate(pixels.width, pixels.height, 8, 32, pixels.stride, space,
    kCGBitmapByteOrder32Big | kCGImageAlphaPremultipliedLast, provider, NULL, false, kCGRenderingIntentDefault) : NULL;
  if (space) CGColorSpaceRelease(space);
  CGDataProviderRelease(provider);
  if (!image) pixels.reset();
  return image;
}
static BOOL PieceScanPixels(const PieceOwnedPixels &pixels, BOOL (^withinDeadline)(void), BOOL rejectEdge, CGRect *ink) {
  size_t l = pixels.width, t = pixels.height, r = 0, b = 0; BOOL seen = NO, edge = NO;
  for (size_t y = 0; y < pixels.height; y++) {
    if (!withinDeadline()) return NO;
    for (size_t x = 0; x < pixels.width; x++) if (pixels.data[y * pixels.stride + x * 4 + 3] > 0) {
      seen = YES; l = MIN(l, x); t = MIN(t, y); r = MAX(r, x); b = MAX(b, y);
      if (x == 0 || y == 0 || x + 1 == pixels.width || y + 1 == pixels.height) edge = YES;
    }
  }
  if (!seen || (rejectEdge && edge) || !withinDeadline()) return NO;
  *ink = CGRectMake(l, t, r + 1 - l, b + 1 - t); return YES;
}
static NSArray *PieceInkEdges(CGRect rect) {
  return @[@(CGRectGetMinX(rect)), @(CGRectGetMinY(rect)), @(CGRectGetMaxX(rect)), @(CGRectGetMaxY(rect))];
}
static BOOL PieceIdentityTransform(CATransform3D t) {
  return t.m11 == 1 && t.m22 == 1 && t.m33 == 1 && t.m44 == 1 &&
    t.m12 == 0 && t.m13 == 0 && t.m14 == 0 && t.m21 == 0 && t.m23 == 0 && t.m24 == 0 &&
    t.m31 == 0 && t.m32 == 0 && t.m34 == 0 && t.m41 == 0 && t.m42 == 0 && t.m43 == 0;
}
static NSDictionary *PieceContainmentLayerState(RCTTextView *view) {
  if (![view respondsToSelector:@selector(cocolonPiecePaintGrid)]) return nil;
  NSDictionary *grid = [view cocolonPiecePaintGrid];
  if (![grid isKindOfClass:NSDictionary.class] || grid[@"storage"] != view.cocolonPieceTextStorage ||
      ![grid[@"attributes"] isEqualToAttributedString:view.cocolonPieceTextStorage] ||
      !CGRectEqualToRect([grid[@"bounds"] CGRectValue], view.bounds) ||
      !CGRectEqualToRect([grid[@"frame"] CGRectValue], view.cocolonPieceContentFrame) ||
      [grid[@"scale"] doubleValue] != view.contentScaleFactor) return nil;
  CGAffineTransform ctm = [grid[@"ctm"] CGAffineTransformValue];
  CGRect clip = [grid[@"clip"] CGRectValue];
  if (!isfinite(ctm.a) || !isfinite(ctm.d) || !isfinite(ctm.tx) || !isfinite(ctm.ty) ||
      ctm.a != view.contentScaleFactor || ctm.d != -view.contentScaleFactor || ctm.b != 0 || ctm.c != 0 ||
      !PiecePixelRect(clip)) return nil;
  CALayer *layer = view.layer;
  // UIKit owns the natural context; its public bitmap queries need not work.
  // Retain the same clean contents before inspecting its public CF type.
  id contents = layer.contents;
  if (!contents || layer.needsDisplay || layer.needsLayout || view.hidden || layer.hidden || layer.opaque ||
      !isfinite(view.alpha) || view.alpha <= 0 || view.alpha > 1 ||
      !isfinite(layer.opacity) || layer.opacity <= 0 || layer.opacity > 1 ||
      !isfinite(view.contentScaleFactor) || view.contentScaleFactor <= 0 || layer.contentsScale != view.contentScaleFactor ||
      layer.sublayers.count || layer.mask || layer.borderWidth != 0 || layer.cornerRadius != 0 || layer.shadowOpacity != 0 ||
      layer.shouldRasterize || layer.drawsAsynchronously || layer.filters.count || layer.backgroundFilters.count || layer.compositingFilter ||
      (layer.backgroundColor && CGColorGetAlpha(layer.backgroundColor) != 0) ||
      !PieceIdentityTransform(layer.transform) || !PieceIdentityTransform(layer.sublayerTransform) ||
      !CGRectEqualToRect(layer.bounds, view.bounds) || !CGPointEqualToPoint(view.bounds.origin, CGPointZero) ||
      !CGRectEqualToRect(layer.contentsRect, CGRectMake(0, 0, 1, 1)) ||
      !CGRectEqualToRect(layer.contentsCenter, CGRectMake(0, 0, 1, 1)) ||
      ![layer.contentsGravity isEqualToString:@"resize"] ||
      ![layer.minificationFilter isEqualToString:@"linear"] || ![layer.magnificationFilter isEqualToString:@"linear"] ||
      layer.minificationFilterBias != 0 || layer.geometryFlipped || layer.animationKeys.count ||
      ![view respondsToSelector:@selector(cocolonPieceIsPlainText)] || ![view cocolonPieceIsPlainText] ||
      ![view respondsToSelector:@selector(cocolonPiecePaintGlyphRange:)]) return nil;
  // This is a plain naturally drawn Text layer, not an arbitrary id input.
  // Unknown backing types remain unsupported; never infer dimensions from clip.
  if (CFGetTypeID((__bridge CFTypeRef)contents) != CGImageGetTypeID()) return nil;
  CGImageRef image = (__bridge CGImageRef)contents;
  const size_t width = CGImageGetWidth(image), height = CGImageGetHeight(image);
  if (!width || !height || width > 4096 || height > 4096 ||
      width > (4 * 1024 * 1024) / height) return nil;
  return @{@"paint_grid":grid, @"contents":contents, @"width":@(width), @"height":@(height), @"scale":@(layer.contentsScale), @"alpha":@(view.alpha), @"opacity":@(layer.opacity),
    @"anchor":[NSValue valueWithCGPoint:layer.anchorPoint], @"bounds":[NSValue valueWithCGRect:layer.bounds],
    @"masks":@(layer.masksToBounds), @"position":[NSValue valueWithCGPoint:layer.position]};
}
static BOOL PieceContainmentSameLayer(NSDictionary *a, NSDictionary *b, BOOL placementAllowed) {
  if (!a || !b || a[@"paint_grid"] != b[@"paint_grid"] || a[@"contents"] != b[@"contents"] ||
      ![a[@"width"] isEqual:b[@"width"]] || ![a[@"height"] isEqual:b[@"height"]] || ![a[@"scale"] isEqual:b[@"scale"]] ||
      ![a[@"alpha"] isEqual:b[@"alpha"]] || ![a[@"opacity"] isEqual:b[@"opacity"]] ||
      ![a[@"anchor"] isEqual:b[@"anchor"]] || ![a[@"bounds"] isEqual:b[@"bounds"]] ||
      ![a[@"masks"] isEqual:b[@"masks"]]) return NO;
  return placementAllowed || [a[@"position"] isEqual:b[@"position"]];
}
static CALayer *PieceReferenceLayer(CGImageRef image, CGRect bounds, CALayer *original) {
  // A public temporary layer; never a copy of a UIKit private subclass.
  CALayer *layer = [CALayer layer];
  layer.actions = @{@"contents":NSNull.null, @"bounds":NSNull.null, @"anchorPoint":NSNull.null,
    @"contentsScale":NSNull.null, @"contentsRect":NSNull.null, @"contentsCenter":NSNull.null, @"opacity":NSNull.null};
  layer.bounds = bounds; layer.anchorPoint = original.anchorPoint;
  layer.contents = (__bridge id)image; layer.contentsScale = original.contentsScale;
  layer.contentsRect = original.contentsRect; layer.contentsCenter = original.contentsCenter;
  layer.contentsGravity = original.contentsGravity; layer.minificationFilter = original.minificationFilter;
  layer.magnificationFilter = original.magnificationFilter; layer.minificationFilterBias = original.minificationFilterBias;
  layer.opacity = original.opacity; layer.opaque = NO; layer.masksToBounds = original.masksToBounds;
  return layer;
}
static BOOL PieceCompositePixels(CALayer *layer, CGRect extent, CGFloat scale, CGPoint origin, CGPoint outputPhase,
    const PieceRasterBudgetOwner &budget, BOOL (^withinDeadline)(void), CGRect *ink) {
  PieceOwnedPixels pixels;
  if (!withinDeadline() || !pixels.make(extent.size, scale, budget) || !withinDeadline()) return NO;
  CGContextTranslateCTM(pixels.context, origin.x - extent.origin.x, origin.y - extent.origin.y);
  [layer renderInContext:pixels.context];
  CGRect cells;
  if (!PieceScanPixels(pixels, withinDeadline, YES, &cells)) return NO;
  *ink = CGRectMake(cells.origin.x / scale + extent.origin.x - outputPhase.x,
    cells.origin.y / scale + extent.origin.y - outputPhase.y, cells.size.width / scale, cells.size.height / scale);
  return YES;
}
static BOOL PieceNativeAndLayerInk(RCTTextView *view, NSDictionary *layerState, NSRange glyphs, CGRect textKitInk, double fontSize,
    CGPoint phase, const PieceRasterBudgetOwner &budget, BOOL (^withinDeadline)(void), CGRect *nativeInk, CGRect *layerInk) {
  const CGFloat scale = view.contentScaleFactor;
  NSDictionary *grid = layerState[@"paint_grid"];
  CGAffineTransform naturalCTM = [grid[@"ctm"] CGAffineTransformValue];
  const size_t naturalWidth = [layerState[@"width"] unsignedLongLongValue], naturalHeight = [layerState[@"height"] unsignedLongLongValue];
  // Top-down pixel coordinates of the actual UIKit draw, including the small
  // fractional translation introduced by Yoga's nonintegral Text height.
  const double px = naturalCTM.tx, py = (double)naturalHeight - naturalCTM.ty;
  CGRect expanded = CGRectInset(textKitInk, -2 * fontSize, -2 * fontSize);
  const double x0 = floor(expanded.origin.x * scale + px), y0 = floor(expanded.origin.y * scale + py);
  const double x1 = ceil(CGRectGetMaxX(expanded) * scale + px), y1 = ceil(CGRectGetMaxY(expanded) * scale + py);
  if (!isfinite(x0) || !isfinite(y0) || !isfinite(x1) || !isfinite(y1) ||
      fabs(x0) > 0x1p52 || fabs(y0) > 0x1p52 || fabs(x1) > 0x1p52 || fabs(y1) > 0x1p52) return NO;
  CGRect nativeExtent = CGRectMake((x0 - px) / scale, (y0 - py) / scale, (x1 - x0) / scale, (y1 - y0) / scale);
  // Extend the original backing-pixel -> layer-bounds resize mapping for
  // the expanded image. Drawing coordinates and CA contents coordinates are
  // distinct when the natural backing dimension is not exactly bounds*S.
  CGRect filteredExtent = CGRectMake(x0 * view.bounds.size.width / naturalWidth,
    y0 * view.bounds.size.height / naturalHeight,
    (x1 - x0) * view.bounds.size.width / naturalWidth,
    (y1 - y0) * view.bounds.size.height / naturalHeight);
  CGRect logicalExtent = CGRectIntegral(CGRectOffset(CGRectUnion(CGRectUnion(view.bounds, nativeExtent), filteredExtent), phase.x, phase.y));
  // One transparent logical cell is only scratch for filter support, never
  // added to returned ink. Alpha touching that outer boundary is rejected.
  logicalExtent = CGRectInset(logicalExtent, -1, -1);
  size_t nw, nh, nb, vw, vh, vb, lw, lh, lb;
  if (!PiecePixelRect(nativeExtent) || !PiecePixelRect(logicalExtent) ||
      !PieceRasterPlan(CGSizeMake(x1 - x0, y1 - y0), 1, &nw, &nh, &nb) ||
      !PieceRasterPlan(CGSizeMake(naturalWidth, naturalHeight), 1, &vw, &vh, &vb) ||
      !PieceRasterPlan(logicalExtent.size, 1, &lw, &lh, &lb)) return NO;
  size_t cw, ch, cb;
  if (!PieceRasterPlan(view.bounds.size, scale, &cw, &ch, &cb)) return NO;
  const size_t bitBytes = (cw * ch + 7) / 8;
  // Preflight all peaks before any v3 allocation; image providers own these
  // same allocations without a second pixel copy.
  if (nb > PieceContainmentMemoryLimit - lb || nb > PieceContainmentMemoryLimit - vb ||
      cb > PieceContainmentMemoryLimit - vb - bitBytes) return NO;
  PieceOwnedPixels native, clipped;
  CGAffineTransform expandedCTM = CGAffineTransformMake(scale, 0, 0, -scale, px - x0, (double)nh + y0 - py);
  if (!withinDeadline() || !native.makeExact(nw, nh, scale, budget, &expandedCTM) || !withinDeadline()) return NO;
  UIGraphicsPushContext(native.context);
  @try { [view cocolonPiecePaintGlyphRange:glyphs]; }
  @finally { UIGraphicsPopContext(); }
  CGRect nativeCells;
  if (!PieceScanPixels(native, withinDeadline, YES, &nativeCells)) return NO;
  const double projectedLeft = floor((CGRectGetMinX(nativeCells) + x0 - px) / scale + phase.x) - phase.x;
  const double projectedTop = floor((CGRectGetMinY(nativeCells) + y0 - py) / scale + phase.y) - phase.y;
  const double projectedRight = ceil((CGRectGetMaxX(nativeCells) + x0 - px) / scale + phase.x) - phase.x;
  const double projectedBottom = ceil((CGRectGetMaxY(nativeCells) + y0 - py) / scale + phase.y) - phase.y;
  CGRect projected = CGRectMake(projectedLeft, projectedTop, projectedRight - projectedLeft, projectedBottom - projectedTop);
  CGImageRef expandedImage = PiecePixelsImage(native), clippedImage = NULL;
  CALayer *reference = nil;
  UInt8 *bits = nullptr;
  BOOL reservedBits = NO;
  @try {
    if (!expandedImage) return NO;
    reference = PieceReferenceLayer(expandedImage, (CGRect){CGPointZero, filteredExtent.size}, view.layer);
    CGRect filtered;
    if (!reference || !PieceCompositePixels(reference, logicalExtent, 1,
        CGPointMake(phase.x + filteredExtent.origin.x, phase.y + filteredExtent.origin.y), phase, budget, withinDeadline, &filtered)) return NO;
    *nativeInk = CGRectUnion(projected, filtered);
    if (!withinDeadline() || !clipped.makeExact(vw, vh, scale, budget, &naturalCTM) || !withinDeadline()) return NO;
    // Replay the observed CTM/clip on the same contents image dimensions, not
    // ceil(bounds*S) or discarding UIKit's fractional CTM translation.
    CGContextClipToRect(clipped.context, [grid[@"clip"] CGRectValue]);
    UIGraphicsPushContext(clipped.context);
    @try { [view cocolonPiecePaintGlyphRange:glyphs]; }
    @finally { UIGraphicsPopContext(); }
    reference.contents = nil; reference = nil;
    CGImageRelease(expandedImage); expandedImage = NULL; native.reset();
    clippedImage = PiecePixelsImage(clipped);
    if (!clippedImage || !budget->reserve(bitBytes)) return NO;
    reservedBits = YES; bits = (UInt8 *)calloc(bitBytes, 1);
    if (!bits) return NO;
    reference = PieceReferenceLayer(clippedImage, view.bounds, view.layer);
    if (!reference) return NO;
    {
      PieceOwnedPixels compared;
      if (!withinDeadline() || !compared.make(view.bounds.size, scale, budget) || !withinDeadline()) return NO;
      [reference renderInContext:compared.context];
      for (size_t y = 0; y < ch; y++) {
        if (!withinDeadline()) return NO;
        for (size_t x = 0; x < cw; x++) if (compared.data[y * compared.stride + x * 4 + 3] > 0) {
          size_t index = y * cw + x; bits[index / 8] |= (UInt8)(1 << (index % 8));
        }
      }
    }
    reference.contents = nil; reference = nil;
    CGImageRelease(clippedImage); clippedImage = NULL; clipped.reset();
    {
      PieceOwnedPixels actual;
      if (!withinDeadline() || !actual.make(view.bounds.size, scale, budget) || !withinDeadline()) return NO;
      [view.layer renderInContext:actual.context];
      for (size_t y = 0; y < ch; y++) {
        if (!withinDeadline()) return NO;
        for (size_t x = 0; x < cw; x++) {
          size_t index = y * cw + x;
          if ((actual.data[y * actual.stride + x * 4 + 3] > 0) != ((bits[index / 8] & (1 << (index % 8))) != 0)) return NO;
        }
      }
    }
    free(bits); bits = nullptr; budget->release(bitBytes); reservedBits = NO;
    return PieceCompositePixels(view.layer, logicalExtent, 1, phase, phase, budget, withinDeadline, layerInk);
  } @finally {
    reference.contents = nil;
    if (expandedImage) CGImageRelease(expandedImage);
    if (clippedImage) CGImageRelease(clippedImage);
    if (bits) free(bits);
    if (reservedBits) budget->release(bitBytes);
  }
}
static NSDictionary *PieceContainmentPixels(RCTTextView *view, UIView *canvas, NSNumber *tag, NSDictionary *request,
    NSTextStorage *storage, NSLayoutManager *layout, NSTextContainer *container, NSRange glyphs,
    CGRect textKitInk, double fontSize, NSData *independent) {
  try {
  @autoreleasepool {
    NSDictionary *prior = objc_getAssociatedObject(view, &PieceContainmentSnapshotKey);
    objc_setAssociatedObject(view, &PieceContainmentSnapshotKey, nil, OBJC_ASSOCIATION_RETAIN_NONATOMIC);
    NSArray *keys = @[@"stage", @"canvas_tag", @"expires_at_ms", @"snapshot_token"];
    if (![request isKindOfClass:NSDictionary.class] ||
        ![[NSSet setWithArray:request.allKeys] isEqualToSet:[NSSet setWithArray:keys]]) return nil;
    NSString *stage = request[@"stage"]; BOOL placed = [stage isEqual:@"placed"];
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
    if (!PiecePixelCanvasFrame(view, canvas, &canvasFrame) || !PiecePixelRect(frame) || !PiecePixelRect(textKitInk)) return nil;
    NSDictionary *layerState = PieceContainmentLayerState(view);
    if (!layerState) return nil;
    NSAttributedString *attributes = [storage copy];
    CGSize containerSize = container.size; CGFloat padding = container.lineFragmentPadding;
    NSLineBreakMode lineBreak = container.lineBreakMode; BOOL leading = layout.usesFontLeading;
    CGRect canvasBounds = canvas.bounds, canvasViewFrame = canvas.frame; CGAffineTransform canvasTransform = canvas.transform;
    NSString *token = placed ? request[@"snapshot_token"] : NSUUID.UUID.UUIDString;
    if (placed) {
      BOOL (^sameCanvas)(UIView *) = prior[@"same_canvas"];
      if (![token isKindOfClass:NSString.class] || ![prior[@"token"] isEqual:token] || !sameCanvas || !sameCanvas(canvas) ||
          prior[@"storage"] != storage || prior[@"layout"] != layout || prior[@"container"] != container ||
          ![prior[@"attributes"] isEqualToAttributedString:attributes] ||
          !CGRectEqualToRect([prior[@"bounds"] CGRectValue], bounds) || !CGRectEqualToRect([prior[@"frame"] CGRectValue], frame) ||
          !CGSizeEqualToSize([prior[@"container_size"] CGSizeValue], containerSize) || [prior[@"padding"] doubleValue] != padding ||
          [prior[@"line_break"] integerValue] != lineBreak || [prior[@"leading"] boolValue] != leading ||
          !CGRectEqualToRect([prior[@"canvas_bounds"] CGRectValue], canvasBounds) ||
          !CGRectEqualToRect([prior[@"canvas_frame"] CGRectValue], canvasViewFrame) ||
          !CGAffineTransformEqualToTransform([prior[@"canvas_transform"] CGAffineTransformValue], canvasTransform) ||
          ![prior[@"independent"] isEqualToData:independent] || ![prior[@"deadline"] isEqual:expires] ||
          !PieceContainmentSameLayer(prior[@"layer"], layerState, YES)) return nil;
    } else if (request[@"snapshot_token"] != NSNull.null) return nil;
    CGPoint phase = placed ? canvasFrame.origin : CGPointZero;
    CGRect extent = CGRectIntegral(CGRectOffset(CGRectInset(CGRectUnion(bounds, textKitInk), -2 * fontSize, -2 * fontSize), phase.x, phase.y));
    NSArray *direct = PieceDirectPixelInk(layout, glyphs, frame, extent, phase, withinDeadline, YES);
    if (!direct) return nil;
    PieceRasterBudgetOwner budget = std::make_shared<PieceRasterBudget>();
    CGRect nativeInk, layerInk;
    if (!PieceNativeAndLayerInk(view, layerState, glyphs, textKitInk, fontSize, phase, budget, withinDeadline, &nativeInk, &layerInk)) return nil;
    CGRect afterFrame;
    if (!withinDeadline() || view.cocolonPieceTextStorage != storage || storage.layoutManagers.firstObject != layout ||
        layout.textContainers.firstObject != container || ![storage isEqualToAttributedString:attributes] ||
        !CGSizeEqualToSize(container.size, containerSize) || container.lineFragmentPadding != padding ||
        container.lineBreakMode != lineBreak || container.maximumNumberOfLines != 0 || layout.usesFontLeading != leading ||
        !NSEqualRanges([layout glyphRangeForTextContainer:container], glyphs) || !CGRectEqualToRect(view.bounds, bounds) ||
        !CGRectEqualToRect(view.cocolonPieceContentFrame, frame) || !PiecePixelCanvasFrame(view, canvas, &afterFrame) ||
        !CGRectEqualToRect(afterFrame, canvasFrame) || !CGRectEqualToRect(canvas.bounds, canvasBounds) ||
        !CGRectEqualToRect(canvas.frame, canvasViewFrame) || !CGAffineTransformEqualToTransform(canvas.transform, canvasTransform) ||
        !PieceContainmentSameLayer(layerState, PieceContainmentLayerState(view), NO)) return nil;
    if (!placed) {
      __weak UIView *weakCanvas = canvas;
      BOOL (^sameCanvas)(UIView *) = ^BOOL(UIView *value) { return weakCanvas && value == weakCanvas; };
      objc_setAssociatedObject(view, &PieceContainmentSnapshotKey, @{
        @"token":token, @"same_canvas":[sameCanvas copy], @"storage":storage, @"layout":layout, @"container":container,
        @"attributes":attributes, @"bounds":[NSValue valueWithCGRect:bounds], @"frame":[NSValue valueWithCGRect:frame],
        @"container_size":[NSValue valueWithCGSize:containerSize], @"padding":@(padding), @"line_break":@(lineBreak), @"leading":@(leading),
        @"canvas_bounds":[NSValue valueWithCGRect:canvasBounds], @"canvas_frame":[NSValue valueWithCGRect:canvasViewFrame],
        @"canvas_transform":[NSValue valueWithCGAffineTransform:canvasTransform], @"independent":independent,
        @"deadline":expires, @"monotonic_deadline":@(monotonicDeadline), @"layer":layerState
      }, OBJC_ASSOCIATION_RETAIN_NONATOMIC);
    }
    if (!withinDeadline()) {
      objc_setAssociatedObject(view, &PieceContainmentSnapshotKey, nil, OBJC_ASSOCIATION_RETAIN_NONATOMIC);
      return nil;
    }
    NSArray *nativeEdges = PieceInkEdges(nativeInk), *layerEdges = PieceInkEdges(layerInk);
    NSMutableArray *unionEdges = [NSMutableArray new];
    for (NSUInteger i = 0; i < 4; i++) {
      double a = [direct[i] doubleValue], b = [nativeEdges[i] doubleValue], c = [layerEdges[i] doubleValue];
      [unionEdges addObject:@(i < 2 ? MIN(a, MIN(b, c)) : MAX(a, MAX(b, c)))];
    }
    return @{@"version":@"piece.native_selected_line.v3", @"stage":stage, @"tag":tag, @"canvas_tag":canvasTag,
      @"canvas_frame":PiecePixelRectArray(canvasFrame), @"content_frame":PiecePixelRectArray(frame),
      @"raster_scale":@1, @"snapshot_token":token, @"native_raster_scale":layerState[@"scale"],
      @"component_inks":@{@"direct":direct, @"native":nativeEdges, @"layer":layerEdges},
      @"ink":unionEdges};
  }
  } catch (const std::bad_alloc &) { return nil; }
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

RCT_EXPORT_METHOD(inspectSelectedLineV3:(nonnull NSNumber *)tag text:(NSString *)expected fontSize:(double)fontSize
                  request:(NSDictionary *)request resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
{
  [self inspectSnapshot:tag text:expected fontSize:fontSize selectedLine:YES
    pixelRequest:[request isKindOfClass:NSDictionary.class] ? request : @{} containment:YES resolver:resolve rejecter:reject];
}

- (void)inspectSnapshot:(NSNumber *)tag text:(NSString *)expected fontSize:(double)fontSize
          selectedLine:(BOOL)selectedLine pixelRequest:(NSDictionary *)pixelRequest resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject
{
  [self inspectSnapshot:tag text:expected fontSize:fontSize selectedLine:selectedLine pixelRequest:pixelRequest
    containment:NO resolver:resolve rejecter:reject];
}

- (void)inspectSnapshot:(NSNumber *)tag text:(NSString *)expected fontSize:(double)fontSize
          selectedLine:(BOOL)selectedLine pixelRequest:(NSDictionary *)pixelRequest containment:(BOOL)containment
          resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject
{
  const void *snapshotKey = containment ? &PieceContainmentSnapshotKey : &PieceSelectedPixelSnapshotKey;
  __block __weak RCTTextView *pixelView = nil;
  void (^unavailable)(void) = ^{
    if (pixelRequest && pixelView) objc_setAssociatedObject(pixelView, snapshotKey, nil, OBJC_ASSOCIATION_RETAIN_NONATOMIC);
    reject(@"PIECE_NATIVE_MEASUREMENT_UNAVAILABLE", @"Text measurement unavailable", nil);
  };
  if (!isfinite(tag.doubleValue) || tag.doubleValue <= 0 || tag.doubleValue != floor(tag.doubleValue) ||
      expected.length == 0 || expected.length > 4096 || !isfinite(fontSize) || fontSize < 1 || fontSize > 100 || !_bridge.uiManager) {
    if (pixelRequest && _bridge.uiManager && isfinite(tag.doubleValue) && tag.doubleValue > 0 && tag.doubleValue == floor(tag.doubleValue)) {
      [_bridge.uiManager addUIBlock:^(__unused RCTUIManager *manager, NSDictionary<NSNumber *, UIView *> *registry) {
        UIView *view = registry[tag];
        if ([view isKindOfClass:RCTTextView.class]) objc_setAssociatedObject(view, snapshotKey, nil, OBJC_ASSOCIATION_RETAIN_NONATOMIC);
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
          NSDictionary *pixels = containment
            ? PieceContainmentPixels(view, canvas, tag, pixelRequest, storage, layout, container, all, ink, fontSize, independentBytes)
            : PieceSelectedPixels(view, canvas, tag, pixelRequest, storage, layout, container, all, ink, fontSize, independentBytes);
          if (!pixels || registry[tag] != view || registry[canvasTag] != canvas) { unavailable(); return; }
          [selected addEntriesFromDictionary:pixels];
        }
        resolve(selected);
      } else resolve(result);
    } @catch (__unused NSException *exception) { unavailable(); }
  }];
}
@end
