import Component from "@pencil.js/component";
import MouseEvent from "@pencil.js/mouse-event";

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
 * @param {DraggableOptions} options - Additional options
 * @return {DraggableAPI}
 */
Component.prototype.draggable = function draggable (options) {
    const cursorNotSet = this.options.cursor === Component.cursors.default;
    if (cursorNotSet) {
        this.options.cursor = Component.cursors.grab;
    }
    this.isDraggable = true;
    const mergedOptions = Object.assign({
        x: true,
        y: true,
    }, options);

    let startPosition = null;
    let originPosition = null;
    this.on(MouseEvent.events.down, (event) => {
        if (cursorNotSet) {
            this.options.cursor = Component.cursors.grabbing;
        }
        startPosition = event.position;
        originPosition = this.position.clone();
        this.isDragged = true;

        this.fire(new MouseEvent(this, MouseEvent.events.grab, event.position));
    }, true);

    this.getScene().then(scene => scene.on(MouseEvent.events.move, (event) => {
        if (this.isDragged && startPosition) {
            const difference = event.position.clone().subtract(startPosition);

            const move = originPosition.clone().add(mergedOptions.x && difference.x, mergedOptions.y && difference.y);
            this.position.set(move);
            if (mergedOptions.constrain) {
                this.position.constrain(mergedOptions.constrain);
            }

            this.fire(new MouseEvent(this, MouseEvent.events.drag, event.position));
        }
    }).on(MouseEvent.events.up, (event) => {
        if (cursorNotSet) {
            this.options.cursor = Component.cursors.grab;
        }
        this.isDragged = false;
        startPosition = null;

        this.fire(new MouseEvent(this, MouseEvent.events.drop, event.position));
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
            mergedOptions.constrain = constrain;
        },
    };
};
