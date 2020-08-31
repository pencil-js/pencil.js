import { Scene, Button, Slider, Select, Knob, Checkbox, ProgressBar, ProgressPie } from "../dist/pencil.esm.js";

// Don't forget to run "npm run build" before
const timer = "Playground ready";
console.time(timer);

const scene = new Scene();

const origin = "center";
const button = new Button(scene.center, {
    value: "Button",
    origin,
});
const check = new Checkbox(button.position.clone().add(0, -50), {
    value: true,
    origin,
});
const slider = new Slider(button.position.clone().add(0, 50), {
    value: 50,
    max: 100,
    origin,
});
const select = new Select(slider.position.clone().add(0, 50), [
    "One",
    "Two\nline",
    "Three is long",
], {
    value: 1,
    origin,
});

const knob = new Knob(select.position.clone().add(0, 90), {
    value: 0.5,
    radius: 50,
    origin,
});

const progressB = new ProgressBar(knob.position.clone().add(0, 90), {
    value: 0.5,
    origin,
});

const progressP = new ProgressPie(progressB.position.clone().add(0, 90), {
    value: 0.5,
    radius: 50,
    origin,
});

// knob.on("change", () => {
//     progressB.value = knob.value;
//     progressP.value = knob.value;
//     slider.value = knob.value;
// });
// slider.on("change", () => {
//     progressB.value = slider.value;
//     progressP.value = slider.value;
//     knob.value = slider.value;
// });

slider.value = 20;
console.log(slider.value);
window.slider = slider;

scene
    .add(
        button, check, slider, select, knob, progressB, progressP,
    )
    .startLoop();

console.timeEnd(timer);
