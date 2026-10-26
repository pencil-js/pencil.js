import Component from "./component.js";
import MouseEvent from "./mouse-event.js";
import Position from "./position.js";
import type Scene from "./scene.js";

/**
 * Control over a rotatable component
 */
export interface RotatableAPI {
    /** Stop the component from being rotatable */
    stop: () => void;
}

declare module "./component.js" {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    interface Component<O> {
        /** Is the component rotatable */
        isRotatable?: boolean;
        /** Is the component currently rotated */
        isRotated?: boolean;
        /**
         * Make the component rotatable (need to import "pencil.js/rotatable")
         */
        rotatable (): RotatableAPI;
    }
}

Component.prototype.rotatable = function rotatable (this: Component): RotatableAPI {
    if (this.isDraggable) {
        throw new Error("Component can't be both draggable and rotatable.");
    }

    const { cursors } = Component;
    const cursorNotSet = this.options.cursor === cursors.default;
    if (cursorNotSet) {
        this.options.cursor = cursors.grab;
    }

    this.isRotatable = true;
    this.isRotated = false;

    // Center of rotation in the scene space
    const getPivot = () => {
        const center = this.position.clone().add(Position.from(this.options.rotationCenter));
        return this.parent ? this.parent.toGlobal(center) : center;
    };

    let previousAngle: number | null = null;
    let startingAngle = 0;
    const downHandler = ({ position }: MouseEvent) => {
        if (cursorNotSet) {
            this.options.cursor = cursors.grabbing;
        }

        previousAngle = this.options.rotation;
        startingAngle = position.clone().subtract(getPivot()).angle;

        this.isRotated = true;

        this.fire(new MouseEvent(MouseEvent.events.grab, this, position));
    };
    this.on(MouseEvent.events.down, downHandler, true);

    const moveHandler = ({ position }: MouseEvent) => {
        if (previousAngle !== null) {
            this.options.rotation = previousAngle + position.clone().subtract(getPivot()).angle - startingAngle;
            this.fire(new MouseEvent(MouseEvent.events.rotate, this, position));
        }
    };
    const upHandler = ({ position }: MouseEvent) => {
        if (cursorNotSet && this.isRotatable) {
            this.options.cursor = cursors.grab;
        }
        if (previousAngle !== null && this.isRotated) {
            previousAngle = null;
            this.isRotated = false;
            this.fire(new MouseEvent(MouseEvent.events.drop, this, position));
        }
    };

    let scene: Scene | null = null;
    this.getScene().then((theScene) => {
        if (this.isRotatable) {
            scene = theScene;
            scene
                .on(MouseEvent.events.move, moveHandler)
                .on(MouseEvent.events.up, upHandler);
        }
    });

    return {
        stop: () => {
            this.removeListener(MouseEvent.events.down, downHandler);
            scene?.removeListener(MouseEvent.events.move, moveHandler).removeListener(MouseEvent.events.up, upHandler);
            if (cursorNotSet) {
                this.options.cursor = cursors.default;
            }
            this.isRotatable = false;
            this.isRotated = false;
        },
    };
};

export default Component;
