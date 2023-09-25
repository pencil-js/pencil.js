import Pencil from "../dist/pencil.esm.js";

const tests = [
    "allShapes",
    "allInputs",
];

tests.forEach(async (name) => {
    const test = document.createElement("div");
    test.className = "test";
    const expected = new Pencil.Image(undefined, `./${name}/expected.png`);

    expected.on(Pencil.NetworkEvent.events.ready, async () => {
        const container = document.createElement("div");
        test.appendChild(container);
        container.style.width = `${expected.width}px`;
        container.style.height = `${expected.height}px`;
        const scene = new Pencil.Scene(container);

        const script = await import(`./${name}/script.js`);
        await script.default(scene, Pencil);
        scene.startLoop();

        const compare = new Pencil.OffScreenCanvas(expected.width, expected.height);
        compare.add(expected);

        const { data } = scene.getImageData();
        const { data: other } = compare.getImageData();

        test.appendChild(compare.ctx.canvas);

        const diffs = [...data].map((pixel, i) => Math.abs(pixel - other[i])).filter(diff => diff > 1);
        if (diffs.length) {
            const percentage = (Pencil.Math.sum(...diffs) / diffs.length / 255) * 100;
            console.error(`${name} failed with ${Math.ceil(diffs.length / 4)} pixels by ${(percentage).toFixed(2)}%`);
            test.classList.add("error");
        }
        else {
            console.log(`${name} Success`);
        }
    });
    document.body.appendChild(test);
});
