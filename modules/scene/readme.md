# Scene

Whole container of your drawing.


## Installation

    npm install @pencil.js/scene


## Examples

```js
import Scene from "@pencil.js/scene";

const options = {
    fill: "#DDD"
};
const scene = new Scene(document.body, options);
scene.startLoop();
```