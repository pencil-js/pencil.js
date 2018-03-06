# RegularPolygon

Equiangular and equilateral convex polygon.


## Installation

    npm install @pencil.js/regular-polygon


## Examples

```js
import RegularPolygon from "@pencil.js/regular-polygon";

const nbSides = 7;
const radius = 100;
const options = {
    fill: "gold",
    stroke: "#000"
};
let heptagon = new RegularPolygon(center, nbSides, radius, options);
```
