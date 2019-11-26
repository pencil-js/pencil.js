# Polygon

Shape from a bunch of points.

![Polygon example](../../media/examples/polygon.png)


## Installation

    npm install @pencil.js/polygon


## Examples

```js
import Polygon from "@pencil.js/polygon";

const points = [aPosition, anotherPosition, yetAgainAPosition, lastPosition];
const options = {
    fill: "red",
    stroke: "#000"
};
const polygon = new Polygon(points, options);
```


## PolygonOptions
Inherit from [ComponentOptions](../component/readme.md#componentoptions).

Rectangle have no specific options.
