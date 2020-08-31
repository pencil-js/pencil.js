# Navigation

Navigation helper to switch from Scene to Scene.


## Examples

```js
import { Navigation, BaseEvent, Scene } from "pencil.js";

Navigation.prepareScenes({
    // The first scene on the set is going to be the default one
    home: (scene) => {
        // Build your scene here ...
        // If you want to change scene call a new change event
        scene.fire(new BaseEvent(Scene.event.change, "other"));
    },
    other: (scene) => {
        // Build your scene here ...
    },
});

const currentScene = Navigation.getCurrentScene();
```

## Documentation

Go check the [full documentation](documentation.md).
