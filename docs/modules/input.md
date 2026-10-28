# Input

Abstract user input, reacting to hover and click and firing a `change` event when its value change.


## Examples

```js
import { Input } from "pencil.js";

class MyInput extends Input {
    // Implement get/set value, width and height
    click (position) {
        // React to clicks (position is relative to the input)
        super.click(); // Fire "change"
    }
}
```

## InputOptions
Inherit from [WidgetOptions](./widget.md#widgetoptions).

| Name       | Type                            | Default                     | Comment                              |
|------------|---------------------------------|-----------------------------|--------------------------------------|
| hover      | [Color](./color.md) or `String` | `"#dcdcdc"`                 | Color of the background when hovered |
| cursor     | `String`                      | `Component.cursors.pointer` | Cursor on hover                      |
