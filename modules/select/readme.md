# Select

Select user input.

![Select example](../../media/examples/select.png)


## Installation

    npm install @pencil.js/select


## Examples

```js
import Select from "@pencil.js/select";

const position = [100, 200];
const items = [
    null, // Selectable empty item
    "Unicorn",
    "Pony",
    "Doggy",
];
const options = {
    value: 1, // index of the default value
};
const select = new Select(position, items, options);
```


## SelectOptions
Inherit from [TextOptions](../text/readme.md#textoptions) and [InputOptions](../input/readme.md#inputoptions).

| Name | Type | Default | Comment |
| ---- | ---- | ------- | ------- |
|value |`Number` |`0` |Selected index of the select |
