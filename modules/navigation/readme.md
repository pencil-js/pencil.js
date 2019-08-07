# Navigation

Navigation helper to switch from Scene to Scene.


## Installation

    npm install @pencil.js/navigation


## Examples

```js
import * as Navigation from "@pencil.js/navigation";

Navigation.prepareScenes({
    // The first scene on the set is going to be the default one
    home: (canvas) => {
        const scene = new Scene(canvas);
        // Build your scene here ...
        // If you want to change scene call a new change event
        scene.fire(new BaseEvent(Scene.event.change, "other"));
        return scene;
    },
    other: (canvas) => {
        const scene = new Scene(canvas);
        // Build your scene here ...
        return scene;
    },
});

const currentScene = Navigation.getCurrentScene();
```

## Documentation

Go check the [full documentation](documentation.md).
