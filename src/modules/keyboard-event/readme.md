# KeyboardEvent

Class for Pencil.js keyboard related events.


## Examples

```js
import { KeyboardEvent } from "pencil.js";

const eventName = "holdKey";
const key = KeyboardEvent.keys.alt;
component.fire(new KeyboardEvent(eventName, component, key));
```


## `events`

Hold the list of possible events for easy access.

```js
scene.on(KeyboardEvent.events.down, () => console.log("User pressed a key"));
```


## `keys`

Hold the list of keys for easy access.

```js
scene.on("keydown", (event) => {
    if (event.key === KeyboardEvent.keys.enter) {
        console.log("User pressed the Enter key");
    }
});
```
