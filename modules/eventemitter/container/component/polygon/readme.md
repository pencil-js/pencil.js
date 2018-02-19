# Polygon

Abstract class for visual component of a scene.


## Installation

    npm install @pencil.js/polygon


## Examples

```js
    import Polygon from "@pencil.js/polygon";
    
    const points = [aPosition, anotherPosition, yetAgainAPosition, lastPosition];
    const options = {
        fill: "red",
        stroke: "#000"
    };
    let polygon = new Polygon(points, options);
```
