# Container

Simple wrapper for others component in you scene.


## Installation

    npm install @pencil.js/container


## Examples

```js
import Container from "@pencil.js/container";

const container = new Container();
container.add(someComponent);
```

## ContainerOptions

| Name | Type | Default | Comment |
| ---- | ---- | ------- | ------- |
|shown |`Boolean` |`true` |Is shown |
|opacity |`Number` |`null` |Opacity level from 0 to 1 (null mean inherited from parent) |
|rotation |`Number` |`0` |Rotation ratio from 0 to 1 (clockwise) |
|rotationCenter |[`Position`](../position) |`new Position()` |Center of rotation relative to this position |
|scale |[`Position`](../position) or `Number` |`1` |Scaling ratio or a pair of value for horizontal and vertical scaling |
|zIndex |`Number` |`1` |Depth ordering |
|clip |`Component` |`null` |Other component used to clip the rendering |
