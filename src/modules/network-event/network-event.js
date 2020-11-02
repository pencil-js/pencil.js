import BaseEvent from "@pencil.js/base-event";

/**
 * @module NetworkEvent
 */

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
     * @type {NetworkEvents}
     */
    static get events () {
        return {
            ready: "ready",
            error: "error",
        };
    }
}
