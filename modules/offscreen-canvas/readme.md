# OffScreenCanvas

Utility to render on a non displayed canvas and extract data from it.


## Installation

    npm install @pencil.js/offscreen-canvas


## Examples

```js
import OffScreenCanvas from "@pencil.js/offscreen-canvas";

const circle = new Circle([0, 0], radius);
const offScreen = new OffScreenCanvas(width, height);

offScreen.render(circle);
// or
circle.render(offScreen);

const imageData = offScreen.imageData;

```


## OffscreenCanvasOptions
Inherit from [ContainerOptions](../container/readme.md#containeroptions).

| Name | Type | Default | Comment |
| ---- | ---- | ------- | ------- |
|fill |[Color](../color/readme.md) or `String` |`null` |Background color |
|opacity |`Number` |`1` |Global opacity |
