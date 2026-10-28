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
 * Turn any style into something usable by the drawing context
 * @param style - Color, gradient, pattern or string
 * @param ctx - Drawing context
 * @internal
 */
export const toStyle = (style: StyleLike | string, ctx: CanvasRenderingContext2D): string | CanvasGradient | CanvasPattern => (
    typeof style === "string" ? style : style.toString(ctx)
);

/**
 * Set the fill or stroke style of a context (skipped when already set during a render pass)
 * @param ctx - Drawing context
 * @param property - "fillStyle" or "strokeStyle"
 * @param style - Color, gradient, pattern or string
 * @internal
 */
export const setStyle = (ctx: CanvasRenderingContext2D, property: "fillStyle" | "strokeStyle", style: StyleLike | string): void => {
    set(ctx, property, toStyle(style, ctx));
};
