# Position

2D space (x, y) pair for Pencil.js.


## Installation

    npm install @pencil.js/position


## Examples

```js
import Position from "@pencil.js/position";

const position = new Position(100, 200);
position.multiply(2); // position is mutated
const other = position.clone().add(10); // Return a new instance
```