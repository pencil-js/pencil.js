/**
 * Bridge jsdom (no canvas support) with @napi-rs/canvas (a real 2D renderer)
 * so tests run against actual drawing, hit-testing and pixel output.
 */
import {
    createCanvas,
    DOMMatrix as NapiDOMMatrix,
    ImageData as NapiImageData,
    Path2D as NapiPath2D,
    type Canvas,
    type SKRSContext2D,
} from "@napi-rs/canvas";

const backing = new WeakMap<HTMLCanvasElement, Canvas>();
const contexts = new WeakMap<HTMLCanvasElement, SKRSContext2D>();

const getBacking = (element: HTMLCanvasElement): Canvas => {
    let canvas = backing.get(element);
    if (!canvas) {
        canvas = createCanvas(Number(element.getAttribute("width") ?? 300), Number(element.getAttribute("height") ?? 150));
        backing.set(element, canvas);
    }
    return canvas;
};

// Any image-like source must be converted to something napi can draw
const toNapiSource = (source: unknown): unknown => {
    if (source instanceof window.HTMLCanvasElement) {
        return getBacking(source);
    }
    if (source instanceof window.HTMLImageElement) {
        return (source as unknown as { napi?: unknown }).napi ?? createCanvas(1, 1);
    }
    return source;
};

const proto = window.HTMLCanvasElement.prototype;

for (const dimension of ["width", "height"] as const) {
    Object.defineProperty(proto, dimension, {
        configurable: true,
        get (this: HTMLCanvasElement) {
            return getBacking(this)[dimension];
        },
        set (this: HTMLCanvasElement, value: number) {
            // Resizing a canvas resets its content and state, like in browsers
            getBacking(this)[dimension] = Math.max(0, Math.floor(Number(value)) || 0);
        },
    });
}

proto.getContext = function getContext (this: HTMLCanvasElement, type: string) {
    if (type !== "2d") {
        return null;
    }
    if (!contexts.has(this)) {
        const element = this;
        const ctx = getBacking(element).getContext("2d");
        const proxy = new Proxy(ctx, {
            get (target, key) {
                if (key === "canvas") {
                    return element;
                }
                if (key === "drawImage") {
                    const draw = target.drawImage as (...a: Array<unknown>) => void;
                    return (source: unknown, ...args: Array<number>) => draw.call(target, toNapiSource(source), ...args);
                }
                if (key === "createPattern") {
                    return (source: unknown, repeat: string) => target.createPattern(toNapiSource(source) as never, repeat as never);
                }
                const value = Reflect.get(target, key, target);
                return typeof value === "function" ? value.bind(target) : value;
            },
            set (target, key, value) {
                return Reflect.set(target, key, value, target);
            },
        });
        contexts.set(this, proxy as unknown as SKRSContext2D);
    }
    return contexts.get(this);
} as typeof proto.getContext;

proto.toDataURL = function toDataURL (this: HTMLCanvasElement, type = "image/png") {
    return getBacking(this).toDataURL(type as "image/png");
};

Object.assign(globalThis, {
    Path2D: NapiPath2D,
    DOMMatrix: NapiDOMMatrix,
    ImageData: NapiImageData,
});
Object.assign(window, {
    Path2D: NapiPath2D,
    DOMMatrix: NapiDOMMatrix,
    ImageData: NapiImageData,
});

// Font loading API is missing from jsdom
class FakeFontFace {
    family: string;

    constructor (family: string) {
        this.family = family;
    }

    load () {
        return Promise.resolve(this);
    }
}
Object.assign(window, {
    FontFace: FakeFontFace,
});
Object.defineProperty(window.document, "fonts", {
    configurable: true,
    value: new Set(),
});

// Images "load" instantly when their src is a data URL or a known fake URL
Object.defineProperty(window.HTMLImageElement.prototype, "src", {
    configurable: true,
    get (this: HTMLImageElement) {
        return this.getAttribute("src") ?? "";
    },
    set (this: HTMLImageElement, value: string) {
        this.setAttribute("src", value);
        queueMicrotask(() => {
            if (value.includes("error") || !/\.(png|jpe?g|gif|webp|svg)$|^data:/.test(value)) {
                this.dispatchEvent(new window.Event("error"));
                return;
            }
            const size = /(\d+)x(\d+)/.exec(value);
            const width = size ? Number(size[1]) : 10;
            const height = size ? Number(size[2]) : 10;
            const napi = createCanvas(width, height);
            const ctx = napi.getContext("2d");
            ctx.fillStyle = "#f00";
            ctx.fillRect(0, 0, width, height);
            Object.assign(this, {
                napi,
            });
            Object.defineProperty(this, "naturalWidth", {
                configurable: true,
                value: width,
            });
            Object.defineProperty(this, "naturalHeight", {
                configurable: true,
                value: height,
            });
            this.width = width;
            this.height = height;
            this.dispatchEvent(new window.Event("load"));
        });
    },
});

window.requestAnimationFrame = (callback: FrameRequestCallback) => setTimeout(() => callback(performance.now()), 16) as unknown as number;
window.cancelAnimationFrame = (id: number) => clearTimeout(id);
