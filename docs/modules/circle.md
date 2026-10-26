# Circle

Circle shape.

![Circle example](/examples/circle.png)


## Examples

```js
import { Circle } from "pencil.js";

const position = [100, 200];
const radius = 50;
const options = {
    fill: "red",
    stroke: "#000"
};
const circle = new Circle(position, radius, options);
```

## CircleOptions
Inherit from [EllipseOptions](./ellipse.md#ellipseoptions).

Circle have no specific options.
