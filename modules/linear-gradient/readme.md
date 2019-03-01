# Linear-gradient

Gradient transition of color(s) between two position.


## Installation

    npm install @pencil.js/linear-gradient


## Examples

```js
import LinearGradient from "@pencil.js/linear-gradient";
import Square from "@pencil.js/square";

const size = 200;
const square = new Square(aPosition, size, {
    fill: new LinearGradient([0, 0], [size, size], {
        0: "red",
        0.5: "green",
        1: "blue",
    }),
});
```
