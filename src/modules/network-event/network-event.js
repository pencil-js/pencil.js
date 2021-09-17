import BaseEvent from "@pencil.js/base-event";

/**
 * @module NetworkEvent
 */

/**
 * Network event class
 * @class
 * @extends {module:BaseEvent}
 */
export default class NetworkEvent extends BaseEvent {
    /**
     * @typedef {Object} NetworkEvents
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
