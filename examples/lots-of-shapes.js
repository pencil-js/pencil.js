const scene = new Pencil.Scene(wrapper);

const rectangle = new Pencil.Rectangle(new Pencil.Position(20, 60), 50, 30);
scene.add(rectangle);

const star = new Pencil.Star(rectangle.position.clone().add(25, 90), 20, 7, 0.5);
scene.add(star);

const triangle = new Pencil.Triangle(star.position.clone().add(0, 75), 20);
scene.add(triangle);

const polygon = new Pencil.RegularPolygon(triangle.position.clone().add(0, 75), 8, 20);
scene.add(polygon);

const arc = new Pencil.Arc(polygon.position.clone().add(0, 75), 50, 40, -0.125, 0.625);
scene.add(arc);

const circle = new Pencil.Circle(arc.position.clone().add(0, 75), 20);
scene.add(circle);

const line = new Pencil.Line(circle.position.clone().add(-25, 75), [
    new Pencil.Position(40, 40),
    new Pencil.Position(40, 0),
    new Pencil.Position(0, 40),
]);
scene.add(line);

const spline = new Pencil.Spline(line.position.clone().add(0, 130), line.points, 0.5);
scene.add(spline);

const text = new Pencil.Text(spline.position.clone().add(0, 75), "Text");
scene.add(text);

image = new Pencil.Image(text.position.clone().add(0, 60), "./res/megusta.png");
scene.add(image);

// And more ...

image.on("load", () => scene.render());
