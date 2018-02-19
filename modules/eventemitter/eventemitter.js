import MouseEvent from "@pencil.js/mouseevent";
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
     * @param {Container} container -
     */
    static bindEvents (container) {
        function listenMouseEvent (eventName) {
            window.addEventListener(eventName, function (event) {
                let eventPosition = new Position(event.clientX, event.clientY);
                let target = container.getTarget(eventPosition);
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
            }.bind(this));
        }
        [
            "mousedown",
            "mousemove",
            "mouseup"
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
            callback: callback,
            element: this,
            bubble: !capture
        });
        return this;
    }

    /**
     * Trigger an event
     * @param {BaseEvent} event - Event to trigger
     * @return {EventEmitter} Itself
     */
    fire (event) {
        let listeners = this.eventListeners[event.name];
        if (listeners && listeners.length) {
            listeners.forEach(listener => (listener.bubble || listener.element === event.target) && listener.callback.call(this, event));
        }
        return this;
    }
}
