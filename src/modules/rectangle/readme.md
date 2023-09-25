# Rectangle

Rectangle shape.

![Rectangle example](../../../media/examples/rectangle.png)


## Examples

```js
import { Rectangle } from "pencil.js";

const position = [100, 200];
const width = 200;
const height = 100;
const options = {
    fill: "red",
    stroke: "#000"
};
const rectangle = new Rectangle(position, width, height, options);
```


## RectangleOptions
Inherit from [ComponentOptions](../component/readme.md#componentoptions).

| Name    | Type                        | Default | Comment                                                                             |
|---------|-----------------------------|---------|-------------------------------------------------------------------------------------|
| rounded | `Number` or `Array<Number>` | `0`     | Corner radius or an array of radii [top-left, top-right, bottom-right, bottom-left] |
