# EventEmitter

Abstract class for event listeners and triggers.

Allow for all components to listen and fire events.


## Examples

```js
const eventName = "eventName";
component.on(eventName, (event) => {
    console.log("Event fired");
});

// ...

const event = new BaseEvent(eventName, component);
component.fire(event);
```
