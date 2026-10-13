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
RCT_EXPORT_METHOD(capture:(NSNumber *)tag report:(NSDictionary *)raw resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
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
  XCTAssertEqual(self.resultModule.reports.count, 5);
  for (NSDictionary *report in self.resultModule.reports) {
    XCTAssertEqualObjects(report[@"phase"], @"native_checked", @"%@", report);
    XCTAssertTrue([report[@"body_preserved"] boolValue], @"%@", report[@"name"]);
    XCTAssertTrue([report[@"native_canvas_valid"] boolValue], @"%@", report);
    XCTAssertFalse([report[@"capture_error"] boolValue]);
    XCTAssertLessThan([report[@"elapsed_ms"] doubleValue], 8000, @"%@", report[@"name"]);
    XCTAssertEqualObjects(report[@"state_can_save"], @NO);
    XCTAssertEqualObjects(report[@"state_can_export"], @NO);
    if (report[@"png"]) {
      UIImage *image = [UIImage imageWithContentsOfFile:[PieceEvidenceDirectory() stringByAppendingPathComponent:report[@"png"]]];
      XCTAssertNotNil(image);
      XCTAttachment *attachment = [XCTAttachment attachmentWithImage:image];
      attachment.name = report[@"name"]; attachment.lifetime = XCTAttachmentLifetimeKeepAlways;
      [self addAttachment:attachment];
    }
  }
  [bridge invalidate];
}
@end
