# BaseEvent

Main class for Pencil.js events.


## Examples

```js
import { BaseEvent } from "pencil.js";

component.fire(new BaseEvent("eventName", component));
```

Child classes should implement the `getModifier` method to support modifiers.

```js
import { BaseEvent } from "pencil.js";

// This is a mock touch event class
class TouchEvent extends BaseEvent {
    constructor (name, target, detail) {
        super(name, target);
        this.detail = detail;
    }
    
    // This is an example, implementation is left to you
    getModifier () {
        if (this.name === TouchEvent.events.swipe) {
            if (this.detail.direction > 0) {
                return "right";
            }
            return "left";
        }
        if (this.name === TouchEvent.events.pinch) {
            if (this.detail.distance > 0) {
                return "out";
            }
            return "in";
        }
    }
    
    static get events () {
        return {
            swipe: "touchswipe",
            pinch: "touchpinch",
        }
    }
}

// Example listeners
scene.on(`${TouchEvent.events.swipe}.right`, () => nextPage())
    .on(`${TouchEvent.events.swipe}.left`, () => previousPage())
    .on(`${TouchEvent.events.pinch}.out`, () => zoomOut())
    .on(`${TouchEvent.events.pinch}.in`, () => zoomIn());
```
