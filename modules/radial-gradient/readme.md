# Radial-gradient

Circular gradient transition of color(s) between a center and the radius of a circle.

![Radial-gradient example](../../media/examples/radial-gradient.png)


## Installation

    npm install @pencil.js/radial-gradient


## Examples

```js
import RadialGradient from "@pencil.js/radial-gradient";
import Square from "@pencil.js/square";

const position = [100, 200];
const size = 200;
const centerPosition = [size / 2, size / 2];
const radius = size / 2;
const square = new Square(position, size, {
    fill: new RadialGradient(centerPosition, radius, {
        0: "red",
        0.5: "yellow",
        1: "green",
    }),
});
```
