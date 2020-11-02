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
        this.eventListeners = {};
    }

    /**
     * Listen to an event or multiple events
     * @param {String|Array<String>} eventName - Name of event (or a list of event names) to listen to
     * @param {Function} callback - Function to call when event fire
     * @param {Boolean} [isTargeted=false] - Should only listen to event targeting itself
     * @return {EventEmitter} Itself
     */
    on (eventName, callback, isTargeted = false) {
        const event = {
            callback,
            element: this,
            isTargeted,
        };
        (Array.isArray(eventName) ? eventName : [eventName]).forEach((name) => {
            if (!this.eventListeners[name]) {
                this.eventListeners[name] = [];
            }
            this.eventListeners[name].push(event);
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
                    listener.callback.call(this, event);
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
            if (callback) {
                this.eventListeners[name] = this.eventListeners[name].filter(event => event.callback !== callback);
            }
            else {
                delete this.eventListeners[name];
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
     * @enum {String}
     */
    /**
     * @type {EventEmitterEvents}
     */
    static get events () {
        return {};
    }
}
