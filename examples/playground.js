import Scene from "@pencil.js/scene";
import Square from "@pencil.js/square";
import Position from "@pencil.js/position";
import Circle from "@pencil.js/circle";
import Vector from "@pencil.js/vector";
import Line from "@pencil/line";
import Star from "@pencil/star";

import "@pencil/draggable";
import "@pencil/resizable";

let scene = new Scene(document.body, {
    fill: "#CCC",
    debug: true
});
scene.startLoop();

// Add a square
let square = new Square(new Position(100, 200), 100, {
    fill: "#666",
    stroke: "#333",
    strokeWidth: 2
});
scene.addChild(square);
square.resizable(); // Make it resizable (square resize to keep 1:1 ratio)

// Add a circle
let underCirc = new Circle(new Position(), 15, {
    fill: "#a01c90",
    cursor: "crosshair", // specific cursor
    zIndex: -1 // Make it go under parent
});
square.addChild(underCirc);

let circ = new Circle(new Position(250, 150), 100, {
    fill: "#D55",
    alpha: .7
});
scene.addChild(circ);
circ.draggable(); // Make it draggable
// change alpha when mouse hover/leave
circ.on("hover", () => circ.options.alpha = 1).on("leave", () => circ.options.alpha = .7);

let subCircV = new Circle(new Position(0, 50), 20, {
    fill: "#EE5",
    cursor: "ns-resize"
});
circ.addChild(subCircV);
subCircV.draggable({
    constrain: new Vector(new Position(0, -80), new Position(0, 80)) // Draggable inside a constrain space
});

let subCircH = new Circle(new Position(), 20, {
    fill: "#EE5",
    cursor: "ew-resize"
});
circ.addChild(subCircH);
subCircH.draggable({
    constrain: new Vector(new Position(-80, 0), new Position(80, 0))
});

// Add a line between two component
let line = new Line(subCircV.position, subCircH.position, {
    stroke: "#FFF",
    strokeWidth: 5
});
circ.addChild(line);

// Add some text
let text = new Text(new Position(150, 500), "Holy shit !", {
    fill: null,
    stroke: "#0AE",
    strokeWidth: 2.5,
    fontSize: 50
});
scene.addChild(text);
text.draggable();

// Add a star
let star = new Star(new Position(text.width / 2, text.height / 2), 100, undefined, undefined, {
    fill: null,
    stroke: "gold",
    strokeWidth: 10,
    zIndex: -1
});
text.addChild(star);
