# OffScreenCanvas

Utility to render on a non displayed canvas and extract data from it.


## Examples

```js
// This will override the native OffscreenCanvas class !
import { OffScreenCanvas, Circle } from "pencil.js";

const offScreen = new OffScreenCanvas(width, height);
offScreen.add(new Circle([0, 0], radius));

const imageData = offScreen.getImageData();
```


## OffscreenCanvasOptions
Inherit from [ContainerOptions](../container/readme.md#containeroptions).

| Name    | Type                          | Default | Comment          |
|---------|-------------------------------|---------|------------------|
| fill    | [Color](../color) or `String` | `null`  | Background color |
| opacity | `Number`                      | `1`     | Global opacity   |
