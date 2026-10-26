# Serialization

Any element (and its children) can be turned into JSON and back.

```js
import { from } from "pencil.js";

const json = JSON.stringify(scene);
// … save it, send it …
const copy = from(JSON.parse(json));
```

Options are serialized only when different from the defaults.
Gradients, patterns (using an image), colors and path instructions are serialized too.

To copy an element in memory, use `clone()`:

```js
const twin = group.clone(); // Deep copy, children included
```

## Custom classes

Extend any class and register it to make it revivable by `from`.
Defining a static `className` keeps the serialization working after minification.

```js
import { Component, register } from "pencil.js";

class Cross extends Component {
    static get className () {
        return "Cross";
    }

    trace (path) {
        path.moveTo(-10, -10);
        path.lineTo(10, 10);
        path.moveTo(10, -10);
        path.lineTo(-10, 10);
        return this;
    }
}

register(Cross);
```
