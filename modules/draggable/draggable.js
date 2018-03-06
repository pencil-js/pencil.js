import Component from "@pencil.js/component";
import MouseEvent from "@pencil.js/mouseevent";

/**
 * @typedef {Object} DraggableOptions
 * @prop {Boolean} [x=true] - Can move along vertical axis
 * @prop {Boolean} [y=true] - Can move along horizontal axis
 * @prop {Vector} [constrain] - Relative limit of freedom (if set, will ignore x and y options)
 */

/**
 * @typedef {Object} DraggableAPI
 * @prop {Function} x - Change the "x" value in the draggable's options
 * @prop {Function} y - Change the "y" value in the draggable's options
 * @prop {Function} constrain - Change the "constrain" value in the draggable's options
 */

/**
 * Set this component draggable
 * @param {DraggableOptions} options - Additional options
 * @return {DraggableAPI}
 */
Component.prototype.draggable = function draggable (options) {
    this.isDraggable = true;
    if (!this.options.cursor) {
        this.options.cursor = "-webkit-grab";
    }
    const mergedOptions = Object.assign({
        x: true,
        y: true,
    }, options);

    let startPosition = null;
    this.on("mousedown", function draggableMouseDownCallback (event) {
        startPosition = event.position.subtract(this.position);
        this.isDragged = true;

        this.fire(new MouseEvent(this, "grab", event.position));
    }, true);

    this.getRoot().on("mousemove", (event) => {
        if (this.isDragged && startPosition) {
            const newPosition = event.position.subtract(startPosition);

            if (mergedOptions.constrain) {
                const constrainer = mergedOptions.constrain;
                this.position.x = Math.max(constrainer.start.x, Math.min(newPosition.x, constrainer.end.x));
                this.position.y = Math.max(constrainer.start.y, Math.min(newPosition.y, constrainer.end.y));
            }
            else {
                if (mergedOptions.x) {
                    this.position.x = newPosition.x;
                }
                if (mergedOptions.y) {
                    this.position.y = newPosition.y;
                }
            }

            this.fire(new MouseEvent(this, "drag", event.position));
        }
    }).on("mouseup", (event) => {
        this.isDragged = false;
        startPosition = null;

        this.fire(new MouseEvent(this, "drop", event.position));
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
            mergedOptions.constrain = constrain;
        },
    };
};
