# Particles

Particle generator optimized to display thousands of instances.


## Installation

    npm install @pencil.js/particles


## Examples

```js
import Particles from "@pencil.js/particles";
import Square from "@pencil.js/square";
import { random } from "@pencil.js/math";

const base = new Square(undefined, 8, {
    fill: "red",
});
const count = 5000;
const generator = () => {
    return {
        position: scene.getRandomPosition(),
        rotation: random(),
        // And whatever value you want to define for each individual particle
    };
};

const particles = new Particles(aPosition, base, count, generator);
```
