# Color

Useful class to manipulate colors.


## Installation

    npm install @pencil.js/color


## Examples

```js
import Color from "@pencil.js/color";

const alpha = 0.9; // Opacity
// All are equivalent
const rebeccapurple = new Color("rebeccapurple", alpha);
const rebeccapurple = new Color(
    0.4, // Red ratio
    0.2, // Green ratio
    0.6, // Blue ratio
    alpha,
);
const rebeccapurple = new Color("#663399", alpha);
const rebeccapurple = new Color("#639", alpha);
const rebeccapurple = new Color(0x663399, alpha); // Careful, 0x639 is equivalent to 0x000639 and not to 0x663399

shape.options.fill = rebeccapurple.saturation(0.5).lerp(otherColor, 0.5).reverse();
```
