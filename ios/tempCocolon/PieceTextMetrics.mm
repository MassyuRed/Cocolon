#import <React/RCTBridgeModule.h>
#import <React/RCTBridge.h>
#import <React/RCTUIManager.h>
#import <React/RCTUIManagerUtils.h>
#import <React/RCTTextView.h>
#import <CoreText/CoreText.h>
#include <math.h>

// Read-only accessors added by the pinned RN patch; no KVC/private-ivar read.
@interface RCTTextView (CocolonPieceMetrics)
- (NSTextStorage *)cocolonPieceTextStorage;
- (CGRect)cocolonPieceContentFrame;
@end

@interface PieceTextMetrics : NSObject <RCTBridgeModule>
@property(nonatomic, weak) RCTBridge *bridge;
@end

@implementation PieceTextMetrics
RCT_EXPORT_MODULE();
@synthesize bridge = _bridge;
+ (BOOL)requiresMainQueueSetup { return NO; }
- (dispatch_queue_t)methodQueue { return RCTGetUIManagerQueue(); }

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
