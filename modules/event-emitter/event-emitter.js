
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
     * Listen to an event
     * @param {String} eventName - Name of event to listen to
     * @param {Function} callback - Function to call when event fire
     * @param {Boolean} [isTargeted=false] - Should only listen to event targeting itself
     * @return {EventEmitter} Itself
     */
    on (eventName, callback, isTargeted) {
        if (!this.eventListeners[eventName]) {
            this.eventListeners[eventName] = [];
        }
        this.eventListeners[eventName].push({
            callback,
            element: this,
            isTargeted,
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
                if (!listener.isTargeted || listener.element === event.target) {
                    listener.callback.call(this, event);
                }
            });
        }
        return this;
    }

    /**
     * Create a copy of any descendant of Container
     * @return {Container}
     */
    clone () {
        return this.constructor.from(this.toJSON());
    }

    /**
     * Return a json ready object
     * @return {Object}
     */
    toJSON () {
        return {
            constructor: this.constructor.name,
        };
    }
}
