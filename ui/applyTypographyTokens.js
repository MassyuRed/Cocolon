function isTopLevelTitleStyle(name) {
  return (
    name === "paneltitle" ||
    name === "headertitle" ||
    name === "screentitle" ||
    name === "pagetitle" ||
    name === "modaltitle" ||
    name === "dialogtitle" ||
    name === "sheettitle"
  );
}

function shouldSkipStyle(name, originalSize) {
  if (!name) return false;
  if (/(icon|emoji|avatar|shield|illustration|symbol|mark|badgeicon)/.test(name)) {
    return true;
  }
  if (originalSize >= 24 && !isTopLevelTitleStyle(name)) {
    return true;
  }
  return false;
}

function pickTargetFontSize(styleName, originalSize, ui) {
  const font = ui?.font ?? {};
  const name = String(styleName || "").trim().toLowerCase();

  if (shouldSkipStyle(name, originalSize)) return originalSize;

  if (isTopLevelTitleStyle(name)) {
    return Math.max(originalSize, font.title ?? 22);
  }

  if (/(buttontext|btntext|cta|reloadtext|opentext|sharetext|pdftext|generatetext|actiontext|modebtntext|goldbuttontext|dangerbuttontext)/.test(name)) {
    return originalSize;
  }

  if (/(eyebrow|gridlabel|legend|caption|memolabel|memo$|date$|range$)/.test(name)) {
    return Math.max(originalSize, font.description ?? 10);
  }

  if (/(desc|description|hint|subtitle|subtext|sub$|meta|notice|helper|emptytext|errortext|footertext|categoryvalue|retention|introtext|previewtext|notetext)/.test(name)) {
    return Math.max(originalSize, font.sectionLabel ?? 14);
  }

  if (/(label|section|chip|filtertext|ordertext|tab|pill|rangetext|secrettext|deletetext|historyretentiontext|statlabel)/.test(name)) {
    return Math.max(originalSize, font.sectionLabel ?? 14);
  }

  if (originalSize >= 18) return Math.max(originalSize, font.title ?? 22);
  if (originalSize >= 13) return Math.max(originalSize, font.body ?? 15);
  if (originalSize >= 11) return Math.max(originalSize, font.sectionLabel ?? 14);
  return Math.max(originalSize, font.description ?? 10);
}

export function applyTypographyTokens(styleMap, ui) {
  if (!styleMap || typeof styleMap !== "object") return styleMap;

  const next = {};

  Object.entries(styleMap).forEach(([styleName, styleDef]) => {
    if (!styleDef || typeof styleDef !== "object" || Array.isArray(styleDef)) {
      next[styleName] = styleDef;
      return;
    }

    const originalSize =
      typeof styleDef.fontSize === "number" ? styleDef.fontSize : null;

    if (!originalSize) {
      next[styleName] = styleDef;
      return;
    }

    const mappedSize = pickTargetFontSize(styleName, originalSize, ui);
    const nextStyle = { ...styleDef, fontSize: mappedSize };

    if (
      typeof styleDef.lineHeight === "number" &&
      styleDef.lineHeight > 0 &&
      mappedSize !== originalSize
    ) {
      const scaledLineHeight = Math.round(
        styleDef.lineHeight * (mappedSize / originalSize)
      );
      nextStyle.lineHeight = Math.max(mappedSize, scaledLineHeight);
    }

    next[styleName] = nextStyle;
  });

  return next;
}
