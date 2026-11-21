#pragma once
// Test-only Paper bridge/view boundary. UIKit, TextKit and CoreText are real.
// This shim is never included in the application or a production header path.
#import <UIKit/UIKit.h>
#import <Foundation/Foundation.h>
#import <dispatch/dispatch.h>
typedef void (^RCTPromiseResolveBlock)(id result);
typedef void (^RCTPromiseRejectBlock)(NSString *code, NSString *message, NSError *error);
typedef void (^RCTDirectEventBlock)(NSDictionary *body);
@protocol RCTBridgeModule <NSObject>
@end
#define RCT_EXPORT_MODULE(...)
#define RCT_EXPORT_METHOD(...) - (void)__VA_ARGS__
#define RCT_EXPORT_VIEW_PROPERTY(name, type)
@class RCTUIManager;
@interface RCTBridge : NSObject
@property(nonatomic, strong) RCTUIManager *uiManager;
@end
@interface RCTViewManager : NSObject <RCTBridgeModule>
@property(nonatomic, strong) RCTBridge *bridge;
- (UIView *)view;
@end
@interface RCTUIManager : NSObject
@property(nonatomic, strong) NSDictionary<NSNumber *, UIView *> *registry;
- (void)addUIBlock:(void (^)(RCTUIManager *, NSDictionary<NSNumber *, UIView *> *))block;
@end
static inline dispatch_queue_t RCTGetUIManagerQueue(void) { return dispatch_get_main_queue(); }
@interface RCTTextView : UIView
@property(nonatomic, strong) NSTextStorage *fixtureStorage;
@property(nonatomic) CGRect fixtureContentFrame;
@property(nonatomic) BOOL fixtureAttached;
@property(nonatomic, strong) NSDictionary *fixturePaintGrid;
@property(nonatomic, strong) NSDictionary *fixturePaintObservation;
- (NSDictionary *)cocolonPiecePaintGrid;
- (NSDictionary *)cocolonPiecePaintObservation;
- (NSDictionary *)cocolonPieceBeginPaintObservation:(NSRange)glyphs;
- (void)cocolonPieceFinishPaintObservation:(NSDictionary *)before glyphRange:(NSRange)glyphs;
- (void)cocolonPieceRecordPaintGrid;
- (void)cocolonPiecePaintGlyphRange:(NSRange)glyphs;
- (BOOL)cocolonPieceIsPlainText;
@end
