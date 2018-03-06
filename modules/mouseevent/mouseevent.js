import BaseEvent from "@pencil.js/baseevent";

/**
 * Mouse event class
 * @class
 * @extends BaseEvent
 */
export default class MouseEvent extends BaseEvent {
    /**
     * MouseEvent constructor
     * @param {Component} target -
     * @param {String} name -
     * @param {Position} position -
     */
    constructor (target, name, position) {
        super(target, name);
        this.position = position;
    }
}
