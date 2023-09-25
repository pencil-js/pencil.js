# Line

Line stroke passing through points.

![Line example](../../../media/examples/line.png)


## Examples

```js
import { Line } from "pencil.js";

const options = {
    stroke: "red",
    strokeWidth: 9,
};
const line = new Line(from, [firstPoint, secondPoint, lastPoint], options);
```


## LineOptions
Inherit from [ComponentOptions](../component/readme.md#componentoptions).

| Name     | Type                                    | Default                         | Comment                                           |
|----------|-----------------------------------------|---------------------------------|---------------------------------------------------|
| cap      | `String`                                | `Line.caps.round`               | How the line end points looks                     |
| join     | `String`                                | `Line.joins.round`              | How the line segment are join                     |
| fill     | [Color](../color/readme.md) or `String` | `null`                          | Color used to fill, set to null for transparent   |
| stroke   | [Color](../color/readme.md) or `String` | `Component.defaultOptions.fill` | Color used to stroke, set to null for transparent |
| absolute | `Boolean`                               | `false`                         | Should points be treated as absolute coordinates  |
