# Getting started

## Installation

```sh
npm install pencil.js
```

Pencil.js is an ES module library that ships its own TypeScript declarations.

### From a CDN

On any [capable browser](https://caniuse.com/es6-module), you can import the ESM bundle directly:

```html
<script type="module">
    import { Scene, Circle } from "https://unpkg.com/pencil.js/dist/pencil.esm.js";
</script>
```

Or go old-school with a global `Pencil` variable:

```html
<script src="https://unpkg.com/pencil.js"></script>
<script>
    const scene = new Pencil.Scene();
</script>
```

## First drawing

```js
import { Scene, Rectangle } from "pencil.js";

// A scene fills the page (or any element you give it)
const scene = new Scene();

const rectangle = new Rectangle([100, 200], 80, 50, {
    fill: "red",
});

scene
    .add(rectangle)
    .render(); // Render once
```

## Animate

Call `startLoop` to render the scene at every frame, and listen to the `draw` event to update things.

```js
import { Scene, Star } from "pencil.js";

const scene = new Scene();
const star = new Star(scene.center, 5, 100);

star.on(Star.events.draw, () => {
    star.options.rotation += 0.01;
}, true);

scene.add(star).startLoop();
```

## Interact

Every element can listen to pointer events (mouse, touch or pen).

```js
import { Scene, Circle, MouseEvent } from "pencil.js";
import "pencil.js/draggable";

const scene = new Scene();
const circle = new Circle(scene.center, 50, {
    cursor: Circle.cursors.pointer,
});

circle.on(MouseEvent.events.click, () => {
    circle.options.fill = "gold";
});
circle.draggable();

scene.add(circle).startLoop();
```

## Import style

You can import from the main entry, from a single module, or everything under a namespace.

```js
// Named imports (recommended, tree-shakable)
import { Scene, Circle } from "pencil.js";

// One module
import Circle from "pencil.js/circle";

// Everything under a namespace
import Pencil from "pencil.js";
const scene = new Pencil.Scene();
```

::: tip Interactions are opt-in
`.draggable()`, `.rotatable()` and `.resizable()` are added to components when you import
`pencil.js/draggable`, `pencil.js/rotatable` or `pencil.js/resizable` (the main entry imports all of them).
:::
