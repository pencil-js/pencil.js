const scene = new Pencil.Scene(wrapper);

const center = new Pencil.Position(scene.width / 2, scene.height / 2);
const size = 30;
const triangle = new Pencil.Triangle(center, size);

scene.add(triangle).render();
