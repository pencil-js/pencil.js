# Widget

Abstract UI element drawn over a background shape and holding a value.
[Input](./input.md), [ProgressBar](./progress-bar.md) and [ProgressPie](./progress-pie.md) extend it.

## Examples

```js
import { Widget, Rectangle } from "pencil.js";

class Gauge extends Widget {
    #value = 0;

    constructor (position, options) {
        // Use Rectangle to draw the background
        super(position, Rectangle, options);
        this.value = this.options.value;
    }

    get width () {
        return 100;
    }

    get height () {
        return 10;
    }

    get value () {
        return this.#value;
    }

    set value (value) {
        this.#value = value;
    }
}
```

## WidgetOptions
Inherit from [ComponentOptions](./component.md#componentoptions).

| Name       | Type                            | Default     | Comment                    |
|------------|---------------------------------|-------------|----------------------------|
| value      | Any                             | `null`      | Initial value              |
| foreground | [Color](./color.md) or `String` | `"#444"`    | Color of the filling       |
| fill       | [Color](./color.md) or `String` | `"#f6f6f6"` | Color of the background    |
| stroke     | [Color](./color.md) or `String` | `"#aaa"`    | Color of the border        |
