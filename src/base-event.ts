/**
 * Base event class
 * @module BaseEvent
 */
export default class BaseEvent<T = unknown> {
    /** Name of the event */
    name: string;

    /** Component concerned by the event */
    target: T;

    /** Original DOM event (if any) */
    event?: Event;

    /** Should the event continue to bubble up to parents */
    bubble: boolean;

    /**
     * BaseEvent constructor
     * @param name - Name of the event
     * @param target - Component concerned by the event
     * @param event - Original HTML event
     */
    constructor (name: string, target: T, event?: Event) {
        this.name = name;
        this.target = target;
        this.event = event;
        this.bubble = true;
    }

    /**
     * Mark this event as stopped (won't bubble further)
     * @returns Itself
     */
    stop (): this {
        this.bubble = false;
        return this;
    }

    /**
     * Get the event modifier (should be overridden by child classes)
     */
    getModifier (): string | null {
        return null;
    }

    /**
     * Prevent the initial event default behavior
     * @returns Itself
     */
    prevent (): this {
        this.event?.preventDefault();
        return this;
    }
}
