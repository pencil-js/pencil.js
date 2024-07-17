# Documentation

## Examples

```js
const { home, settings } = Navigation.prepareScenes({
    home: scene => {
        const goToSettings = new Button(scene.center, {
            value: "Settings",
        });
        goToSettings.on(MouseEvent.events.click, () => Navigation.displayScene(settings));
        scene.add(goToSettings);
    },
    settings: scene => {
        const backButton = new Button([10, 10], {
            value: "<<",
        });
        backButton.on(MouseEvent.events.click, () => Navigation.back());
        scene.add(backButton);
    },
});
```


## Methods

### getCurrentScene
Return the current scene

```js
const currentScene = Navigation.getCurrentScene();
```

### prepareScenes
Build all scene and display the first one

```js
const { first } = Navigation.prepareScenes({
    first: scene => {
      scene.add(new Circle());
    },
});
```

| Name      | Type            | Default           | Comment                             |
|-----------|-----------------|-------------------|-------------------------------------|
| builders  | ``Object``      | Required          | Set of function building the scenes |
| container | ``HTMLElement`` | ``document.body`` | Container for all the scenes        |


### displayScene
Hide the current scene and display a new scene

```js
Navigation.displayScene(newScene);
```

| Name     | Type      | Default  | Comment           |
|----------|-----------|----------|-------------------|
| builders | ``Scene`` | Required | Any scene to show |

### back
Go back in history

```js
Navigation.back();
```
