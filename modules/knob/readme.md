# Knob

Rotating knob component.

![Knob example](../../media/examples/knob.png)


## Installation

    npm install @pencil.js/knob


## Examples

```js
import Knob from "@pencil.js/knob";

const position = [100, 200];
const options = {
    radius: 100, // radius in pixel
    min: 0, // Minimum value of the knob
    max: 10, // Maximum value of the knob
    value: 0, // initial value (from 0 to 1)
};
const knob = new Knob(position, options);
knob.value = 0.5; // set to 50%
```


## KnobOptions
Inherit from [ComponentOptions](../input/readme.md#inputoptions).

| Name | Type | Default | Comment |
| ---- | ---- | ------- | ------- |
|min |`Number` |`0` |Minimum value when the knob is at lowest |
|max |`Number` |`10` |Maximum value when the knob is at highest |
|value |`Number` |`0` |Initial value |
|radius |`Number` |`100` |Radius of the knob |
