# Particles

Particle generator optimized to display thousands of instances.

![Particles example](../../../media/examples/particles.png)


## Examples

### Manual generation

```js
import { Particles, Star, Math as M } from "pencil.js";

const count = 5000;
const position = [100, 200];
const base = new Star(undefined, 5, 20);
// Additional parameters after the first one come from the generate method call
const generator = (index, any, additional, params) => {
    // Particles data
    return {
        position: scene.getRandomPosition(),
        rotation: M.random(),
        scale: M.random(0.5, 1.5),
        ttl: 100,
        // And whatever value you want to define for each individual particle, for example
        speed: new Position(1, 0).rotate(M.random()),
    };
};
const updater = (data, index) => {
    data.position.add(data.speed);
};

const particles = new Particles(position, base, generator, updater);
// Any parameters after the first one are passed to the generator function
particles.generate(count, any, additional, params);
```

### Automatic generation

```js
import { Particles, Star, Math as M } from "pencil.js";

const count = 5000;
const position = [100, 200];
const base = new Star(undefined, 5, 20);
// Additional parameters after the first one come from the generate method call
const generator = (index, any, additional, params) => {
    // Particles data
    return {
        position: scene.cursorPosition,
        rotation: M.random(),
        scale: M.random(0.5, 1.5),
        ttl: 100,
        // And whatever value you want to define for each individual particle, for example
        speed: new Position(1, 0).rotate(M.random()),
    };
};
const updater = (data, index) => {
    data.position.add(data.speed);
};

const particles = new Particles(position, base, generator, updater, {
    emit: [10, 20], // Between 10 and 20 particles
    frequency: 0.5, // about every 2 frames
    args: [any, additional, params], // parameters for the generator function
});
```


## ParticlesOptions

Inherit from [ComponentOptions](../component/readme.md#componentoptions).

| Name | Type | Default | Comment |
| ---- | ---- | ------- | ------- |
|`frequency` |`Number` |`1` |Frequency of emission per frame (randomized, 1 mean every frame, 0.1 mean about 1 each 10 frames) |
|`emit` |`Number` or `Array<Number>` | |Number or range of number of particles emitted |
|`args` |`Array` | |Arguments passed to the generator function |


## ParticlesData

`ParticlesData` stores individuals information about each particle.
It supports a limited number of properties.

| Name | Type | Default | Comment |
| ---- | ---- | ------- | ------- |
|`position` |[`Position`](../position) |`new Position()` |Position of the particle |
|`rotation` |`Number` |`0` |Rotation applied to the particle |
|`scale` |`Number` or `Array` |`1` |Scaling ratio or a pair of value for horizontal and vertical scaling |
|`ttl` |`Number` |`undefined` |Time to live, number of frames the particle is displayed. This number will be decremented and the data removed when it reach 0. Any falsy value will prevent this behavior |

The data object can also be used to store any other individual values for each particle.
