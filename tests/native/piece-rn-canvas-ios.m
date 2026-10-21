// Hosted XCTest: real Paper bridge, real mounted Text, actual PieceTextMetrics v9.
#import <XCTest/XCTest.h>
#import <React/RCTBridge.h>
#import <React/RCTBridgeDelegate.h>
#import <React/RCTBridgeModule.h>
#import <React/RCTRootView.h>
#import <React/RCTUIManager.h>
#import <React/RCTUIManagerUtils.h>
#import <React/RCTTextView.h>
#import <React/UIView+React.h>
#import <QuartzCore/QuartzCore.h>
#import <objc/runtime.h>
#import <math.h>

@interface RCTTextView (PieceCanvasTestAccess)
- (NSTextStorage *)cocolonPieceTextStorage;
- (CGRect)cocolonPieceContentFrame;
@end

// Test-only observation of the original selected-line operation. The product
// inspector, its wire object, and the already-mounted Text remain unchanged.
typedef void (*PieceSelectedCall)(id, SEL, NSNumber *, NSString *, double,
                                 RCTPromiseResolveBlock, RCTPromiseRejectBlock);
static PieceSelectedCall PieceOriginalSelectedCall;
static NSMutableArray *PieceArabicObservations;
static NSUInteger PieceArabicOperationOrdinal;
static BOOL PiecePlacedCompositeAttempted;
static NSString *PieceEvidenceDirectory(void);

static id PieceFinite(double value) { return isfinite(value) ? @(value) : (id)NSNull.null; }
static NSArray *PieceRect(CGRect rect) {
  return @[PieceFinite(rect.origin.x), PieceFinite(rect.origin.y),
    PieceFinite(rect.size.width), PieceFinite(rect.size.height)];
}
static NSDictionary *PieceFontFacts(id value) {
  if (![value isKindOfClass:UIFont.class])
    return @{ @"observed_type": value ? NSStringFromClass([value class]) : @"absent" };
  UIFont *font = value;
  return @{ @"name": font.fontName ?: @"", @"family": font.familyName ?: @"",
    @"size": PieceFinite(font.pointSize), @"line_height": PieceFinite(font.lineHeight),
    @"ascender": PieceFinite(font.ascender), @"descender": PieceFinite(font.descender),
    @"leading": PieceFinite(font.leading), @"cap_height": PieceFinite(font.capHeight), @"x_height": PieceFinite(font.xHeight) };
}
static NSDictionary *PieceReadArabicGeometry(id module, NSNumber *tag, NSString *text,
                                            double fontSize, NSUInteger ordinal, id wire) {
  NSMutableDictionary *sample = [@{ @"operation": @(ordinal), @"tag": tag ?: NSNull.null,
    @"font_size": PieceFinite(fontSize), @"text_length": @(text.length),
    @"main_thread": @(NSThread.isMainThread) } mutableCopy];
  if ([NSJSONSerialization isValidJSONObject:wire]) sample[@"original_wire"] = wire;
  if (!NSThread.isMainThread) { sample[@"observation_error"] = @"not_main_thread"; return sample; }
  RCTBridge *bridge = [(id<RCTBridgeModule>)module bridge];
  UIView *rawView = [bridge.uiManager viewForReactTag:tag];
  if (![rawView isKindOfClass:RCTTextView.class]) {
    sample[@"observation_error"] = @"not_original_text_view"; return sample;
  }
  RCTTextView *view = (RCTTextView *)rawView;
  NSTextStorage *storage = view.cocolonPieceTextStorage;
  NSLayoutManager *layout = storage.layoutManagers.firstObject;
  NSTextContainer *container = layout.textContainers.firstObject;
  sample[@"text_matches"] = @([storage.string isEqualToString:text]);
  if (![storage.string isEqualToString:text] || !layout || !container) {
    sample[@"observation_error"] = @"original_storage_mismatch"; return sample;
  }
  sample[@"view_identity"] = [NSString stringWithFormat:@"%p", (__bridge void *)view];
  sample[@"storage_identity"] = [NSString stringWithFormat:@"%p", (__bridge void *)storage];
  sample[@"layout_identity"] = [NSString stringWithFormat:@"%p", (__bridge void *)layout];
  sample[@"container_identity"] = [NSString stringWithFormat:@"%p", (__bridge void *)container];
  sample[@"view_alpha"] = PieceFinite(view.alpha);
  sample[@"view_hidden"] = @(view.hidden);
  sample[@"view_clips_to_bounds"] = @(view.clipsToBounds);
  sample[@"view_bounds"] = PieceRect(view.bounds); sample[@"content_frame"] = PieceRect(view.cocolonPieceContentFrame);
  sample[@"container_size"] = @[PieceFinite(container.size.width), PieceFinite(container.size.height)];
  sample[@"container_padding"] = PieceFinite(container.lineFragmentPadding);
  sample[@"maximum_lines"] = @(container.maximumNumberOfLines); sample[@"line_break_mode"] = @(container.lineBreakMode);
  sample[@"uses_font_leading"] = @(layout.usesFontLeading);
  NSRange glyphs = [layout glyphRangeForTextContainer:container];
  sample[@"glyph_range"] = @[@(glyphs.location), @(glyphs.length)];
  sample[@"used_rect"] = PieceRect([layout usedRectForTextContainer:container]);
  sample[@"bounding_rect"] = PieceRect([layout boundingRectForGlyphRange:glyphs inTextContainer:container]);
  NSMutableArray *runs = [NSMutableArray new], *glyphFacts = [NSMutableArray new];
  [storage enumerateAttributesInRange:NSMakeRange(0, storage.length) options:0 usingBlock:^(NSDictionary *attributes, NSRange range, BOOL *stop) {
    id baseline = attributes[NSBaselineOffsetAttributeName];
    NSMutableDictionary *run = [@{ @"range": @[@(range.location), @(range.length)],
      @"storage_font": PieceFontFacts(attributes[NSFontAttributeName]),
      @"baseline_offset": !baseline ? @0 : ([baseline isKindOfClass:NSNumber.class] ? PieceFinite([baseline doubleValue]) : (id)NSNull.null) } mutableCopy];
    id value = attributes[NSParagraphStyleAttributeName];
    if ([value isKindOfClass:NSParagraphStyle.class]) {
      NSParagraphStyle *paragraph = value;
      run[@"paragraph"] = @{ @"minimum_line_height": PieceFinite(paragraph.minimumLineHeight),
        @"maximum_line_height": PieceFinite(paragraph.maximumLineHeight), @"line_height_multiple": PieceFinite(paragraph.lineHeightMultiple),
        @"line_spacing": PieceFinite(paragraph.lineSpacing), @"paragraph_spacing": PieceFinite(paragraph.paragraphSpacing),
        @"alignment": @(paragraph.alignment), @"base_writing_direction": @(paragraph.baseWritingDirection),
        @"line_break_mode": @(paragraph.lineBreakMode), @"first_line_indent": PieceFinite(paragraph.firstLineHeadIndent),
        @"head_indent": PieceFinite(paragraph.headIndent), @"tail_indent": PieceFinite(paragraph.tailIndent) };
    }
    [runs addObject:run];
  }];
  // These glyphs were laid out by the original inspector before it resolved.
  // Do not request another layout, inspect another node, or construct a CTLine.
  for (NSUInteger index = glyphs.location; index < NSMaxRange(glyphs); index++) {
    CGPoint location = [layout locationForGlyphAtIndex:index];
    [glyphFacts addObject:@{ @"index": @(index), @"character_index": @([layout characterIndexForGlyphAtIndex:index]),
      @"glyph": @([layout CGGlyphAtIndex:index]), @"properties": @([layout propertyForGlyphAtIndex:index]),
      @"location": @[PieceFinite(location.x), PieceFinite(location.y)],
      @"line_fragment": PieceRect([layout lineFragmentRectForGlyphAtIndex:index effectiveRange:NULL withoutAdditionalLayout:YES]),
      @"line_fragment_used": PieceRect([layout lineFragmentUsedRectForGlyphAtIndex:index effectiveRange:NULL withoutAdditionalLayout:YES]),
      @"bounding_rect": PieceRect([layout boundingRectForGlyphRange:NSMakeRange(index, 1) inTextContainer:container]),
      @"draws_outside_line_fragment": @([layout drawsOutsideLineFragmentForGlyphAtIndex:index]) }];
  }
  sample[@"attribute_runs"] = runs; sample[@"glyphs"] = glyphFacts;
  return sample;
}
static BOOL PiecePositiveFiniteRect(CGRect rect) {
  return isfinite(rect.origin.x) && isfinite(rect.origin.y) &&
    isfinite(rect.size.width) && isfinite(rect.size.height) &&
    rect.size.width > 0 && rect.size.height > 0;
}
static NSDictionary *PieceDrawArabicDiagnostic(RCTTextView *view, double fontSize, NSUInteger ordinal) {
  NSMutableDictionary *result = [@{
    @"diagnostic_only": @YES,
    @"method": @"original_layout_drawGlyphs",
    @"bypasses_view_visibility": @YES,
    @"pixel_checks_pending": @YES,
    @"png_write_complete": @NO,
    @"scale": @1
  } mutableCopy];
  NSTextStorage *storage = view.cocolonPieceTextStorage;
  NSLayoutManager *layout = storage.layoutManagers.firstObject;
  NSTextContainer *container = layout.textContainers.firstObject;
  if (!layout || !container || !isfinite(fontSize) || fontSize <= 0) {
    result[@"error"] = @"missing_original_layout"; return result;
  }
  NSRange glyphs = [layout glyphRangeForTextContainer:container];
  if (glyphs.location == NSNotFound || glyphs.length == 0) {
    result[@"error"] = @"empty_original_glyph_range"; return result;
  }
  CGRect bounds = view.bounds, frame = view.cocolonPieceContentFrame;
  CGRect ink = CGRectOffset([layout boundingRectForGlyphRange:glyphs inTextContainer:container],
                            frame.origin.x, frame.origin.y);
  if (!PiecePositiveFiniteRect(bounds) || !PiecePositiveFiniteRect(frame) || !PiecePositiveFiniteRect(ink)) {
    result[@"error"] = @"invalid_original_geometry"; return result;
  }
  // Diagnostic margin only. It does not change the mounted Text or its layout.
  CGRect extent = CGRectIntegral(CGRectInset(CGRectUnion(bounds, ink), -2 * fontSize, -2 * fontSize));
  result[@"extent_in_view_coordinates"] = PieceRect(extent);
  result[@"view_bounds"] = PieceRect(bounds);
  result[@"content_frame"] = PieceRect(frame);
  result[@"glyph_range"] = @[@(glyphs.location), @(glyphs.length)];
  if (!PiecePositiveFiniteRect(extent) || extent.size.width > 4096 || extent.size.height > 4096) {
    result[@"error"] = @"diagnostic_extent_out_of_range"; return result;
  }
  UIGraphicsImageRendererFormat *format = [UIGraphicsImageRendererFormat defaultFormat];
  format.scale = 1;
  format.opaque = NO;
  format.preferredRange = UIGraphicsImageRendererFormatRangeStandard;
  UIGraphicsImageRenderer *renderer = [[UIGraphicsImageRenderer alloc] initWithSize:extent.size format:format];
  NSMutableArray *images = [NSMutableArray new];
  BOOL complete = YES;
  for (NSString *variant in @[@"expanded", @"view_clipped"]) {
    NSString *filename = [NSString stringWithFormat:@"arabic-diagnostic-%lu-%.0f-%@.png",
                          (unsigned long)ordinal, fontSize, variant];
    NSMutableDictionary *record = [@{ @"variant": variant, @"filename": filename, @"png_written": @NO } mutableCopy];
    @try {
      UIImage *image = [renderer imageWithActions:^(UIGraphicsImageRendererContext *context) {
        CGContextRef cg = context.CGContext;
        CGContextSaveGState(cg);
        @try {
          CGContextTranslateCTM(cg, -extent.origin.x, -extent.origin.y);
          if ([variant isEqualToString:@"view_clipped"]) CGContextClipToRect(cg, bounds);
          [layout drawGlyphsForGlyphRange:glyphs atPoint:frame.origin];
        } @finally {
          CGContextRestoreGState(cg);
        }
      }];
      NSData *png = UIImagePNGRepresentation(image);
      NSError *error = nil;
      BOOL written = png.length > 0 && [png writeToFile:[PieceEvidenceDirectory() stringByAppendingPathComponent:filename]
                                               options:NSDataWritingAtomic error:&error];
      record[@"png_bytes"] = @(png.length);
      record[@"png_written"] = @(written);
      if (!written) record[@"error"] = error.localizedDescription ?: @"png_encoding_or_write_failed";
    } @catch (NSException *exception) {
      record[@"error"] = exception.name ?: @"unknown_render_exception";
    }
    complete = complete && [record[@"png_written"] boolValue];
    [images addObject:record];
  }
  result[@"pngs"] = images;
  result[@"png_write_complete"] = @(complete);
  return result;
}
static void PieceObservedSelectedCall(id module, SEL command, NSNumber *tag, NSString *text, double fontSize,
                                     RCTPromiseResolveBlock resolve, RCTPromiseRejectBlock reject) {
  PieceSelectedCall original = PieceOriginalSelectedCall;
  BOOL target = [text isEqualToString:@"مرحبا بالعالم"] && (fontSize == 72 || fontSize == 64 || fontSize == 56);
  if (!target) { original(module, command, tag, text, fontSize, resolve, reject); return; }
  NSMutableArray *sink = PieceArabicObservations;
  NSUInteger ordinal = ++PieceArabicOperationOrdinal;
  RCTPromiseResolveBlock observedResolve = ^(id wire) {
    @try {
      CFTimeInterval start = CACurrentMediaTime();
      NSDictionary *before = PieceReadArabicGeometry(module, tag, text, fontSize, ordinal, wire);
      NSMutableDictionary *sample = [before mutableCopy];
      if (!before[@"observation_error"]) {
        RCTBridge *bridge = [(id<RCTBridgeModule>)module bridge];
        UIView *rawView = [bridge.uiManager viewForReactTag:tag];
        if ([rawView isKindOfClass:RCTTextView.class]) {
          RCTTextView *view = (RCTTextView *)rawView;
          NSTextStorage *storage = view.cocolonPieceTextStorage;
          NSAttributedString *attributesBefore = [storage copy];
          NSDictionary *drawing = PieceDrawArabicDiagnostic(view, fontSize, ordinal);
          NSDictionary *after = PieceReadArabicGeometry(module, tag, text, fontSize, ordinal, wire);
          sample[@"offscreen_diagnostic"] = drawing;
          sample[@"state_after"] = after;
          sample[@"geometry_unchanged"] = @([before isEqualToDictionary:after]);
          sample[@"attributed_storage_unchanged"] = @(attributesBefore != nil && storage == view.cocolonPieceTextStorage &&
            [attributesBefore isEqualToAttributedString:storage]);
        } else {
          sample[@"offscreen_diagnostic"] = @{ @"diagnostic_only": @YES, @"error": @"original_text_view_disappeared",
                                              @"png_write_complete": @NO };
        }
      }
      sample[@"observation_ms"] = PieceFinite((CACurrentMediaTime() - start) * 1000);
      if ([NSJSONSerialization isValidJSONObject:sample]) [sink addObject:sample];
    } @catch (NSException *exception) {
      @try { [sink addObject:@{ @"operation": @(ordinal), @"font_size": PieceFinite(fontSize),
        @"observation_error": exception.name ?: @"unknown_exception" }]; } @catch (__unused NSException *ignored) {}
    }
    resolve(wire);
  };
  original(module, command, tag, text, fontSize, observedResolve, reject);
}

static NSString *PieceEvidenceDirectory(void) {
  NSString *dir = [NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, YES).firstObject stringByAppendingPathComponent:@"piece-rn-canvas"];
  [NSFileManager.defaultManager createDirectoryAtPath:dir withIntermediateDirectories:YES attributes:nil error:nil];
  return dir;
}


// Independent oracle for final canvas-phase alpha. Fixed raw RGBA storage;
// it does not call the product rasterizer or use the product's extent/ink.
static NSArray *PieceCanvasPixelOracle(RCTTextView *view, UIView *canvas) {
  const size_t width = 1536, height = 512, stride = width * 4;
  const CGFloat pad = 160;
  CGPoint origin = [view convertPoint:CGPointZero toView:canvas];
  CGFloat px = origin.x - floor(origin.x), py = origin.y - floor(origin.y);
  UInt8 *bytes = calloc(height, stride);
  CGColorSpaceRef space = CGColorSpaceCreateWithName(kCGColorSpaceSRGB);
  CGContextRef context = bytes && space ? CGBitmapContextCreate(bytes, width, height, 8, stride, space,
    kCGBitmapByteOrder32Big | kCGImageAlphaPremultipliedLast) : NULL;
  if (space) CGColorSpaceRelease(space);
  if (!context) { free(bytes); return nil; }
  NSArray *result = nil;
  @try {
    CGContextTranslateCTM(context, 0, height); CGContextScaleCTM(context, 1, -1);
    CGContextTranslateCTM(context, pad + px, pad + py);
    UIGraphicsPushContext(context);
    @try {
      NSLayoutManager *layout = view.cocolonPieceTextStorage.layoutManagers.firstObject;
      [layout drawGlyphsForGlyphRange:[layout glyphRangeForTextContainer:layout.textContainers.firstObject]
        atPoint:view.cocolonPieceContentFrame.origin];
    } @finally { UIGraphicsPopContext(); }
    size_t l = width, t = height, r = 0, b = 0; BOOL seen = NO, edge = NO;
    for (size_t y = 0; y < height; y++) for (size_t x = 0; x < width; x++) if (bytes[y * stride + x * 4 + 3]) {
      seen = YES; l = MIN(l, x); t = MIN(t, y); r = MAX(r, x); b = MAX(b, y);
      edge = edge || x == 0 || y == 0 || x + 1 == width || y + 1 == height;
    }
    if (seen && !edge) result = @[@(l + floor(origin.x) - pad - origin.x), @(t + floor(origin.y) - pad - origin.y),
      @(r + 1 + floor(origin.x) - pad - origin.x), @(b + 1 + floor(origin.y) - pad - origin.y)];
  } @finally { CGContextRelease(context); free(bytes); }
  return result;
}
typedef void (*PieceSelectedV2Call)(id, SEL, NSNumber *, NSString *, double, NSDictionary *,
                                  RCTPromiseResolveBlock, RCTPromiseRejectBlock);
static PieceSelectedV2Call PieceOriginalSelectedV2Call;
// Read the model-layer state at the original placed callback. In particular,
// nil public contents is NOT evidence that Core Animation has no backing.
// Never force layout/display/drawing, decode a private backing, or change wire.
static NSDictionary *PiecePlacedLayerState(RCTTextView *view, UIView *canvas) {
  CALayer *layer = view.layer;
  id contents = layer.contents;
  CGPoint origin = [view convertPoint:CGPointZero toView:canvas];
  NSMutableArray *ancestors = [NSMutableArray new];
  for (UIView *ancestor = view; ancestor; ancestor = ancestor.superview) {
    [ancestors addObject:@{
      @"view_identity": [NSString stringWithFormat:@"%p", (__bridge void *)ancestor],
      @"class": NSStringFromClass(ancestor.class), @"hidden": @(ancestor.hidden),
      @"alpha": PieceFinite(ancestor.alpha), @"layer_opacity": PieceFinite(ancestor.layer.opacity),
      @"bounds": PieceRect(ancestor.bounds), @"frame": PieceRect(ancestor.frame),
      @"is_canvas": @(ancestor == canvas)
    }];
  }
  return @{
    @"view_identity": [NSString stringWithFormat:@"%p", (__bridge void *)view],
    @"canvas_identity": [NSString stringWithFormat:@"%p", (__bridge void *)canvas],
    @"window_identity": [NSString stringWithFormat:@"%p", (__bridge void *)view.window],
    @"same_window": @(view.window != nil && view.window == canvas.window),
    @"descendant_of_canvas": @([view isDescendantOfView:canvas]),
    @"view_bounds": PieceRect(view.bounds), @"view_frame": PieceRect(view.frame),
    @"content_frame": PieceRect(view.cocolonPieceContentFrame),
    @"canvas_frame": @[PieceFinite(origin.x), PieceFinite(origin.y),
      PieceFinite(view.bounds.size.width), PieceFinite(view.bounds.size.height)],
    @"view_content_scale_factor": PieceFinite(view.contentScaleFactor),
    @"layer_identity": [NSString stringWithFormat:@"%p", (__bridge void *)layer],
    @"layer_bounds": PieceRect(layer.bounds),
    @"layer_position": @[PieceFinite(layer.position.x), PieceFinite(layer.position.y)],
    @"layer_anchor_point": @[PieceFinite(layer.anchorPoint.x), PieceFinite(layer.anchorPoint.y)],
    @"layer_contents_scale": PieceFinite(layer.contentsScale),
    @"layer_contents_rect": PieceRect(layer.contentsRect),
    @"layer_contents_center": PieceRect(layer.contentsCenter),
    @"layer_contents_gravity": layer.contentsGravity ?: @"",
    @"layer_opacity": PieceFinite(layer.opacity), @"layer_hidden": @(layer.hidden),
    @"layer_needs_display": @(layer.needsDisplay), @"layer_needs_layout": @(layer.needsLayout),
    @"public_contents_state": contents ? @"nonnull_opaque_pixel_unobserved" : @"nil_pixel_unobserved",
    @"public_contents_identity": contents ? [NSString stringWithFormat:@"%p", (__bridge void *)contents] : (id)NSNull.null,
    @"public_contents_class": contents ? NSStringFromClass(object_getClass(contents)) : (id)NSNull.null,
    @"ancestors": ancestors
  };
}
// External composition of the existing Text layer, not a backing-store read or
// physical-screen capture. Never force display/layout or alter ancestor alpha.
static NSDictionary *PieceCompositePlacedLayer(RCTTextView *view, UIView *canvas,
                                               NSUInteger ordinal, double expiresAt) {
  const size_t width = 1536, height = 512, stride = 6144;
  const CGFloat pad = 160;
  CALayer *layer = view.layer;
  CGPoint origin = [view convertPoint:CGPointZero toView:canvas];
  CGFloat px = origin.x - floor(origin.x), py = origin.y - floor(origin.y);
  NSMutableDictionary *sample = [@{
    @"diagnostic_only": @YES, @"method": @"same_text_layer_renderInContext",
    @"bypasses_ancestor_visibility": @YES, @"physical_screen_equivalence": @NO,
    @"backing_bytes_directly_read": @NO, @"composite_performed": @NO,
    @"raw_written": @NO, @"width": @(width), @"height": @(height),
    @"stride": @(stride), @"format": @"RGBA8_sRGB_premultiplied_last_big_endian",
    @"raster_scale": @1, @"pad": @(pad),
    @"phase": @[PieceFinite(px), PieceFinite(py)]
  } mutableCopy];
  BOOL plain = layer.sublayers.count == 0 && layer.mask == nil &&
    layer.borderWidth == 0 && layer.shadowOpacity == 0 &&
    (!layer.backgroundColor || CGColorGetAlpha(layer.backgroundColor) == 0) &&
    CATransform3DIsIdentity(layer.transform) && CATransform3DIsIdentity(layer.sublayerTransform) &&
    CGPointEqualToPoint(view.bounds.origin, CGPointZero) && view.alpha == 1 && !view.hidden &&
    layer.opacity == 1 && !layer.hidden;
  sample[@"plain_layer"] = @(plain);
  if (!plain || !layer.contents || layer.needsDisplay || layer.needsLayout ||
      !PiecePositiveFiniteRect(view.bounds) || !isfinite(px) || !isfinite(py) ||
      !isfinite(expiresAt) || expiresAt <= NSDate.date.timeIntervalSince1970 * 1000) {
    sample[@"diagnostic_error"] = @"layer_or_deadline_prerequisite_not_met"; return sample;
  }
  UInt8 *bytes = calloc(height, stride);
  CGColorSpaceRef space = CGColorSpaceCreateWithName(kCGColorSpaceSRGB);
  CGContextRef context = bytes && space ? CGBitmapContextCreate(bytes, width, height, 8, stride, space,
    kCGBitmapByteOrder32Big | kCGImageAlphaPremultipliedLast) : NULL;
  if (space) CGColorSpaceRelease(space);
  if (!context) { free(bytes); sample[@"diagnostic_error"] = @"allocation"; return sample; }
  @try {
    CGContextTranslateCTM(context, 0, height); CGContextScaleCTM(context, 1, -1);
    CGContextTranslateCTM(context, pad + px, pad + py);
    CGAffineTransform ctm = CGContextGetCTM(context);
    sample[@"ctm"] = @[PieceFinite(ctm.a), PieceFinite(ctm.b), PieceFinite(ctm.c),
      PieceFinite(ctm.d), PieceFinite(ctm.tx), PieceFinite(ctm.ty)];
    [layer renderInContext:context];
    sample[@"composite_performed"] = @YES;
    // A bounded copy owns its bytes independently of the context's allocation.
    @autoreleasepool {
      NSData *raw = [[NSData alloc] initWithBytes:bytes length:height * stride];
      NSString *filename = [NSString stringWithFormat:@"arabic-placed-layer-%lu-72.rgba", (unsigned long)ordinal];
      NSError *error = nil;
      BOOL written = [raw writeToFile:[PieceEvidenceDirectory() stringByAppendingPathComponent:filename]
                             options:NSDataWritingAtomic error:&error];
      sample[@"raw_filename"] = filename; sample[@"raw_bytes"] = @(raw.length);
      sample[@"raw_written"] = @(written);
      if (!written) sample[@"diagnostic_error"] = @"raw_write_failed";
    }
    size_t l = width, t = height, r = 0, b = 0; BOOL seen = NO, edge = NO;
    for (size_t y = 0; y < height; y++) for (size_t x = 0; x < width; x++) if (bytes[y * stride + x * 4 + 3]) {
      seen = YES; l = MIN(l, x); t = MIN(t, y); r = MAX(r, x); b = MAX(b, y);
      edge = edge || x == 0 || y == 0 || x + 1 == width || y + 1 == height;
    }
    sample[@"empty"] = @(!seen); sample[@"edge_reached"] = @(edge);
    if (seen && !edge) sample[@"ink_local"] = @[@(l - pad - px), @(t - pad - py),
      @(r + 1 - pad - px), @(b + 1 - pad - py)];
    else sample[@"diagnostic_error"] = seen ? @"edge" : @"empty";
  } @catch (NSException *exception) {
    sample[@"diagnostic_error"] = exception.name ?: @"render_exception";
  } @finally { CGContextRelease(context); free(bytes); }
  return sample;
}
static NSDictionary *PieceReadPlacedLayer(id module, NSNumber *tag, NSString *text,
                                         double fontSize, NSUInteger ordinal, NSDictionary *request, id wire) {
  const CFTimeInterval began = CACurrentMediaTime();
  NSMutableDictionary *sample = [@{
    @"diagnostic_only": @YES, @"phase": @"placed_callback_pre_geometry_pre_resolve",
    @"callback_unix_ms": PieceFinite(NSDate.date.timeIntervalSince1970 * 1000),
    @"callback_monotonic_seconds": PieceFinite(began), @"main_thread": @(NSThread.isMainThread),
    @"request": request ?: @{}, @"pixel_observation": @"NOT_PERFORMED"
  } mutableCopy];
  if (!NSThread.isMainThread || ![wire isKindOfClass:NSDictionary.class]) {
    sample[@"observation_error"] = @"invalid_callback_context"; return sample;
  }
  RCTBridge *bridge = [(id<RCTBridgeModule>)module bridge];
  UIView *rawView = [bridge.uiManager viewForReactTag:tag];
  NSNumber *canvasTag = request[@"canvas_tag"];
  UIView *canvas = [canvasTag isKindOfClass:NSNumber.class] ? [bridge.uiManager viewForReactTag:canvasTag] : nil;
  if (![rawView isKindOfClass:RCTTextView.class] || !canvas) {
    sample[@"observation_error"] = @"original_node_unavailable"; return sample;
  }
  RCTTextView *view = (RCTTextView *)rawView;
  // The first contents read precedes the existing geometry/glyph observer.
  NSDictionary *before = PiecePlacedLayerState(view, canvas);
  NSTextStorage *storage = view.cocolonPieceTextStorage;
  NSLayoutManager *layout = storage.layoutManagers.firstObject;
  NSTextContainer *container = layout.textContainers.firstObject;
  sample[@"state_before"] = before;
  sample[@"storage_identity"] = [NSString stringWithFormat:@"%p", (__bridge void *)storage];
  sample[@"layout_identity"] = [NSString stringWithFormat:@"%p", (__bridge void *)layout];
  sample[@"container_identity"] = [NSString stringWithFormat:@"%p", (__bridge void *)container];
  sample[@"text_matches"] = @([storage.string isEqualToString:text]);
  sample[@"request_wire_identity_matches"] = @([wire[@"tag"] isEqual:tag] &&
    [wire[@"canvas_tag"] isEqual:canvasTag] &&
    [wire[@"snapshot_token"] isEqual:request[@"snapshot_token"]] &&
    [wire[@"stage"] isEqual:@"placed"] && [request[@"stage"] isEqual:@"placed"]);
  sample[@"wire_canvas_frame_matches"] = @([wire[@"canvas_frame"] isEqual:before[@"canvas_frame"]]);
  sample[@"remaining_deadline_ms"] = PieceFinite([request[@"expires_at_ms"] doubleValue] -
    NSDate.date.timeIntervalSince1970 * 1000);
  id originalContents = view.layer.contents;
  NSDictionary *composite = nil;
  if (!PiecePlacedCompositeAttempted && fontSize == 72 && layout && container && [sample[@"text_matches"] boolValue] &&
      [sample[@"request_wire_identity_matches"] boolValue] && [sample[@"wire_canvas_frame_matches"] boolValue] &&
      [before[@"same_window"] boolValue] && [before[@"descendant_of_canvas"] boolValue]) {
    PiecePlacedCompositeAttempted = YES;
    composite = PieceCompositePlacedLayer(view, canvas, ordinal, [request[@"expires_at_ms"] doubleValue]);
    sample[@"layer_composite"] = composite;
    if ([composite[@"composite_performed"] boolValue]) sample[@"pixel_observation"] = @"EXTERNAL_LAYER_COMPOSITE_ONLY";
  }
  NSDictionary *after = PiecePlacedLayerState(view, canvas);
  sample[@"state_after"] = after;
  sample[@"state_unchanged"] = @([before isEqualToDictionary:after] &&
    view == [bridge.uiManager viewForReactTag:tag] && canvas == [bridge.uiManager viewForReactTag:canvasTag] &&
    storage == view.cocolonPieceTextStorage && layout == storage.layoutManagers.firstObject &&
    container == layout.textContainers.firstObject && originalContents == view.layer.contents);
  double remainingAfter = [request[@"expires_at_ms"] doubleValue] - NSDate.date.timeIntervalSince1970 * 1000;
  sample[@"remaining_deadline_after_ms"] = PieceFinite(remainingAfter);
  if (composite) sample[@"external_composite_valid"] = @([sample[@"state_unchanged"] boolValue] &&
    isfinite(remainingAfter) && remainingAfter > 0 && [composite[@"composite_performed"] boolValue] &&
    [composite[@"raw_written"] boolValue] && !composite[@"diagnostic_error"]);
  sample[@"observation_ms"] = PieceFinite((CACurrentMediaTime() - began) * 1000);
  return sample;
}
static void PieceObservedSelectedV2Call(id module, SEL selector, NSNumber *tag, NSString *text,
                                      double fontSize, NSDictionary *request,
                                      RCTPromiseResolveBlock resolve, RCTPromiseRejectBlock reject) {
  if (![text isEqual:@"مرحبا بالعالم"] || (fontSize != 72 && fontSize != 64 && fontSize != 56)) {
    PieceOriginalSelectedV2Call(module, selector, tag, text, fontSize, request, resolve, reject); return;
  }
  NSUInteger ordinal = ++PieceArabicOperationOrdinal;
  PieceOriginalSelectedV2Call(module, selector, tag, text, fontSize, request, ^(id wire) {
    NSDictionary *placedLayer = nil;
    if ([request[@"stage"] isEqual:@"placed"]) {
      @try { placedLayer = PieceReadPlacedLayer(module, tag, text, fontSize, ordinal, request, wire); }
      @catch (NSException *exception) {
        placedLayer = @{ @"diagnostic_only": @YES, @"pixel_observation": @"NOT_PERFORMED",
          @"observation_error": exception.name ?: @"unknown_exception" };
      }
    }
    NSMutableDictionary *sample = [PieceReadArabicGeometry(module, tag, text, fontSize, ordinal, wire) mutableCopy];
    if (placedLayer) sample[@"placed_layer_observation"] = placedLayer;
    sample[@"stage"] = request[@"stage"] ?: NSNull.null;
    sample[@"observation_only"] = @YES;
    [PieceArabicObservations addObject:sample];
    resolve(wire);
  }, ^(NSString *code, NSString *message, NSError *error) {
    [PieceArabicObservations addObject:@{@"operation":@(ordinal), @"stage":request[@"stage"] ?: NSNull.null,
      @"font_size":@(fontSize), @"rejection":code ?: @"missing_code"}];
    reject(code, message, error);
  });
}


static NSString *const PieceContainmentProfile = @"piece.rn_native_preview.containment.prototype.v1";
static NSString *PieceClipTrapText = @"Controlled native clip trap";
typedef void (*PiecePaintCall)(RCTTextView *, SEL, NSRange);
typedef void (*PieceDrawRectCall)(RCTTextView *, SEL, CGRect);
static PiecePaintCall PieceOriginalPaint;
static PieceDrawRectCall PieceOriginalDrawRect;
static BOOL PieceInsideNaturalDraw;
static NSMutableArray *PiecePaintContexts;
static NSMutableSet *PiecePaintContextKeys;
static void PieceObservePaintContext(RCTTextView *view, NSString *kind) {
  CGContextRef cg=UIGraphicsGetCurrentContext(); if (!cg) return;
  NSString *identity=[NSString stringWithFormat:@"%p",(__bridge void *)view];
  NSString *storageIdentity=[NSString stringWithFormat:@"%p",(__bridge void*)view.cocolonPieceTextStorage];
  NSString *key=[NSString stringWithFormat:@"%@|%@|%@|%@|%@|%@",identity,kind,view.reactTag,storageIdentity,PieceRect(view.bounds),PieceRect(view.cocolonPieceContentFrame)];
  if ([PiecePaintContextKeys containsObject:key]) return;
  [PiecePaintContextKeys addObject:key];
  CGAffineTransform ctm=CGContextGetCTM(cg);
  [PiecePaintContexts addObject:@{@"view_identity":identity,@"kind":kind,@"tag":view.reactTag?:NSNull.null,@"storage_identity":storageIdentity,
    @"text":view.cocolonPieceTextStorage.string?:@"",@"bounds":PieceRect(view.bounds),
    @"content_frame":PieceRect(view.cocolonPieceContentFrame),@"view_scale":PieceFinite(view.contentScaleFactor),
    @"layer_scale":PieceFinite(view.layer.contentsScale),@"ctm":@[PieceFinite(ctm.a),PieceFinite(ctm.b),PieceFinite(ctm.c),PieceFinite(ctm.d),PieceFinite(ctm.tx),PieceFinite(ctm.ty)],
    @"clip":PieceRect(CGContextGetClipBoundingBox(cg)),@"view_alpha":PieceFinite(view.alpha),@"layer_opacity":PieceFinite(view.layer.opacity)}];
}
static void PieceObservedNaturalDraw(RCTTextView *view, SEL cmd, CGRect rect) {
  BOOL before=PieceInsideNaturalDraw; PieceInsideNaturalDraw=YES;
  @try { PieceObservePaintContext(view,@"natural_drawRect_pre_paint"); PieceOriginalDrawRect(view,cmd,rect); }
  @finally { PieceInsideNaturalDraw=before; }
}
static void PieceObservedSharedPaint(RCTTextView *view, SEL cmd, NSRange glyphs) {
  PieceObservePaintContext(view,PieceInsideNaturalDraw?@"natural_shared_paint":@"reference_shared_paint");
  PieceOriginalPaint(view,cmd,glyphs);
  CGContextRef cg=UIGraphicsGetCurrentContext();
  CGAffineTransform ctm=cg?CGContextGetCTM(cg):CGAffineTransformIdentity;
  if ([view.cocolonPieceTextStorage.string isEqual:PieceClipTrapText] && cg && fabs(ctm.a)>1) {
    CGFloat scale=fabs(ctm.a);
    CGContextSaveGState(cg); CGContextSetRGBFillColor(cg,0,0,0,1);
    CGContextFillRect(cg,CGRectMake(view.cocolonPieceContentFrame.origin.x+4,-1/scale,1/scale,1/scale));
    CGContextRestoreGState(cg);
  }
}
// Independent layer alpha uses the historical fixed raw oracle geometry. No
// product extent/union is reused, and the actual Text is never modified.
static NSArray *PieceCanvasLayerOracle(RCTTextView *view, UIView *canvas) {
  const size_t width=1536,height=512,stride=6144; const CGFloat pad=160;
  CGPoint origin=[view convertPoint:CGPointZero toView:canvas];
  CGFloat px=origin.x-floor(origin.x),py=origin.y-floor(origin.y);
  UInt8 *bytes=calloc(height,stride); CGColorSpaceRef space=CGColorSpaceCreateWithName(kCGColorSpaceSRGB);
  CGContextRef cg=bytes&&space?CGBitmapContextCreate(bytes,width,height,8,stride,space,kCGBitmapByteOrder32Big|kCGImageAlphaPremultipliedLast):NULL;
  if(space)CGColorSpaceRelease(space); if(!cg){free(bytes);return nil;}
  NSArray *answer=nil;
  @try{
    CGContextTranslateCTM(cg,0,height);CGContextScaleCTM(cg,1,-1);CGContextTranslateCTM(cg,pad+px,pad+py);
    [view.layer renderInContext:cg];
    size_t l=width,t=height,r=0,b=0;BOOL seen=NO,edge=NO;
    for(size_t y=0;y<height;y++)for(size_t x=0;x<width;x++)if(bytes[y*stride+x*4+3]){
      seen=YES;l=MIN(l,x);t=MIN(t,y);r=MAX(r,x);b=MAX(b,y);edge=edge||x==0||y==0||x+1==width||y+1==height;
    }
    if(seen&&!edge)answer=@[@(l-pad-px),@(t-pad-py),@(r+1-pad-px),@(b+1-pad-py)];
  }@finally{CGContextRelease(cg);free(bytes);}return answer;
}
static NSArray *PieceComponentUnion(NSDictionary *parts) {
  NSArray*a=parts[@"direct"],*b=parts[@"native"],*c=parts[@"layer"];if(parts.count!=3||a.count!=4||b.count!=4||c.count!=4)return nil;
  return @[@(fmin([a[0]doubleValue],fmin([b[0]doubleValue],[c[0]doubleValue]))),@(fmin([a[1]doubleValue],fmin([b[1]doubleValue],[c[1]doubleValue]))),
    @(fmax([a[2]doubleValue],fmax([b[2]doubleValue],[c[2]doubleValue]))),@(fmax([a[3]doubleValue],fmax([b[3]doubleValue],[c[3]doubleValue])))];
}

@interface PieceCanvasTest : NSObject <RCTBridgeModule>
@property(nonatomic, weak) RCTBridge *bridge;
@property(nonatomic, strong) NSMutableArray *reports;
@property(nonatomic, copy) dispatch_block_t completed;
@end
@implementation PieceCanvasTest
RCT_EXPORT_MODULE();
@synthesize bridge = _bridge;
+ (BOOL)requiresMainQueueSetup { return NO; }
- (dispatch_queue_t)methodQueue { return RCTGetUIManagerQueue(); }
- (void)saveReport:(NSDictionary *)report {
  if ([report[@"name"] isEqual:@"suffix_arabic"]) {
    NSMutableDictionary *observed = [report mutableCopy];
    observed[@"native_selected_observations"] = [PieceArabicObservations copy] ?: @[];
    report = observed;
  }
  [self.reports addObject:report];
  NSData *data = [NSJSONSerialization dataWithJSONObject:self.reports options:NSJSONWritingPrettyPrinted error:nil];
  [data writeToFile:[PieceEvidenceDirectory() stringByAppendingPathComponent:@"results.json"] atomically:YES];
  NSLog(@"PIECE_RN_CASE %@", [[NSString alloc] initWithData:[NSJSONSerialization dataWithJSONObject:report options:0 error:nil] encoding:NSUTF8StringEncoding]);
}
RCT_EXPORT_METHOD(record:(NSDictionary *)report) {
  dispatch_async(dispatch_get_main_queue(), ^{ [self saveReport:report]; });
}
- (void)collectText:(UIView *)view into:(NSMutableArray *)texts {
  if ([view isKindOfClass:RCTTextView.class]) [texts addObject:view];
  for (UIView *child in view.subviews) [self collectText:child into:texts];
}
RCT_EXPORT_METHOD(capture:(nonnull NSNumber *)tag report:(NSDictionary *)raw resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
  [self.bridge.uiManager addUIBlock:^(__unused RCTUIManager *manager, NSDictionary<NSNumber *,UIView *> *registry) {
    UIView *canvas = tag ? registry[tag] : nil;
    NSMutableDictionary *report = [raw mutableCopy];
    BOOL valid = canvas && canvas.window && !canvas.hidden && canvas.alpha == 1 &&
      fabs(canvas.bounds.size.width - [raw[@"width"] doubleValue]) < 0.01 &&
      fabs(canvas.bounds.size.height - [raw[@"height"] doubleValue]) < 0.01;
    NSMutableArray *texts = [NSMutableArray new], *actual = [NSMutableArray new], *frames = [NSMutableArray new], *geometry = [NSMutableArray new];
    if (canvas) [self collectText:canvas into:texts];
    NSArray *rows = raw[@"rows"];
    valid = valid && texts.count == rows.count + ([raw[@"branding"] boolValue] ? 1 : 0);
    for (NSUInteger i = 0; i < texts.count; i++) {
      RCTTextView *view = texts[i];
      NSTextStorage *storage = [view cocolonPieceTextStorage];
      [actual addObject:storage.string ?: @""];
      NSString *expected = i < rows.count ? rows[i] : @"Cocolon";
      valid = valid && [storage.string isEqualToString:expected] && view.window && !view.hidden && view.alpha > 0;
      NSLayoutManager *layout = storage.layoutManagers.firstObject;
      NSTextContainer *container = layout.textContainers.firstObject;
      CGRect contentFrame = view.cocolonPieceContentFrame;
      [geometry addObject:@{ @"view_size": @[@(view.bounds.size.width), @(view.bounds.size.height)],
        @"content_frame": @[@(contentFrame.origin.x), @(contentFrame.origin.y), @(contentFrame.size.width), @(contentFrame.size.height)],
        @"container_size": @[@(container.size.width), @(container.size.height)] }];
      if (i < rows.count && [raw[@"candidate_profile"] isEqual:@"piece.rn_native_preview.prototype.v6"]) {
        valid = valid && fabs(view.bounds.size.width - [raw[@"width"] doubleValue]) < 0.01 &&
          fabs(contentFrame.origin.x - [raw[@"margin"] doubleValue]) < 0.01 && fabs(contentFrame.origin.y) < 0.01 &&
          fabs(contentFrame.size.width - [raw[@"content_width"] doubleValue]) < 0.01 &&
          fabs(contentFrame.size.height - [raw[@"plan_line_height"] doubleValue]) < 0.01 &&
          fabs(container.size.width - contentFrame.size.width) < 0.01 && fabs(container.size.height - contentFrame.size.height) < 0.01;
      }
      if (i < rows.count && [@[@"piece.rn_native_preview.prototype.v7", @"piece.rn_native_preview.prototype.v8", @"piece.rn_native_preview.prototype.v9", PieceContainmentProfile] containsObject:raw[@"candidate_profile"]]) {
        valid = valid && fabs(view.bounds.size.width - [raw[@"width"] doubleValue]) < 0.01 &&
          fabs(contentFrame.origin.x - [raw[@"margin"] doubleValue]) < 0.01 && fabs(contentFrame.origin.y) < 0.01 &&
          fabs(contentFrame.size.width - [raw[@"content_width"] doubleValue]) < 0.01 &&
          fabs(view.bounds.size.height - contentFrame.size.height) < 0.01 &&
          fabs(contentFrame.size.height - [raw[@"plan_line_height"] doubleValue]) <= 0.5 &&
          fabs(container.size.width - contentFrame.size.width) < 0.01 && fabs(container.size.height - contentFrame.size.height) < 0.01;
      }
      [layout ensureLayoutForTextContainer:container];
      NSRange glyphs = [layout glyphRangeForTextContainer:container];
      CGRect localInk = CGRectOffset([layout boundingRectForGlyphRange:glyphs inTextContainer:container],
        view.cocolonPieceContentFrame.origin.x, view.cocolonPieceContentFrame.origin.y);
      if ([raw[@"candidate_profile"] isEqual:@"piece.rn_native_preview.prototype.v9"]) {
        NSArray *oracle = PieceCanvasPixelOracle(view, canvas);
        localInk = oracle.count == 4 ? CGRectMake([oracle[0] doubleValue], [oracle[1] doubleValue],
          [oracle[2] doubleValue] - [oracle[0] doubleValue], [oracle[3] doubleValue] - [oracle[1] doubleValue]) : CGRectNull;
        NSDictionary *evidence = i < [raw[@"inspection"] count] ? raw[@"inspection"][i] : nil;
        NSArray *observed = evidence[@"ink"], *observedFrame = evidence[@"canvasFrame"];
        CGRect actualFrame = (CGRect){[view convertPoint:CGPointZero toView:canvas], view.bounds.size};
        valid = valid && PiecePositiveFiniteRect(localInk) && observed.count == 4 && observedFrame.count == 4 &&
          [evidence[@"stage"] isEqual:@"placed"] && [evidence[@"tag"] isEqual:view.reactTag] && [evidence[@"canvasTag"] isEqual:tag];
        if (observed.count == 4 && observedFrame.count == 4) {
          valid = valid && [observed isEqual:oracle] &&
            [observedFrame isEqual:PieceRect(actualFrame)] && CGRectGetHeight(localInk) <= (i < rows.count ? [raw[@"plan_line_height"] doubleValue] : 40);
        }
      }
      if ([raw[@"candidate_profile"] isEqual:PieceContainmentProfile]) {
        NSDictionary *evidence=i<[raw[@"inspection"] count]?raw[@"inspection"][i]:nil;
        NSDictionary *parts=evidence[@"componentInks"];
        NSArray *ink=evidence[@"ink"],*direct=PieceCanvasPixelOracle(view,canvas),*layer=PieceCanvasLayerOracle(view,canvas);
        BOOL trap=[raw[@"native_clip_trap_synthetic"] boolValue];
        CGRect actualFrame=(CGRect){[view convertPoint:CGPointZero toView:canvas],view.bounds.size};
        BOOL componentValid=[evidence[@"version"] isEqual:@"piece.native_selected_line.v3"]&&
          [ink isEqual:PieceComponentUnion(parts)]&&[parts[@"direct"] isEqual:direct]&&[parts[@"layer"] isEqual:layer]&&
          [evidence[@"nativeRasterScale"] doubleValue]==view.contentScaleFactor&&view.contentScaleFactor==view.layer.contentsScale&&
          [evidence[@"tag"]isEqual:view.reactTag]&&[evidence[@"canvasTag"]isEqual:tag]&&
          [evidence[@"canvasFrame"]isEqual:PieceRect(actualFrame)]&&[evidence[@"stage"]isEqual:trap?@"local":@"placed"];
        valid=valid&&componentValid;
        if(trap){
          report[@"native_clip_trap_capture_verified"]=@(componentValid&&[parts[@"direct"][1]doubleValue]>=0&&[parts[@"layer"][1]doubleValue]>=0&&[parts[@"native"][1]doubleValue]<0&&[evidence[@"overflow"]boolValue]);
        }
        localInk=ink.count==4?CGRectMake([ink[0]doubleValue],[ink[1]doubleValue],[ink[2]doubleValue]-[ink[0]doubleValue],[ink[3]doubleValue]-[ink[1]doubleValue]):CGRectNull;
      }
      if (i < rows.count && [@[@"piece.rn_native_preview.prototype.v7", @"piece.rn_native_preview.prototype.v8", @"piece.rn_native_preview.prototype.v9", PieceContainmentProfile] containsObject:raw[@"candidate_profile"]])
        valid = valid && CGRectGetHeight(localInk) <= [raw[@"plan_line_height"] doubleValue];
      CGRect ink = [view convertRect:localInk toView:canvas];
      [frames addObject:@[@(ink.origin.x), @(ink.origin.y), @(CGRectGetMaxX(ink)), @(CGRectGetMaxY(ink))]];
      CGFloat margin = [raw[@"margin"] doubleValue], height = [raw[@"height"] doubleValue];
      CGFloat bottom = height - margin - (i < rows.count ? [raw[@"branding_zone"] doubleValue] : 0);
      valid = valid && CGRectContainsRect(view.bounds, localInk) && CGRectGetMinX(ink) >= margin - 0.5 &&
        CGRectGetMaxX(ink) <= canvas.bounds.size.width - margin + 0.5 && CGRectGetMinY(ink) >= margin - 0.5 && CGRectGetMaxY(ink) <= bottom + 0.5;
    }
    report[@"native_texts"] = actual; report[@"native_ink_frames"] = frames; report[@"native_canvas_valid"] = @(valid);
    report[@"native_text_geometry"] = geometry;
    NSMutableArray *paintContexts=[NSMutableArray new],*opacityFacts=[NSMutableArray new];
    for(RCTTextView *view in texts){
      NSString *identity=[NSString stringWithFormat:@"%p",(__bridge void*)view];
      NSString *storageIdentity=[NSString stringWithFormat:@"%p",(__bridge void*)view.cocolonPieceTextStorage];
      for(NSDictionary *p in PiecePaintContexts)if([p[@"view_identity"] isEqual:identity]&&[p[@"storage_identity"] isEqual:storageIdentity]&&[p[@"tag"] isEqual:view.reactTag]&&[p[@"bounds"] isEqual:PieceRect(view.bounds)]&&[p[@"content_frame"] isEqual:PieceRect(view.cocolonPieceContentFrame)])[paintContexts addObject:p];
      [opacityFacts addObject:@{@"text":view.cocolonPieceTextStorage.string?:@"",@"view_alpha":PieceFinite(view.alpha),@"layer_opacity":PieceFinite(view.layer.opacity)}];
    }
    report[@"natural_and_reference_paint_contexts"]=paintContexts;report[@"native_opacity_facts"]=opacityFacts;
    if (canvas && canvas.bounds.size.width > 0 && canvas.bounds.size.height > 0) {
      UIGraphicsImageRendererFormat *format = [UIGraphicsImageRendererFormat defaultFormat];
      format.scale = 1; format.opaque = YES;
      UIGraphicsImageRenderer *renderer = [[UIGraphicsImageRenderer alloc] initWithSize:canvas.bounds.size format:format];
      UIImage *image = [renderer imageWithActions:^(UIGraphicsImageRendererContext *ctx) { [canvas.layer renderInContext:ctx.CGContext]; }];
      NSString *name = [raw[@"name"] stringByAppendingString:@".png"];
      [UIImagePNGRepresentation(image) writeToFile:[PieceEvidenceDirectory() stringByAppendingPathComponent:name] atomically:YES];
      report[@"png"] = name;
    }
    // Observe the unresolved Arabic layer/direct-glyph boundary difference
    // only after the original canvas PNG. Never change its image, elapsed
    // time, oracle, validity, mounted views or acceptance assertions.
    if ([raw[@"name"] isEqual:@"suffix_arabic"] && report[@"png"] && texts.count > 0) {
      RCTTextView *view = texts.firstObject;
      CGPoint origin = [view convertPoint:CGPointZero toView:canvas];
      CGAffineTransform canvasTransform = canvas.transform;
      NSMutableDictionary *diagnostic = [@{
        @"diagnostic_only": @YES, @"observed_after_original_png": @YES,
        @"view_content_scale_factor": PieceFinite(view.contentScaleFactor),
        @"layer_contents_scale": PieceFinite(view.layer.contentsScale),
        @"screen_scale": PieceFinite(view.window.screen.scale),
        @"masks_to_bounds": @(view.layer.masksToBounds), @"layer_opaque": @(view.layer.opaque),
        @"layer_opacity": PieceFinite(view.layer.opacity), @"should_rasterize": @(view.layer.shouldRasterize),
        @"rasterization_scale": PieceFinite(view.layer.rasterizationScale),
        @"contents_gravity": view.layer.contentsGravity ?: @"",
        @"minification_filter": view.layer.minificationFilter ?: @"",
        @"magnification_filter": view.layer.magnificationFilter ?: @"",
        @"canvas_transform": @[PieceFinite(canvasTransform.a), PieceFinite(canvasTransform.b),
          PieceFinite(canvasTransform.c), PieceFinite(canvasTransform.d), PieceFinite(canvasTransform.tx), PieceFinite(canvasTransform.ty)],
        @"canvas_origin": @[PieceFinite(origin.x), PieceFinite(origin.y)]
      } mutableCopy];
      NSMutableArray *samples = [NSMutableArray new];
      for (NSNumber *placed in @[@NO, @YES]) {
        @autoreleasepool {
          const size_t width = 1536, height = 512, stride = width * 4;
          const CGFloat pad = 160;
          CGFloat px = placed.boolValue ? origin.x - floor(origin.x) : 0;
          CGFloat py = placed.boolValue ? origin.y - floor(origin.y) : 0;
          NSMutableDictionary *sample = [@{ @"stage": placed.boolValue ? @"placed" : @"local",
            @"phase": @[PieceFinite(px), PieceFinite(py)], @"raster_scale": @1 } mutableCopy];
          UInt8 *bytes = calloc(height, stride);
          CGColorSpaceRef space = CGColorSpaceCreateWithName(kCGColorSpaceSRGB);
          CGContextRef context = bytes && space ? CGBitmapContextCreate(bytes, width, height, 8, stride, space,
            kCGBitmapByteOrder32Big | kCGImageAlphaPremultipliedLast) : NULL;
          if (space) CGColorSpaceRelease(space);
          if (!context) {
            sample[@"diagnostic_error"] = @"allocation";
          } else {
            @try {
              CGContextTranslateCTM(context, 0, height); CGContextScaleCTM(context, 1, -1);
              CGContextTranslateCTM(context, pad + px, pad + py);
              CGAffineTransform ctm = CGContextGetCTM(context);
              sample[@"ctm"] = @[PieceFinite(ctm.a), PieceFinite(ctm.b), PieceFinite(ctm.c),
                PieceFinite(ctm.d), PieceFinite(ctm.tx), PieceFinite(ctm.ty)];
              [view.layer renderInContext:context];
              size_t l = width, t = height, r = 0, b = 0; BOOL seen = NO, edge = NO;
              for (size_t y = 0; y < height; y++) for (size_t x = 0; x < width; x++) if (bytes[y * stride + x * 4 + 3]) {
                seen = YES; l = MIN(l, x); t = MIN(t, y); r = MAX(r, x); b = MAX(b, y);
                edge = edge || x == 0 || y == 0 || x + 1 == width || y + 1 == height;
              }
              sample[@"empty"] = @(!seen); sample[@"edge_reached"] = @(edge);
              if (seen && !edge) sample[@"ink_local"] = @[@(l - pad - px), @(t - pad - py), @(r + 1 - pad - px), @(b + 1 - pad - py)];
              else sample[@"diagnostic_error"] = seen ? @"edge" : @"empty";
            } @catch (NSException *exception) {
              sample[@"diagnostic_error"] = exception.name ?: @"render_exception";
            } @finally { CGContextRelease(context); }
          }
          free(bytes); [samples addObject:sample];
        }
      }
      diagnostic[@"samples"] = samples;
      report[@"arabic_layer_raster_diagnostic"] = diagnostic;
    }
    [self saveReport:report]; resolve(@YES);
  }];
}
RCT_EXPORT_METHOD(done) { dispatch_async(dispatch_get_main_queue(), ^{ if (self.completed) self.completed(); }); }
@end

@interface PieceRNCanvasTests : XCTestCase <RCTBridgeDelegate>
@property(nonatomic, strong) PieceCanvasTest *resultModule;
@end
@implementation PieceRNCanvasTests
- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge {
  return [[NSBundle mainBundle] URLForResource:@"piece-canvas" withExtension:@"jsbundle"];
}
- (NSArray<id<RCTBridgeModule>> *)extraModulesForBridge:(RCTBridge *)bridge { return @[self.resultModule]; }
- (void)assertV8Report:(NSDictionary *)report {
  XCTAssertEqualObjects(report[@"candidate_profile"], @"piece.rn_native_preview.prototype.v8");
  NSArray *rows = report[@"rows"], *inspection = report[@"inspection"];
  BOOL branding = [report[@"branding"] boolValue];
  XCTAssertEqual(inspection.count, rows.count + (branding ? 1 : 0), @"%@", report[@"name"]);
  XCTAssertGreaterThan([report[@"plan_line_height"] doubleValue], 0);
  for (NSUInteger index = 0; index < inspection.count; index++) {
    NSDictionary *item = inspection[index]; NSArray *metric = item[@"independentMetrics"];
    XCTAssertEqualObjects(item[@"version"], @"piece.native_selected_line.v1");
    XCTAssertEqualObjects(item[@"platform"], @"ios");
    XCTAssertEqualObjects(item[@"glyphCheck"], @"no_missing_observed");
    XCTAssertEqualObjects(item[@"fontSize"], index < rows.count ? report[@"font_size"] : @28);
    XCTAssertFalse([item[@"overflow"] boolValue]); XCTAssertFalse([item[@"wrapViolation"] boolValue]);
    XCTAssertEqual(metric.count, 5);
    BOOL finiteMetrics = metric.count == 5;
    for (id value in metric) finiteMetrics = [value isKindOfClass:NSNumber.class] && isfinite([value doubleValue]) && finiteMetrics;
    XCTAssertTrue(finiteMetrics, @"%@", report[@"name"]);
    if (!finiteMetrics) continue;
    double advance = [metric[0] doubleValue], left = [metric[1] doubleValue], top = [metric[2] doubleValue],
      right = [metric[3] doubleValue], bottom = [metric[4] doubleValue];
    XCTAssertGreaterThanOrEqual(advance, 0); XCTAssertGreaterThanOrEqual(right, left); XCTAssertGreaterThanOrEqual(bottom, top);
    XCTAssertLessThanOrEqual(fmax(advance, right) - fmin(0, left), [report[@"content_width"] doubleValue]);
    XCTAssertLessThanOrEqual(bottom - top, index < rows.count ? [report[@"plan_line_height"] doubleValue] : 40);
  }
  BOOL observedCandidate = NO;
  for (NSDictionary *adapter in report[@"trace"][@"adapters"]) {
    if ([adapter[@"status"] isEqual:@"resolved"] && [adapter[@"font_size"] isEqual:report[@"font_size"]] &&
        [adapter[@"candidate_profile"] isEqual:@"piece.rn_native_preview.prototype.v5"] &&
        [adapter[@"version"] isEqual:@"piece.native_candidates.v5"]) observedCandidate = YES;
  }
  XCTAssertTrue(observedCandidate, @"%@", report[@"name"]);
  XCTAssertNotNil(report[@"png"], @"%@", report[@"name"]);
}
- (void)assertV9Report:(NSDictionary *)report {
  XCTAssertEqualObjects(report[@"candidate_profile"], @"piece.rn_native_preview.prototype.v9");
  NSArray *rows = report[@"rows"], *inspection = report[@"inspection"], *local = report[@"local_inspection"];
  XCTAssertEqual(inspection.count, rows.count + ([report[@"branding"] boolValue] ? 1 : 0));
  XCTAssertEqual(local.count, inspection.count);
  XCTAssertGreaterThan([report[@"plan_line_height"] doubleValue], 0);
  for (NSUInteger i = 0; i < inspection.count; i++) {
    NSDictionary *item = inspection[i], *before = i < local.count ? local[i] : nil;
    NSArray *metric = item[@"independentMetrics"];
    XCTAssertEqualObjects(item[@"version"], @"piece.native_selected_line.v2");
    XCTAssertEqualObjects(item[@"stage"], @"placed"); XCTAssertEqualObjects(before[@"stage"], @"local");
    XCTAssertEqualObjects(item[@"platform"], @"ios"); XCTAssertEqualObjects(item[@"rasterScale"], @1);
    XCTAssertEqualObjects(item[@"glyphCheck"], @"no_missing_observed");
    XCTAssertEqualObjects(item[@"fontSize"], i < rows.count ? report[@"font_size"] : @28);
    XCTAssertEqualObjects(item[@"snapshotToken"], before[@"snapshotToken"]);
    XCTAssertEqualObjects(item[@"tag"], before[@"tag"]); XCTAssertEqualObjects(item[@"canvasTag"], before[@"canvasTag"]);
    XCTAssertEqualObjects(item[@"contentFrame"], before[@"contentFrame"]);
    XCTAssertEqualObjects(metric, before[@"independentMetrics"]);
    XCTAssertFalse([item[@"overflow"] boolValue]); XCTAssertFalse([item[@"wrapViolation"] boolValue]);
    XCTAssertEqual(metric.count, 5);
    BOOL finite = metric.count == 5;
    for (id value in metric) finite = [value isKindOfClass:NSNumber.class] && isfinite([value doubleValue]) && finite;
    XCTAssertTrue(finite); if (!finite) continue;
    double advance = [metric[0] doubleValue], left = [metric[1] doubleValue], top = [metric[2] doubleValue],
      right = [metric[3] doubleValue], bottom = [metric[4] doubleValue];
    XCTAssertGreaterThanOrEqual(advance, 0); XCTAssertGreaterThanOrEqual(right, left); XCTAssertGreaterThanOrEqual(bottom, top);
    XCTAssertLessThanOrEqual(fmax(advance, right) - fmin(0, left), [report[@"content_width"] doubleValue]);
    XCTAssertLessThanOrEqual(bottom - top, i < rows.count ? [report[@"plan_line_height"] doubleValue] : 40);
  }
  BOOL observed = NO;
  for (NSDictionary *adapter in report[@"trace"][@"adapters"]) if ([adapter[@"status"] isEqual:@"resolved"] &&
      [adapter[@"font_size"] isEqual:report[@"font_size"]] && [adapter[@"candidate_profile"] isEqual:@"piece.rn_native_preview.prototype.v5"] &&
      [adapter[@"version"] isEqual:@"piece.native_candidates.v5"]) observed = YES;
  XCTAssertTrue(observed); XCTAssertNotNil(report[@"png"]);
}

- (void)assertContainmentReport:(NSDictionary *)report {
  XCTAssertEqualObjects(report[@"candidate_profile"],PieceContainmentProfile);
  NSArray *rows=report[@"rows"],*all=report[@"inspection"],*locals=report[@"local_inspection"];
  XCTAssertEqual(all.count,rows.count+([report[@"branding"]boolValue]?1:0));XCTAssertEqual(locals.count,all.count);
  for(NSUInteger i=0;i<all.count;i++){
    NSDictionary*e=all[i],*l=locals[i];
    XCTAssertEqualObjects(e[@"version"],@"piece.native_selected_line.v3");XCTAssertEqualObjects(e[@"platform"],@"ios");XCTAssertEqualObjects(e[@"rasterScale"],@1);
    XCTAssertEqualObjects(e[@"glyphCheck"],@"no_missing_observed");XCTAssertEqualObjects(e[@"fontSize"],i<rows.count?report[@"font_size"]:@28);
    XCTAssertEqualObjects(e[@"stage"],@"placed");XCTAssertEqualObjects(l[@"stage"],@"local");
    XCTAssertEqualObjects(e[@"ink"],PieceComponentUnion(e[@"componentInks"]));XCTAssertEqualObjects(l[@"ink"],PieceComponentUnion(l[@"componentInks"]));
    XCTAssertEqualObjects(e[@"nativeRasterScale"],l[@"nativeRasterScale"]);
    XCTAssertEqualObjects(e[@"snapshotToken"],l[@"snapshotToken"]);XCTAssertEqualObjects(e[@"tag"],l[@"tag"]);XCTAssertEqualObjects(e[@"canvasTag"],l[@"canvasTag"]);
    XCTAssertEqualObjects(e[@"contentFrame"],l[@"contentFrame"]);XCTAssertEqualObjects(e[@"independentMetrics"],l[@"independentMetrics"]);
    XCTAssertFalse([e[@"overflow"]boolValue]);XCTAssertFalse([e[@"wrapViolation"]boolValue]);
    NSArray*m=e[@"independentMetrics"];XCTAssertEqual(m.count,5);if(m.count!=5)continue;
    for(id v in m)XCTAssertTrue([v isKindOfClass:NSNumber.class]&&isfinite([v doubleValue]));
    XCTAssertGreaterThanOrEqual([m[0]doubleValue],0);XCTAssertGreaterThanOrEqual([m[3]doubleValue],[m[1]doubleValue]);XCTAssertGreaterThanOrEqual([m[4]doubleValue],[m[2]doubleValue]);
    XCTAssertLessThanOrEqual(fmax([m[0]doubleValue],[m[3]doubleValue])-fmin(0,[m[1]doubleValue]),[report[@"content_width"]doubleValue]);
    XCTAssertLessThanOrEqual([m[4]doubleValue]-[m[2]doubleValue],i<rows.count?[report[@"plan_line_height"]doubleValue]:40);
  }
  BOOL observed=NO;
  for(NSDictionary *a in report[@"trace"][@"adapters"])if([a[@"status"]isEqual:@"resolved"]&&[a[@"font_size"]isEqual:report[@"font_size"]]&&[a[@"candidate_profile"]isEqual:@"piece.rn_native_preview.prototype.v5"]&&[a[@"version"]isEqual:@"piece.native_candidates.v5"])observed=YES;
  XCTAssertTrue(observed);XCTAssertGreaterThan([report[@"plan_line_height"]doubleValue],0);
  NSArray *contexts=report[@"natural_and_reference_paint_contexts"];
  XCTAssertGreaterThan(contexts.count,0u);
  NSMutableDictionary *byView=[NSMutableDictionary new];
  for(NSDictionary*p in contexts){NSMutableDictionary *v=byView[p[@"view_identity"]];if(!v){v=[NSMutableDictionary new];byView[p[@"view_identity"]]=v;}v[p[@"kind"]]=p;}
  for(NSDictionary*v in byView.allValues){
    NSDictionary*a=v[@"natural_drawRect_pre_paint"],*b=v[@"reference_shared_paint"];XCTAssertNotNil(a);XCTAssertNotNil(b);if(!a||!b)continue;
    XCTAssertEqualObjects(a[@"bounds"],b[@"bounds"]);XCTAssertEqualObjects(a[@"content_frame"],b[@"content_frame"]);
    XCTAssertEqualObjects(a[@"view_scale"],b[@"view_scale"]);XCTAssertEqualObjects(a[@"layer_scale"],b[@"layer_scale"]);
    NSArray*ac=a[@"ctm"],*bc=b[@"ctm"];for(NSUInteger j=0;j<4;j++)XCTAssertEqualWithAccuracy([ac[j]doubleValue],[bc[j]doubleValue],1e-6);
  }
  XCTAssertNotNil(report[@"png"]);
}

- (void)testWholeCanvasWithRealReactNative {
  SEL selectedSelector = NSSelectorFromString(@"inspectSelectedLine:text:fontSize:resolver:rejecter:");
  Method selectedMethod = class_getInstanceMethod(NSClassFromString(@"PieceTextMetrics"), selectedSelector);
  XCTAssertNotEqual(selectedMethod, NULL);
  if (!selectedMethod) return;
  XCTAssertEqual(method_getNumberOfArguments(selectedMethod), 7u);
  if (method_getNumberOfArguments(selectedMethod) != 7u) return;
  SEL pixelSelector = NSSelectorFromString(@"inspectSelectedLineV3:text:fontSize:request:resolver:rejecter:");
  Method pixelMethod = class_getInstanceMethod(NSClassFromString(@"PieceTextMetrics"), pixelSelector);
  XCTAssertNotEqual(pixelMethod, NULL); if (!pixelMethod) return;
  XCTAssertEqual(method_getNumberOfArguments(pixelMethod), 8u); if (method_getNumberOfArguments(pixelMethod) != 8u) return;
  IMP pixelIMP = method_getImplementation(pixelMethod);
  PieceOriginalSelectedV2Call = (PieceSelectedV2Call)pixelIMP;
  method_setImplementation(pixelMethod, (IMP)PieceObservedSelectedV2Call);
  IMP priorIMP = method_getImplementation(selectedMethod);
  PieceOriginalSelectedCall = (PieceSelectedCall)priorIMP;
  PieceArabicObservations = [NSMutableArray new]; PieceArabicOperationOrdinal = 0;
  method_setImplementation(selectedMethod, (IMP)PieceObservedSelectedCall);
  Method paintMethod=class_getInstanceMethod(RCTTextView.class,NSSelectorFromString(@"cocolonPiecePaintGlyphRange:"));
  Method drawMethod=class_getInstanceMethod(RCTTextView.class,@selector(drawRect:));
  XCTAssertNotEqual(paintMethod,NULL);XCTAssertNotEqual(drawMethod,NULL);if(!paintMethod||!drawMethod){method_setImplementation(selectedMethod,priorIMP);method_setImplementation(pixelMethod,pixelIMP);return;}
  IMP paintIMP=method_getImplementation(paintMethod),drawIMP=method_getImplementation(drawMethod);
  PieceOriginalPaint=(PiecePaintCall)paintIMP;PieceOriginalDrawRect=(PieceDrawRectCall)drawIMP;
  PiecePaintContexts=[NSMutableArray new];PiecePaintContextKeys=[NSMutableSet new];
  method_setImplementation(paintMethod,(IMP)PieceObservedSharedPaint);method_setImplementation(drawMethod,(IMP)PieceObservedNaturalDraw);
  RCTBridge *bridge = nil;
  @try {
  self.resultModule = [PieceCanvasTest new]; self.resultModule.reports = [NSMutableArray new];
  XCTestExpectation *done = [self expectationWithDescription:@"Piece React Native canvas cases"];
  self.resultModule.completed = ^{ [done fulfill]; };
  bridge = [[RCTBridge alloc] initWithDelegate:self launchOptions:nil];
  RCTRootView *root = [[RCTRootView alloc] initWithBridge:bridge moduleName:@"PieceCanvasCases" initialProperties:nil];
  UIWindow *window = [[[UIApplication sharedApplication] delegate] window];
  window.rootViewController.view = root;
  [window makeKeyAndVisible];
  [self waitForExpectations:@[done] timeout:90];
  NSArray *baselineNames = @[@"essay_paragraphs", @"quote_unicode", @"declaration_no_brand", @"essay_max420", @"saved_essay_canvas"];
  NSArray *supplementalNames = @[@"suffix_latin_ligature", @"suffix_arabic", @"suffix_max420_a"];
  NSArray *rawNames = @[@"suffix_spaces_raw", @"suffix_hebrew_raw", @"suffix_mixed_bidi_raw"];
  NSArray *baseline = [self.resultModule.reports filteredArrayUsingPredicate:[NSPredicate predicateWithFormat:@"evidence_set == %@", @"baseline_card"]];
  NSArray *supplemental = [self.resultModule.reports filteredArrayUsingPredicate:[NSPredicate predicateWithFormat:@"evidence_set == %@", @"supplemental_card"]];
  NSArray *raw = [self.resultModule.reports filteredArrayUsingPredicate:[NSPredicate predicateWithFormat:@"evidence_set == %@", @"raw_text_diagnostic"]];
  XCTAssertEqual(self.resultModule.reports.count, 13);
  XCTAssertEqualObjects([self.resultModule.reports valueForKey:@"name"], [[[baselineNames arrayByAddingObjectsFromArray:supplementalNames] arrayByAddingObjectsFromArray:rawNames] arrayByAddingObjectsFromArray:@[@"containment_native_clip_trap",@"containment_branding_opacity08"]]);
  XCTAssertEqual(baseline.count, 5); XCTAssertEqualObjects([baseline valueForKey:@"name"], baselineNames);
  XCTAssertEqual(supplemental.count, 3); XCTAssertEqualObjects([supplemental valueForKey:@"name"], supplementalNames);
  XCTAssertEqual(raw.count, 3); XCTAssertEqualObjects([raw valueForKey:@"name"], rawNames);
  // Preserve every original acceptance assertion for the original five.
  for (NSDictionary *report in baseline) {
    XCTAssertEqualObjects(report[@"phase"], @"native_checked", @"%@", report);
    XCTAssertTrue([report[@"body_preserved"] boolValue], @"%@", report[@"name"]);
    XCTAssertTrue([report[@"native_canvas_valid"] boolValue], @"%@", report);
    XCTAssertFalse([report[@"capture_error"] boolValue]);
    XCTAssertLessThan([report[@"elapsed_ms"] doubleValue], 8000, @"%@", report[@"name"]);
    XCTAssertEqualObjects(report[@"state_can_save"], @NO);
    XCTAssertEqualObjects(report[@"state_can_export"], @NO);
    BOOL preview = ![report[@"name"] isEqualToString:@"saved_essay_canvas"];
    XCTAssertEqualObjects(report[@"save_fit_current"], @(preview), @"%@", report[@"name"]);
    XCTAssertEqualObjects(report[@"save_fit_wrong_token_current"], @NO, @"%@", report[@"name"]);
    XCTAssertEqualObjects(report[@"save_fit_handle_keys"], preview ? @[@"isCurrent"] : @[], @"%@", report[@"name"]);
    if (preview) [self assertContainmentReport:report];
    XCTAssertNotNil(report[@"png"]);
    if (report[@"png"]) {
      UIImage *image = [UIImage imageWithContentsOfFile:[PieceEvidenceDirectory() stringByAppendingPathComponent:report[@"png"]]];
      XCTAssertNotNil(image);
      XCTAttachment *attachment = [XCTAttachment attachmentWithImage:image];
      attachment.name = report[@"name"]; attachment.lifetime = XCTAttachmentLifetimeKeepAlways;
      [self addAttachment:attachment];
    }
  }
  for (NSDictionary *report in supplemental) {
    XCTAssertEqualObjects(report[@"phase"], @"native_checked", @"%@", report);
    XCTAssertTrue([report[@"body_preserved"] boolValue], @"%@", report[@"name"]);
    XCTAssertTrue([report[@"native_canvas_valid"] boolValue], @"%@", report);
    XCTAssertFalse([report[@"capture_error"] boolValue]);
    XCTAssertLessThan([report[@"elapsed_ms"] doubleValue], 8000, @"%@", report[@"name"]);
    XCTAssertEqualObjects(report[@"state_can_save"], @NO); XCTAssertEqualObjects(report[@"state_can_export"], @NO);
    XCTAssertEqualObjects(report[@"save_fit_current"], @YES);
    XCTAssertEqualObjects(report[@"save_fit_wrong_token_current"], @NO);
    XCTAssertEqualObjects(report[@"save_fit_handle_keys"], @[@"isCurrent"]);
    [self assertContainmentReport:report];
  }
  for (NSDictionary *report in raw) {
    XCTAssertEqualObjects(report[@"phase"], @"measurement_checked", @"%@", report);
    XCTAssertEqualObjects(report[@"diagnostic_only"], @YES); XCTAssertEqualObjects(report[@"diagnostic_valid"], @YES);
    XCTAssertEqualObjects(report[@"same_selected_text_node"], @YES);
    XCTAssertTrue([report[@"body_preserved"] boolValue]); XCTAssertTrue([report[@"native_canvas_valid"] boolValue]);
    XCTAssertFalse([report[@"capture_error"] boolValue]);
    XCTAssertLessThan([report[@"elapsed_ms"] doubleValue], 8000, @"%@", report[@"name"]);
    XCTAssertEqualObjects(report[@"plan_groups"], @[report[@"rows"]]);
    XCTAssertEqual([report[@"on_text_layout"] count], 1);
    XCTAssertNil(report[@"save_fit_current"]); XCTAssertNil(report[@"state_can_save"]); XCTAssertNil(report[@"state_can_export"]);
    [self assertContainmentReport:report];
  }
  NSArray *extra=[self.resultModule.reports filteredArrayUsingPredicate:[NSPredicate predicateWithFormat:@"evidence_set == %@",@"containment_addition"]];
  XCTAssertEqual(extra.count,2u);
  NSDictionary *trap=extra.count>0?extra[0]:nil,*branding=extra.count>1?extra[1]:nil;
  XCTAssertEqualObjects(trap[@"name"],@"containment_native_clip_trap");
  XCTAssertEqualObjects(trap[@"native_clip_trap_synthetic"],@YES);XCTAssertEqualObjects(trap[@"native_clip_trap_detected"],@YES);
  XCTAssertEqualObjects(trap[@"diagnostic_valid"],@YES);XCTAssertEqualObjects(trap[@"native_clip_trap_capture_verified"],@YES);
  XCTAssertEqualObjects(trap[@"expected_overflow"],@YES);XCTAssertEqualObjects(trap[@"native_canvas_valid"],@NO);
  XCTAssertLessThan([trap[@"elapsed_ms"]doubleValue],8000);XCTAssertNil(trap[@"save_fit_current"]);XCTAssertNil(trap[@"state_can_save"]);
  XCTAssertEqualObjects(branding[@"name"],@"containment_branding_opacity08");XCTAssertEqualObjects(branding[@"phase"],@"native_checked");
  XCTAssertEqualObjects(branding[@"native_canvas_valid"],@YES);XCTAssertEqualObjects(branding[@"body_preserved"],@YES);
  XCTAssertEqualObjects(branding[@"state_can_save"],@NO);XCTAssertEqualObjects(branding[@"state_can_export"],@NO);
  XCTAssertEqualObjects(branding[@"save_fit_current"],@YES);XCTAssertEqualObjects(branding[@"save_fit_wrong_token_current"],@NO);
  XCTAssertLessThan([branding[@"elapsed_ms"]doubleValue],8000);[self assertContainmentReport:branding];
  NSDictionary *opacity=[branding[@"native_opacity_facts"] lastObject];XCTAssertEqualObjects(opacity[@"text"],@"Cocolon");
  XCTAssertEqualWithAccuracy([opacity[@"view_alpha"]doubleValue],0.8,1e-6);XCTAssertEqualWithAccuracy([opacity[@"layer_opacity"]doubleValue],0.8,1e-6);

  for (NSDictionary *report in [[supplemental arrayByAddingObjectsFromArray:raw] arrayByAddingObjectsFromArray:extra]) {
    if (report[@"png"]) {
      UIImage *image = [UIImage imageWithContentsOfFile:[PieceEvidenceDirectory() stringByAppendingPathComponent:report[@"png"]]];
      XCTAssertNotNil(image);
      if (image) { XCTAttachment *attachment = [XCTAttachment attachmentWithImage:image];
        attachment.name = report[@"name"]; attachment.lifetime = XCTAttachmentLifetimeKeepAlways; [self addAttachment:attachment]; }
    }
  }
  } @finally {
    method_setImplementation(selectedMethod, priorIMP);
    method_setImplementation(pixelMethod, pixelIMP);
    method_setImplementation(paintMethod,paintIMP);method_setImplementation(drawMethod,drawIMP);
    [bridge invalidate];
  }
}
@end
