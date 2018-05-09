import BaseEvent from "@pencil.js/base-event";

/**
 * Keyboard event class
 * @class
 * @extends BaseEvent
 */
export default class KeyboardEvent extends BaseEvent {
    /**
     * MouseEvent constructor
     * @param {EventEmitter} target - Component concerned by the event
     * @param {String} name - Name of the event
     * @param {String} key - Key that trigger the event
     */
    constructor (target, name, key) {
        super(target, name);
        this.key = key;
    }
}
