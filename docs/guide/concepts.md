# Core concepts

## The scene graph

Everything you draw is part of a tree:

- a [`Scene`](/modules/scene) is the root, linked to a canvas displayed on the page
- [`Container`](/modules/container)s group elements and share their transformations
- [`Component`](/modules/component)s are the visible shapes (circles, texts, images …)

```js
import { Scene, Container, Circle } from "pencil.js";

const scene = new Scene();
const group = new Container([200, 200], {
    rotation: 0.125,
    scale: 2,
});
group.add(new Circle([0, 0], 20), new Circle([50, 0], 20));
scene.add(group).render();
```

A child's position, rotation, scale and opacity are relative to its parent.

## Positions

Wherever a position is expected, you can give a [`Position`](/modules/position), an array `[x, y]` or an object `{ x, y }`.

```js
new Circle([10, 20], 5);
new Circle({ x: 10, y: 20 }, 5);
new Circle(new Position(10, 20), 5);
```

## Angles

Angles are expressed in ratio of a full turn, clockwise, starting from the top:
`0` is up, `0.25` is right, `0.5` is down and `1` is a full circle.

```js
rectangle.options.rotation = 0.25; // Quarter turn clockwise
```

## Options

Every element takes an `options` object as last constructor argument.
They are merged with the class's `defaultOptions` and can be changed at any time.

```js
const circle = new Circle([0, 0], 10, {
    fill: "red",
    stroke: "#000",
    strokeWidth: 3,
    shadow: {
        color: "#0004",
        blur: 5,
        position: [2, 2],
    },
});

circle.options.fill = "blue";
circle.setOptions({ opacity: 0.5 });
```

Fill and stroke accept any CSS color, a [`Color`](/modules/color), a gradient or a [`Pattern`](/modules/pattern).

## Events

Every element is an [`EventEmitter`](/modules/event-emitter). Events bubble up from a child to its ancestors.

```js
circle.on("click", event => console.log(event.position));

// Only when the event targets this element (not a descendant)
group.on("click", () => {}, true);

// With a modifier
scene.on(`keydown.${KeyboardEvent.keys.enter}`, () => {});
scene.on(`mousedown.${MouseEvent.buttons.right}`, () => {});

// Only once
circle.once("ready", () => {});
```

## Rendering

- `scene.render()` draws everything once
- `scene.startLoop()` draws at every animation frame (`scene.fps` gives the current frame rate)
- `scene.stopLoop()` stops it
- `scene.destroy()` stops everything and removes the event listeners

Elements with a negative `zIndex` are drawn behind their parent.
