import BaseEvent from "@pencil.js/base-event";
import Position from "@pencil.js/position";

/**
 * @module MouseEvent
 */

/**
 * Mouse event class
 * @class
 * @extends BaseEvent
 */
export default class MouseEvent extends BaseEvent {
    /**
     * MouseEvent constructor
     * @param {String} name - Name of the event
     * @param {EventEmitter} target - Component concerned by the event
     * @param {PositionDefinition} positionDefinition - Position of the mouse when event trigger
     * @param {UIEvent} [event] - Original HTML event
     */
    constructor (name, target, positionDefinition, event) {
        super(name, target, event);
        this.position = Position.from(positionDefinition);
        this.button = event ? event.button : null;
    }

    /**
     * @inheritDoc
     */
    getModifier () {
        return this.button;
    }

    /**
     * @typedef {Object} MouseButtons
     * @enum {String}
     * @prop {String} left - Left button on a classic right-handed mouse
     * @prop {String} main - Main button
     * @prop {String} wheel - The scroll wheel
     * @prop {String} middle - Middle button, usually the scroll wheel
     * @prop {String} right - Right button on a classic right-handed mouse
     * @prop {String} secondary - Secondary button
     * @prop {String} backward - Browse backward button
     * @prop {String} aux1 - First auxiliary button, usually the browse backward button
     * @prop {String} forward - Browse forward button
     * @prop {String} aux2 - Second auxiliary button, usually the browse forward button
     */
    /**
     * Set of buttons on a pointing device for easy access
     * @example scene.on(`${MouseEvent.events.down}.${MouseEvent.buttons.middle}`, () => {
     *     console.log("User pressed the middle mouse button");
     * });
     * @return {MouseButtons}
     */
    static get buttons () {
        return {
            left: "0",
            main: "0",
            wheel: "1",
            middle: "1",
            right: "2",
            secondary: "2",
            backward: "3",
            aux1: "3",
            forward: "4",
            aux2: "4",
        };
    }

    /**
     * @typedef {Object} MouseEvents
     * @enum {String}
     * @prop {String} down - Mouse button is pressed
     * @prop {String} up - Mouse button is released
     * @prop {String} click - Mouse button is pressed then released without moving
     * @prop {String} move - Mouse is moved
     * @prop {String} hover - Mouse goes hover a component
     * @prop {String} leave - Mouse leave a component
     * @prop {String} wheel - Mouse wheel is scrolled in any direction
     * @prop {String} scrollDown - Mouse wheel is scrolled down
     * @prop {String} scrollUp - Mouse wheel is scrolled up
     * @prop {String} zoomOut - Mouse wheel is scrolled down (away from the screen)
     * @prop {String} zoomIn - Mouse wheel is scrolled up (toward the screen)
     * @prop {String} grab - Mouse is clicked on a draggable component
     * @prop {String} drag - Mouse is moved while grabbing a component
     * @prop {String} drop - Mouse is release after dragging a component
     * @prop {String} resize - Mouse is moved while holding the handle of a resizable component
     * @prop {String} rotate - Mouse is rotating a component
     * @prop {String} doubleClick - Mouse is clicked twice rapidly
     */
    /**
     * Set of events for easy access
     * @type {MouseEvents}
     */
    static get events () {
        return {
            down: "mousedown",
            up: "mouseup",
            click: "click",
            contextMenu: "contextmenu",
            move: "mousemove",
            hover: "hover",
            leave: "leave",
            wheel: "mousewheel",
            scrollDown: "scrolldown",
            scrollUp: "scrollup",
            zoomOut: "zoomout",
            zoomIn: "zoomin",
            grab: "grab",
            drag: "drag",
            drop: "drop",
            resize: "resize",
            rotate: "rotate",
            doubleClick: "dblclick",
        };
    }
}
