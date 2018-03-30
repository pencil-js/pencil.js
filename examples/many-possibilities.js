const scene = new Pencil.Scene(wrapper, {
    fill: "rgba(255, 0, 255, 0.1)",
});

const width = 100;
const height = 80;

for (let i = 0; i < 5; ++i) {
    const position = new Pencil.Position(Pencil.Math.random(scene.width), Pencil.Math.random(scene.height));
    const rectangle = new Pencil.Rectangle(position, width, height, {
        fill: "#49a8eb",
        stroke: "#fff277",
        strokeWidth: 5,
        opacity: 0.5,
    });
    rectangle.draggable({
        constrain: new Pencil.Vector(0, 0, scene.width, scene.height),
    });
    scene.add(rectangle);
}

scene.startLoop();
