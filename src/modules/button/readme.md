# Checkbox

Button user input.

![Button example](../../../media/examples/button.png)


## Examples

```js
import { Button } from "pencil.js";

const position = [100, 200];
const options = {
    value: "Click me",
};
const button = new Button(position, options);
```

## ButtonOptions
Inherit from [TextOptions](../text/readme.md#textoptions) and from [InputOptions](../input/readme.md#inputoptions).

| Name | Type | Default | Comment |
| ---- | ---- | ------- | ------- |
|value |`String` |`""` |Text of the button |
