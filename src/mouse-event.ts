import BaseEvent from "./base-event.js";
import Position, { type PositionDefinition } from "./position.js";

const mouseEventButtons = {
    /** Left button on a classic right-handed mouse */
    left: "0",
    /** Main button */
    main: "0",
    /** The scroll wheel */
    wheel: "1",
    /** Middle button, usually the scroll wheel */
    middle: "1",
    /** Right button on a classic right-handed mouse */
    right: "2",
    /** Secondary button */
    secondary: "2",
    /** Browse backward button */
    backward: "3",
    /** First auxiliary button, usually the browse backward button */
    aux1: "3",
    /** Browse forward button */
    forward: "4",
    /** Second auxiliary button, usually the browse forward button */
    aux2: "4",
} as const;

const mouseEventEvents = {
    /** Pointer button is pressed */
    down: "mousedown",
    /** Pointer button is released */
    up: "mouseup",
    /** Pointer button is pressed then released without moving */
    click: "click",
    /** Context menu is requested (usually right click) */
    contextMenu: "contextmenu",
    /** Pointer is moved */
    move: "mousemove",
    /** Pointer goes hover a component */
    hover: "hover",
    /** Pointer leave a component */
    leave: "leave",
    /** Mouse wheel is scrolled in any direction */
    wheel: "mousewheel",
    /** Mouse wheel is scrolled down */
    scrollDown: "scrolldown",
    /** Mouse wheel is scrolled up */
    scrollUp: "scrollup",
    /** Mouse wheel is scrolled down (away from the screen) */
    zoomOut: "zoomout",
    /** Mouse wheel is scrolled up (toward the screen) */
    zoomIn: "zoomin",
    /** Pointer is pressed on a draggable component */
    grab: "grab",
    /** Pointer is moved while grabbing a component */
    drag: "drag",
    /** Pointer is release after dragging a component */
    drop: "drop",
    /** Pointer is moved while holding the handle of a resizable component */
    resize: "resize",
    /** Pointer is rotating a component */
    rotate: "rotate",
    /** Pointer is clicked twice rapidly */
    doubleClick: "dblclick",
} as const;

/**
 * Mouse (or any pointer, touch included) event class
 */
export class MouseEvent<T = unknown> extends BaseEvent<T> {
    /** Position of the pointer when the event trigger */
    position: Position;

    /** Pressed button ("0" for the main button) */
    button: string | null;

    /**
     * MouseEvent constructor
     * @param name - Name of the event
     * @param target - Component concerned by the event
     * @param positionDefinition - Position of the mouse when event trigger
     * @param event - Original HTML event
     */
    constructor (name: string, target: T, positionDefinition?: PositionDefinition, event?: Event) {
        super(name, target, event);
        this.position = Position.from(positionDefinition);
        this.button = event && "button" in event ? String((event as globalThis.MouseEvent).button) : null;
    }

    override getModifier (): string | null {
        return this.button;
    }

    /**
     * Set of buttons on a pointing device for easy access
     * @example scene.on(`${MouseEvent.events.down}.${MouseEvent.buttons.middle}`, () => {
     *     console.log("User pressed the middle mouse button");
     * });
     */
    static get buttons () {
        return mouseEventButtons;
    }

    /**
     * Set of events for easy access
     */
    static get events () {
        return mouseEventEvents;
    }
}

export default MouseEvent;
