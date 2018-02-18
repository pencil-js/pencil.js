# EventEmitter

Abstract class for event listener and triggerer.


## Installation

    npm install pencil.js-eventemitter --save


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