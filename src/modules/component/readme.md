# Component

Abstract class for visual component of a scene.


## Examples

```js
import { Component } from "pencil.js";

class FunnyShape extends Component {
    render (ctx) {
        // Do crazy stuff here
    }
}
```

## ComponentOptions
Inherit from [ContainerOptions](../container/readme.md#containeroptions).

| Name | Type | Default | Comment |
| ---- | ---- | ------- | ------- |
|fill |[Color](../color/readme.md) or `String` |`"#000"` |Background Color used to fill, set to null for transparent |
|stroke |[Color](../color/readme.md) or `String` |`null` |Color used to stroke, set to null for transparent |
|strokeWidth |`Number` |`2` |Stroke line thickness in pixels |
|dashed |`Boolean` or `Array` |`false` |Should the line be dashed, you can also specify the dash pattern (ex: [4, 4] or Component.dashes.dots) |
|cursor |`String` |`Component.cursors.default` |Cursor to use when hover |
|join |`String` |`Component.joins.miter` |How lines join between them |
|origin |[`Position`](../position) |`new Position()` |Relative offset |
|shadow |[`ShadowOptions`](#shadowoptions) |(see below) |Set of options to set a shadow |

## ShadowOptions

| Name | Type | Default | Comment |
| ---- | ---- | ------- | ------- |
|blur |`Number` |`0` |Spread of the shadow around the component |
|position |[`Position`](../position) |`new Position()` |Position of the shadow relative to the component |
|color |[Color](../color/readme.md) or `String` |`null` |Color of the shadow |

