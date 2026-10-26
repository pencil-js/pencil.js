# Interactions

The scene listens to [pointer events](https://developer.mozilla.org/docs/Web/API/Pointer_events),
so mouse, touch and pen are all supported and trigger the same events.

| Event | When |
|-------|------|
| `mousedown` / `mouseup` | Pointer pressed / released over the element |
| `click` | Pressed then released without moving more than 10px |
| `mousemove` | Pointer moved over the element |
| `hover` / `leave` | Pointer starts / stops hovering the element |
| `scrollup` / `scrolldown` (`zoomin` / `zoomout`) | Mouse wheel |
| `contextmenu`, `dblclick` | Same as their DOM counterpart |
| `keydown` / `keyup` | Fired on the scene |

Use `MouseEvent.events` and `KeyboardEvent.events` constants instead of strings.

## Drag, rotate and resize

```js
import "pencil.js/draggable";

const api = rectangle.draggable({
    y: false, // Only move horizontally
    constrain: [[0, 0], [500, 0]], // In the parent space
});

api.stop(); // Not draggable anymore
```

Dragging works whatever the transformations (rotation, scale …) of the element's ancestors.

```js
import "pencil.js/rotatable";

knob.rotatable(); // Rotate around options.rotationCenter
```

```js
import "pencil.js/resizable";

rectangle.resizable(); // Add a handle at the bottom-right corner
```

These interactions fire `grab`, `drag`, `rotate`, `resize` and `drop` events.

## Coordinates

Pointer events give positions in the scene space. Convert them for any element:

```js
scene.on("click", (event) => {
    const local = group.toLocal(event.position);
    const back = group.toGlobal(local);
});
```

`getAbsolutePosition()` and `getAbsoluteMatrix()` give the element's position and full transformation in the scene.
