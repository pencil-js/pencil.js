/**
 * @module BaseEvent
 */

/**
 * Base event class
 * @class
 */
export default class BaseEvent {
    /**
     * BaseEvent constructor
     * @param {String} name - Name of the event
     * @param {EventEmitter} target - Component concerned by the event
     */
    constructor (name, target) {
        this.name = name;
        this.target = target;
        this.bubble = true;
    }

    /**
     * Mark this event as stopped
     * @return {BaseEvent} Itself
     */
    stop () {
        this.bubble = false;
        return this;
    }
}
