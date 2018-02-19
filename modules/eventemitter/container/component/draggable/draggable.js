import Component from "views/component";
import MouseEvent from "events/mouse";

/**
 * @typedef {Object} DraggableOptions
 * @prop {Boolean} [x=true] - Can move along vertical axis
 * @prop {Boolean} [y=true] - Can move along horizontal axis
 * @prop {Vector} [constrain] - Relative limit of freedom (if set, will ignore x and y options)
 */

/**
 * Set this component draggable
 * @param {DraggableOptions} options
 */
Component.prototype.draggable = function(options) {
    this.isDraggable = true;
    if (!this.options.cursor) {
        this.options.cursor = "-webkit-grab";
    }
    let mergedOptions = Object.assign({
        x: true,
        y: true
    }, options);

    let startPosition = null;
    this.on("mousedown", function(event) {
        startPosition = event.position.subtract(this.position);
        this.isDragged = true;

        this.fire(new MouseEvent(this, "grab", event.position));
    }, true);

    this.getRoot().on("mousemove", function(event) {
        if (this.isDragged && startPosition) {
            let newPosition = event.position.subtract(startPosition);

            if (mergedOptions.constrain) {
                const constrain = mergedOptions.constrain;
                this.position.x = Math.max(constrain.start.x, Math.min(newPosition.x, constrain.end.x));
                this.position.y = Math.max(constrain.start.y, Math.min(newPosition.y, constrain.end.y));
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
    }.bind(this)).on("mouseup", function(event) {
        this.isDragged = false;
        startPosition = null;

        this.fire(new MouseEvent(this, "drop", event.position));
    }.bind(this));

    return {
        set x(x) {
            mergedOptions.x = x;
        },

        set y(y) {
            mergedOptions.y = y;
        },

        set constrain(constrain) {
            mergedOptions.constrain = constrain;
        }
    };
};
