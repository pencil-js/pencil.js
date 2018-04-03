const scene = new Pencil.Scene(wrapper);

const size = 30;
const triangle = new Pencil.Triangle(scene.center, size);

scene.add(triangle).render();
