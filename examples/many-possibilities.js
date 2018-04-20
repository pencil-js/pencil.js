const scene = new Pencil.Scene(wrapper, {
    fill: "#ffdaf8",
});

const width = 100;
const height = 80;

for (let i = 0; i < 5; ++i) {
    const randomPosition = new Pencil.Position(
        Pencil.Math.random(scene.width - (width * 2)),
        Pencil.Math.random(scene.height - (height * 2)),
    );
    const rectangle = new Pencil.Rectangle(randomPosition, width, height, {
        fill: "#49a8eb",
        stroke: "gold",
        strokeWidth: 5,
        alpha: 0.5,
    });
    rectangle.draggable({
        constrain: new Pencil.Vector(0, 0, scene.width - width, scene.height - height),
    });
    rectangle.on("grab", () => rectangle.options.alpha = 1)
        .on("drop", () => rectangle.options.alpha = 0.5);
    scene.add(rectangle);
}

scene.startLoop();
