# Image

Image rendering.


## Installation

    npm install @pencil.js/image


## Examples

```js
import Image from "@pencil.js/image";

const image = new Image(aPosition, "url/to/my/file.png");
image.on("load", () => {
    console.log("Image is loaded");
});

// Can be use to preload a bunch of images
Image.load([url1, url2, url3]).then(() => {
    console.log("Images ready");
});
```

Be aware that this example overrides Javascript's `Image` global. Use namespace to avoid this issue.

```js
import * as Namespace from "@pencil.js/image";
new Namespace.Image();
```
