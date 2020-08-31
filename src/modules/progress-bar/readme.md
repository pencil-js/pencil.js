# Progress-bar

Progress-bar component.

![Progress-bar example](../../../media/examples/progress-bar.png)


## Examples

```js
import { ProgressBar } from "pencil.js";

const position = [100, 200];
const options = {
    width: 200, // width in pixel
    value: 0, // initial value (from 0 to 1)
    speed: 0.3, // transition speed (0 means no changes, 1 mean instant change)
};
const progressBar = new ProgressBar(position, options);
progressBar.value = 0.5; // set to 50%
```


## ProgressBarOptions
Inherit from [InputOptions](../input/readme.md#inputoptions).

| Name | Type | Default | Comment |
| ---- | ---- | ------- | ------- |
|value |`Number` |`0` |Initial value |
|width |`Number` |`200` |Size of the slider |
|speed |`Number` |`0.3` |Transition speed between two value (0 mean no change, 1 mean instant change) |
