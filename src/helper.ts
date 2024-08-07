import { MAIN_COLORS } from "./constant";
import { RGB } from "./type";

export const NumberToVND = new Intl.NumberFormat("vi-VI", {
  style: "currency",
  currency: "VND",
});

const getLuminance = ({ r, g, b }: RGB) => {
  const toLinear = (value: number) => {
    const normalized = value / 255;
    return normalized <= 0.03928
      ? normalized / 12.92
      : Math.pow((normalized + 0.055) / 1.055, 2.4);
  };

  const linearR = toLinear(r);
  const linearG = toLinear(g);
  const linearB = toLinear(b);

  return 0.2126 * linearR + 0.7152 * linearG + 0.0722 * linearB;
};

export const compareBrightness = (color1: RGB, color2: RGB) => {
  const luminance1 = getLuminance(color1);
  const luminance2 = getLuminance(color2);

  if (luminance1 > luminance2) {
    return 1;
  } else if (luminance1 < luminance2) {
    return -1;
  }
  return 0;
};

const rgbToHsl = (rgb: RGB) => {
  let { r, g, b } = rgb;
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0,
    s;
  const l = (max + min) / 2;

  if (max === min) {
    h = s = 0; // achromatic
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }
  return [h * 360, s, l];
};

export const classifyColor = (rgb: RGB) => {
  if (!rgb) return 1
  const hsl = rgbToHsl(rgb)
  if (!hsl) return 1
  if (hsl[2] <= 0.25) return 1.5
  if (hsl[2] >= 0.75) return 1.2
  return 1.1
}

export const getClosestMainColor = (rgb: RGB) => {
  const [h1, s1, l1] = rgbToHsl(rgb);
  let closestColor = null;
  let minDistance = Number.MAX_VALUE;

  for (const color of MAIN_COLORS) {
    const colorRGB = { r: color.rgb[0], g: color.rgb[1], b: color.rgb[2] };
    const [h2, s2, l2] = rgbToHsl(colorRGB);
    const distance = Math.abs(h1 - h2) + Math.abs(s1 - s2) + Math.abs(l1 - l2);
    if (distance < minDistance) {
      minDistance = distance;
      closestColor = color.name;
    }
  }
  return closestColor;
};

export function appendIdAsKey<T>(it: T & { id: string }): T {
  return {
    ...it,
    key: it.id,
  };
}
