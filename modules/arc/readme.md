# Arc

Arc shape.

![Arc example](../../media/examples/arc.png)


## Installation

    npm install @pencil.js/arc


## Examples

```js
import Arc from "@pencil.js/arc";

const position = [100, 200];
const horizontalRadius = 50;
const verticalRadius = 20;
const startAngle = -0.25;
const endAngle = 0.25;
const options = {
    stroke: "red",
};
const arc = new Arc(position, horizontalRadius, verticalRadius, startAngle, endAngle, options);
```

## ArcOptions
Inherit from [LineOptions](../line/readme.md#lineoptions).

Arc have no specific options.
