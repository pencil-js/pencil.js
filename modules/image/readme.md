# Image

Class for Pencil.js keyboard related events.


## Installation

    npm install @pencil.js/image


## Examples

```js
import Image from "@pencil.js/image";

const img = new Image(aPosition, "url/to/my/file.png");
img.on("load", () => {
    myScene.addChild(img);
});

// Can be use to preload a bunch of images
Image.load([url1, url2, url3]).then(() => console.log("Images ready"));
```

Be aware that this example overrides Javascript's ``Image`` global. Use namespace to avoid this issue.

```js
import * as Pencil from "@pencil.js/image";
```
