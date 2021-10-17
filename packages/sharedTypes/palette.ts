type ColorVariants =
  | "Vibrant"
  | "LightVibrant"
  | "DarkVibrant"
  | "Muted"
  | "LightMuted"
  | "DarkMuted";

type RGB = [number, number, number];

export type Palette = Record<ColorVariants, RGB>;
