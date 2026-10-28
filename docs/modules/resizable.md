# .resizable

Allow rectangles to be resized.


## Examples

```js
const options = {
    x: false
};
myComponent.resizable(options);
```

The size can be bounded with the `constrain` option (applied to the bottom-right corner):

```js
myComponent.resizable({
    constrain: [[20, 20], [400, 300]], // min and max size
});
```

| Name | Type | Default | Comment |
| ---- | ---- | ------- | ------- |
| `x` | `Boolean` | `true` | Can be resized horizontally |
| `y` | `Boolean` | `true` | Can be resized vertically |
| `constrain` | `Vector` | `null` | Limits of the bottom-right corner |
| `handle` | `Component` | gold triangle | Draggable shape used as handle |
