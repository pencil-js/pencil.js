import BaseEvent from "./base-event.js";

/**
 * Network event class
 */
export class NetworkEvent<T = unknown> extends BaseEvent<T> {
    /**
     * Set of events for easy access
     */
    static get events () {
        return {
            /** Content has been loaded */
            ready: "ready",
            /** Content load has fail */
            error: "error",
        } as const;
    }
}

export default NetworkEvent;
