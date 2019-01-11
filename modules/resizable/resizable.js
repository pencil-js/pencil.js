import Component from "@pencil.js/component";
import MouseEvent from "@pencil.js/mouse-event";
import Polygon from "@pencil.js/polygon";
import Rectangle from "@pencil.js/rectangle";
import Square from "@pencil.js/square";
import "@pencil.js/draggable";

/**
 * @typedef {Object} ResizableOptions
 * @extends DraggableOptions
 * @prop {Component} [handle] - Draggable shape used as handle (default is a right-triangle at the bottom right angle)
 */

/**
 * Enable resize on a rectangle
 * @param {ResizableOptions} options - Additional options
 * @return {DraggableAPI}
 */
Rectangle.prototype.resizable = function resizable (options) {
    this.isResizable = true;
    const size = 15;
    const mergedOptions = {
        x: true,
        y: true,
        handle: new Polygon([this.width, this.height], [
            [-size, 0],
            [0, -size],
        ], {
            fill: "gold",
            cursor: Component.cursors.seResize,
        }),
        ...options,
    };

    if (!(mergedOptions.x && mergedOptions.y) && this instanceof Square) {
        throw new TypeError("Square should be resizable in both x and y axis.");
    }

    this.add(mergedOptions.handle);
    const distanceToBottomRight = mergedOptions.handle.position.clone().multiply(-1).add(this.width, this.height);
    const api = mergedOptions.handle.draggable(mergedOptions);
    mergedOptions.handle.on(MouseEvent.events.drag, () => {
        if (this instanceof Square) {
            mergedOptions.handle.position.add(distanceToBottomRight);
            this.size = (mergedOptions.handle.position.x + mergedOptions.handle.position.y) / 2;
            mergedOptions.handle.position.set(this.size).subtract(distanceToBottomRight);
        }
        else {
            if (mergedOptions.x) {
                this.width = mergedOptions.handle.position.x + distanceToBottomRight.x;
            }
            if (mergedOptions.y) {
                this.height = mergedOptions.handle.position.y + distanceToBottomRight.y;
            }
        }

        this.fire(new MouseEvent(MouseEvent.events.resize, this, mergedOptions.handle.position));
    }, true);

    return api;
};
