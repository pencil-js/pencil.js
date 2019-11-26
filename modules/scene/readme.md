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


## RectangleOptions
Inherit from [OffscreenCanvasOptions](../offscreen-canvas/readme.md#offscreencanvasoptions).

| Name | Type | Default | Comment |
| ---- | ---- | ------- | ------- |
|cursor |`String` |`Component.cursors.default` |Cursor on hover |
