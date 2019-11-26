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
    fire (event) {
        super.fire(event);
        const trigger = `on${capitalize(event.name)}`;
        if (target[trigger]) {
            target[trigger](event);
        }
    }
}
```
