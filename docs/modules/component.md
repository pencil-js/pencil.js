# Component

Abstract class for visual component of a scene.


## Examples

```js
import { Component } from "pencil.js";

class FunnyShape extends Component {
    render (ctx) {
        // Do crazy stuff here
    }
}
```

## ComponentOptions
Inherit from [ContainerOptions](./container.md#containeroptions).

| Name        | Type                                    | Default                     | Comment                                                                                                |
|-------------|-----------------------------------------|-----------------------------|--------------------------------------------------------------------------------------------------------|
| fill        | [Color](./color.md) or `String` | `"#000"`                    | Background Color used to fill, set to null for transparent                                             |
| stroke      | [Color](./color.md) or `String` | `null`                      | Color used to stroke, set to null for transparent                                                      |
| strokeWidth | `Number`                                | `2`                         | Stroke line thickness in pixels                                                                        |
| dashed      | `Boolean` or `Array`                    | `false`                     | Should the line be dashed, you can also specify the dash pattern (ex: [4, 4] or Component.dashes.dots) |
| cursor      | `String`                                | `Component.cursors.default` | Cursor to use when hover                                                                               |
| join        | `String`                                | `Component.joins.miter`     | How lines join between them                                                                            |
| origin      | [`Position`](./position.md)               | `new Position()`            | Relative offset                                                                                        |
| shadow      | [`ShadowOptions`](#shadowoptions)       | (see below)                 | Set of options to set a shadow                                                                         |

## ShadowOptions

| Name     | Type                                    | Default          | Comment                                          |
|----------|-----------------------------------------|------------------|--------------------------------------------------|
| blur     | `Number`                                | `0`              | Spread of the shadow around the component        |
| position | [`Position`](./position.md)               | `new Position()` | Position of the shadow relative to the component |
| color    | [Color](./color.md) or `String` | `null`           | Color of the shadow                              |


## Custom shapes

Extend `Component` and implement `trace`. By default, the path is traced again at every render.
When the path only depends on a few values, declare them with `pathDependencies`: the path is then kept between renders until one of them changes.

```js
import { Component } from "pencil.js";

class Cross extends Component {
    constructor (position, size, options) {
        super(position, options);
        this.size = size;
    }

    trace (path) {
        path.moveTo(0, 0);
        path.lineTo(this.size, this.size);
        path.moveTo(this.size, 0);
        path.lineTo(0, this.size);
        return this;
    }

    get pathDependencies () {
        return [this.size];
    }
}
```

A subclass redefining `trace` without its own `pathDependencies` is always traced again, so extending a shape never shows an outdated path.
