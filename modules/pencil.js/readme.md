![Pencil.js logo](media/animated-logo.gif)

# :pencil2: Pencil.js
[![NPM Version](https://badgen.net/npm/v/pencil.js?icon=npm)](https://www.npmjs.com/package/pencil.js)
[![Dependencies update](https://badgen.net/david/dev/pencil-js/pencil.js?icon=npm)](https://david-dm.org/pencil-js/pencil.js?type=dev)
[![Maintainability](https://badgen.net/codeclimate/maintainability/pencil-js/pencil.js?icon=codeclimate)](https://codeclimate.com/github/pencil-js/pencil.js/maintainability)
[![Test Coverage](https://badgen.net/codeclimate/coverage/pencil-js/pencil.js?icon=codeclimate)](https://codeclimate.com/github/pencil-js/pencil.js/test_coverage)
[![Join us on Discord](https://badgen.net/badge/Discord/Join%20us/7289da?icon=discord)](https://discord.gg/GkEgjsy)

Nice modular interactive 2D drawing library.

 - [Installtion](#installation)
 - [CDN](#cdnhttpsdevelopermozillaorgdocsglossairecdn-content-delivery-network)
 - [Usage](#usage)
 - [Purpose](#purpose)
 - [Examples](#examples)
 - [Modules](#modules)
 - [Who is using Pencil.js ?](#who-is-using-penciljs-)
 - [Sponsors](#sponsors)
 - [Contributions](#contributions)
 - [License](#license)


## Installation
You can install the whole package with the following command :

    npm install pencil.js


But, each part is a JS module and can be used independently, for example:

    npm install @pencil.js/scene


## [CDN](https://developer.mozilla.org/docs/Glossaire/CDN "Content Delivery Network")
On [capable browsers](https://caniuse.com/#feat=es6-module), the most simple way is to import the [ESM package](https://unpkg.com/pencil.js/dist/pencil.esm.js).

```html
<script type="module">
    import { Scene } from "https://unpkg.com/pencil.js/dist/pencil.esm.js";
    
    const scene = new Scene();
</script>
```

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
Once you have installed the library using NPM, you can start to import it.

You can either import everything under a namespace or only the package you're going to use. Pick the way that fit your style.

```js
// The whole package under a namespace
import Pencil from "pencil.js";

const scene = new Pencil.scene();

/***/

// Just the part you need (recommended)
import { Scene } from "pencil.js";
// or
import Scene from "@pencil.js/scene";

const scene = new Scene();
```

In that case, you will need to use a bundler like [webpack](https://webpack.js.org/) or [browserify](http://browserify.org/).


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
It also allows you to grab only what you need or replace what you don't like.


### Documentation
A complete documentation goes a long way to help developers.
All functions are assured to have a description and typed arguments and returns.


## Examples
```js
import { Scene, Rectangle, Position } from "pencil.js";

const scene = new Scene(); // create a new scene

const width = 80;
const height = 50;
const rectangle = new Rectangle(new Position(100, 200), width, height, {
    fill: "red",
}); // Create a new red rectangle
scene.add(rectangle); // Add the rectangle to the scene

scene.render(); // Render the scene once
```

Take a look at [more advanced examples](https://codepen.io/collection/XqzkNQ/).


## Modules
### Core modules
> Core modules refer to all classes and methods you'll get within Pencil.js library.
 * [EventEmitter](modules/event-emitter)
   * [Container](modules/container)
     * [OffScreenCanvas](modules/offscreen-canvas)
       * [Scene](modules/scene)
     * [Component](modules/component)
       * [.draggable()](modules/draggable)
       * [.rotatable()](modules/rotatable)
       * [Particles](modules/particles)
       * [Path](modules/path)
       * [Heart](modules/heart)
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
           * [Sprite](modules/sprite)
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

### Non-core modules
> Non-core modules refer to packages made by us and not part of Pencil.js library. We find them useful so maybe you will too...
 * [text-direction](https://github.com/pencil-js/text-direction)<br/>
Gives the rendering text direction (left to right or right to left) of a node.
 * [test-environment](https://github.com/pencil-js/test-environment)<br/>
Set a Node.js environment suitable for testing Pencil.js and Pencil.js applications.
 * [spritesheet](https://github.com/pencil-js/spritesheet)<br/>
Pack a set of images into a single spritesheet along its json description file.
 * [spritesheet-cli](https://github.com/pencil-js/spritesheet-cli)<br/>
CLI tool for spritesheet (see above).
 * [gif](https://github.com/pencil-js/gif)<br/>
Turn any Pencil.js scene into an animated GIF.
 * [canvas-gif-encoder](https://github.com/pencil-js/canvas-gif-encoder)<br/>
Create a GIF stream frame by frame from a canvas rendering context.
 * [vue-pencil.js](https://github.com/pencil-js/vue-pencil.js)<br/>
Build reactive 2D graphics scene in your Vue project.

## Who is using Pencil.js ?

Take a tour of all the [awesome project using Pencil.js](https://github.com/pencil-js/awesome).


## Sponsors

[![JetBrains logo](https://user-images.githubusercontent.com/2543511/58549723-71160e00-820c-11e9-98c1-9e3d7aafcbb2.png)](https://www.jetbrains.com/?from=Pencil.js)

### Enterprises

We are working with Tidelift to deliver commercial support and maintenance for the open source dependencies you use to build your applications.
Save time, reduce risk, and improve code health, while paying the maintainers of the exact dependencies you use. [Learn more.](https://tidelift.com/subscription/pkg/npm-pencil-js?utm_source=npm-pencil-js&utm_medium=referral&utm_campaign=enterprise&utm_term=repo)

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
    <td align="center"><a href='https://github.com/jaller94'><img src='https://github.com/jaller94.png?size=99' width='99px;' alt='Christian Paul avatar'/><br/>
    <sub><b>Christian Paul</b></sub></a></td>
  </tr>
</table>

<!-- markdownlint-enable -->
<!-- prettier-ignore-end -->
<!-- ALL-CONTRIBUTORS-LIST:END -->

> All contributions are valued, you can add yourself to this list (or request to be added) whatever your contribution is.

## License 

[MIT](license)
