# Documentation

## Methods

### getCurrentScene
Return the current scene

```js
const currentScene = getCurrentScene();
```

### prepareScenes
Build all scene and display the first one

```js
const firstScene = prepareScenes({
    first: scene => scene.add(new Circle()),
});
```

| Name | Type | Default | Comment |
| --- | --- | --- | --- |
| builders | ``Object`` | Required | Set of function building the scenes |
| container | ``HTMLElement`` | ``document.body`` | Container for all the scenes |


### displayScene
Hide the current scene and display a new scene

```js
displayScene(newScene);
```

| Name | Type | Default | Comment |
| --- | --- | --- | --- |
| builders | ``Scene`` | Required | Any scene to show |
