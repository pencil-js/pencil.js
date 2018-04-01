# Line

Single line stroke.


## Installation

    npm install @pencil.js/line


## Examples

```js
import Line from "@pencil.js/line";

const from = aPosition;
const to = anotherPosition;
const options = {
    stroke: "red",
    strokeWidth: 9
};
let line = new Line([from, to], options);
```
