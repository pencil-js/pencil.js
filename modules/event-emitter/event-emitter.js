import MouseEvent from "@pencil.js/mouse-event";
import Position from "@pencil.js/position";

/**
 * Able to listen and fire events
 * @class
 */
export default class EventEmitter {
    /**
     * EventEmitter constructor
     */
    constructor () {
        this.eventListeners = {};
        this.isClicked = false;
    }

    /**
     * Start listening to outside events
     * @param {Scene} scene -
     */
    static bindEvents (scene) {
        /**
         * Add a listener for a mouse event
         * @param {String} eventName - Any mouse event name
         */
        function listenMouseEvent (eventName) {
            window.addEventListener(eventName, (event) => {
                const eventPosition = (new Position(event.clientX, event.clientY))
                    .subtract(scene.containerPosition)
                    .add(window.scrollX, window.scrollY);
                const target = scene.getTarget(eventPosition);
                if (target) {
                    // console.log(target);
                    target.fire(new MouseEvent(target, eventName, eventPosition));
                    if (eventName === "mousedown") {
                        target.isClicked = true;
                    }
                    else if (eventName === "mousemove" && target.isClicked) {
                        target.isClicked = false;
                    }
                    else if (eventName === "mouseup" && target.isClicked) {
                        target.fire(new MouseEvent(target, "click", eventPosition));
                        target.isClicked = false;
                    }
                }
            });
        }
        [
            "mousedown",
            "mousemove",
            "mouseup",
        ].forEach(listenMouseEvent, this);
    }

    /**
     * Listen to an event
     * @param {String} eventName - Name of event to listen to
     * @param {Function} callback - Function to call when event fire
     * @param {Boolean} [capture=false] - Should not bubble to parent
     * @return {EventEmitter} Itself
     */
    on (eventName, callback, capture) {
        if (!this.eventListeners[eventName]) {
            this.eventListeners[eventName] = [];
        }
        this.eventListeners[eventName].push({
            callback,
            element: this,
            bubble: !capture,
        });
        return this;
    }

    /**
     * Trigger an event
     * @param {BaseEvent} event - Event to trigger
     * @return {EventEmitter} Itself
     */
    fire (event) {
        const listeners = this.eventListeners[event.name];
        if (listeners && listeners.length) {
            listeners.forEach((listener) => {
                if (listener.bubble || listener.element === event.target) {
                    listener.callback.call(this, event);
                }
            });
        }
        return this;
    }
}
