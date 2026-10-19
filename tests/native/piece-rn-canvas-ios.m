// Hosted XCTest: real Paper bridge, real mounted Text, unchanged PieceTextMetrics.
#import <XCTest/XCTest.h>
#import <React/RCTBridge.h>
#import <React/RCTBridgeDelegate.h>
#import <React/RCTBridgeModule.h>
#import <React/RCTRootView.h>
#import <React/RCTUIManager.h>
#import <React/RCTUIManagerUtils.h>
#import <React/RCTTextView.h>
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
      NSMutableDictionary *sample = [PieceReadArabicGeometry(module, tag, text, fontSize, ordinal, wire) mutableCopy];
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
      if (i < rows.count && [raw[@"candidate_profile"] isEqual:@"piece.rn_native_preview.prototype.v7"]) {
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
      if (i < rows.count && [raw[@"candidate_profile"] isEqual:@"piece.rn_native_preview.prototype.v7"])
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
    if (canvas && canvas.bounds.size.width > 0 && canvas.bounds.size.height > 0) {
      UIGraphicsImageRendererFormat *format = [UIGraphicsImageRendererFormat defaultFormat];
      format.scale = 1; format.opaque = YES;
      UIGraphicsImageRenderer *renderer = [[UIGraphicsImageRenderer alloc] initWithSize:canvas.bounds.size format:format];
      UIImage *image = [renderer imageWithActions:^(UIGraphicsImageRendererContext *ctx) { [canvas.layer renderInContext:ctx.CGContext]; }];
      NSString *name = [raw[@"name"] stringByAppendingString:@".png"];
      [UIImagePNGRepresentation(image) writeToFile:[PieceEvidenceDirectory() stringByAppendingPathComponent:name] atomically:YES];
      report[@"png"] = name;
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
- (void)assertV7Report:(NSDictionary *)report {
  XCTAssertEqualObjects(report[@"candidate_profile"], @"piece.rn_native_preview.prototype.v7");
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
- (void)testWholeCanvasWithRealReactNative {
  SEL selectedSelector = NSSelectorFromString(@"inspectSelectedLine:text:fontSize:resolver:rejecter:");
  Method selectedMethod = class_getInstanceMethod(NSClassFromString(@"PieceTextMetrics"), selectedSelector);
  XCTAssertNotEqual(selectedMethod, NULL);
  if (!selectedMethod) return;
  XCTAssertEqual(method_getNumberOfArguments(selectedMethod), 7u);
  if (method_getNumberOfArguments(selectedMethod) != 7u) return;
  IMP priorIMP = method_getImplementation(selectedMethod);
  PieceOriginalSelectedCall = (PieceSelectedCall)priorIMP;
  PieceArabicObservations = [NSMutableArray new]; PieceArabicOperationOrdinal = 0;
  method_setImplementation(selectedMethod, (IMP)PieceObservedSelectedCall);
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
  XCTAssertEqual(self.resultModule.reports.count, 11);
  XCTAssertEqualObjects([self.resultModule.reports valueForKey:@"name"], [[baselineNames arrayByAddingObjectsFromArray:supplementalNames] arrayByAddingObjectsFromArray:rawNames]);
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
    if (preview) [self assertV7Report:report];
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
    [self assertV7Report:report];
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
    [self assertV7Report:report];
  }
  for (NSDictionary *report in [supplemental arrayByAddingObjectsFromArray:raw]) {
    if (report[@"png"]) {
      UIImage *image = [UIImage imageWithContentsOfFile:[PieceEvidenceDirectory() stringByAppendingPathComponent:report[@"png"]]];
      XCTAssertNotNil(image);
      if (image) { XCTAttachment *attachment = [XCTAttachment attachmentWithImage:image];
        attachment.name = report[@"name"]; attachment.lifetime = XCTAttachmentLifetimeKeepAlways; [self addAttachment:attachment]; }
    }
  }
  } @finally {
    method_setImplementation(selectedMethod, priorIMP);
    [bridge invalidate];
  }
}
@end
