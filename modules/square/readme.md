# Square

Square shape.

![Square example](../../media/examples/square.png)


## Installation

    npm install @pencil.js/square


## Examples

```js
import Square from "@pencil.js/square";

const position = [100, 200];
const size = 200;
const options = {
    fill: "red",
    stroke: "#000"
};
const square = new Square(position, size, options);
```


## SquareOptions
Inherit from [RectangleOptions](../rectangle/readme.md#rectangleoptions).

Square have no specific options.
