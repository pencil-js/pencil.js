# Input

Abstract user input.


## Examples

```js
import { Input } from "pencil.js";

class MyInput extends Input {
}
```

## InputOptions
Inherit from [ContainerOptions](../container/readme.md#containeroptions).

| Name       | Type                          | Default                     | Comment                              |
|------------|-------------------------------|-----------------------------|--------------------------------------|
| value      | Any                           | `null`                      | Initial value of the input           |
| foreground | [Color](../color) or `String` | `"#444"`                    | Color of the filling                 |
| fill       | [Color](../color) or `String` | `"#f6f6f6"`                 | Color of the background              |
| stroke     | [Color](../color) or `String` | `"#aaa"`                    | Color of the border                  |
| hover      | [Color](../color) or `String` | `"#d0d0d0"`                 | Color of the background when hovered |
| cursor     | `String`                      | `Component.cursors.pointer` | Cursor on hover                      |
