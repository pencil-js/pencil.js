# Particles

Particle generator optimized to display thousands of instances.

![Particles example](../../../media/examples/particles.png)


## Examples

```js
import { Particles, Star, Math as M } from "pencil.js";

const count = 5000;
const position = [100, 200];
const base = new Star();
const generator = (index, any, additional, params) => {
    return {
        position: scene.getRandomPosition(),
        rotation: M.random(),
        // And whatever value you want to define for each individual particle
    };
};
const updater = (data, index) => {
    data.position.add(data.speed);
};

const particles = new Particles(position, base, generator, updater);
particles.generate(count, any, additional, params);
```


## ParticlesOptions
Inherit from [ComponentOptions](../component/readme.md#componentoptions).

Particles have no specific options.
