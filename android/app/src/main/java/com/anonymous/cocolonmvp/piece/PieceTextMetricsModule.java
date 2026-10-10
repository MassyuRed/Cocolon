package com.anonymous.cocolonmvp.piece;

import android.graphics.Bitmap;
import android.graphics.Canvas;
import android.icu.text.BreakIterator;
import android.text.Layout;
import android.text.Spanned;
import android.text.TextPaint;
import android.text.style.MetricAffectingSpan;
import android.text.style.ReplacementSpan;
import android.view.View;
import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.*;
import com.facebook.react.uimanager.UIManagerModule;
import com.facebook.react.uimanager.ViewManager;
import com.facebook.react.views.text.ReactTextView;
import java.util.Collections;
import java.util.List;
import java.util.Locale;

/** Read the mounted Paper Text's actual Layout. No file, network or body log.
 * hasGlyph(false) is unavailable, not a claim that a combining sequence is
 * certainly missing. Raster bounds are inspected at logical export scale.
 */
public final class PieceTextMetricsModule extends ReactContextBaseJavaModule {
  public PieceTextMetricsModule(ReactApplicationContext context) { super(context); }
  @Override public String getName() { return "PieceTextMetrics"; }

  public static final class Package implements ReactPackage {
    @Override public List<NativeModule> createNativeModules(ReactApplicationContext context) {
      return Collections.singletonList(new PieceTextMetricsModule(context));
    }
    @Override public List<ViewManager> createViewManagers(ReactApplicationContext context) {
      return Collections.emptyList();
    }
  }

  private static void unavailable(Promise promise) {
    promise.reject("PIECE_NATIVE_MEASUREMENT_UNAVAILABLE", "Text measurement unavailable");
  }

  @ReactMethod public void inspect(double tag, String expected, double expectedSize, Promise promise) {
    if (!Double.isFinite(tag) || tag <= 0 || tag != Math.rint(tag) || tag > Integer.MAX_VALUE || expected == null ||
        expected.length() == 0 || expected.length() > 4096 || !Double.isFinite(expectedSize) || expectedSize < 1 || expectedSize > 100) {
      unavailable(promise); return;
    }
    UIManagerModule manager = getReactApplicationContext().getNativeModule(UIManagerModule.class);
    if (manager == null) { unavailable(promise); return; }
    manager.addUIBlock(hierarchy -> {
      Bitmap bitmap = null;
      try {
        View candidate = hierarchy.resolveView((int) tag);
        if (!(candidate instanceof ReactTextView) || !candidate.isAttachedToWindow()) { unavailable(promise); return; }
        ReactTextView view = (ReactTextView) candidate;
        Layout layout = view.getLayout();
        if (layout == null || !expected.contentEquals(view.getText()) || !expected.contentEquals(layout.getText()) ||
            view.getScrollX() != 0 || view.getScrollY() != 0 || view.getTotalPaddingLeft() != 0 ||
            view.getTotalPaddingTop() != 0 || view.getTotalPaddingRight() != 0 || view.getTotalPaddingBottom() != 0) {
          unavailable(promise); return;
        }
        float density = view.getResources().getDisplayMetrics().density;
        double width = view.getWidth() / (double) density, height = view.getHeight() / (double) density;
        if (!Float.isFinite(density) || density <= 0 || width <= 0 || width > 1080 || height <= 0 || height > 1920) {
          unavailable(promise); return;
        }
        WritableArray ends = Arguments.createArray();
        int previous = 0;
        for (int i = 0; i < layout.getLineCount(); i++) {
          int end = layout.getLineEnd(i);
          if (layout.getLineStart(i) != previous || end <= previous || end > expected.length() || layout.getEllipsisCount(i) != 0) {
            unavailable(promise); return;
          }
          ends.pushInt(end); previous = end;
        }
        if (previous != expected.length()) { unavailable(promise); return; }
        BreakIterator iterator = BreakIterator.getCharacterInstance(Locale.ROOT);
        iterator.setText(expected);
        WritableArray boundaries = Arguments.createArray(); boundaries.pushInt(0);
        int start = iterator.first();
        for (int end = iterator.next(); end != BreakIterator.DONE; start = end, end = iterator.next()) {
          TextPaint paint = new TextPaint(layout.getPaint());
          if (layout.getText() instanceof Spanned) {
            Spanned spanned = (Spanned) layout.getText();
            if (spanned.getSpans(start, end, ReplacementSpan.class).length > 0) { unavailable(promise); return; }
            for (MetricAffectingSpan span : spanned.getSpans(start, end, MetricAffectingSpan.class)) {
              if (spanned.getSpanStart(span) > start || spanned.getSpanEnd(span) < end) { unavailable(promise); return; }
              span.updateMeasureState(paint);
            }
          }
          if (Math.abs(paint.getTextSize() / density - expectedSize) > 0.5 || !paint.hasGlyph(expected.substring(start, end))) {
            unavailable(promise); return;
          }
          boundaries.pushInt(end);
        }
        // Draw the SAME Layout with overscan. Drawing the TextView itself would
        // already clip at its bounds, hiding precisely the overflow we need.
        int pad = (int) Math.ceil(expectedSize * 2 + 8);
        int bw = (int) Math.ceil(width) + 2 * pad, bh = (int) Math.ceil(height) + 2 * pad;
        if ((long) bw * bh > 4000000) { unavailable(promise); return; }
        bitmap = Bitmap.createBitmap(bw, bh, Bitmap.Config.ARGB_8888);
        Canvas canvas = new Canvas(bitmap); canvas.translate(pad, pad); canvas.scale(1 / density, 1 / density);
        layout.draw(canvas);
        int minX = bw, minY = bh, maxX = -1, maxY = -1;
        int[] row = new int[bw];
        for (int y = 0; y < bh; y++) {
          bitmap.getPixels(row, 0, bw, 0, y, bw, 1);
          for (int x = 0; x < bw; x++) if ((row[x] >>> 24) != 0) {
            minX = Math.min(minX, x); maxX = Math.max(maxX, x); minY = Math.min(minY, y); maxY = Math.max(maxY, y);
          }
        }
        if (maxX < 0 || minX == 0 || minY == 0 || maxX == bw - 1 || maxY == bh - 1) { unavailable(promise); return; }
        WritableArray ink = Arguments.createArray();
        ink.pushDouble(minX - pad); ink.pushDouble(minY - pad); ink.pushDouble(maxX + 1 - pad); ink.pushDouble(maxY + 1 - pad);
        WritableMap result = Arguments.createMap();
        result.putString("version", "piece.native_text.v1"); result.putString("platform", "android");
        result.putDouble("font_size", expectedSize); result.putDouble("width", width); result.putDouble("height", height);
        result.putInt("utf16_length", expected.length()); result.putArray("boundaries", boundaries); result.putArray("line_ends", ends);
        result.putArray("ink", ink); result.putString("glyph_check", "no_missing_observed");
        promise.resolve(result);
      } catch (RuntimeException | OutOfMemoryError error) {
        unavailable(promise); // Do not include native exception text or view descriptions.
      } finally { if (bitmap != null) bitmap.recycle(); }
    });
  }
}
