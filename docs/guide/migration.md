# Migrate from v3

v4 is a complete rewrite in TypeScript. The public API stays the same:
constructors, options, methods and events keep their names and signatures.
This page lists everything that could affect an existing project.

## Installation and imports

The 48 `@pencil.js/*` packages are replaced by the single `pencil.js` package.
Each module is still importable on its own.

```js
// v3
import Circle from "@pencil.js/circle";
import "@pencil.js/draggable";

// v4
import Circle from "pencil.js/circle";
import "pencil.js/draggable";
```

Imports from `pencil.js` (named or default) don't change.

- The CDN files are still `dist/pencil.esm.js` and `dist/pencil.min.js`. The global `Pencil` variable exposes every named export.
- TypeScript declarations are included, no need for `@types`.
- Node.js 22.12 or later is required for tooling (the library itself runs in any modern browser).

## Behavior changes

These are bug fixes or improvements that can change what you see.

### Rendering

- **Opacity is multiplied** with the ancestors opacity. A child with `opacity: 0.5` in a parent with `opacity: 0.5` is now drawn at 25% (it was 50%).
- `Polygon`, `Heart` and closed `Path` close their outline properly (no more doubled first segment).
- `Container.setContext` only sets styles. Position, clipping, rotation and scale are applied by the new `applyTransform` method. Update your overrides if you used `setContext` to transform the context.
- Clipping takes the clip component's own rotation, scale and origin into account, and clipped areas can't be hovered anymore.

### Pointer events

- Mouse, touch and pen all trigger the usual `mousedown`, `mousemove`, `mouseup`, `click` … events (the scene uses Pointer Events and captures the pointer while pressed).
- Positions account for the canvas CSS size and its current position on the page (scroll, layout changes). `scene.containerPosition` is removed.
- `MouseEvent#button` is now a string (`"0"`, `"1"` …) matching `MouseEvent.buttons`, so button modifiers like `` `mousedown.${MouseEvent.buttons.right}` `` now work.
- Leaving the canvas fires `leave` on the hovered element.

### Interactions

- `.draggable()` works inside rotated or scaled parents ([#60](https://github.com/pencil-js/pencil.js/issues/60)).
- `.rotatable()` rotates around the element's `rotationCenter` and no longer mutates the event position.
- `.resizable()` handle follows size changes made by code.

### Geometry

- `getAbsolutePosition()` accounts for every transformation, scale included. New helpers: `getMatrix()`, `getAbsoluteMatrix()`, `toLocal()` and `toGlobal()`.
- `Vector#multiply(position | vector)` scales the vector's delta (start stays in place). It used to multiply the end coordinates directly.
- `Math.modulo` returns `0` instead of the divisor or `-0` for exact multiples of a negative number. `Math.truncate` works beyond 32 bits.
- `RegularPolygon` requires its number of sides.

### Widgets

- `ProgressBar` and `ProgressPie` now extend the new `Widget` class instead of `Input`: they don't react to hover or click and don't fire `change`.
- Inputs get their initial `value` at construction (it was set when attached to a parent).
- `Button` shows a pressed state (new `active` option).
- `Slider` keeps its handle vertically centered on click and keeps its value when its width changes.
- `Select`'s options list is drawn above its siblings.

### Text, images and sprites

- `Text` fires `ready` asynchronously, so a listener added right after construction is called. A font that fails to load fires `error`.
- `Image` ignores an outdated load when the url changes before the end of the previous one.
- `Sprite.sheet` resolves the image path relative to the JSON file, fires `sprite-start` and uses [zeptomatch](https://github.com/fabiospampinato/zeptomatch) for glob selectors.
- `Pattern` accepts an image url and is transparent until loaded.

### Particles

- Particles are updated once per render with the new `update()` method (the updater was called each time the path was traced, hit-testing included).

### Serialization

- `toJSON` returns plain data (`[x, y]` arrays instead of `Position` instances). `JSON.stringify` output is the same as before.
- Gradients, patterns, path instructions and particles can be serialized and revived with `from`.
- `clone()` copies children too.
- Classes are identified by a static `className`, so serialization survives minification. Use `register()` to make your own classes revivable.

### Colors

- Hex numbers keep their leading zeros (`new Color(0x00ff00)` was invalid).
- CSS color strings keep their alpha (`"rgba(0, 0, 0, 0.5)"`).
- `Color.from` accepts the `[red, green, blue, alpha]` array produced by `toJSON`.

### Navigation

- `back()` returns `null` when the history is empty instead of throwing.

## New features

- `scene.destroy()` stops rendering, removes every event listener and the canvas it created.
- `emitter.once(name, callback)` listens to an event only once.
- `Path.waveTo` and `Path.sinTo` are implemented.
- Gradients' and `Pattern`'s `toJSON` / `from`.
- `register()` to make custom classes revivable by `from()`.
