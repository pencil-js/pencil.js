# Path

Hand-free drawing tool.

![Path example](/examples/path.png)


## Examples

```js
import { Path } from "pencil.js";

const from = startingPosition;
const path = new Path(from, [
    Path.lineTo(pos1),
    Path.moveTo(pos2),
    Path.quadTo(pos3, controlPoint),
    Path.bezierTo(pos4, controlPoint1, controlPoint2),
], isClosed, options);

// Or with a SVG path string (relative to the starting position)
const svgPath = new Path(from, "c 40 10, 65 10, 95 80 s 150 150, 180 80");
```

## Instructions

| Instruction | Description |
|-------------|-------------|
| `Path.lineTo(position)` | Straight line |
| `Path.moveTo(position)` | Move without drawing |
| `Path.quadTo(position, control)` | Quadratic curve |
| `Path.bezierTo(position, control1, control2)` | Bezier curve |
| `Path.quarterTo(position, clockwise = true)` | Quarter circle |
| `Path.halfTo(position, clockwise = true)` | Half circle |
| `Path.arcTo(position, angle, magicRatio, clockwise = true)` | Approximated arc |
| `Path.splineThrough(points, tension)` | Smooth curve through points |
| `Path.waveTo(position, nbWaves = 1)` | Series of half circles |
| `Path.sinTo(position, nbSins = 1, sinsHeight = 10)` | Sinusoid |

Paths built with these instructions can be serialized with `JSON.stringify` and revived with `from`.


## PathOptions
Inherit from [ComponentOptions](./component.md#componentoptions) if the path is closed, or from [LineOptions](./line.md#lineoptions) otherwise.

Path have no specific options.
