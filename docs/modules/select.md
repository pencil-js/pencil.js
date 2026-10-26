# Select

Select user input.

![Select example](/examples/select.png)


## Examples

```js
import { Select } from "pencil.js";

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
Inherit from [TextOptions](./text.md#textoptions) and [InputOptions](./input.md#inputoptions).

| Name  | Type     | Default | Comment                      |
|-------|----------|---------|------------------------------|
| value | `Number` | `0`     | Selected index of the select |
