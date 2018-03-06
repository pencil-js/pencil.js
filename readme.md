# Pencil.js
[![dependencies Status](https://david-dm.org/GMartigny/pencil.js/status.svg)](https://david-dm.org/GMartigny/pencil.js)
[![devDependencies Status](https://david-dm.org/GMartigny/pencil.js/dev-status.svg)](https://david-dm.org/GMartigny/pencil.js?type=dev)

Modular 2D drawing library.


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
    var scene = new Pencil.Scene();
</script>
```


## Usage

Once you have installed it, you can start to import it using common.js or ES6 syntax.

There's multiple ways to rely on the project for your, pick the one that fits you need or preference :

```js
// The whole package under a namespace
import Pencil from "pencil.js";

const scene = new Pencil.scene();

/ *** /

// Just the part you need
import Scene from "@pencil.js/scene";
// or
import Scene from "pencil.js";

const scene = new Scene();

/ *** /

// Works the same way with common.js syntax
const Scene = require("pencil.js").Scene;
// or
const Scene = require("@pencil.js/scene");
```

Since today's web browser don't support module requirements yet, you need to use a bundler like [webpack](https://webpack.js.org/) or [browserify](http://browserify.org/).


## Examples

```js
import Scene from "pencil.js"; // or "@pencil.js/scene"
import Rectangle from "pencil.js"; // or "@pencil.js/rectangle"
import Position from "pencil.js"; // or "@pencil.js/position"

const scene = new Scene(); // create a new scene

const width = 80;
const height = 50;
let rectangle = new Rectangle(new Position(100, 200), width, height, {
    fill: "red"
}); // Create a new rectangle with few parameters
scene.addChild(rectangle); // Add the rectangle to the scene

scene.render(); // Render the scene once
```
    
Take a look at [more advanced examples]().

Or read [the full documentation]().

## Modules

 * [EventEmitter](/modules/eventemitter)
   * [Container](/modules/eventemitter/container)
     * [Scene](/modules/eventemitter/container/scene)
     * [Component](/modules/eventemitter/container/component)
       * [.draggable()](/modules/eventemitter/container/component/draggable)
       * [Polygon](/modules/eventemitter/container/component/polygon)
         * [RegularPolygon](/modules/eventemitter/container/component/polygon/regular-polygon)
           * [Star](/modules/eventemitter/container/component/polygon/regular-polygon/star)
       * [Rectangle](/modules/eventemitter/container/component/rectangle)
         * [.resizable()](/modules/eventemitter/container/component/rectangle/resizable)
         * [Square](/modules/eventemitter/container/component/rectangle/square)
       * [Circle](/modules/eventemitter/container/component/circle)
       * [Text](/modules/eventemitter/container/component/text)
     * [Slider](/modules/eventemitter/container/container/slider)
 * [Position](/modules/position)
 * [Vector](/modules/vector)
 * [BaseEvent](/modules/baseevent)
   * [MouseEvent](/modules/baseevent/mouseevent)


## Purpose

### Abstraction
Drawing in a canvas is not trivial.
First of all, the goal is to ease the use of canvas in a browser.

### OOP
OOP is great, OOP is almighty, OOP saves lives !
Others library exists, but none with a beautiful OOP syntax.

### Modularity
Splitting the whole code into modules make everything looks cleaner.
It also allow you to grab only what you need or replace what you don't like.

### Documentation
A complete documentation goes a long way to help devs.
All functions are assured to have a description also typed arguments and returns.
