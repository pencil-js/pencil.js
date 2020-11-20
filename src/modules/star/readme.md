# Star

Star shape.

![Star example](../../../media/examples/star.png)


## Examples

```js
import { Star } from "pencil.js";

const position = [100, 200];
const nbBranches = 6;
const radius = 50;
const bevel = 0.7;
const options = {
    fill: "gold",
    stroke: "goldendrod"
};
const star = new Star(position, nbBranches, radius, bevel, options);
```


## StarOptions
Inherit from [RegularPolygonOptions](../regular-polygon/readme.md#regularpolygonoptions).

Star have no specific options.
