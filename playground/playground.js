/* global Pencil */
// Don't forget to run "npm run build" before

const timer = "Playground ready";
console.time(timer);

const P = Pencil;

const scene = new P.Scene();

const heart = new P.Heart(scene.center, 5);
console.log(scene.center)
console.log(heart.toJSON())
heart.draggable()
scene.add(heart);

// ...
scene.startLoop();

console.timeEnd(timer);