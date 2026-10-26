import Component from "./component.js";
import type Container from "./container.js";
import MouseEvent from "./mouse-event.js";
import type Position from "./position.js";
import Vector, { type VectorDefinition } from "./vector.js";
import type Scene from "./scene.js";

/**
 * Draggable options
 */
export interface DraggableOptions {
    /** Can move along horizontal axis */
    x?: boolean;
    /** Can move along vertical axis */
    y?: boolean;
    /** Relative limit of freedom (in the parent space) */
    constrain?: VectorDefinition | null;
}

/**
 * Control over a draggable component
 */
export interface DraggableAPI {
    /** Change the "x" value in the draggable's options */
    x: boolean;
    /** Change the "y" value in the draggable's options */
    y: boolean;
    /** Change the "constrain" value in the draggable's options */
    constrain: VectorDefinition | null;
    /** Stop the component from being draggable */
    stop: () => void;
}

declare module "./component.js" {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    interface Component<O> {
        /** Is the component draggable */
        isDraggable?: boolean;
        /** Is the component currently dragged */
        isDragged?: boolean;
        /**
         * Make the component draggable (need to import "pencil.js/draggable")
         * @param options - Additional options
         */
        draggable (options?: DraggableOptions): DraggableAPI;
    }
}

/**
 * Convert a scene position into the parent space of a container
 * @param container - Any container
 * @param position - Position in the scene space
 */
const toParentSpace = (container: Container, position: Position): Position => (
    container.parent ? container.parent.toLocal(position) : position.clone()
);

Component.prototype.draggable = function draggable (this: Component, options?: DraggableOptions): DraggableAPI {
    if (this.isRotatable) {
        throw new Error("Component can't be both rotatable and draggable.");
    }

    const { cursors } = Component;
    const cursorNotSet = this.options.cursor === cursors.default;
    if (cursorNotSet) {
        this.options.cursor = cursors.grab;
    }
    this.isDraggable = true;
    this.isDragged = false;
    const settings: { x: boolean; y: boolean; constrain: Vector | null } = {
        x: options?.x ?? true,
        y: options?.y ?? true,
        constrain: options?.constrain ? Vector.from(options.constrain) : null,
    };

    let startPosition: Position | null = null;
    let originPosition: Position | null = null;

    const downHandler = ({ position }: MouseEvent) => {
        if (cursorNotSet) {
            this.options.cursor = cursors.grabbing;
        }

        startPosition = toParentSpace(this, position);
        originPosition = this.position.clone();

        this.isDragged = true;

        this.fire(new MouseEvent(MouseEvent.events.grab, this, this.position.clone()));
    };
    this.on(MouseEvent.events.down, downHandler, true);

    const moveHandler = ({ position }: MouseEvent) => {
        if (this.isDragged && startPosition && originPosition) {
            const difference = toParentSpace(this, position).subtract(startPosition);

            this.position.set(originPosition).add(settings.x ? difference.x : 0, settings.y ? difference.y : 0);
            if (settings.constrain) {
                this.position.constrain(settings.constrain.start, settings.constrain.end);
            }

            this.fire(new MouseEvent(MouseEvent.events.drag, this, this.position.clone()));
        }
    };
    const upHandler = () => {
        if (cursorNotSet && this.isDraggable) {
            this.options.cursor = cursors.grab;
        }
        if (this.isDragged && startPosition) {
            startPosition = null;
            this.isDragged = false;
            this.fire(new MouseEvent(MouseEvent.events.drop, this, this.position.clone()));
        }
    };

    let scene: Scene | null = null;
    this.getScene().then((theScene) => {
        if (this.isDraggable) {
            scene = theScene;
            scene
                .on(MouseEvent.events.move, moveHandler)
                .on(MouseEvent.events.up, upHandler);
        }
    });

    return {
        get x () {
            return settings.x;
        },
        set x (x: boolean) {
            settings.x = x;
        },
        get y () {
            return settings.y;
        },
        set y (y: boolean) {
            settings.y = y;
        },
        get constrain () {
            return settings.constrain;
        },
        set constrain (constrain: VectorDefinition | null) {
            settings.constrain = constrain ? Vector.from(constrain) : null;
        },
        stop: () => {
            this.removeListener(MouseEvent.events.down, downHandler);
            scene?.removeListener(MouseEvent.events.move, moveHandler).removeListener(MouseEvent.events.up, upHandler);
            if (cursorNotSet) {
                this.options.cursor = cursors.default;
            }
            this.isDraggable = false;
            this.isDragged = false;
        },
    };
};

export default Component;
