export default async function draw (scene, Pencil) {
    const P = Pencil;

    const value = 0.7;
    const slider = new P.Slider([20, 10], {
        value,
    });
    const progress = new P.ProgressBar([20, 40], {
        value,
        speed: 1,
    });
    const knob = new P.Knob([40, 130], {
        radius: 20,
        value,
    });
    const pie = new P.ProgressPie([90, 130], {
        radius: 20,
        value,
        speed: 1,
    });
    slider.on(P.Input.events.change, () => {
        progress.value = slider.value;
        knob.value = slider.value;
        pie.value = slider.value;
    });
    knob.on(P.Input.events.change, () => {
        progress.value = knob.value;
        slider.value = knob.value;
        pie.value = knob.value;
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
        pie,
    );
}
