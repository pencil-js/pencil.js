# Pencil.js

A modular 2D drawing library for Javascript.


## Installation
You can install the whole package with the following command :

    npm install pencil.js


But, each part is a JS module and can be used independently, ex:

    npm install @pencil.js/scene

## Usage

Once you have installed it, you can start to import it using common.js or ES6 syntax.

Either, the whole package (good to wrap it in a namespace) :
```js
    const Pencil = require("pencil.js");
    // or
    import Pencil from "pencil.js";
    
    let scene = new Pencil.Scene();
```

Or, just the package you need (good for simplicity) :

```js
    const Scene = require("@pencil.js/scene");
    // or
    import Scene from "@pencil.js/scene";
    
    let scene = new Scene();
```


## Examples

```js
    import Scene from "pencil.js"; // or "@pencil.js/scene"
    import Rectangle from "pencil.js"; // or "@pencil.js/rectangle"
    import Position from "pencil.js"; // or "@pencil.js/position"
    
    let scene = new Scene(document.body);
    
    
    const width = 80;
    const height = 50;
    let rectangle = new Rectangle(new Position(100, 200), width, height, {
        fill: "red"
    });
    scene.addChild(rectangle);
    
    scene.render();
```
    
Take a look at [more advanced examples]().

## Modules

 * [EventEmitter](/modules/eventemitter)
   * [Container](/modules/eventemitter/container)
     * [Scene](/modules/eventemitter/container/scene)
     * [Component](/modules/eventemitter/container/component)
       * [.draggable()](/modules/eventemitter/container/component/draggable)
       * [Polygon](/modules/eventemitter/container/component/polygon)
         * [Star](/modules/eventemitter/container/component/polygon/star)
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
It also allow you to grab only what you need.

### Documentation
A complete documentation goes a long way to help devs.
All functions are assured to have a description and typed arguments and returns.
