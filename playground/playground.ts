/**
 * Quick sandbox using the sources directly
 * Run with "npm run dev"
 */
import { Scene, Rectangle, Circle, Text } from "../src/index.js";

const timer = "Playground ready";
console.time(timer);

const scene = new Scene();

const rectangle = new Rectangle(scene.center, 200, 100, {
    fill: "#642b73",
    origin: Rectangle.origins.center,
    rotationCenter: [0, 0],
});
rectangle.draggable();
rectangle.add(new Circle([0, 0], 20, {
    fill: "#c6426e",
}));
scene.add(rectangle, new Text([10, 10], "Drag me"));

scene.on("draw", () => {
    rectangle.options.rotation += 0.002;
}, true);

scene.startLoop();

console.timeEnd(timer);
