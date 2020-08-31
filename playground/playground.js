import { Scene } from "../dist/pencil.esm.js";

// Don't forget to run "npm run build" before
const timer = "Playground ready";
console.time(timer);

const scene = new Scene();

// ...

scene
    .startLoop();

console.timeEnd(timer);
