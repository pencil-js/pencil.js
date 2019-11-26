# Heart

Heart shape.

![Heart example](../../media/examples/heart.png)


## Installation

    npm install @pencil.js/heart


## Examples

```js
import Heart from "@pencil.js/heart";

const position = [100, 200];
const radius = 2;
const options = {
    fill: "red",
    stroke: "teal"
};
const heart = new Heart(position, radius, options);
```

## HeartOptions
Inherit from [ComponentOptions](../component/readme.md#componentoptions).

Heart have no specific options.
