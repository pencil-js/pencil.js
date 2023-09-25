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
```


## SceneOptions
Inherit from [OffscreenCanvasOptions](../offscreen-canvas/readme.md#offscreencanvasoptions).

| Name   | Type     | Default                     | Comment         |
|--------|----------|-----------------------------|-----------------|
| cursor | `String` | `Component.cursors.default` | Cursor on hover |
