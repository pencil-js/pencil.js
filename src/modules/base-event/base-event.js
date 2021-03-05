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
     * @param {UIEvent} [event] - Original HTML event
     */
    constructor (name, target, event) {
        this.name = name;
        this.target = target;
        this.event = event;
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

    /**
     * Get the event modifier (should be overridden by child classes)
     * @return {null}
     */
    getModifier () { // eslint-disable-line class-methods-use-this
        return null;
    }

    /**
     * Prevent the initial event default behavior
     * @return {BaseEvent} Itself
     */
    prevent () {
        this.event.preventDefault();
        return this;
    }
}
