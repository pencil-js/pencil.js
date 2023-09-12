[![Pencil.js logo](media/animated-logo.gif)](https://pencil.js.org)

# :pencil2: Pencil.js
[![NPM Version](https://badgen.net/npm/v/pencil.js?icon=npm)](https://www.npmjs.com/package/pencil.js)
[![Vulnerability](https://badgen.net/snyk/pencil-js/pencil.js?icon=dependabot)](https://snyk.io/test/github/pencil-js/pencil.js)
[![Maintainability](https://badgen.net/codeclimate/maintainability/pencil-js/pencil.js?icon=codeclimate)](https://codeclimate.com/github/pencil-js/pencil.js/maintainability)
[![Test Coverage](https://badgen.net/codeclimate/coverage/pencil-js/pencil.js?icon=codeclimate)](https://codeclimate.com/github/pencil-js/pencil.js/test_coverage)

Nice modular interactive 2D drawing library.


## Installation
You can install Pencil.js with the following command :

    npm install pencil.js


## [CDN](https://developer.mozilla.org/docs/Glossaire/CDN "Content Delivery Network")
On [capable browsers](https://caniuse.com/#feat=es6-module), the easiest way is to import the [ESM package](https://unpkg.com/pencil.js/dist/pencil.esm.js).

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

const scene = new Scene();
```

In that case, you will need to use a bundler like [webpack](https://webpack.js.org/) or [browserify](http://browserify.org/).


## Documentation

The [official documentation](https://docs.pencil-js.vercel.app/) [![Vercel logo](media/vercel.svg)](https://vercel.com/?utm_source=pencil-js&utm_campaign=oss).


## What Pencil.js do best

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
A [complete documentation](https://docs.pencil-js.vercel.app/) goes a long way to help developers.
All functions are assured to have a description and typed arguments and returns.

### Performance
Pencil.js is able to [draw thousands of shapes](https://benchmarks.slaylines.io/pencil.html) pretty smoothly without tanking your memory.
Even more if you use the [Particles](src/modules/particles) generator.

### Size
With [![Package size](https://badgen.net/packagephobia/publish/pencil.js)](https://packagephobia.com/result?p=pencil.js), Pencil.js is fairly lightweight.
Furthermore, with no side effect, it's fully tree-shakable. So, any decent bundler can further reduce its footprint.


## Examples
```js
import { Scene, Rectangle } from "pencil.js";

const scene = new Scene(); // create a new scene

const position = [100, 200];
const width = 80;
const height = 50;
const options = {
    fill: "red",
};
const rectangle = new Rectangle(position, width, height, options); // Create a new red rectangle
scene.add(rectangle); // Add the rectangle to the scene

scene.render(); // Render the scene once
```

Take a look at [more advanced examples](https://codepen.io/collection/XqzkNQ/).


## Modules
### Core modules
> Core modules refer to all classes and methods you'll get within Pencil.js library.
 * [EventEmitter](src/modules/event-emitter)
   * [Container](src/modules/container)
     * [OffScreenCanvas](src/modules/offscreen-canvas)
       * [Scene](src/modules/scene)
     * [Component](src/modules/component)
       * [.draggable()](src/modules/draggable)
       * [.rotatable()](src/modules/rotatable)
       * [Particles](src/modules/particles)
       * [Path](src/modules/path)
       * [Heart](src/modules/heart)
       * [Line](src/modules/line)
         * [Spline](src/modules/spline)
       * [Polygon](src/modules/polygon)
         * [RegularPolygon](src/modules/regular-polygon)
           * [Star](src/modules/star)
           * [Triangle](src/modules/triangle)
       * [Rectangle](src/modules/rectangle)
         * [.resizable()](src/modules/resizable)
         * [Square](src/modules/square)
         * [Image](src/modules/image)
           * [Sprite](src/modules/sprite)
       * [Arc](src/modules/arc)
         * [Pie](src/modules/pie)
         * [Ellipse](src/modules/ellipse)
           * [Circle](src/modules/circle)
       * [Text](src/modules/text)
   * [Input](src/modules/input)
     * [Button](src/modules/button)
     * [Checkbox](src/modules/checkbox)
     * [Knob](src/modules/knob)
     * [ProgressBar](src/modules/progress-bar)
     * [ProgressPie](src/modules/progress-pie)
     * [Select](src/modules/select)
     * [Slider](src/modules/slider)
 * [Position](src/modules/position)
 * [Vector](src/modules/vector)
 * [Math](src/modules/math)
 * [Navigation](src/modules/navigation)
 * [Color](src/modules/color)
 * [LinearGradient](src/modules/linear-gradient)
 * [RadialGradient](src/modules/radial-gradient)
 * [ConicGradient](src/modules/conic-gradient)
 * [Pattern](src/modules/pattern)
 * [BaseEvent](src/modules/base-event)
   * [MouseEvent](src/modules/mouse-event)
   * [KeyboardEvent](src/modules/keyboard-event)
   * [NetworkEvent](src/modules/network-event)

### Non-core modules
> Non-core modules refer to packages made by us and not part of Pencil.js library. We find them useful, so maybe you will too...
 * [spritesheet](https://github.com/pencil-js/spritesheet) ([CLI](https://github.com/pencil-js/spritesheet-cli))<br/>
Pack a set of images into a single spritesheet along its json description file.
 * [vue-pencil.js](https://github.com/pencil-js/vue-pencil.js)<br/>
Build reactive 2D graphics scene in your Vue project.
 * [gif](https://github.com/pencil-js/gif)<br/>
Turn any Pencil.js scene into an animated GIF.
 * [text-direction](https://github.com/pencil-js/text-direction)<br/>
Gives the rendering text direction (left to right or right to left) of a node.
 * [test-environment](https://github.com/pencil-js/test-environment)<br/>
Set a Node.js environment suitable for testing Pencil.js and Pencil.js applications.
 * [canvas-gif-encoder](https://github.com/pencil-js/canvas-gif-encoder)<br/>
Create a GIF stream frame by frame from a canvas rendering context.

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
    <td align="center"><a href='https://github.com/Marr11317'><img src='https://github.com/Marr11317.png?size=99' width='99px;' alt='Rémi Marche avatar'/><br/>
    <sub><b>Rémi Marche</b></sub></a></td>
  </tr>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

> All contributions are valued, you can add yourself to this list (or request to be) whatever your contribution is.

## License 

[MIT](license)
