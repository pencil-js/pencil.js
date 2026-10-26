import { test, expect } from "vitest";

import Pencil from "./index.js";
import {
    BaseEvent,
    MouseEvent,
    NetworkEvent,
    KeyboardEvent,
    Math,
    Navigation,
    Position,
    Vector,
    Line,
    Spline,
    EventEmitter,
    Container,
    Scene,
    Component,
    Polygon,
    RegularPolygon,
    Triangle,
    Star,
    Rectangle,
    Square,
    Image,
    Sprite,
    Arc,
    Pie,
    Ellipse,
    Circle,
    Text,
    Path,
    Input,
    Checkbox,
    Slider,
    Knob,
    ProgressBar,
    ProgressPie,
    Button,
    Select,
    from,
    version,
    author,
    homepage,
    OffScreenCanvas,
    Color,
    LinearGradient,
    RadialGradient,
    use,
} from "./index.js";

test("use", () => {
    expect.assertions(4);

    use({
        name: "test",
        install: P => expect(P).toBe(Pencil),
    });
    Pencil.use({
        name: "test2",
        install: P => expect(P).toBe(Pencil),
    });

    expect(() => use({})).toThrow();
    expect(() => use({
        name: "test",
    })).toThrow();
});

test("from", () => {
    const definition = {
        constructor: "Circle",
        position: [10, 20],
        radius: 50,
        children: [
            {
                constructor: "Triangle",
                radius: 5,
            },
        ],
    };
    const newInstance = Pencil.from(definition);
    expect(newInstance instanceof Pencil.Circle).toBe(true);
    expect(newInstance.position.x).toBe(10);
    expect(newInstance.position.y).toBe(20);
    expect(newInstance.radius).toBe(definition.radius);
    expect(newInstance.children.length).toBe(1);
    expect(newInstance.children[0] instanceof Pencil.Triangle).toBe(true);
});

test("namespace", () => {
    expect(Pencil.BaseEvent).not.toBe(undefined);
    expect(Pencil.MouseEvent).not.toBe(undefined);
    expect(Pencil.NetworkEvent).not.toBe(undefined);
    expect(Pencil.KeyboardEvent).not.toBe(undefined);
    expect(Pencil.Math).not.toBe(undefined);
    expect(Pencil.Navigation).not.toBe(undefined);
    expect(Pencil.Position).not.toBe(undefined);
    expect(Pencil.Vector).not.toBe(undefined);
    expect(Pencil.Line).not.toBe(undefined);
    expect(Pencil.Spline).not.toBe(undefined);
    expect(Pencil.EventEmitter).not.toBe(undefined);
    expect(Pencil.Container).not.toBe(undefined);
    expect(Pencil.Scene).not.toBe(undefined);
    expect(Pencil.Component).not.toBe(undefined);
    expect(Pencil.Polygon).not.toBe(undefined);
    expect(Pencil.RegularPolygon).not.toBe(undefined);
    expect(Pencil.Triangle).not.toBe(undefined);
    expect(Pencil.Star).not.toBe(undefined);
    expect(Pencil.Rectangle).not.toBe(undefined);
    expect(Pencil.Square).not.toBe(undefined);
    expect(Pencil.Image).not.toBe(undefined);
    expect(Pencil.Sprite).not.toBe(undefined);
    expect(Pencil.Arc).not.toBe(undefined);
    expect(Pencil.Pie).not.toBe(undefined);
    expect(Pencil.Ellipse).not.toBe(undefined);
    expect(Pencil.Circle).not.toBe(undefined);
    expect(Pencil.Text).not.toBe(undefined);
    expect(Pencil.Slider).not.toBe(undefined);
    expect(Pencil.ProgressBar).not.toBe(undefined);
    expect(Pencil.ProgressPie).not.toBe(undefined);
    expect(Pencil.Path).not.toBe(undefined);
    expect(Pencil.Checkbox).not.toBe(undefined);
    expect(Pencil.Input).not.toBe(undefined);
    expect(Pencil.Button).not.toBe(undefined);
    expect(Pencil.Select).not.toBe(undefined);
    expect(Pencil.Knob).not.toBe(undefined);
    expect(Pencil.from).not.toBe(undefined);
    expect(Pencil.OffScreenCanvas).not.toBe(undefined);
    expect(Pencil.version).not.toBe(undefined);
    expect(Pencil.author).not.toBe(undefined);
    expect(Pencil.homepage).not.toBe(undefined);
    expect(Pencil.Color).not.toBe(undefined);
    expect(Pencil.LinearGradient).not.toBe(undefined);
    expect(Pencil.RadialGradient).not.toBe(undefined);

});

test("named imports", () => {
    expect(BaseEvent).not.toBe(undefined);
    expect(MouseEvent).not.toBe(undefined);
    expect(NetworkEvent).not.toBe(undefined);
    expect(KeyboardEvent).not.toBe(undefined);
    expect(Math).not.toBe(undefined);
    expect(Navigation).not.toBe(undefined);
    expect(Position).not.toBe(undefined);
    expect(Vector).not.toBe(undefined);
    expect(Line).not.toBe(undefined);
    expect(Spline).not.toBe(undefined);
    expect(EventEmitter).not.toBe(undefined);
    expect(Container).not.toBe(undefined);
    expect(Scene).not.toBe(undefined);
    expect(Component).not.toBe(undefined);
    expect(Polygon).not.toBe(undefined);
    expect(RegularPolygon).not.toBe(undefined);
    expect(Triangle).not.toBe(undefined);
    expect(Star).not.toBe(undefined);
    expect(Rectangle).not.toBe(undefined);
    expect(Square).not.toBe(undefined);
    expect(Image).not.toBe(undefined);
    expect(Sprite).not.toBe(undefined);
    expect(Arc).not.toBe(undefined);
    expect(Pie).not.toBe(undefined);
    expect(Ellipse).not.toBe(undefined);
    expect(Circle).not.toBe(undefined);
    expect(Text).not.toBe(undefined);
    expect(Slider).not.toBe(undefined);
    expect(ProgressBar).not.toBe(undefined);
    expect(ProgressPie).not.toBe(undefined);
    expect(Path).not.toBe(undefined);
    expect(Checkbox).not.toBe(undefined);
    expect(Input).not.toBe(undefined);
    expect(Button).not.toBe(undefined);
    expect(Select).not.toBe(undefined);
    expect(Knob).not.toBe(undefined);
    expect(from).not.toBe(undefined);
    expect(OffScreenCanvas).not.toBe(undefined);
    expect(version).not.toBe(undefined);
    expect(author).not.toBe(undefined);
    expect(homepage).not.toBe(undefined);
    expect(Color).not.toBe(undefined);
    expect(LinearGradient).not.toBe(undefined);
    expect(RadialGradient).not.toBe(undefined);
});
