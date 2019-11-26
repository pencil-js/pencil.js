# Sprite

Sprite component.

![Sprite example](../../media/examples/sprite.gif)


## Installation

    npm install @pencil.js/sprite


## Examples

The easiest way to use sprites is using a spritesheet (a.k.a. Texture Atlas). A Spritesheet is a combination of a large image composed of smaller images
and a json file.
We even create our [own tool to build a spritesheet](https://github.com/pencil-js/spritesheet) from separate images.

Pencil.js offer an easy way to load and use a spritesheet.
```js
import Sprite from "@pencil.js/sprite";

Sprite.sheet("spritesheet.json")
    .then((sheet) => {
        const position = scene.center;
        const selector = "image_*.png";
        const sprite = sheet.extract(position, selector);
        scene.add(sprite).startLoop();
    });
```

You can also use the `Sprite` class directly if you prefer.
```js
import Sprite from "@pencil.js/sprite";

const position = scene.center;
const url = "sprite-sheet.png";
const frames = [
   // list of frames data
];
const options = {
    // Options
};
const sprite = new Sprite(position, url, frames);
scene.add(sprite).startLoop();
```

## SpriteOptions
Inherit from [ImageOptions](../image/readme.md#imageoptions).

| Name | Type | Default | Comment |
| ---- | ---- | ------- | ------- |
|speed |`Number` |`1` |Frame rate of the animation (1 means about 60 frame per seconds, 0 means stopped) |
|loop |`Boolean` |`true` |Should the animation start over indefinitely |