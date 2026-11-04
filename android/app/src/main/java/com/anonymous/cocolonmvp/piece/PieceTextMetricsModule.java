package com.anonymous.cocolonmvp.piece;

import android.content.Context;
import android.graphics.Bitmap;
import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.Paint;
import android.graphics.Rect;
import android.icu.text.BreakIterator;
import android.net.Uri;
import android.os.SystemClock;
import android.text.Layout;
import android.text.Spanned;
import android.text.TextPaint;
import android.text.style.BackgroundColorSpan;
import android.text.style.ForegroundColorSpan;
import android.text.style.MetricAffectingSpan;
import android.text.style.ReplacementSpan;
import android.util.Base64;
import android.view.View;
import android.view.ViewParent;
import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.*;
import com.facebook.react.uimanager.NativeViewHierarchyManager;
import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.UIManagerModule;
import com.facebook.react.uimanager.ViewManager;
import com.facebook.react.uimanager.annotations.ReactProp;
import com.facebook.react.uimanager.events.RCTEventEmitter;
import com.facebook.react.views.text.ReactTextView;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.nio.ByteBuffer;
import java.nio.ByteOrder;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

/** Read the mounted Paper Text's actual Layout. No network or body log.
 * hasGlyph(false) is unavailable, not a claim that a combining sequence is
 * certainly missing. Raster bounds are inspected at logical export scale.
 */
public final class PieceTextMetricsModule extends ReactContextBaseJavaModule {
  private final ExecutorService candidateWorker = Executors.newSingleThreadExecutor();
  private final ExecutorService bitmapExportWorker = Executors.newSingleThreadExecutor();
  private volatile boolean bitmapActive = true;
  public PieceTextMetricsModule(ReactApplicationContext context) { super(context); }
  @Override public String getName() { return "PieceTextMetrics"; }
  @Override public void invalidate() {
    bitmapActive = false;
    candidateWorker.shutdownNow();
    bitmapExportWorker.shutdownNow();
    super.invalidate();
  }

  public static final class Package implements ReactPackage {
    @Override public List<NativeModule> createNativeModules(ReactApplicationContext context) {
      return Collections.singletonList(new PieceTextMetricsModule(context));
    }
    @Override public List<ViewManager> createViewManagers(ReactApplicationContext context) {
      return Collections.singletonList(new AndroidBitmapCanvasManager());
    }
  }

  private static void unavailable(Promise promise) {
    promise.reject("PIECE_NATIVE_MEASUREMENT_UNAVAILABLE", "Text measurement unavailable");
  }

  /** Snapshot only the mounted uniform font on the UI queue. The quadratic
   * substring shaping runs off the UI thread, under the caller's old deadline.
   * These candidate metrics never replace final inspection of the drawn rows.
   */
  @ReactMethod public void measureCandidates(double tag, String expected, double expectedSize, Promise promise) {
    final long deadline = SystemClock.uptimeMillis() + 8000;
    if (!Double.isFinite(tag) || tag <= 0 || tag != Math.rint(tag) || tag > Integer.MAX_VALUE || expected == null ||
        expected.length() == 0 || expected.length() > 4096 || !Double.isFinite(expectedSize) || expectedSize < 1 || expectedSize > 100) {
      unavailable(promise); return;
    }
    UIManagerModule manager = getReactApplicationContext().getNativeModule(UIManagerModule.class);
    if (manager == null) { unavailable(promise); return; }
    manager.addUIBlock(hierarchy -> {
      try {
        View candidate = hierarchy.resolveView((int) tag);
        if (!(candidate instanceof ReactTextView) || !candidate.isAttachedToWindow()) { unavailable(promise); return; }
        ReactTextView view = (ReactTextView) candidate;
        Layout layout = view.getLayout();
        if (layout == null || !expected.contentEquals(view.getText()) || !expected.contentEquals(layout.getText())) {
          unavailable(promise); return;
        }
        final float density = view.getResources().getDisplayMetrics().density;
        final TextPaint paint = new TextPaint(layout.getPaint());
        if (layout.getText() instanceof Spanned) {
          Spanned spans = (Spanned) layout.getText();
          if (spans.getSpans(0, expected.length(), ReplacementSpan.class).length != 0) { unavailable(promise); return; }
          for (MetricAffectingSpan span : spans.getSpans(0, expected.length(), MetricAffectingSpan.class)) {
            // Piece's body is one uniform style, never an attributed subrange.
            if (spans.getSpanStart(span) != 0 || spans.getSpanEnd(span) != expected.length()) { unavailable(promise); return; }
            span.updateMeasureState(paint);
          }
        }
        if (!Float.isFinite(density) || density <= 0 || Math.abs(paint.getTextSize() / density - expectedSize) > 0.5 || paint.baselineShift != 0) {
          unavailable(promise); return;
        }
        candidateWorker.execute(() -> {
          try {
            BreakIterator iterator = BreakIterator.getCharacterInstance(Locale.ROOT); iterator.setText(expected);
            ArrayList<Integer> offsets = new ArrayList<>(); offsets.add(0);
            for (int end = iterator.next(); end != BreakIterator.DONE; end = iterator.next()) offsets.add(end);
            int n = offsets.size() - 1;
            if (n < 1 || n > 420) { unavailable(promise); return; }
            WritableArray boundaries = Arguments.createArray();
            for (int offset : offsets) boundaries.pushInt(offset);
            for (int i = 0; i < n; i++) {
              if (!paint.hasGlyph(expected.substring(offsets.get(i), offsets.get(i + 1)))) { unavailable(promise); return; }
            }
            // The existing v2 decoder expects seven Float64 values per
            // ordered range. Keep the measurement arithmetic unchanged and
            // avoid allocating a bridged array for every substring.
            int rowCount = n * (n + 1) / 2;
            ByteBuffer rows = ByteBuffer.allocate(rowCount * 7 * Double.BYTES).order(ByteOrder.LITTLE_ENDIAN);
            Rect ink = new Rect();
            for (int start = 0; start < n; start++) for (int end = start + 1; end <= n; end++) {
              if (Thread.currentThread().isInterrupted() || SystemClock.uptimeMillis() >= deadline) { unavailable(promise); return; }
              String part = expected.substring(offsets.get(start), offsets.get(end));
              double advance = Layout.getDesiredWidth(part, paint) / density;
              paint.getTextBounds(part, 0, part.length(), ink);
              rows.putDouble(start).putDouble(end).putDouble(advance);
              rows.putDouble(ink.left / (double) density).putDouble(ink.top / (double) density);
              rows.putDouble(ink.right / (double) density).putDouble(ink.bottom / (double) density);
            }
            if (Thread.currentThread().isInterrupted() || SystemClock.uptimeMillis() >= deadline) { unavailable(promise); return; }
            String packedRows = Base64.encodeToString(rows.array(), Base64.NO_WRAP);
            if (Thread.currentThread().isInterrupted() || SystemClock.uptimeMillis() >= deadline) { unavailable(promise); return; }
            WritableMap result = Arguments.createMap();
            result.putString("version", "piece.native_candidates.v2"); result.putString("platform", "android");
            result.putDouble("font_size", expectedSize); result.putInt("utf16_length", expected.length());
            result.putArray("boundaries", boundaries); result.putString("rows_f64le", packedRows);
            result.putString("glyph_check", "no_missing_observed");
            promise.resolve(result);
          } catch (RuntimeException | OutOfMemoryError error) { unavailable(promise); }
        });
      } catch (RuntimeException | OutOfMemoryError error) { unavailable(promise); }
    });
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

  private static final String ANDROID_BITMAP_VERSION = "piece.native_android_bitmap_canvas.v1";
  private static final String ANDROID_BITMAP_PROFILE = "piece.rn_android_bitmap_preview.prototype.v1";
  private static final String BITMAP_INVALIDATED_EVENT = "topBitmapInvalidated";
  private static final int BITMAP_DEADLINE_MS = 8000;
  private static final long MAX_SCAN_PIXELS = 24000000;

  public static final class AndroidBitmapCanvasManager extends SimpleViewManager<AndroidBitmapCanvas> {
    @Override public String getName() { return "PieceAndroidBitmapCanvas"; }
    @Override protected AndroidBitmapCanvas createViewInstance(ThemedReactContext context) {
      return new AndroidBitmapCanvas(context);
    }
    @ReactProp(name = "bitmapBinding") public void setBitmapBinding(AndroidBitmapCanvas view, String value) {
      if (!java.util.Objects.equals(view.binding, value)) {
        view.clear(true);
        view.binding = value;
      }
    }
    @Override public Map<String, Object> getExportedCustomDirectEventTypeConstants() {
      return Collections.singletonMap(BITMAP_INVALIDATED_EVENT,
          Collections.singletonMap("registrationName", "onBitmapInvalidated"));
    }
    @Override public void onDropViewInstance(AndroidBitmapCanvas view) {
      view.clear(false);
      super.onDropViewInstance(view);
    }
  }

  public static final class AndroidBitmapCanvas extends View {
    private final Paint paint = new Paint(Paint.FILTER_BITMAP_FLAG);
    private final Rect destination = new Rect();
    private String binding;
    private BitmapArtifact artifact;

    AndroidBitmapCanvas(Context context) {
      super(context);
      setImportantForAccessibility(IMPORTANT_FOR_ACCESSIBILITY_NO);
    }

    void clear(boolean notify) {
      BitmapArtifact old = artifact;
      if (old == null) return;
      artifact = null;
      // The last hardware display list or an export worker may still read
      // these pixels. Do not recycle a bitmap that has been displayed.
      invalidate();
      if (!notify || !(getContext() instanceof ReactContext)) return;
      try {
        WritableMap event = Arguments.createMap();
        event.putString("artifact_token", old.token);
        event.putString("binding_token", old.binding);
        ((ReactContext) getContext()).getJSModule(RCTEventEmitter.class)
            .receiveEvent(getId(), BITMAP_INVALIDATED_EVENT, event);
      } catch (RuntimeException | OutOfMemoryError ignored) { /* The native bitmap is already revoked. */ }
    }

    @Override protected void onLayout(boolean changed, int left, int top, int right, int bottom) {
      super.onLayout(changed, left, top, right, bottom);
      if (changed) clear(true);
    }
    @Override protected void onDetachedFromWindow() {
      clear(true);
      super.onDetachedFromWindow();
    }
    @Override protected void onDraw(Canvas canvas) {
      super.onDraw(canvas);
      BitmapArtifact current = artifact;
      if (current == null) return;
      if (!current.matches(this)) { clear(true); return; }
      destination.set(0, 0, getWidth(), getHeight());
      canvas.drawBitmap(current.bitmap, null, destination, paint);
      current.drawn = true;
    }
  }

  private static final class BitmapArtifact {
    final Bitmap bitmap;
    final String binding;
    final String token = UUID.randomUUID().toString();
    final ViewParent parent;
    final int width;
    final int height;
    final List<BitmapSource> sources;
    boolean drawn;
    boolean exporting;

    BitmapArtifact(AndroidBitmapCanvas host, Bitmap bitmap, String binding, List<BitmapSource> sources) {
      this.bitmap = bitmap;
      this.binding = binding;
      this.parent = host.getParent();
      this.width = host.getWidth();
      this.height = host.getHeight();
      this.sources = sources;
    }

    boolean matches(AndroidBitmapCanvas host) {
      if (host.artifact != this || !host.isAttachedToWindow() || !binding.equals(host.binding) ||
          host.getParent() != parent || host.getWidth() != width || host.getHeight() != height) return false;
      for (BitmapSource source : sources) if (!source.matches(host)) return false;
      return true;
    }
  }

  @ReactMethod public void renderAndroidBitmapCanvas(ReadableMap request, Promise promise) {
    final int canvasTag;
    final String binding;
    final long deadline;
    try {
      requireFields(request, "version", "profile", "canvas_tag", "preview_key", "binding_token",
          "expires_at_ms", "remaining_ms", "width", "height", "margin", "branding_zone", "content_width",
          "content_height", "line_height", "total_height", "alignment", "branding_mode", "colors", "rows");
      require(ANDROID_BITMAP_VERSION.equals(request.getString("version")) &&
          ANDROID_BITMAP_PROFILE.equals(request.getString("profile")));
      canvasTag = intValue(request.getDouble("canvas_tag"));
      binding = stringValue(request, "binding_token", 128);
      stringValue(request, "preview_key", 4096);
      double remaining = request.getDouble("remaining_ms");
      double wallRemaining = request.getDouble("expires_at_ms") - System.currentTimeMillis();
      require(Double.isFinite(remaining) && remaining > 0 && remaining <= BITMAP_DEADLINE_MS &&
          Double.isFinite(wallRemaining) && wallRemaining > 0 && wallRemaining <= BITMAP_DEADLINE_MS);
      deadline = SystemClock.uptimeMillis() + (long) Math.ceil(Math.min(remaining, wallRemaining));
    } catch (RuntimeException error) { unavailable(promise); return; }
    UIManagerModule manager = getReactApplicationContext().getNativeModule(UIManagerModule.class);
    if (manager == null) { unavailable(promise); return; }
    manager.addUIBlock(hierarchy -> {
      AndroidBitmapCanvas host = null;
      try {
        View view = hierarchy.resolveView(canvasTag);
        require(view instanceof AndroidBitmapCanvas);
        host = (AndroidBitmapCanvas) view;
        require(bitmapActive && host.isAttachedToWindow() && binding.equals(host.binding));
        beforeDeadline(deadline);
        host.clear(true);
        promise.resolve(renderAndroidBitmap(request, hierarchy, host, canvasTag, binding, deadline));
      } catch (RuntimeException | OutOfMemoryError error) {
        if (host != null && binding.equals(host.binding)) host.clear(true);
        unavailable(promise);
      }
    });
  }

  @ReactMethod public void releaseAndroidBitmapCanvas(double tag, String token) {
    if (!validTag(tag) || token == null || token.length() > 128) return;
    UIManagerModule manager = getReactApplicationContext().getNativeModule(UIManagerModule.class);
    if (manager == null) return;
    manager.addUIBlock(hierarchy -> {
      try {
        View view = hierarchy.resolveView((int) tag);
        if (view instanceof AndroidBitmapCanvas) {
          AndroidBitmapCanvas host = (AndroidBitmapCanvas) view;
          if (host.artifact != null && token.equals(host.artifact.token)) host.clear(false);
        }
      } catch (RuntimeException ignored) { /* An unmounted view no longer owns the bitmap. */ }
    });
  }

  @ReactMethod public void captureAndroidBitmapCanvas(double tag, String token, String binding, Promise promise) {
    if (!validTag(tag) || token == null || token.isEmpty() || token.length() > 128 ||
        binding == null || binding.isEmpty() || binding.length() > 128) { unavailable(promise); return; }
    UIManagerModule manager = getReactApplicationContext().getNativeModule(UIManagerModule.class);
    if (manager == null) { unavailable(promise); return; }
    final long deadline = SystemClock.uptimeMillis() + BITMAP_DEADLINE_MS;
    manager.addUIBlock(hierarchy -> {
      try {
        beforeDeadline(deadline);
        View view = hierarchy.resolveView((int) tag);
        require(view instanceof AndroidBitmapCanvas);
        AndroidBitmapCanvas host = (AndroidBitmapCanvas) view;
        BitmapArtifact artifact = host.artifact;
        require(bitmapActive && artifact != null && token.equals(artifact.token) && binding.equals(artifact.binding) &&
            artifact.drawn && !artifact.exporting && artifact.matches(host));
        artifact.exporting = true;
        try {
          bitmapExportWorker.execute(() -> exportAndroidBitmap(host, artifact, deadline, promise));
        } catch (RuntimeException error) {
          artifact.exporting = false;
          throw error;
        }
      } catch (RuntimeException | OutOfMemoryError error) { unavailable(promise); }
    });
  }

  private void exportAndroidBitmap(AndroidBitmapCanvas host, BitmapArtifact artifact, long deadline, Promise promise) {
    File file = null;
    try {
      beforeDeadline(deadline);
      require(bitmapActive);
      File directory = new File(getReactApplicationContext().getCacheDir(), "piece-capture");
      if (!directory.isDirectory() && !directory.mkdirs() && !directory.isDirectory()) throw new IOException();
      file = File.createTempFile("piece-", ".png", directory);
      try (FileOutputStream stream = new FileOutputStream(file)) {
        if (!artifact.bitmap.compress(Bitmap.CompressFormat.PNG, 100, stream)) throw new IOException();
      }
      beforeDeadline(deadline);
      final File encoded = file;
      boolean queued = UiThreadUtil.runOnUiThread(() -> {
        artifact.exporting = false;
        try {
          beforeDeadline(deadline);
          require(bitmapActive && artifact.matches(host));
          promise.resolve(Uri.fromFile(encoded).toString());
        } catch (RuntimeException | OutOfMemoryError error) {
          removeTemp(encoded);
          unavailable(promise);
        }
      });
      if (!queued) throw new IOException();
    } catch (IOException | RuntimeException | OutOfMemoryError error) {
      removeTemp(file);
      if (!UiThreadUtil.runOnUiThread(() -> {
        artifact.exporting = false;
        unavailable(promise);
      })) unavailable(promise);
    }
  }

  private static void removeTemp(File file) {
    if (file != null) try { file.delete(); } catch (SecurityException ignored) { /* Private cache cleanup can retry. */ }
  }

  private WritableMap renderAndroidBitmap(ReadableMap request, NativeViewHierarchyManager hierarchy,
      AndroidBitmapCanvas host, int canvasTag, String binding, long deadline) {
    int width = intValue(request.getDouble("width"));
    int height = intValue(request.getDouble("height"));
    require(width == 1080 && (height == 1350 || height == 1920));
    int margin = intValue(request.getDouble("margin"));
    int brandingZone = intValue(request.getDouble("branding_zone"));
    int contentWidth = intValue(request.getDouble("content_width"));
    int contentHeight = intValue(request.getDouble("content_height"));
    require(margin == (height == 1350 ? 96 : 108) && brandingZone == (height == 1350 ? 72 : 84) &&
        contentWidth == width - 2 * margin && contentHeight == height - 2 * margin - brandingZone);
    int lineHeight = intValue(request.getDouble("line_height"));
    double totalHeight = request.getDouble("total_height");
    require(lineHeight <= 160 && Double.isFinite(totalHeight) && totalHeight > 0 && totalHeight <= contentHeight);
    String alignment = request.getString("alignment");
    require("left".equals(alignment) || "center".equals(alignment));
    String brandingMode = request.getString("branding_mode");
    boolean hasBrand = !"off".equals(brandingMode);
    require(!hasBrand || "required_small".equals(brandingMode) || "required_subtle".equals(brandingMode));

    ReadableMap colors = request.getMap("colors");
    requireFields(colors, "canvas", "surface", "border", "text", "branding");
    int background = readColor(colors, "canvas"), surface = readColor(colors, "surface"), border = readColor(colors, "border");
    int textColor = readColor(colors, "text"), brandColor = readColor(colors, "branding");
    float density = host.getResources().getDisplayMetrics().density;
    require(Float.isFinite(density) && density > 0 && Math.abs(host.getWidth() - width * (double) density) <= 1 &&
        Math.abs(host.getHeight() - height * (double) density) <= 1 && host.getLeft() == 0 && host.getTop() == 0);

    ReadableArray rows = request.getArray("rows");
    require(rows != null && rows.size() > (hasBrand ? 1 : 0) && rows.size() <= 64);
    Set<Integer> tags = new HashSet<>();
    List<BitmapSource> sources = new ArrayList<>();
    double heightSum = 0;
    int textUnits = 0;
    for (int index = 0; index < rows.size(); index++) {
      beforeDeadline(deadline);
      ReadableMap row = rows.getMap(index);
      requireFields(row, "tag", "text", "font_size", "width", "height", "line_width", "gap_after", "kind");
      int tag = intValue(row.getDouble("tag"));
      require(tag != canvasTag && tags.add(tag));
      boolean brand = hasBrand && index == rows.size() - 1;
      require((brand ? "branding" : "body").equals(row.getString("kind")));
      String expected = stringValue(row, "text", 4096);
      double size = row.getDouble("font_size"), boxWidth = row.getDouble("width"), boxHeight = row.getDouble("height");
      double lineWidth = row.getDouble("line_width"), gap = row.getDouble("gap_after");
      require((brand ? size == 28 && "Emlis".equals(expected) && gap == 0
          : Double.isFinite(size) && size >= 24 && size <= 100) &&
          Double.isFinite(boxWidth) && Math.abs(boxWidth - contentWidth) <= 0.5 &&
          Double.isFinite(boxHeight) && boxHeight > 0 && boxHeight <= 160 &&
          Double.isFinite(lineWidth) && lineWidth >= 0 && lineWidth <= contentWidth &&
          Double.isFinite(gap) && gap >= 0 && gap <= lineHeight);
      if (!brand) heightSum += lineHeight + gap;
      textUnits += expected.length();
      require(textUnits <= 8192);
      View candidate = hierarchy.resolveView(tag);
      require(candidate instanceof ReactTextView);
      sources.add(new BitmapSource(host, (ReactTextView) candidate, tag, expected, size, boxWidth, boxHeight,
          lineWidth, gap, brand, brand ? brandColor : textColor, density, deadline));
    }
    require(Math.abs(totalHeight - heightSum) <= 0.000001);

    Bitmap bitmap = null;
    try {
      bitmap = Bitmap.createBitmap(width, height, Bitmap.Config.ARGB_8888);
      bitmap.setHasAlpha(false);
      Canvas full = new Canvas(bitmap);
      Paint paint = new Paint();
      full.drawColor(background);
      int frame = margin / 2;
      paint.setColor(border);
      full.drawRect(frame, frame, width - frame, height - frame, paint);
      paint.setColor(surface);
      full.drawRect(frame + 2, frame + 2, width - frame - 2, height - frame - 2, paint);
      WritableArray proof = Arguments.createArray();
      double rowTop = margin + (contentHeight - totalHeight) / 2;
      long remainingPixels = MAX_SCAN_PIXELS;
      for (BitmapSource source : sources) {
        beforeDeadline(deadline);
        require(source.matches(host));
        int pad = (int) Math.ceil(2 * source.size + 8);
        int scratchWidth = (int) Math.ceil(source.width / (double) density) + 2 * pad;
        int scratchHeight = (int) Math.ceil(source.height / (double) density) + 2 * pad;
        remainingPixels -= 2L * scratchWidth * scratchHeight;
        require(remainingPixels >= 0);
        Bitmap scratch = Bitmap.createBitmap(scratchWidth, scratchHeight, Bitmap.Config.ARGB_8888);
        try {
          int[] scan = new int[scratchWidth];
          int alpha = source.brand && "required_subtle".equals(brandingMode) ? 204 : 255;
          Rect local = paintAndMeasure(source, scratch, scan, pad, 0, 0, alpha, deadline);
          double rowWidth = Math.max(source.lineWidth, local.right) - Math.min(0, local.left);
          int maxInkHeight = source.brand ? 40 : lineHeight;
          if (rowWidth > contentWidth || local.height() > maxInkHeight) return bitmapReply(request, canvasTag, null, null);
          double slotTop = source.brand ? height - margin - brandingZone : rowTop;
          double slotBottom = slotTop + (source.brand ? brandingZone : lineHeight);
          double x = source.brand ? margin : margin - Math.min(0, local.left) +
              ("center".equals(alignment) ? (contentWidth - rowWidth) / 2 : 0);
          double y = source.brand ? slotTop : slotTop + (lineHeight - local.height()) / 2.0 - local.top;
          int wholeX = (int) Math.floor(x), wholeY = (int) Math.floor(y);
          Rect pixels = paintAndMeasure(source, scratch, scan, pad, x - wholeX, y - wholeY, alpha, deadline);
          Rect placed = new Rect(pixels);
          placed.offset(wholeX, wholeY);
          if (placed.left < margin || placed.right > width - margin || placed.top < slotTop ||
              placed.bottom > slotBottom || placed.height() > maxInkHeight) {
            return bitmapReply(request, canvasTag, null, null);
          }
          pixels.offset(pad, pad);
          // Equal integer source/destination rectangles preserve the pixels
          // just scanned, including the composed branding alpha.
          full.drawBitmap(scratch, pixels, placed, null);
          WritableMap row = Arguments.createMap();
          row.putInt("tag", source.tag);
          row.putString("kind", source.brand ? "branding" : "body");
          row.putArray("local_ink", bounds(local));
          row.putArray("origin", coordinates(x, y));
          row.putArray("ink", bounds(placed));
          proof.pushMap(row);
          if (!source.brand) rowTop += lineHeight + source.gap;
        } finally { scratch.recycle(); }
      }
      beforeDeadline(deadline);
      require(bitmapActive && host.isAttachedToWindow() && binding.equals(host.binding));
      for (BitmapSource source : sources) require(source.matches(host));
      BitmapArtifact artifact = new BitmapArtifact(host, bitmap, binding, sources);
      WritableMap result = bitmapReply(request, canvasTag, artifact, proof);
      beforeDeadline(deadline);
      host.artifact = artifact;
      bitmap = null; // Ownership has moved to the view and capture worker.
      host.invalidate();
      return result;
    } finally { if (bitmap != null) bitmap.recycle(); }
  }

  private static final class BitmapSource {
    final ReactTextView view;
    final Layout layout;
    final String text;
    final int tag;
    final int width;
    final int height;
    final float density;
    final int color;
    final double size;
    final double lineWidth;
    final double gap;
    final boolean brand;

    BitmapSource(AndroidBitmapCanvas host, ReactTextView view, int tag, String text, double size,
        double boxWidth, double boxHeight, double lineWidth, double gap, boolean brand, int color, float density,
        long deadline) {
      this.view = view;
      this.layout = view.getLayout();
      this.text = text;
      this.tag = tag;
      this.width = view.getWidth();
      this.height = view.getHeight();
      this.density = density;
      this.color = color;
      this.size = size;
      this.lineWidth = lineWidth;
      this.gap = gap;
      this.brand = brand;
      require(layout != null && matches(host) &&
          Math.abs(width / (double) density - boxWidth) <= 0.5 && Math.abs(height / (double) density - boxHeight) <= 0.5 &&
          layout.getLineCount() == 1 && layout.getLineStart(0) == 0 && layout.getLineEnd(0) == text.length() &&
          layout.getEllipsisCount(0) == 0 && Math.abs(layout.getLineWidth(0) / (double) density - lineWidth) <= 0.5);
      TextPaint paint = new TextPaint(layout.getPaint());
      if (layout.getText() instanceof Spanned) {
        Spanned spans = (Spanned) layout.getText();
        require(spans.getSpans(0, text.length(), ReplacementSpan.class).length == 0 &&
            spans.getSpans(0, text.length(), BackgroundColorSpan.class).length == 0);
        for (MetricAffectingSpan span : spans.getSpans(0, text.length(), MetricAffectingSpan.class)) {
          require(spans.getSpanStart(span) == 0 && spans.getSpanEnd(span) == text.length());
          span.updateMeasureState(paint);
        }
      }
      require(Math.abs(paint.getTextSize() / density - size) <= 0.5 && paint.baselineShift == 0);
      BreakIterator boundaries = BreakIterator.getCharacterInstance(Locale.ROOT);
      boundaries.setText(text);
      int clusters = 0;
      for (int start = boundaries.first(), end = boundaries.next(); end != BreakIterator.DONE;
          start = end, end = boundaries.next()) {
        beforeDeadline(deadline);
        require(++clusters <= 420 && paint.hasGlyph(text.substring(start, end)));
      }
    }

    boolean matches(AndroidBitmapCanvas host) {
      if (!view.isAttachedToWindow() || view.getId() != tag || layout == null || view.getLayout() != layout ||
          width <= 0 || height <= 0 || view.getWidth() != width || view.getHeight() != height ||
          view.getResources().getDisplayMetrics().density != density ||
          !text.contentEquals(view.getText()) || !text.contentEquals(layout.getText()) ||
          view.getScrollX() != 0 || view.getScrollY() != 0 || view.getTotalPaddingLeft() != 0 ||
          view.getTotalPaddingTop() != 0 || view.getTotalPaddingRight() != 0 || view.getTotalPaddingBottom() != 0 ||
          !mountedOnCanvas(host, view)) return false;
      CharSequence content = layout.getText();
      if (content instanceof Spanned) {
        Spanned spans = (Spanned) content;
        ForegroundColorSpan[] foreground = spans.getSpans(0, text.length(), ForegroundColorSpan.class);
        if (foreground.length != 0) {
          for (ForegroundColorSpan span : foreground) if (spans.getSpanStart(span) != 0 ||
              spans.getSpanEnd(span) != text.length() || span.getForegroundColor() != color) return false;
          return true;
        }
      }
      return view.getCurrentTextColor() == color;
    }
  }

  private static boolean mountedOnCanvas(AndroidBitmapCanvas host, ReactTextView text) {
    ViewParent root = host.getParent();
    if (!(root instanceof View)) return false;
    View child = text;
    for (int depth = 0; depth < 12; depth++) {
      // Parent alpha zero is expected for probes. Any local transform would
      // make the mounted source an ambiguous coordinate reference.
      if (!child.getMatrix().isIdentity()) return false;
      ViewParent parent = child.getParent();
      if (parent == root) return true;
      if (!(parent instanceof View)) return false;
      child = (View) parent;
    }
    return false;
  }

  private static Rect paintAndMeasure(BitmapSource source, Bitmap scratch, int[] scan, int pad,
      double shiftX, double shiftY, int alpha, long deadline) {
    beforeDeadline(deadline);
    scratch.eraseColor(Color.TRANSPARENT);
    Canvas canvas = new Canvas(scratch);
    int layer = alpha == 255 ? 0 : canvas.saveLayerAlpha(0, 0, scratch.getWidth(), scratch.getHeight(), alpha);
    canvas.translate((float) (pad + shiftX), (float) (pad + shiftY));
    canvas.scale(1 / source.density, 1 / source.density);
    TextPaint paint = source.layout.getPaint();
    int oldColor = paint.getColor();
    int[] oldState = paint.drawableState;
    try {
      paint.setColor(source.color);
      paint.drawableState = source.view.getDrawableState();
      source.layout.draw(canvas);
    } finally {
      paint.setColor(oldColor);
      paint.drawableState = oldState;
    }
    if (layer != 0) canvas.restoreToCount(layer);
    int width = scratch.getWidth(), height = scratch.getHeight();
    int left = width, top = height, right = -1, bottom = -1;
    for (int y = 0; y < height; y++) {
      beforeDeadline(deadline);
      scratch.getPixels(scan, 0, width, 0, y, width, 1);
      for (int x = 0; x < width; x++) if ((scan[x] >>> 24) != 0) {
        left = Math.min(left, x);
        top = Math.min(top, y);
        right = Math.max(right, x);
        bottom = Math.max(bottom, y);
      }
    }
    beforeDeadline(deadline);
    require(right >= 0 && left > 0 && top > 0 && right < width - 1 && bottom < height - 1);
    return new Rect(left - pad, top - pad, right + 1 - pad, bottom + 1 - pad);
  }

  private static WritableMap bitmapReply(ReadableMap request, int canvasTag, BitmapArtifact artifact, WritableArray rows) {
    WritableMap result = Arguments.createMap();
    result.putString("version", ANDROID_BITMAP_VERSION);
    result.putString("profile", ANDROID_BITMAP_PROFILE);
    result.putString("platform", "android");
    result.putInt("canvas_tag", canvasTag);
    result.putString("preview_key", request.getString("preview_key"));
    result.putString("binding_token", request.getString("binding_token"));
    result.putDouble("width", request.getDouble("width"));
    result.putDouble("height", request.getDouble("height"));
    result.putInt("raster_scale", 1);
    result.putBoolean("overflow", artifact == null);
    result.putBoolean("checked", artifact != null);
    if (artifact == null) result.putNull("artifact_token");
    else result.putString("artifact_token", artifact.token);
    result.putArray("rows", rows == null ? Arguments.createArray() : rows);
    return result;
  }

  private static WritableArray bounds(Rect bounds) {
    return coordinates(bounds.left, bounds.top, bounds.right, bounds.bottom);
  }

  private static WritableArray coordinates(double... values) {
    WritableArray output = Arguments.createArray();
    for (double value : values) output.pushDouble(value);
    return output;
  }

  private static int readColor(ReadableMap map, String key) {
    String value = stringValue(map, key, 7);
    require(value.matches("#[0-9a-fA-F]{6}"));
    return Color.parseColor(value);
  }

  private static String stringValue(ReadableMap map, String key, int maxLength) {
    String value = map.getString(key);
    require(value != null && !value.isEmpty() && value.length() <= maxLength);
    return value;
  }

  private static void requireFields(ReadableMap map, String... keys) {
    require(map != null);
    Set<String> remaining = new HashSet<>();
    Collections.addAll(remaining, keys);
    ReadableMapKeySetIterator iterator = map.keySetIterator();
    while (iterator.hasNextKey()) require(remaining.remove(iterator.nextKey()));
    require(remaining.isEmpty());
  }

  private static boolean validTag(double value) {
    return Double.isFinite(value) && value > 0 && value <= Integer.MAX_VALUE && value == Math.rint(value);
  }

  private static int intValue(double value) {
    require(validTag(value));
    return (int) value;
  }

  private static void beforeDeadline(long deadline) {
    require(!Thread.currentThread().isInterrupted() && SystemClock.uptimeMillis() < deadline);
  }

  private static void require(boolean condition) {
    if (!condition) throw new IllegalArgumentException();
  }
}
