import BaseEvent from "@pencil.js/base-event";

/**
 * Mouse event class
 * @class
 * @extends BaseEvent
 */
export default class MouseEvent extends BaseEvent {
    /**
     * MouseEvent constructor
     * @param {Component} target - Component concerned by the event
     * @param {String} name - Name of the event
     * @param {Position} position - Position of the mouse when event trigger
     */
    constructor (target, name, position) {
        super(target, name);
        this.position = position;
    }
}
