import { set } from "./render-state.js";

let sandbox: CanvasRenderingContext2D | null = null;

/**
 * Create a new canvas drawing context
 * @param width - Width of the canvas
 * @param height - Height of the canvas
 * @internal
 */
export const createContext = (width = 1, height = 1): CanvasRenderingContext2D => {
    const canvas = window.document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
        throw new Error("Canvas 2D rendering context is not supported.");
    }
    return ctx;
};

/**
 * Return a shared drawing context used for measurement and hit-testing
 * @internal
 */
export const getSandbox = (): CanvasRenderingContext2D => {
    sandbox ??= createContext();
    return sandbox;
};

/**
 * Anything that can be used as a fill or stroke style
 */
export interface StyleLike {
    toString (ctx?: CanvasRenderingContext2D): string | CanvasGradient | CanvasPattern;
}

/**
 * Color as [red, green, blue, alpha] values from 0 to 1 (what Color#toJSON returns)
 */
export type ColorArray = ReadonlyArray<number>;

/**
 * Turn any style into something usable by the drawing context
 * @param style - Color, gradient, pattern, string or [red, green, blue, alpha] array
 * @param ctx - Drawing context
 * @internal
 */
export const toStyle = (style: StyleLike | ColorArray | string, ctx: CanvasRenderingContext2D): string | CanvasGradient | CanvasPattern => {
    if (typeof style === "string") {
        return style;
    }
    if (Array.isArray(style)) {
        const [red = 0, green = 0, blue = 0, alpha = 1] = style as ColorArray;
        return `rgba(${red * 255}, ${green * 255}, ${blue * 255}, ${alpha})`;
    }
    return (style as StyleLike).toString(ctx);
};

/**
 * Set the fill or stroke style of a context (skipped when already set during a render pass)
 * @param ctx - Drawing context
 * @param property - "fillStyle" or "strokeStyle"
 * @param style - Color, gradient, pattern or string
 * @internal
 */
export const setStyle = (ctx: CanvasRenderingContext2D, property: "fillStyle" | "strokeStyle", style: StyleLike | ColorArray | string): void => {
    set(ctx, property, toStyle(style, ctx));
};
