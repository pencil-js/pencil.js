# Progress-bar

Progress-bar component.


## Installation

    npm install @pencil.js/progress-bar


## Examples

```js
import ProgressBar from "@pencil.js/progress-bar";

const options = {
    width: 200, // width in pixel
    value: 0, // initial value (from 0 to 1)
    speed: 0.3, // transition speed (0 means no changes, 1 mean instant change)
};
const progressBar = new ProgressBar(aPosition, options);
progressBar.value = 0.5; // set to 50%
```
