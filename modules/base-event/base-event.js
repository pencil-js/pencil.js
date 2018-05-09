/**
 * Base event class
 * @class
 */
export default class BaseEvent {
    /**
     * BaseEvent constructor
     * @param {EventEmitter} target - Component concerned by the event
     * @param {String} name - Name of the event
     */
    constructor (target, name) {
        this.target = target;
        this.name = name;
    }
}
