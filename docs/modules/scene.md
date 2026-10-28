# Scene

Whole container of your drawing.


## Examples

```js
import { Scene } from "pencil.js";

const options = {
    fill: "#DDD"
};
const scene = new Scene(document.body, options);
scene.startLoop();

// Later, when not needed anymore
scene.destroy();
```

The scene can also use an existing canvas: `new Scene(myCanvas)`.


## SceneOptions
Inherit from [OffscreenCanvasOptions](./offscreen-canvas.md#offscreencanvasoptions).

| Name   | Type     | Default                     | Comment         |
|--------|----------|-----------------------------|-----------------|
| cursor | `String` | `Component.cursors.default` | Cursor on hover |
