# Text

Text writing.

![Text example](../../media/examples/text.png)


## Installation

    npm install @pencil.js/text


## Examples

```js
import Text from "@pencil.js/text";

const options = {
    font: "comic-sans",
    fontSize: 42
};
const text = new Text(aPosition, "Hello world !", options);

// Can be use to preload a bunch of fonts
Text.load([url1, url2, url3]).then(() => {
    console.log("Fonts ready");
});
```

Be aware that this example overrides Javascript's `Text` global. Use namespace to avoid this issue.

```js
import * as Namespace from "@pencil.js/text";
new Namespace.Text();
```
