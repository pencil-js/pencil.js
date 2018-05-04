/* global Pencil */

{
    const P = Pencil;

    const scene = new P.Scene(window.allInputsScene);

    scene.add(
        new P.Checkbox([20, 20], {
            value: true,
        }),
        new P.Slider([20, 50], {
            value: 8,
        }),
        new P.Button([20, 80], {
            value: "Click",
        }),
    );

    scene.startLoop();
}
