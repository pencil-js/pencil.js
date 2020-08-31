import Component from "@pencil.js/component";
import MouseEvent from "@pencil.js/mouse-event";
import Vector from "@pencil.js/vector";

/**
 * @typedef {Object} DraggableOptions
 * @prop {Boolean} [x=true] - Can move along vertical axis
 * @prop {Boolean} [y=true] - Can move along horizontal axis
 * @prop {Vector} [constrain] - Relative limit of freedom
 */

/**
 * @typedef {Object} DraggableAPI
 * @prop {Function} x - Change the "x" value in the draggable's options
 * @prop {Function} y - Change the "y" value in the draggable's options
 * @prop {Function} constrain - Change the "constrain" value in the draggable's options
 * @prop {Function} stop - Stop the component from being draggable
 */

/**
 * Set this component draggable
 * @param {DraggableOptions} [options] - Additional options
 * @return {DraggableAPI}
 */
Component.prototype.draggable = function draggable (options) {
    if (this.isRotatable) {
        throw new Error("Component can't be both rotatable and draggable.");
    }

    const cursorNotSet = this.options.cursor === Component.cursors.default;
    if (cursorNotSet) {
        this.options.cursor = Component.cursors.grab;
    }
    this.isDraggable = true;
    this.isDragged = false;
    const mergedOptions = {
        x: true,
        y: true,
        ...options,
    };
    if (mergedOptions.constrain) {
        mergedOptions.constrain = Vector.from(mergedOptions.constrain);
    }

    let startPosition = null;
    let originPosition = null;
    const downHandler = ({ position }) => {
        if (cursorNotSet) {
            this.options.cursor = Component.cursors.grabbing;
        }

        startPosition = position;
        originPosition = this.position.clone();

        this.isDragged = true;

        this.fire(new MouseEvent(MouseEvent.events.grab, this, this.position.clone()));
    };
    this.on(MouseEvent.events.down, downHandler, true);

    const moveHandler = (event) => {
        if (this.isDragged && startPosition) {
            const difference = event.position.clone().subtract(startPosition);

            const move = originPosition.clone().add(mergedOptions.x && difference.x, mergedOptions.y && difference.y);
            this.position.set(move);
            if (mergedOptions.constrain) {
                this.position.constrain(mergedOptions.constrain.start, mergedOptions.constrain.end);
            }

            this.fire(new MouseEvent(MouseEvent.events.drag, this, this.position.clone()));
        }
    };
    const upHandler = () => {
        if (cursorNotSet) {
            this.options.cursor = Component.cursors.grab;
        }
        if (this.isDragged && startPosition) {
            startPosition = null;

            this.isDragged = false;

            this.fire(new MouseEvent(MouseEvent.events.drop, this, this.position.clone()));
        }
    };
    let scene;
    this.getScene().then((theScene) => {
        if (this.isDraggable) {
            scene = theScene;
            scene
                .on(MouseEvent.events.move, moveHandler)
                .on(MouseEvent.events.up, upHandler);
        }
    });

    return {
        /**
         * Set the draggable "x" option
         * @param {Boolean} x - New value for "x"
         */
        set x (x) {
            mergedOptions.x = x;
        },

        /**
         * Set the draggable "y" option
         * @param {Boolean} y - New value for "y"
         */
        set y (y) {
            mergedOptions.y = y;
        },

        /**
         * Set the draggable "constrain" option
         * @param {Vector} constrain - New value for "constrain"
         */
        set constrain (constrain) {
            mergedOptions.constrain = constrain ? Vector.from(constrain) : constrain;
        },

        /**
         * Stop the component from being draggable
         */
        stop: () => {
            this.removeListener(MouseEvent.events.down, downHandler);
            if (scene) {
                scene
                    .removeListener(MouseEvent.events.move, moveHandler)
                    .removeListener(MouseEvent.events.up, upHandler);
            }
            if (cursorNotSet) {
                this.options.cursor = Component.cursors.default;
            }
            this.isDraggable = false;
            this.isDragged = false;
        },
    };
};
