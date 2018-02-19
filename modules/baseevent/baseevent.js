/**
 * Base event class
 * @class
 */
export default class BaseEvent {
    /**
     * BaseEvent constructor
     * @param {Component} target -
     * @param {String} name -
     */
    constructor (target, name) {
        this.target = target;
        this.name = name;
    }
}
