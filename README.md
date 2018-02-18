# Pencil.js

A modular 2D drawing library for Javascript.


## Installation
You can install the whole package with the following command :

    npm install pencil.js --save


But, know that each part is a JS module and can be used independently, ex:

    npm install pencil.js-scene --save


## Examples

```js
    import Scene from "pencil.js"; // or "pencil.js-scene"
    import Rectangle from "pencil.js"; // or "pencil.js-rectangle"
    import Position from "pencil.js"; // or "pencil.js-position"
    
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

 * [EventEmitter]()
   * [Container]()
     * [Scene]()
     * [Component]()
       * [.draggable()]()
       * [Polygon]()
         * [Star]()
       * [Rectangle]()
         * [.resizable()]()
         * [Square]()
       * [Circle]()
       * [Text]()
     * [Slider]()
 * [Position]()
 * [Vector]()
 * [BaseEvent]()
   * [MouseEvent]()


## Purpose

### Abstraction
Drawing in a canvas is not trivial.
First of all, the goal is to ease the use of canvas in a browser.

### OOP
OOP is great, OOP is almighty, OOP saves lives !
Others library exists, but none with a beautiful OOP syntax.

### Modularity
Cutting the whole code into modules make everything looks cleaner.
It also allow you to grab only what you need.
