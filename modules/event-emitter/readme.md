# EventEmitter

Abstract class for event listener and triggerer.


## Installation

    npm install @pencil.js/event-emitter


## Examples

```js
import EventEmitter from "@pencil.js/event-emitter";

class MyEmitter extends EventEmitter {
    /**
     * @override EventEmitter.prototype.fire
     */
    fire (eventName, target) {
        super.fire(eventName);
        target.someAction(eventName);
    }
}
```