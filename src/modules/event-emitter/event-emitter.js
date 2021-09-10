/**
 * @module EventEmitter
 */

/**
 * Able to listen and fire events
 * @abstract
 * @class
 */
export default class EventEmitter {
    /**
     * EventEmitter constructor
     */
    constructor () {
        /**
         * @typedef {Object} EventListener
         * @prop {Function} callback - Function called when event is fired
         * @prop {EventEmitter} element - Element on which to listen for the event
         * @prop {Boolean} isTargeted - Will call the callback only when the event target is the element
         * @prop {String} [modifier] - Additional data about the event
         */
        /**
         * Set of event listeners of this component
         * @type {Object<string, Array<EventListener>>}
         */
        this.eventListeners = {};
    }

    /**
     * Listen to an event or multiple events
     * @param {String|Array<String>} eventName - Name of event (or a list of event names) to listen to.<br>
     * The event name can be followed by a modifier (separated by a ".")
     * @param {Function} callback - Function to call when event fire
     * @param {Boolean} [isTargeted=false] - Should only listen to event targeting itself
     * @return {EventEmitter} Itself
     * @example component.on("event.modifier", () => console.log("Event fired with modifier"));
     */
    on (eventName, callback, isTargeted = false) {
        const event = {
            callback,
            element: this,
            isTargeted,
        };
        (Array.isArray(eventName) ? eventName : [eventName]).forEach((name) => {
            const [baseName, modifier] = name.split(".");
            if (!this.eventListeners[baseName]) {
                this.eventListeners[baseName] = [];
            }
            this.eventListeners[baseName].push({
                ...event,
                modifier,
            });
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
        if (listeners) {
            listeners.forEach((listener) => {
                if (!listener.isTargeted || listener.element === event.target) {
                    const modifier = event.getModifier && event.getModifier();
                    if (!listener.modifier || listener.modifier === modifier) {
                        listener.callback.call(this, event);
                    }
                }
            });
        }
        return this;
    }

    /**
     * Remove an event or multiple events
     * @param {String|Array<String>} eventName - Name of event (or a list of event names) to remove
     * @param {Function} [callback] - Specify the callback to remove, if not defined remove all listeners
     * @return {EventEmitter} Itself
     */
    removeListener (eventName, callback) {
        (Array.isArray(eventName) ? eventName : [eventName]).forEach((name) => {
            const [baseName, modifier] = name.split(".");
            if (callback || modifier) {
                this.eventListeners[baseName] = this.eventListeners[baseName]
                    .filter(event => (callback && event.callback !== callback) ||
                        (modifier && event.modifier !== modifier));
            }
            else {
                delete this.eventListeners[baseName];
            }
        });
        return this;
    }

    /**
     * Remove all event listener
     * @return {EventEmitter} Itself
     */
    removeAllListener () {
        this.eventListeners = {};
        return this;
    }

    /**
     * @typedef {Object} EventEmitterEvents
     */
    /**
     * @type {EventEmitterEvents}
     */
    static get events () {
        return {};
    }
}
