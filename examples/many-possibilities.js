const scene = new Pencil.Scene(wrapper, {
    fill: "#b3f0ff",
});

const width = 100;
const height = 80;

for (let i = 0; i < 5; ++i) {
    const randomPosition = new Pencil.Position(
        Pencil.Math.random(scene.width - (width * 2)),
        Pencil.Math.random(scene.height - (height * 2)),
    );
    const rectangle = new Pencil.Rectangle(randomPosition, width, height, {
        fill: "#ebc31b",
        stroke: "teal",
        strokeWidth: 5,
        opacity: 0.5,
    });
    rectangle.draggable({
        constrain: new Pencil.Vector([0, 0], [scene.width - width, scene.height - height]),
    });
    rectangle.on("grab", () => rectangle.options.opacity = 1)
        .on("drop", () => rectangle.options.opacity = 0.5);
    scene.add(rectangle);
}

scene.startLoop();
