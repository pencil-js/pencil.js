import test from "ava";

/* eslint-disable import/no-duplicates */
import Pencil from "./pencil";
import {
    BaseEvent, MouseEvent, KeyboardEvent, Math, Position, Vector, Line, Spline, EventEmitter, Container, Scene,
    Component, Polygon, RegularPolygon, Triangle, Star, Rectangle, Square, Image, Arc, Circle, Text, Slider, Path,
    Checkbox, Input, Button, from, OffScreenCanvas,
} from "./pencil";
/* eslint-enable */

test.todo("from");

test("namespace", (t) => {
    /* eslint-disable import/no-named-as-default-member */
    t.not(Pencil.BaseEvent, undefined);
    t.not(Pencil.MouseEvent, undefined);
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
    t.not(Pencil.Circle, undefined);
    t.not(Pencil.Text, undefined);
    t.not(Pencil.Slider, undefined);
    t.not(Pencil.Path, undefined);
    t.not(Pencil.Checkbox, undefined);
    t.not(Pencil.Input, undefined);
    t.not(Pencil.Button, undefined);
    t.not(Pencil.from, undefined);
    t.not(Pencil.OffScreenCanvas, undefined);
    /* eslint-enable */
});

test("named imports", (t) => {
    t.not(BaseEvent, undefined);
    t.not(MouseEvent, undefined);
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
    t.not(Circle, undefined);
    t.not(Text, undefined);
    t.not(Slider, undefined);
    t.not(Path, undefined);
    t.not(Checkbox, undefined);
    t.not(Input, undefined);
    t.not(Button, undefined);
    t.not(from, undefined);
    t.not(OffScreenCanvas, undefined);
});
