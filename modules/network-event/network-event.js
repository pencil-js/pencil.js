import BaseEvent from "@pencil.js/base-event";

/**
 * Network event class
 * @class
 * @extends BaseEvent
 */
export default class NetworkEvent extends BaseEvent {
    /**
     * @typedef {Object} NetworkEvents
     * @enum {String}
     * @prop {String} ready - Content has been loaded
     * @prop {String} error - Content load has fail
     */
    /**
     * @return {NetworkEvents}
     */
    static get events () {
        return {
            ready: "ready",
            error: "error",
        };
    }
}
