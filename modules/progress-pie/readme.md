# Progress-pie

Progress-pie component.

![Progress-pie example](../../media/examples/progress-pie.png)


## Installation

    npm install @pencil.js/progress-pie


## Examples

```js
import ProgressPie from "@pencil.js/progress-pie";

const position = [100, 200];
const options = {
    radius: 200, // radius in pixel
    value: 0, // initial value (from 0 to 1)
    speed: 0.3, // transition speed (0 means no changes, 1 mean instant change)
};
const progressPie = new ProgressPie(position, options);
progressPie.value = 0.5; // set to 50%
```

## ProgressPieOptions
Inherit from [InputOptions](../input/readme.md#inputoptions).

| Name | Type | Default | Comment |
| ---- | ---- | ------- | ------- |
|value |`Number` |`0` |Initial value |
|radius |`Number` |`100` |Size of the progress-pie |
|speed |`Number` |`0.3` |Transition speed between two value (0 mean no change, 1 mean instant change) |
