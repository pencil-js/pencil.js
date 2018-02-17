# Scene

Abstract class for event listener and trigger.


## Installation

    npm install pencil.js-eventemitter


## Examples

```js
    import EventEmitter from "pencil.js-eventemitter";
    
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