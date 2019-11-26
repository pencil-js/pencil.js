# EventEmitter

Ellipse shape (oval).

![Ellipse example](../../media/examples/ellipse.png)


## Installation

    npm install @pencil.js/ellipse


## Examples

```js
import Ellipse from "@pencil.js/ellipse";

const position = [100, 200];
const horizontalRadius = 50;
const verticalRadius = 20;
const options = {
    fill: "red",
};
const ellipse = new Ellipse(position, horizontalRadius, verticalRadius, options);
```

## EllipseOptions
Inherit from [ComponentOptions](../component/readme.md#componentoptions).

Ellipse have no specific options.

