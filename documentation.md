![Pencil.js logo](./media/animated-logo.gif)

# Documentation

[![NPM Version](https://badgen.net/npm/v/pencil.js?icon=npm)](https://www.npmjs.com/package/pencil.js)

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

<form action="https://codepen.io/pen/define" method="post" target="_blank">
<input type="hidden" name="data" value='{"title": "Pencil.js demo", "js": "import { Scene, Triangle } from \"https://unpkg.com/pencil.js/dist/pencil.esm.js\";\n\nconst scene = new Scene();\n\nconst radius = 200;\nconst triangle = new Triangle(scene.center, radius);\n\nscene\n    .add(triangle)\n    .render();\n", "tags": ["pencil.js"], "editors": "001", "layout": "right"}'>
<input type="submit" value="Try it yourself !" style="">
<style>
input[type=submit]{background:#642B73;color:#fff;border:none;padding:.5em 1em;cursor:pointer;box-shadow:2px 2px 0 #3e1b48}
input[type=submit]:hover{text-decoration:underline}
</style>
</form>


## Links

 - [Pencil.js official website](https://pencil.js.org/)
 - [Quick-start guide](https://pencil.js.org/quick-start/)
 - [Complete guide](https://pencil.js.org/guide/)
 - [Examples](https://codepen.io/collection/XqzkNQ/)
