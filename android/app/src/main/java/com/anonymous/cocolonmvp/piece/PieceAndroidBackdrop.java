package com.anonymous.cocolonmvp.piece;

/** Paint the saved Piece palette at the same inner-card coordinates as iOS. */
final class PieceAndroidBackdrop {
  final String fill;
  final String frame;
  final String accent;
  final int[] colors;
  final int ink;

  PieceAndroidBackdrop(String fill, String frame, String accent, int[] colors, int ink) {
    this.fill = fill;
    this.frame = frame;
    this.accent = accent;
    this.colors = colors;
    this.ink = ink;
  }

  private static int blend(int from, int to, int step, int steps) {
    int result = 0xff000000;
    for (int shift = 16; shift >= 0; shift -= 8) {
      int a = (from >> shift) & 255;
      int b = (to >> shift) & 255;
      result |= (a * (steps - step) + b * step + steps / 2) / steps << shift;
    }
    return result;
  }

  void paintRow(int[] pixels, int y, int height) {
    int width = pixels.length;
    int steps = height - 1;
    int base = colors[0];
    switch (fill) {
      case "gradient":
        base = blend(base, colors[1], y, steps);
        break;
      case "color_bands":
        base = colors[y * 3 / height];
        break;
      case "color_wash":
        int segment = y * 2 > steps ? 1 : 0;
        base = blend(colors[segment], colors[segment + 1], y * 2 - segment * steps, steps);
        break;
      default:
        break;
    }
    boolean dots = "dot_pattern".equals(fill);
    boolean stripes = "stripe_pattern".equals(fill);
    boolean singleLine = "line".equals(frame);
    boolean doubleLine = "double_line".equals(frame);
    boolean topRule = "top_rule".equals(accent) && y >= 24 && y < 27;
    boolean corners = "corner_marks".equals(accent);
    int topBottom = Math.min(y, height - y - 1);
    int dotY = y % 28 - 14;
    for (int x = 0; x < width; x++) {
      int color = base;
      if (dots) {
        int dotX = (x + ((y / 28) % 2) * 14) % 28 - 14;
        if (dotX * dotX + dotY * dotY <= 9) color = colors[1];
      } else if (stripes && (x + y) % 32 < 5) {
        color = colors[1];
      }
      int leftRight = Math.min(x, width - x - 1);
      int edge = Math.min(topBottom, leftRight);
      boolean framed = singleLine && edge >= 9 && edge < 12
          || doubleLine && ((edge >= 8 && edge < 10) || (edge >= 16 && edge < 18));
      boolean ruled = topRule && x >= width / 2 - 58 && x < width / 2 + 58;
      boolean marked = corners && ((topBottom >= 23 && topBottom < 26 && leftRight >= 23 && leftRight < 43)
          || (leftRight >= 23 && leftRight < 26 && topBottom >= 23 && topBottom < 43));
      pixels[x] = framed || ruled || marked ? ink : color;
    }
  }
}
