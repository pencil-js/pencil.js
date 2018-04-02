# Line

Hand-free drawing tool.


## Installation

    npm install @pencil.js/path


## Examples

```js
import Line from "@pencil.js/path";

const from = startingPosition;
const path = new Path(from, [
    Path.lineTo(pos1),
    Path.moveTo(pos2),
    Path.quadTo(pos3, controlPoint),
    Path.bezierTo(pos4, controlPoint1, controlPoint2),
], isClosed, options);
```
