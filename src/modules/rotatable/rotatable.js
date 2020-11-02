import Component from "@pencil.js/component";
import MouseEvent from "@pencil.js/mouse-event";

/**
 * @module Rotatable
 */

/**
 * @typedef {Object} RotatableAPI
 * @prop {Function} stop - Stop the component from being rotatable
 */

/**
 * Set this component rotatable (use drag and drop interaction to rotate)
 * @return {RotatableAPI}
 * @memberOf Component
 */
Component.prototype.rotatable = function rotatable () {
    if (this.isDraggable) {
        throw new Error("Component can't be both draggable and rotatable.");
    }

    const cursorNotSet = this.options.cursor === Component.cursors.default;
    if (cursorNotSet) {
        this.options.cursor = Component.cursors.grab;
    }

    this.isRotatable = true;
    this.isRotated = false;

    let previousAngle = null;
    let startingAngle = null;
    const downHandler = ({ position }) => {
        if (cursorNotSet) {
            this.options.cursor = Component.cursors.grabbing;
        }

        previousAngle = this.options.rotation;
        startingAngle = position.subtract(this.getAbsolutePosition()).angle;

        this.isRotated = true;

        this.fire(new MouseEvent(MouseEvent.events.grab, this, position));
    };
    this.on(MouseEvent.events.down, downHandler);

    const moveHandler = ({ position }) => {
        if (previousAngle !== null) {
            const absolutePosition = this.getAbsolutePosition();
            this.options.rotation = previousAngle + position.subtract(absolutePosition).angle - startingAngle;
            this.fire(new MouseEvent(MouseEvent.events.rotate, this, position));
        }
    };
    const upHandler = ({ position }) => {
        if (cursorNotSet) {
            this.options.cursor = Component.cursors.grab;
        }
        if (previousAngle !== null && this.isRotated) {
            previousAngle = null;
            startingAngle = null;

            this.isRotated = false;

            this.fire(new MouseEvent(MouseEvent.events.drop, this, position));
        }
    };
    let scene;
    this.getScene().then((theScene) => {
        if (this.isRotatable) {
            scene = theScene;
            scene
                .on(MouseEvent.events.move, moveHandler)
                .on(MouseEvent.events.up, upHandler);
        }
    });

    return {
        /**
         * Stop the component from being rotatable
         * @memberOf RotatableAPI#
         */
        stop: () => {
            this.removeListener(MouseEvent.events.down, downHandler, true);
            if (scene) {
                scene
                    .removeListener(MouseEvent.events.move, moveHandler)
                    .removeListener(MouseEvent.events.up, upHandler);
            }
            if (cursorNotSet) {
                this.options.cursor = Component.cursors.default;
            }
            this.isRotatable = false;
            this.isRotated = false;
        },
    };
};
