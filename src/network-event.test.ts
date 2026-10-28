import { test, expect } from "vitest";
import NetworkEvent from "./network-event.js";

test("events", () => {
    expect(typeof NetworkEvent.events.ready).toBe("string");
    expect(typeof NetworkEvent.events.error).toBe("string");
});
