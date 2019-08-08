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
 */

/**
 * Set this component draggable
 * @param {DraggableOptions} [options] - Additional options
 * @return {DraggableAPI}
 */
Component.prototype.draggable = function draggable (options) {
    if (this.isDraggable) {
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
    mergedOptions.constrain = Vector.from(mergedOptions.constrain);

    let startPosition = null;
    let originPosition = null;
    this.on(MouseEvent.events.down, (event) => {
        if (cursorNotSet) {
            this.options.cursor = Component.cursors.grabbing;
        }

        startPosition = event.position;
        originPosition = this.position.clone();

        this.isDragged = true;

        this.fire(new MouseEvent(MouseEvent.events.grab, this, this.position.clone()));
    }, true);

    this.getScene().then(scene => scene.on(MouseEvent.events.move, (event) => {
        if (this.isDragged && startPosition) {
            const difference = event.position.clone().subtract(startPosition);

            const move = originPosition.clone().add(mergedOptions.x && difference.x, mergedOptions.y && difference.y);
            this.position.set(move);
            if (mergedOptions.constrain) {
                this.position.constrain(mergedOptions.constrain.start, mergedOptions.constrain.end);
            }

            this.fire(new MouseEvent(MouseEvent.events.drag, this, this.position.clone()));
        }
    }).on(MouseEvent.events.up, () => {
        if (cursorNotSet) {
            this.options.cursor = Component.cursors.grab;
        }
        if (this.isDragged && startPosition) {
            startPosition = null;

            this.isDragged = false;

            this.fire(new MouseEvent(MouseEvent.events.drop, this, this.position.clone()));
        }
    }));

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
            mergedOptions.constrain = Vector.from(constrain);
        },
    };
};
