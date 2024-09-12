# Image

Image rendering.

![Image example](../../../media/examples/image.png)


## Examples

```js
// This will override the native Image class !
import { Image } from "pencil.js";

const position = [100, 200];
const url = "url/to/my/file.png";
const options = {
    fill: "black",
    description: "Cutest cat ever !"
};
const image = new Image(position, url, options);
image.on("ready", () => {
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


## ImageOptions
Inherit from [RectangleOptions](../rectangle/readme.md#rectangleoptions).

| Name        | Type                                    | Default | Comment                                 |
|-------------|-----------------------------------------|---------|-----------------------------------------|
| fill        | [Color](../color/readme.md) or `String` | `null`  | Background color for transparent images |
| tint        | [Color](../color/readme.md)             | `null`  | Multiply the image pixels with a color  |
| description | `String`                                | `""`    | Accessibility description of the image  |
