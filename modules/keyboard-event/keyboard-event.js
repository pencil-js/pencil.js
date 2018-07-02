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
     * For the complete list of key values:
     * https://developer.mozilla.org/fr/docs/Web/API/KeyboardEvent/key/Key_Values
     */
    constructor (target, name, key) {
        super(target, name);
        this.key = key;
    }

    /**
     * @typedef {Object} KeyboardEvents
     * @enum {String}
     * @prop {String} down - Keyboard key pressed
     * @prop {String} up - Keyboard key released
     */
    /**
     * @return {KeyboardEvents}
     */
    static get events () {
        return {
            down: "keydown",
            up: "keyup",
        };
    }

    /**
     * @typedef {Object} ArrowKeys
     * @enum {String}
     * @prop {String} up - Up arrow
     * @prop {String} right - Right arrow
     * @prop {String} down - Down arrow
     * @prop {String} left - Left arrow
     */
    /**
     * @typedef {Object} KeyboardKeys
     * @enum {String}
     * @prop {String} backspace - Remove last character or return previous screen
     * @prop {String} enter - Add line-break or validate entry
     * @prop {String} delete - Remove character in front
     * @prop {String} escape - Cancel or leave screen
     * @prop {String} control - Modifying key (function)
     * @prop {String} shift - Modifying key (uppercase)
     * @prop {ArrowKeys}
     * @prop {String} tab - Next input or toggle focus
     * @prop {String} alt - Modifying key (alternative)
     * @prop {String} altGr - Modifying key (alternative grapheme)
     * @prop {String} pageUp - Move up one page
     * @prop {String} pageDown - Move down one page
     * @prop {String} start - Go to start
     * @prop {String} end - Go to end
     * @prop {String} insert - Insert here or toggle insert mode
     */
    /**
     * @return {KeyboardKeys}
     */
    static get keys () {
        return {
            backspace: "Backspace",
            enter: "Enter",
            delete: "Delete",
            escape: "Escape",
            control: "Control",
            shift: "Shift",
            arrows: {
                up: "ArrowUp",
                right: "ArrowRight",
                down: "ArrowDown",
                left: "ArrowLeft",
            },
            tab: "Tab",
            alt: "Alt",
            altGr: "AltGraph",
            pageUp: "PageUp",
            pageDown: "PageDown",
            start: "Home",
            end: "End",
            insert: "Insert",
        };
    }
}
