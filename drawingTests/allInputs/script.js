/* global Pencil */

{
    const P = Pencil;

    const scene = new P.Scene(window.allInputsScene);

    const slider = new P.Slider([20, 10], {
        value: 7,
    });
    const progress = new P.ProgressBar([20, 40], {
        value: 0.7,
    });
    const knob = new P.Knob([40, 130], {
        radius: 20,
        value: 7,
    });
    slider.on(P.Input.events.change, () => {
        progress.value = slider.value / 10;
        knob.value = slider.value;
    });
    knob.on(P.Input.events.change, () => {
        progress.value = knob.value / 10;
        slider.value = knob.value;
    });

    scene.add(
        slider,
        progress,
        new P.Button([20, 70], {
            value: "Click",
        }),
        new P.Select([90, 70], [
            "Unicorn",
            "Doggy",
            "Cat",
            "Pony",
        ], {
            value: 1,
        }),
        new P.Checkbox([195, 75], {
            value: true,
        }),
        knob,
    );

    scene.startLoop();
}
