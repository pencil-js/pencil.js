# Particles

Particle generator optimized to display thousands of instances.

![Particles example](../../media/examples/particles.png)


## Installation

    npm install @pencil.js/particles


## Examples

```js
import Particles from "@pencil.js/particles";
import Star from "@pencil.js/star";
import { random } from "@pencil.js/math";

const position = [100, 200];
const base = new Star();
const count = 5000;
const generator = () => {
    return {
        position: scene.getRandomPosition(),
        rotation: random(),
        // And whatever value you want to define for each individual particle
    };
};
const updater = (data) => {
    data.position.add(data.speed);
};

const particles = new Particles(position, base, count, generator, updater);
```


## ParticlesOptions
Inherit from [ComponentOptions](../component/readme.md#componentoptions).

Particles have no specific options.
