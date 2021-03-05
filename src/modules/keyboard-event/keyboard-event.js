import BaseEvent from "@pencil.js/base-event";

/**
 * @module KeyboardEvent
 */

/**
 * Keyboard event class
 * @class
 * @extends BaseEvent
 */
export default class KeyboardEvent extends BaseEvent {
    /**
     * MouseEvent constructor
     * @param {String} name - Name of the event
     * @param {EventEmitter} target - Component concerned by the event
     * @param {UIEvent} [event] - Original HTML event
     * For the complete list of key values:
     * https://developer.mozilla.org/en/docs/Web/API/KeyboardEvent/key/Key_Values
     */
    constructor (name, target, event) {
        super(name, target, event);
        this.key = event.key;
    }

    /**
     * @inheritDoc
     */
    getModifier () {
        return this.key;
    }

    /**
     * @typedef {Object} KeyboardEvents
     * @enum {String}
     * @prop {String} down - Keyboard key pressed
     * @prop {String} up - Keyboard key released
     */
    /**
     * Set of supported event name for easy access
     * @example component.on(KeyboardEvent.events.up, () => console.log("User release a key"));
     * @type {KeyboardEvents}
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
     * @prop {String} control - Modifying key (control)
     * @prop {String} shift - Modifying key (uppercase)
     * @prop {String} fn - Modifying key (function)
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
     * Set of keys for easy access
     * @example if (key === KeyboardEvent.keys.enter) {
     *     console.log("This is the enter key");
     * }
     * @type {KeyboardKeys}
     */
    static get keys () {
        return {
            backspace: "Backspace",
            enter: "Enter",
            delete: "Delete",
            escape: "Escape",
            control: "Control",
            shift: "Shift",
            fn: "Fn",
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
