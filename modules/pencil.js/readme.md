![Pencil.js logo](media/animated-logo.gif)

# :pencil2: Pencil.js
[![NPM Version](https://badgen.net/npm/v/pencil.js?icon=npm)](https://www.npmjs.com/package/pencil.js)
[![Dependencies update](https://badgen.net/david/dev/pencil-js/pencil.js?icon=npm)](https://david-dm.org/pencil-js/pencil.js?type=dev)
[![Maintainability](https://badgen.net/codeclimate/maintainability/pencil-js/pencil.js?icon=codeclimate)](https://codeclimate.com/github/pencil-js/pencil.js/maintainability)
[![Test Coverage](https://badgen.net/codeclimate/coverage/pencil-js/pencil.js?icon=codeclimate)](https://codeclimate.com/github/pencil-js/pencil.js/test_coverage)
[![Inline docs](http://inch-ci.org/github/pencil-js/pencil.js.svg?branch=master)](http://inch-ci.org/github/pencil-js/pencil.js)
[![Join us on Discord](https://badgen.net/badge/Discord/Join%20us/7289da?icon=discord)](https://discord.gg/GkEgjsy)

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
import { Scene } from "pencil.js";

const scene = new Scene();

/***/

// Works the same way with common.js syntax
const Scene = require("@pencil.js/scene");
// or
const { Scene } = require("pencil.js");

const scene = new Scene();
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


## Modules
 * [EventEmitter](modules/event-emitter)
   * [Container](modules/container)
     * [OffScreenCanvas](modules/offscreen-canvas)
       * [Scene](modules/scene)
     * [Component](modules/component)
       * [.draggable()](modules/draggable)
       * [.rotatable()](modules/rotatable)
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
     * [Knob](modules/knob)
     * [ProgressBar](modules/progress-bar)
     * [ProgressPie](modules/progress-pie)
     * [Select](modules/select)
     * [Slider](modules/slider)
 * [Position](modules/position)
 * [Vector](modules/vector)
 * [Math](modules/math)
 * [Navigation](modules/navigation)
 * [Color](modules/color)
 * [LinearGradient](modules/linear-gradient)
 * [RadialGradient](modules/radial-gradient)
 * [BaseEvent](modules/base-event)
   * [MouseEvent](modules/mouse-event)
   * [KeyboardEvent](modules/keyboard-event)
   * [NetworkEvent](modules/network-event)


## Who is using Pencil.js ?

 - [Socialism Simulator](https://gmartigny.github.io/socialismSimulator/)


## Sponsors

[![JetBrains logo](https://user-images.githubusercontent.com/2543511/58549723-71160e00-820c-11e9-98c1-9e3d7aafcbb2.png)](https://www.jetbrains.com/?from=Pencil.js)
`Gwenaël Provost`

## Contributions
You want to help us improve ? Please read [the contributing manual](contributing.md).

### Contributors
<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href='https://github.com/GMartigny'><img src='https://github.com/GMartigny.png?size=99' width='99px;' alt='Guillaume Martigny avatar'/><br/>
    <sub><b>Guillaume Martigny</b></sub></a></td>
    <td align="center"><a href='https://github.com/Heraclite'><img src='https://github.com/Heraclite.png?size=99' width='99px;' alt='Heraclite avatar'/><br/>
    <sub><b>Heraclite</b></sub></a></td>
    <td align="center"><a href='https://github.com/zachary-nguyen'><img src='https://github.com/zachary-nguyen.png?size=99' width='99px;' alt='Zachary Nguyen avatar'/><br/>
    <sub><b>Zachary Nguyen</b></sub></a></td>
  </tr>
</table>

<!-- markdownlint-enable -->
<!-- prettier-ignore-end -->
<!-- ALL-CONTRIBUTORS-LIST:END -->

> All contributions are valued, you can add yourself to this list (or request to be added) whatever your contribution is.

## License 

[MIT](license)
