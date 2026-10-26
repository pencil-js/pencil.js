import Component from "./component.js";
import type Container from "./container.js";
import type { ContainerJSON } from "./container.js";
import KeyboardEvent from "./keyboard-event.js";
import MouseEvent from "./mouse-event.js";
import OffScreenCanvas, { type OffScreenCanvasOptions } from "./offscreen-canvas.js";
import Position from "./position.js";
import { createContext } from "./internal/canvas.js";

/**
 * Scene options
 */
export interface SceneOptions extends OffScreenCanvasOptions {
    /** Cursor on hover */
    cursor: string | null;
}

/**
 * Maximum distance (in pixels) between pointer down and up to be considered a click
 */
const CLICK_TOLERANCE = 10;

/**
 * Root of every drawing, linked to a canvas displayed on screen and handling user interactions
 */
export class Scene<O extends SceneOptions = SceneOptions> extends OffScreenCanvas<O> {
    static override get className (): string {
        return "Scene";
    }

    override readonly isScene: boolean = true;

    /** Last known pointer position */
    cursorPosition: Position;

    /** Is the scene rendered every frame */
    isLooped: boolean;

    /** Is the scene clicked */
    isClicked: boolean;

    /** Number of frame per seconds (only when looped) */
    fps: number;

    /** Timestamp of the last render */
    lastTick: number | null;

    #frameId: number | null = null;

    #abort: AbortController = new AbortController();

    #ownCanvas: boolean;

    /**
     * Scene constructor
     * @param container - Container of the renderer (or a canvas to use)
     * @param options - Specific options
     */
    constructor (container: HTMLElement = window.document.body, options?: Partial<O>) {
        super(1, 1, options);

        if (container === window.document.body) {
            container.style.margin = "0";
            container.style.height = `${window.innerHeight}px`;
        }

        if (container instanceof window.HTMLCanvasElement) {
            const ctx = container.getContext("2d");
            if (!ctx) {
                throw new Error("Canvas 2D rendering context is not supported.");
            }
            this.ctx = ctx;
            this.#ownCanvas = false;
        }
        else {
            this.ctx = Scene.getDrawingContext(container);
            container.appendChild(this.ctx.canvas);
            this.#ownCanvas = true;
        }

        // Prevent browser gestures (scroll, zoom) on touch devices
        this.ctx.canvas.style.touchAction = "none";

        this.cursorPosition = new Position();
        this.isLooped = false;
        this.isClicked = false;
        this.fps = 0;
        this.lastTick = null;

        this.#listenForEvents();
    }

    /**
     * Change the cursor displayed over the canvas
     * @param cursor - Cursor string
     * @returns Itself
     */
    setCursor (cursor: string | null = Component.cursors.default): this {
        this.ctx.canvas.style.cursor = cursor ?? "";
        return this;
    }

    /**
     * Draw the whole scene
     * @returns Itself
     */
    override render (): this {
        if (this.isLooped) {
            this.#frameId = window.requestAnimationFrame(() => this.render());
        }

        try {
            super.render();
        }
        catch (error) {
            this.stopLoop();
            throw error;
        }

        const now = window.performance.now();
        if (this.isLooped && this.lastTick) {
            this.fps = 1000 / (now - this.lastTick);
        }
        this.lastTick = now;

        return this;
    }

    /**
     * A scene is always hovered when shown
     */
    override isHover (): boolean {
        return this.options.shown;
    }

    /**
     * Start to render the scene each frame
     * @returns Itself
     */
    startLoop (): this {
        if (!this.isLooped) {
            this.isLooped = true;
            this.render();
        }
        return this;
    }

    /**
     * Stop scene from being rendered
     * @returns Itself
     */
    stopLoop (): this {
        this.isLooped = false;
        this.fps = 0;
        if (this.#frameId !== null) {
            window.cancelAnimationFrame(this.#frameId);
            this.#frameId = null;
        }
        return this;
    }

    override hide (): this {
        this.ctx.canvas.style.visibility = "hidden";
        return super.hide();
    }

    override show (): this {
        this.ctx.canvas.style.visibility = "";
        return super.show();
    }

    /**
     * Stop rendering, remove every listener and remove the canvas from the page (when created by the scene)
     * @returns Itself
     */
    destroy (): this {
        this.stopLoop();
        this.#abort.abort();
        this.removeAllListener();
        if (this.#ownCanvas) {
            this.ctx.canvas.remove();
        }
        return this;
    }

    /**
     * Convert a DOM event coordinates into the scene space
     * @param event - Any DOM mouse/pointer event
     */
    getEventPosition (event: { clientX: number; clientY: number }): Position {
        const { canvas } = this.ctx;
        const rect = canvas.getBoundingClientRect();
        const ratioX = rect.width ? canvas.width / rect.width : 1;
        const ratioY = rect.height ? canvas.height / rect.height : 1;
        return new Position((event.clientX - rect.left) * ratioX, (event.clientY - rect.top) * ratioY);
    }

    /**
     * Bind events and call them on targets
     */
    #listenForEvents (): void {
        const { signal } = this.#abort;
        const { canvas } = this.ctx;
        const { events } = MouseEvent;

        let hovered: Container | null = null;
        let startPosition: Position | null = null;

        const fire = (name: string, target: Container, position: Position, event?: Event) => {
            target.fire(new MouseEvent(name, target, position, event));
        };

        const handlers: Record<string, ((target: Container, position: Position, event: Event) => void) | null> = {
            [events.down]: (target, position, event) => {
                (target as Component).isClicked = true;
                this.isClicked = true;
                startPosition = position;
                // Keep receiving events when the pointer goes out of the canvas while pressed
                const { pointerId } = event as PointerEvent;
                if (pointerId !== undefined) {
                    try {
                        canvas.setPointerCapture(pointerId);
                    }
                    catch {
                        // Unsupported or invalid pointer
                    }
                }
            },
            [events.move]: (target, position) => {
                if (startPosition && position.distance(startPosition) >= CLICK_TOLERANCE) {
                    (target as Component).isClicked = false;
                }
                if (target !== hovered) {
                    if (hovered) {
                        (hovered as Component).isHovered = false;
                        if (!hovered.isAncestorOf(target)) {
                            fire(events.leave, hovered, position);
                        }
                    }
                    hovered = target;
                }
                const component = target as Component;
                if (!component.isHovered) {
                    component.isHovered = true;
                    fire(events.hover, target, position);
                }
                this.setCursor((target.options as Partial<SceneOptions>).cursor ?? null);
                this.cursorPosition.set(position);
            },
            [events.up]: (target, position, event) => {
                startPosition = null;
                this.isClicked = false;
                const component = target as Component;
                if (component.isClicked) {
                    component.isClicked = false;
                    fire(events.click, target, position, event);
                }
            },
            [events.wheel]: (target, position, event) => {
                const [scroll, zoom] = (event as WheelEvent).deltaY > 0 ?
                    [events.scrollDown, events.zoomOut] :
                    [events.scrollUp, events.zoomIn];
                fire(scroll, target, position, event);
                fire(zoom, target, position, event);
            },
            [events.contextMenu]: null,
            [events.doubleClick]: null,
        };

        // DOM event name => Pencil.js event name
        const domEvents: Record<string, string> = {
            pointerdown: events.down,
            pointermove: events.move,
            pointerup: events.up,
            wheel: events.wheel,
            contextmenu: events.contextMenu,
            dblclick: events.doubleClick,
        };

        for (const [domName, eventName] of Object.entries(domEvents)) {
            canvas.addEventListener(domName, (event) => {
                if (!this.options.shown) {
                    return;
                }
                const position = this.getEventPosition(event as globalThis.MouseEvent);
                const target = this.getTarget(position, this.ctx);
                if (target) {
                    fire(eventName, target, position, event);
                    handlers[eventName]?.(target, position, event);
                }
            }, {
                passive: false,
                signal,
            });
        }

        canvas.addEventListener("pointerleave", (event) => {
            if (hovered && !this.isClicked) {
                (hovered as Component).isHovered = false;
                fire(events.leave, hovered, this.getEventPosition(event), event);
                hovered = null;
            }
        }, {
            signal,
        });

        for (const eventName of Object.values(KeyboardEvent.events)) {
            window.document.addEventListener(eventName, (event) => {
                if (this.options.shown) {
                    this.fire(new KeyboardEvent(eventName, this, event as globalThis.KeyboardEvent));
                }
            }, {
                signal,
            });
        }
    }

    /**
     * Return an instance from a generic object
     * @param definition - Scene definition
     */
    static override from (definition: ContainerJSON): Scene {
        return new this(undefined, definition.options);
    }

    /**
     * Build a canvas filling the given element
     * @param container - Element holding the canvas
     * @param height - Canvas height (when the first argument is a width)
     */
    static override getDrawingContext (container: HTMLElement | number = window.document.body, height = 1): CanvasRenderingContext2D {
        if (typeof container === "number") {
            return createContext(container, height);
        }
        const { scrollWidth, scrollHeight } = container;
        const ctx = createContext(scrollWidth || 1, scrollHeight || 1);
        ctx.canvas.style.display = "block";
        ctx.canvas.style.position = "absolute";
        return ctx;
    }

    /**
     * Default options for this class
     */
    static override get defaultOptions (): SceneOptions {
        return {
            ...super.defaultOptions,
            cursor: Component.cursors.default,
        };
    }

    /**
     * Set of events for easy access
     */
    static override get events () {
        return {
            ...super.events,
            /** Ask to change the displayed scene (see Navigation) */
            change: "change-scene",
        };
    }
}

export default Scene;
