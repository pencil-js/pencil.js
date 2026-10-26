import type BaseEvent from "./base-event.js";

/**
 * Function called when an event is fired
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type EventCallback<E extends BaseEvent = any> = (this: EventEmitter, event: E) => void;

/**
 * Registered listener
 */
export interface EventListener {
    /** Function called when event is fired */
    callback: EventCallback;
    /** Element on which to listen for the event */
    element: EventEmitter;
    /** Will call the callback only when the event target is the element */
    isTargeted: boolean;
    /** Additional data about the event */
    modifier?: string;
}

const split = (name: string): [string, string | undefined] => {
    const index = name.indexOf(".");
    return index === -1 ? [name, undefined] : [name.slice(0, index), name.slice(index + 1)];
};

/**
 * Able to listen and fire events
 * @module EventEmitter
 */
export default class EventEmitter {
    /** Set of event listeners of this component */
    eventListeners: Record<string, Array<EventListener>>;

    /**
     * EventEmitter constructor
     */
    constructor () {
        this.eventListeners = {};
    }

    /**
     * Listen to an event or multiple events
     * @param eventName - Name of event (or a list of event names) to listen to.
     * The event name can be followed by a modifier (separated by a ".")
     * @param callback - Function to call when event fire
     * @param isTargeted - Should only listen to event targeting itself
     * @returns Itself
     * @example component.on("event.modifier", () => console.log("Event fired with modifier"));
     */
    on (eventName: string | Array<string>, callback: EventCallback, isTargeted = false): this {
        for (const name of Array.isArray(eventName) ? eventName : [eventName]) {
            const [baseName, modifier] = split(name);
            (this.eventListeners[baseName] ??= []).push({
                callback,
                element: this,
                isTargeted,
                modifier,
            });
        }
        return this;
    }

    /**
     * Listen to an event only once
     * @param eventName - Name of event (or a list of event names) to listen to.
     * @param callback - Function to call when event fire
     * @param isTargeted - Should only listen to event targeting itself
     * @returns Itself
     */
    once (eventName: string | Array<string>, callback: EventCallback, isTargeted = false): this {
        const wrapper: EventCallback = function wrapped (this: EventEmitter, event) {
            this.removeListener(eventName, wrapper);
            callback.call(this, event);
        };
        return this.on(eventName, wrapper, isTargeted);
    }

    /**
     * Trigger an event
     * @param event - Event to trigger
     * @returns Itself
     */
    fire (event: BaseEvent): this {
        const listeners = this.eventListeners[event.name];
        if (listeners) {
            const modifier = event.getModifier?.() ?? null;
            // Copy to allow listeners to remove themselves
            for (const listener of listeners.slice()) {
                if ((!listener.isTargeted || listener.element === event.target) &&
                    (!listener.modifier || listener.modifier === modifier)) {
                    listener.callback.call(this, event);
                }
            }
        }
        return this;
    }

    /**
     * Remove an event or multiple events
     * @param eventName - Name of event (or a list of event names) to remove
     * @param callback - Specify the callback to remove, if not defined remove all listeners
     * @returns Itself
     */
    removeListener (eventName: string | Array<string>, callback?: EventCallback): this {
        for (const name of Array.isArray(eventName) ? eventName : [eventName]) {
            const [baseName, modifier] = split(name);
            const listeners = this.eventListeners[baseName];
            if (!listeners) {
                continue;
            }
            if (callback || modifier) {
                this.eventListeners[baseName] = listeners.filter(listener => (callback && listener.callback !== callback) ||
                    (modifier && listener.modifier !== modifier));
            }
            else {
                delete this.eventListeners[baseName];
            }
        }
        return this;
    }

    /**
     * Remove all event listeners
     * @returns Itself
     */
    removeAllListener (): this {
        this.eventListeners = {};
        return this;
    }

    /**
     * Set of events for easy access
     */
    static get events (): Record<string, string> {
        return {};
    }
}
