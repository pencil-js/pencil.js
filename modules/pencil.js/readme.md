![Pencil.js logo](media/animated-logo.gif)

# :pencil2: Pencil.js
[![NPM Version](https://badgen.net/npm/v/pencil.js?icon=npm)](https://www.npmjs.com/package/pencil.js)
[![Dependencies update](https://badgen.net/david/dev/pencil-js/pencil.js?icon=npm)](https://david-dm.org/pencil-js/pencil.js?type=dev)
[![Maintainability](https://badgen.net/codeclimate/maintainability/pencil-js/pencil.js?icon=codeclimate)](https://codeclimate.com/github/pencil-js/pencil.js/maintainability)
[![Test Coverage](https://badgen.net/codeclimate/coverage/pencil-js/pencil.js?icon=codeclimate)](https://codeclimate.com/github/pencil-js/pencil.js/test_coverage)
[![Inline docs](http://inch-ci.org/github/pencil-js/pencil.js.svg?branch=master)](http://inch-ci.org/github/pencil-js/pencil.js)
[![Chat on Gitter](https://badgen.net/badge/chat/on%20gitter/cyan?icon=gitter)](https://gitter.im/Pencil-js)

Nice modular interactive 2D drawing library.


## Installation
You can install the whole package with the following command :

    npm install pencil.js


But, each part is a JS module and can be used independently, ex:

    npm install @pencil.js/scene

# CDN
If you want to go old-school, you can fetch the script with [unpkg](https://unpkg.com/) or [jsdelivr](https://www.jsdelivr.com/).

```html
<script src="https://unpkg.com/pencil.js"></script>
<!-- or -->
<script src="https://cdn.jsdelivr.net/npm/pencil.js"></script>

<script>
    const scene = new Pencil.Scene();
</script>
```


## Usage
Once you have installed it, you can start to import it using common.js or ES6 syntax.

There's multiple ways to rely on the project for your, pick the one that fits you need or preference :

```js
// The whole package under a namespace
import Pencil from "pencil.js";

const scene = new Pencil.scene();

/***/

// Just the part you need
import Scene from "@pencil.js/scene";
// or
import Scene from "pencil.js";

const scene = new Scene();

/***/

// Works the same way with common.js syntax
const Scene = require("pencil.js").Scene;
// or
const Scene = require("@pencil.js/scene");
```

Since today's web browser don't support module requirements yet, you need to use a bundler like [webpack](https://webpack.js.org/) or [browserify](http://browserify.org/).


## Purpose

### Abstraction
Drawing in a canvas is not trivial.
First of all, the goal is to ease the use of canvas in a browser;
allowing anyone to use it with its comprehensible syntax and extensible options.


### OOP
OOP is great, OOP is almighty, OOP saves lives !
Others library exists, but none with a beautiful OOP syntax.
It makes code look natural.


### Modularity
Splitting the whole code into modules make everything cleaner.
It also allow you to grab only what you need or replace what you don't like.


### Documentation
A complete documentation goes a long way to help developers.
All functions are assured to have a description and also typed arguments and returns.


## Examples
```js
import Scene from "pencil.js"; // or "@pencil.js/scene"
import Rectangle from "pencil.js"; // or "@pencil.js/rectangle"
import Position from "pencil.js"; // or "@pencil.js/position"

const scene = new Scene(); // create a new scene

const width = 80;
const height = 50;
const rectangle = new Rectangle(new Position(100, 200), width, height, {
    fill: "red"
}); // Create a new red rectangle
scene.add(rectangle); // Add the rectangle to the scene

scene.render(); // Render the scene once
```

Take a look at [more advanced examples](https://codepen.io/collection/XqzkNQ/).


## Who is using Pencil.js ?

 - [Socialism Simulator](https://gmartigny.github.io/socialismSimulator/)


## Modules
 * [EventEmitter](modules/event-emitter)
   * [Container](modules/container)
     * [Scene](modules/scene)
     * [Component](modules/component)
       * [.draggable()](modules/draggable)
       * [Particles](modules/particles)
       * [Path](modules/path)
       * [Line](modules/line)
         * [Spline](modules/spline)
       * [Polygon](modules/polygon)
         * [RegularPolygon](modules/regular-polygon)
           * [Star](modules/star)
           * [Triangle](modules/triangle)
       * [Rectangle](modules/rectangle)
         * [.resizable()](modules/resizable)
         * [Square](modules/square)
         * [Image](modules/image)
       * [Arc](modules/arc)
         * [Ellipse](modules/ellipse)
           * [Circle](modules/circle)
       * [Text](modules/text)
   * [Input](modules/input)
     * [Button](modules/button)
     * [Checkbox](modules/checkbox)
     * [Progressbar](modules/progress-bar)
     * [Select](modules/select)
     * [Slider](modules/slider)
 * [Position](modules/position)
 * [Vector](modules/vector)
 * [Math](modules/math)
 * [Color](modules/color)
 * [LinearGradient](modules/linear-gradient)
 * [RadialGradient](modules/radial-gradient)
 * [OffScreenCanvas](modules/offscreen-canvas)
 * [BaseEvent](modules/base-event)
   * [MouseEvent](modules/mouse-event)
   * [KeyboardEvent](modules/keyboard-event)
   * [NetworkEvent](modules/network-event)

## Common pitfalls

### Scaling
Even if Pencil.js can draw thousand of shapes, it's not built around performance nor memory management.
If you want to code an efficient particle generator, try [Processing](https://processing.org/) instead.

### Naming
Some module have the same name as some Javascript global (eg: Image, Math).
Importing them without namespace will overrides these globals and lead to potential bugs.

In any case, we recommend you use a namespace (eg: `import Pencil from "pencil.js"`, `import * as PencilMath from "@pencil.js/math"`)


## Contributions
You want to help us improve ? Please read [the contributing manual](contributing.md).

### Contributors
| [![Guillaume Martigny](https://github.com/GMartigny.png?size=99)<br><b>GMartigny</b>](https://github.com/GMartigny) | [![Heraclite](https://github.com/heraclite.png?size=99)<br><b>Heraclite</b>](https://github.com/heraclite) |
| --- | --- |
> All contributions are valued, you can add yourself to this list (or request to be added) whatever your contribution is.
<!--
Use this pattern to add yourself:
[![FULL NAME or USERNAME](https://github.com/USERNAME.png?size=99)<br><b>USERNAME</b>](https://github.com/USERNAME)
-->

## License 

[MIT](license)
