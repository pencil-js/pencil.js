# Pencil.js

A modular 2D drawing library for Javascript.


## Installation
You can install the whole package with the following command :

    npm install pencil.js


But, know that each part is a JS module and can be used independently, ex:

    npm install @pencil.js/scene


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

 * [EventEmitter](/tree/master/modules/eventemitter)
   * [Container](/tree/master/modules/eventemitter/container)
     * [Scene](/tree/master/modules/eventemitter/scene)
     * [Component](/tree/master/modules/eventemitter/component)
       * [.draggable()](/tree/master/modules/eventemitter/component/draggable)
       * [Polygon](/tree/master/modules/eventemitter/component/polygon)
         * [Star](/tree/master/modules/eventemitter/component/polygon/star)
       * [Rectangle](/tree/master/modules/eventemitter/component/rectangle)
         * [.resizable()](/tree/master/modules/eventemitter/component/rectangle/resizable)
         * [Square](/tree/master/modules/eventemitter/component/rectangle/square)
       * [Circle](/tree/master/modules/eventemitter/component/circle)
       * [Text](/tree/master/modules/eventemitter/component/text)
     * [Slider](/tree/master/modules/eventemitter/container/slider)
 * [Position](/tree/master/modules/position)
 * [Vector](/tree/master/modules/vector)
 * [BaseEvent](/tree/master/modules/baseevent)
   * [MouseEvent](/tree/master/modules/baseevent/mouseevent)


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
