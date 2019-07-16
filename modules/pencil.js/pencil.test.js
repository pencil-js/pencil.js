import test from "ava";

/* eslint-disable import/no-duplicates, import/no-named-as-default-member */
import Pencil from ".";
import {
    BaseEvent, MouseEvent, NetworkEvent, KeyboardEvent, Math, Position, Vector, Line, Spline, EventEmitter, Container,
    Scene, Component, Polygon, RegularPolygon, Triangle, Star, Rectangle, Square, Image, Arc, Ellipse, Circle, Text,
    Path, Input, Checkbox, Slider, ProgressBar, ProgressPie, Button, Select, from, OffScreenCanvas,
    version, author, homepage, Color, LinearGradient, RadialGradient,
} from ".";

test("from", (t) => {
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
    t.true(newInstance instanceof Pencil.Circle);
    t.is(newInstance.position.x, 10);
    t.is(newInstance.position.y, 20);
    t.is(newInstance.radius, definition.radius);
    t.is(newInstance.children.length, 1);
    t.true(newInstance.children[0] instanceof Pencil.Triangle);
});

test("namespace", (t) => {
    /* eslint-disable import/no-named-as-default-member */
    t.not(Pencil.BaseEvent, undefined);
    t.not(Pencil.MouseEvent, undefined);
    t.not(Pencil.NetworkEvent, undefined);
    t.not(Pencil.KeyboardEvent, undefined);
    t.not(Pencil.Math, undefined);
    t.not(Pencil.Position, undefined);
    t.not(Pencil.Vector, undefined);
    t.not(Pencil.Line, undefined);
    t.not(Pencil.Spline, undefined);
    t.not(Pencil.EventEmitter, undefined);
    t.not(Pencil.Container, undefined);
    t.not(Pencil.Scene, undefined);
    t.not(Pencil.Component, undefined);
    t.not(Pencil.Polygon, undefined);
    t.not(Pencil.RegularPolygon, undefined);
    t.not(Pencil.Triangle, undefined);
    t.not(Pencil.Star, undefined);
    t.not(Pencil.Rectangle, undefined);
    t.not(Pencil.Square, undefined);
    t.not(Pencil.Image, undefined);
    t.not(Pencil.Arc, undefined);
    t.not(Pencil.Ellipse, undefined);
    t.not(Pencil.Circle, undefined);
    t.not(Pencil.Text, undefined);
    t.not(Pencil.Slider, undefined);
    t.not(Pencil.ProgressBar, undefined);
    t.not(Pencil.ProgressPie, undefined);
    t.not(Pencil.Path, undefined);
    t.not(Pencil.Checkbox, undefined);
    t.not(Pencil.Input, undefined);
    t.not(Pencil.Button, undefined);
    t.not(Pencil.Select, undefined);
    t.not(Pencil.from, undefined);
    t.not(Pencil.OffScreenCanvas, undefined);
    t.not(Pencil.version, undefined);
    t.not(Pencil.author, undefined);
    t.not(Pencil.homepage, undefined);
    t.not(Pencil.Color, undefined);
    t.not(Pencil.LinearGradient, undefined);
    t.not(Pencil.RadialGradient, undefined);
    /* eslint-enable */
});

test("named imports", (t) => {
    t.not(BaseEvent, undefined);
    t.not(MouseEvent, undefined);
    t.not(NetworkEvent, undefined);
    t.not(KeyboardEvent, undefined);
    t.not(Math, undefined);
    t.not(Position, undefined);
    t.not(Vector, undefined);
    t.not(Line, undefined);
    t.not(Spline, undefined);
    t.not(EventEmitter, undefined);
    t.not(Container, undefined);
    t.not(Scene, undefined);
    t.not(Component, undefined);
    t.not(Polygon, undefined);
    t.not(RegularPolygon, undefined);
    t.not(Triangle, undefined);
    t.not(Star, undefined);
    t.not(Rectangle, undefined);
    t.not(Square, undefined);
    t.not(Image, undefined);
    t.not(Arc, undefined);
    t.not(Ellipse, undefined);
    t.not(Circle, undefined);
    t.not(Text, undefined);
    t.not(Slider, undefined);
    t.not(ProgressBar, undefined);
    t.not(ProgressPie, undefined);
    t.not(Path, undefined);
    t.not(Checkbox, undefined);
    t.not(Input, undefined);
    t.not(Button, undefined);
    t.not(Select, undefined);
    t.not(from, undefined);
    t.not(OffScreenCanvas, undefined);
    t.not(version, undefined);
    t.not(author, undefined);
    t.not(homepage, undefined);
    t.not(Color, undefined);
    t.not(LinearGradient, undefined);
    t.not(RadialGradient, undefined);
});
