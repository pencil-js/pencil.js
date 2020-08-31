# Position

2D space (x, y) pair for Pencil.js.


## Examples

```js
import { Position } from "pencil.js";

const position = new Position(100, 200);
position.multiply(2); // position is mutated
const other = position.clone().add(10); // Return a new instance
```
