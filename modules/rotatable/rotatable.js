import Component from "@pencil.js/component";
import MouseEvent from "@pencil.js/mouse-event";

/**
 * Set this component rotatable (use drag and drop interaction to rotate)
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
    this.on(MouseEvent.events.down, (event) => {
        if (cursorNotSet) {
            this.options.cursor = Component.cursors.grabbing;
        }

        previousAngle = this.options.rotation;
        startingAngle = event.position.subtract(this.position).angle;

        this.isRotated = true;

        this.fire(new MouseEvent(MouseEvent.events.grab, this, event.position));
    });

    this.getScene().then(scene => scene.on(MouseEvent.events.move, (event) => {
        if (previousAngle !== null) {
            this.options.rotation = previousAngle + event.position.subtract(this.position).angle - startingAngle;
            this.fire(new MouseEvent(MouseEvent.events.rotate, this, event.position));
        }
    }).on(MouseEvent.events.up, (event) => {
        if (cursorNotSet) {
            this.options.cursor = Component.cursors.grab;
        }
        if (previousAngle !== null && this.isRotated) {
            previousAngle = null;
            startingAngle = null;

            this.isRotated = false;

            this.fire(new MouseEvent(MouseEvent.events.drop, this, event.position));
        }
    }));
};
