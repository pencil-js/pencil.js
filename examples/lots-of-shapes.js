const scene = new Pencil.Scene(wrapper);

const rectangle = new Pencil.Rectangle(new Pencil.Position(20, 30), 50, 30);
scene.add(rectangle);

const star = new Pencil.Star(rectangle.position.add(25, 60), 20, 7, 0.5);
scene.add(star);

const triangle = new Pencil.Triangle(star.position.add(0, 50), 20);
scene.add(triangle);

const polygon = new Pencil.RegularPolygon(triangle.position.add(0, 40), 8, 20);
scene.add(polygon);

const arc = new Pencil.Arc(polygon.position.add(0, 50), 20, -0.125, 0.625);
scene.add(arc);

const circle = new Pencil.Circle(arc.position.add(0, 50), 20);
scene.add(circle);

const line = new Pencil.Line([
    new Pencil.Position(20, 340),
    new Pencil.Position(60, 380),
    new Pencil.Position(60, 340),
    new Pencil.Position(20, 380),
]);
scene.add(line);

const spline = new Pencil.Spline(line.points.map(p => p.add(0, 60)), 0.5);
scene.add(spline);

const text = new Pencil.Text(spline.position.add(0, 70), "Text");
scene.add(text);

image = new Pencil.Image(text.position.add(0, 40), "./megusta.png");
scene.add(image);

// And more ...

image.on("load", () => scene.render());
