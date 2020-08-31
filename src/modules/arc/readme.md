# Arc

Arc shape.

![Arc example](../../../media/examples/arc.png)


## Examples

```js
import { Arc } from "pencil.js";

const position = [100, 200];
const width = 50;
const height = 20;
const startAngle = -0.25;
const endAngle = 0.25;
const options = {
    stroke: "red",
};
const arc = new Arc(position, width, height, startAngle, endAngle, options);
```

## ArcOptions
Inherit from [LineOptions](../line/readme.md#lineoptions).

Arc have no specific options.
