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

Rectangle have no specific options.
