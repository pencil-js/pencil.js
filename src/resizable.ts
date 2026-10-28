import Component from "./component.js";
import MouseEvent from "./mouse-event.js";
import Polygon from "./polygon.js";
import Position from "./position.js";
import Rectangle from "./rectangle.js";
import Square from "./square.js";
import type { DraggableAPI, DraggableOptions } from "./draggable.js";
import "./draggable.js";

/**
 * Resizable options
 */
export interface ResizableOptions extends Omit<DraggableOptions, "constrain"> {
    /** Draggable shape used as handle (default is a right-triangle at the bottom right angle) */
    handle?: Component;
}

declare module "./rectangle.js" {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    interface Rectangle<O> {
        /** Is the rectangle resizable */
        isResizable?: boolean;
        /**
         * Make the rectangle resizable with a handle (need to import "pencil.js/resizable")
         * @param options - Additional options
         */
        resizable (options?: ResizableOptions): DraggableAPI;
    }
}

const HANDLE_SIZE = 15;

Rectangle.prototype.resizable = function resizable (this: Rectangle, options?: ResizableOptions): DraggableAPI {
    if (this.options.rotation % 1 !== 0) {
        throw new EvalError("Resizable don't support rotation.");
    }

    const origin = this.getOrigin();
    if (origin.x !== 0 || origin.y !== 0) {
        throw new EvalError("Resizable don't support other origin than [0, 0] or topLeft.");
    }

    const isSquare = this instanceof Square;
    const settings = {
        x: options?.x ?? true,
        y: options?.y ?? true,
    };

    if (isSquare && !(settings.x && settings.y)) {
        throw new TypeError("Square should be resizable in both x and y axis.");
    }

    this.isResizable = true;
    const handle = options?.handle ?? new Polygon([this.width, this.height], [
        [0, 0],
        [-HANDLE_SIZE, 0],
        [0, -HANDLE_SIZE],
    ], {
        fill: "gold",
        cursor: Component.cursors.seResize,
    });

    this.add(handle);
    // Distance between the handle's position and the bottom-right corner
    const shift = new Position(this.width, this.height).subtract(handle.position);
    const api = handle.draggable(settings);

    handle.on(MouseEvent.events.drag, () => {
        const corner = handle.position.clone().add(shift);
        if (isSquare) {
            (this as Square).size = Math.max(0, (corner.x + corner.y) / 2);
        }
        else {
            if (settings.x) {
                this.width = Math.max(0, corner.x);
            }
            if (settings.y) {
                this.height = Math.max(0, corner.y);
            }
        }
        handle.position.set(this.width, this.height).subtract(shift);

        this.fire(new MouseEvent(MouseEvent.events.resize, this, handle.position.clone()));
    }, true);

    // Keep the handle in place when the size is changed by other means
    this.on(Component.events.draw, () => {
        if (!handle.isDragged) {
            handle.position.set(this.width, this.height).subtract(shift);
        }
    }, true);

    return api;
};

export default Rectangle;
