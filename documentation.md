![Pencil.js logo](./media/animated-logo.gif)

# Documentation

Welcome to the [Pencil.js documentation page](https://docs.pencil-js.vercel.app/).


## Get started

### NPM

```
npm install pencil.js
```


### CDN

```js
import Pencil from "https://unpkg.com/pencil.js/dist/pencil.esm.js";
```

## Usage

```js
import { Scene, Triangle } from "https://unpkg.com/pencil.js/dist/pencil.esm.js";

const scene = new Scene();

const radius = 200;
const triangle = new Triangle(scene.center, radius);

scene
    .add(triangle)
    .render();
```


## Links

 - [Pencil.js official website](https://pencil.js.org/)
 - [Quick-start guide](https://pencil.js.org/quick-start/)
 - [Complete guide](https://pencil.js.org/guide/)
 - [Examples](https://codepen.io/collection/XqzkNQ/)
