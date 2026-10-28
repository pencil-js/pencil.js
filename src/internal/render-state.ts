/**
 * Drawing context state known during a render pass.
 * Setting a context property is slow (colors are parsed, lines rebuilt …) and reading it back is not free either,
 * so the values set by Pencil.js are remembered and only changed when needed.
 * Anything not controlled by the render pass (save/restore, custom drawing code) must invalidate it.
 * @internal
 */
export interface RenderState {
    /** Context being rendered (null outside of a render pass) */
    ctx: CanvasRenderingContext2D | null;
    /** Matrix currently applied on the context */
    matrix: ArrayLike<number> | null;
    fillStyle: unknown;
    strokeStyle: unknown;
    lineWidth: number | undefined;
    lineJoin: CanvasLineJoin | undefined;
    lineCap: CanvasLineCap | undefined;
    dash: unknown;
    dashWidth: number | undefined;
    hasShadow: boolean | undefined;
    font: string | undefined;
    textAlign: CanvasTextAlign | undefined;
    textBaseline: CanvasTextBaseline | undefined;
}

/** @internal */
export const state: RenderState = {
    ctx: null,
    matrix: null,
    fillStyle: undefined,
    strokeStyle: undefined,
    lineWidth: undefined,
    lineJoin: undefined,
    lineCap: undefined,
    dash: undefined,
    dashWidth: undefined,
    hasShadow: undefined,
    font: undefined,
    textAlign: undefined,
    textBaseline: undefined,
};

/**
 * Forget every known value (the context may have been changed outside of the render pass)
 * @internal
 */
export const invalidate = (): void => {
    state.matrix = null;
    state.fillStyle = undefined;
    state.strokeStyle = undefined;
    state.lineWidth = undefined;
    state.lineJoin = undefined;
    state.lineCap = undefined;
    state.dash = undefined;
    state.dashWidth = undefined;
    state.hasShadow = undefined;
    state.font = undefined;
    state.textAlign = undefined;
    state.textBaseline = undefined;
};

/**
 * Start a render pass on a context
 * @param ctx - Drawing context
 * @returns The previous state, to give to "end"
 * @internal
 */
export const start = (ctx: CanvasRenderingContext2D): RenderState => {
    // Render passes can be nested (a pattern rendering an off-screen canvas while drawing)
    const previous = {
        ...state,
    };
    invalidate();
    state.ctx = ctx;
    return previous;
};

/**
 * End a render pass
 * @param previous - State returned by "start"
 * @internal
 */
export const end = (previous: RenderState): void => {
    Object.assign(state, previous);
};

/**
 * Tell if the context is the one of the current render pass (only then known values can be trusted)
 * @param ctx - Drawing context
 * @internal
 */
export const isTracked = (ctx: CanvasRenderingContext2D): boolean => state.ctx === ctx;

/**
 * Set a context property only when different from the known value
 * @param ctx - Drawing context
 * @param property - Name of the property
 * @param value - New value
 * @internal
 */
export const set = <K extends "fillStyle" | "strokeStyle" | "lineWidth" | "lineJoin" | "lineCap" | "font" | "textAlign" | "textBaseline">(
    ctx: CanvasRenderingContext2D,
    property: K,
    value: CanvasRenderingContext2D[K],
): void => {
    if (state.ctx === ctx) {
        const known = state as unknown as Record<K, unknown>;
        if (known[property] === value) {
            return;
        }
        known[property] = value;
    }
    ctx[property] = value;
};
