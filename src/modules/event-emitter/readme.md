# EventEmitter

Abstract class for event listener and triggerer.


## Examples

```js
import { EventEmitter } from "pencil.js";

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
