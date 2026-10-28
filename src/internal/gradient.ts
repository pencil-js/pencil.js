import type Color from "../color.js";

/**
 * Set of colors to go through (key is position [from 0 to 1], value is the color)
 */
export type ColorStops = Record<number | string, Color | string>;

/**
 * Add color stops to a gradient
 * @param gradient - Canvas gradient
 * @param colorStops - Set of colors
 * @internal
 */
export const addColorStops = (gradient: CanvasGradient, colorStops: ColorStops): CanvasGradient => {
    for (const [stop, color] of Object.entries(colorStops)) {
        gradient.addColorStop(Number(stop), color.toString());
    }
    return gradient;
};

/**
 * Turn color stops into a JSON ready object
 * @param colorStops - Set of colors
 * @internal
 */
export const colorStopsToJSON = (colorStops: ColorStops): Record<string, string> => Object.fromEntries(
    Object.entries(colorStops).map(([stop, color]) => [stop, color.toString()]),
);
