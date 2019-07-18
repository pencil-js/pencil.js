/* global Pencil */

// Don't forget to run "npm run build" before
const timer = "Playground ready";
console.time(timer);

const P = Pencil;

const scene = new P.Scene();

// ...

scene.startLoop();

console.timeEnd(timer);
