// Theme IDs and colors are persisted as recipes. Preserve existing definitions.
export const PIECE_VISUAL_CATALOG_V1 = 'piece.visual_catalog.v1';

function palette(canvas, surface, text, secondary, accent, border, vector_end) {
  return { canvas, surface, text, secondary, accent, border, branding: accent, vector_end };
}

export const PIECE_THEME_COLORS = Object.freeze({
  soft_paper: { canvas: '#F6F1E8', surface: '#FFFDF8', text: '#111827', secondary: '#4B5563',
    accent: '#800020', border: '#D7D2C9', branding: '#800020', vector_end: '#FFFFFF' },
  quiet_night: { canvas: '#0B1120', surface: '#111827', text: '#F9FAFB', secondary: '#CBD5E1',
    accent: '#D4AF37', border: '#334155', branding: '#D4AF37', vector_end: '#1E293B' },
  rose_paper: palette('#F5E5E7', '#FFF6F6', '#352629', '#625054', '#8D364D', '#D6B9BF', '#FDF1F1'),
  rose_berry: palette('#F5E5E7', '#FFF6F6', '#702942', '#74485A', '#832747', '#D6B9BF', '#FDF1F1'),
  sand_umber: palette('#EFE4CE', '#FFF8EA', '#4D3223', '#6A5548', '#774729', '#CDBA9A', '#FAF0D8'),
  sand_olive: palette('#EFE4CE', '#FFF8EA', '#384322', '#515B40', '#526027', '#CDBA9A', '#FAF0D8'),
  mist_slate: palette('#DDE8EE', '#F4FAFD', '#263949', '#4C606F', '#315D77', '#AFCCD9', '#EBF5F9'),
  mist_teal: palette('#DDE8EE', '#F4FAFD', '#174C48', '#43645F', '#25685C', '#AFCCD9', '#EBF5F9'),
  lavender_ink: palette('#E8E3F4', '#FAF6FF', '#31294B', '#5F5272', '#624683', '#CDC0DF', '#F4ECFF'),
  lavender_plum: palette('#E8E3F4', '#FAF6FF', '#632D58', '#70536D', '#7A3B6B', '#CDC0DF', '#F4ECFF'),
  forest_mint: palette('#102821', '#19372D', '#E3F7ED', '#B9D9C9', '#9ADBB8', '#3A6252', '#24463C'),
  ocean_ice: palette('#102336', '#182F47', '#E3F3FC', '#B9D4E6', '#9CD7F5', '#3A5973', '#23435E'),
});
Object.values(PIECE_THEME_COLORS).forEach(Object.freeze);

export const PIECE_THEME_LABELS = Object.freeze({
  soft_paper: 'ソフトペーパー',
  quiet_night: '静かな夜',
  rose_paper: 'ローズ × 墨',
  rose_berry: 'ローズ × ベリー',
  sand_umber: 'サンド × 琥珀',
  sand_olive: 'サンド × オリーブ',
  mist_slate: 'ミスト × 藍',
  mist_teal: 'ミスト × 青緑',
  lavender_ink: 'ラベンダー × 墨紫',
  lavender_plum: 'ラベンダー × プラム',
  forest_mint: '深緑 × ミント',
  ocean_ice: '深海 × アイスブルー',
});

export const PIECE_LEGACY_THEME_IDS = Object.freeze(['soft_paper', 'quiet_night']);
export const PIECE_THEME_IDS = Object.freeze(Object.keys(PIECE_THEME_COLORS));
