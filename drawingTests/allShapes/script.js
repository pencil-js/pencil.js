/* global Pencil */

const P = Pencil;

const scene = new P.Scene(window.allShapesScene, {
    fill: "rgba(200, 200, 200, 0.3)",
});

const shapes = [];

shapes.push(new P.Arc(new P.Position(30, 30), 20, 0.25, -0.1, {
    fill: "#F00",
    strokeWidth: 8,
}));

const container = new P.Container(new P.Position(30, 20), {
    opacity: 0.5,
});

container.add(new P.Circle(new P.Position(0, 60), 20, {
    fill: "gold",
}));

container.add(new P.Rectangle(new P.Position(50, 0), 50, 40, {
    rotation: 0.125,
    rotationAnchor: new P.Position(25, 20),
}));

shapes.push(container);

shapes.push(new P.Star(new P.Position(80, 100), 20));

shapes.push(new P.RegularPolygon(new P.Position(80, 100), 5, 20, {
    fill: null,
    stroke: "rgb(0, 0, 255)",
}));

const points = [
    new P.Position(20, 130),
    new P.Position(50, 180),
    new P.Position(70, 160),
    new P.Position(20, 170),
];

shapes.push(new P.Line(points, {
    strokeWidth: 4,
    cap: P.Line.caps.butt,
}));
shapes.push(new P.Spline(points.map(point => point.clone().add(50, 0)), 0.5, {
    strokeWidth: 4,
}));

shapes.push(new P.Square(new P.Position(160, 100), 50, {
    zIndex: 0,
    origin: new P.Position(25, 0),
    fill: "green",
}));

shapes.push(new P.Text(new P.Position(160, 100), "test\n🦄", {
    fontSize: 40,
    align: P.Text.alignments.center,
    bold: true,
    italic: true,
    font: "monospace",
}));

shapes.push(new P.Path(new P.Position(140, 30), [
    P.Path.lineTo(new P.Position(160, 30)),
    P.Path.halfTo(new P.Position(180, 30), false),
    P.Path.quarterTo(new P.Position(200, 10)),
    P.Path.splineThrough([
        new P.Position(200, 80),
        new P.Position(140, 80),
    ], 0.4),
], false, {
    stroke: "hsl(210, 100%, 50%)",
    strokeWidth: 6,
}));

scene.add(...shapes).render();
