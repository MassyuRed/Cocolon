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

@interface RCTTextView (PieceCanvasTestAccess)
- (NSTextStorage *)cocolonPieceTextStorage;
- (CGRect)cocolonPieceContentFrame;
@end

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
    NSMutableArray *texts = [NSMutableArray new], *actual = [NSMutableArray new], *frames = [NSMutableArray new];
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
      [layout ensureLayoutForTextContainer:container];
      NSRange glyphs = [layout glyphRangeForTextContainer:container];
      CGRect localInk = CGRectOffset([layout boundingRectForGlyphRange:glyphs inTextContainer:container],
        view.cocolonPieceContentFrame.origin.x, view.cocolonPieceContentFrame.origin.y);
      CGRect ink = [view convertRect:localInk toView:canvas];
      [frames addObject:@[@(ink.origin.x), @(ink.origin.y), @(CGRectGetMaxX(ink)), @(CGRectGetMaxY(ink))]];
      CGFloat margin = [raw[@"margin"] doubleValue], height = [raw[@"height"] doubleValue];
      CGFloat bottom = height - margin - (i < rows.count ? [raw[@"branding_zone"] doubleValue] : 0);
      valid = valid && CGRectContainsRect(view.bounds, localInk) && CGRectGetMinX(ink) >= margin - 0.5 &&
        CGRectGetMaxX(ink) <= canvas.bounds.size.width - margin + 0.5 && CGRectGetMinY(ink) >= margin - 0.5 && CGRectGetMaxY(ink) <= bottom + 0.5;
    }
    report[@"native_texts"] = actual; report[@"native_ink_frames"] = frames; report[@"native_canvas_valid"] = @(valid);
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
- (void)assertV5Report:(NSDictionary *)report {
  XCTAssertEqualObjects(report[@"candidate_profile"], @"piece.rn_native_preview.prototype.v5");
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
  self.resultModule = [PieceCanvasTest new]; self.resultModule.reports = [NSMutableArray new];
  XCTestExpectation *done = [self expectationWithDescription:@"Piece React Native canvas cases"];
  self.resultModule.completed = ^{ [done fulfill]; };
  RCTBridge *bridge = [[RCTBridge alloc] initWithDelegate:self launchOptions:nil];
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
    if (preview) [self assertV5Report:report];
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
    [self assertV5Report:report];
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
    [self assertV5Report:report];
  }
  for (NSDictionary *report in [supplemental arrayByAddingObjectsFromArray:raw]) {
    if (report[@"png"]) {
      UIImage *image = [UIImage imageWithContentsOfFile:[PieceEvidenceDirectory() stringByAppendingPathComponent:report[@"png"]]];
      XCTAssertNotNil(image);
      if (image) { XCTAttachment *attachment = [XCTAttachment attachmentWithImage:image];
        attachment.name = report[@"name"]; attachment.lifetime = XCTAttachmentLifetimeKeepAlways; [self addAttachment:attachment]; }
    }
  }
  [bridge invalidate];
}
@end
