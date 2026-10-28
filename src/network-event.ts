import BaseEvent from "./base-event.js";

const networkEventEvents = {
    /** Content has been loaded */
    ready: "ready",
    /** Content load has fail */
    error: "error",
} as const;

/**
 * Network event class
 */
export class NetworkEvent<T = unknown> extends BaseEvent<T> {
    /**
     * Set of events for easy access
     */
    static get events () {
        return networkEventEvents;
    }
}

export default NetworkEvent;
