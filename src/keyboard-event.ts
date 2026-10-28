import BaseEvent from "./base-event.js";

const keyboardEventEvents = {
    /** Keyboard key pressed */
    down: "keydown",
    /** Keyboard key released */
    up: "keyup",
} as const;

const keyboardEventKeys = {
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
    space: " ",
} as const;

/**
 * Keyboard event class
 */
export class KeyboardEvent<T = unknown> extends BaseEvent<T> {
    /** Pressed key value (see https://developer.mozilla.org/en/docs/Web/API/KeyboardEvent/key/Key_Values) */
    key: string;

    /**
     * KeyboardEvent constructor
     * @param name - Name of the event
     * @param target - Component concerned by the event
     * @param event - Original HTML event
     */
    constructor (name: string, target: T, event: globalThis.KeyboardEvent) {
        super(name, target, event);
        this.key = event.key;
    }

    override getModifier (): string {
        return this.key;
    }

    /**
     * Set of supported event name for easy access
     * @example component.on(KeyboardEvent.events.up, () => console.log("User release a key"));
     */
    static get events () {
        return keyboardEventEvents;
    }

    /**
     * Set of keys for easy access
     * @example if (key === KeyboardEvent.keys.enter) {
     *     console.log("This is the enter key");
     * }
     */
    static get keys () {
        return keyboardEventKeys;
    }
}

export default KeyboardEvent;
