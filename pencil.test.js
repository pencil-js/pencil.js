/* global test expect */

/* eslint-disable import/no-duplicates */
import Pencil from "./pencil";
import {
    BaseEvent, MouseEvent, KeyboardEvent, Math, Position, Vector, Line, Spline, EventEmitter, Container, Scene,
    Component, Polygon, RegularPolygon, Triangle, Star, Rectangle, Square, Image, Arc, Circle, Text, Slider, Path,
    Checkbox, Input, Button, from, OffScreenCanvas,
} from "./pencil";
/* eslint-enable */

test("Pencil namespace", () => {
    /* eslint-disable import/no-named-as-default-member */
    expect(Pencil.BaseEvent).toBeDefined();
    expect(Pencil.MouseEvent).toBeDefined();
    expect(Pencil.KeyboardEvent).toBeDefined();
    expect(Pencil.Math).toBeDefined();
    expect(Pencil.Position).toBeDefined();
    expect(Pencil.Vector).toBeDefined();
    expect(Pencil.Line).toBeDefined();
    expect(Pencil.Spline).toBeDefined();
    expect(Pencil.EventEmitter).toBeDefined();
    expect(Pencil.Container).toBeDefined();
    expect(Pencil.Scene).toBeDefined();
    expect(Pencil.Component).toBeDefined();
    expect(Pencil.Polygon).toBeDefined();
    expect(Pencil.RegularPolygon).toBeDefined();
    expect(Pencil.Triangle).toBeDefined();
    expect(Pencil.Star).toBeDefined();
    expect(Pencil.Rectangle).toBeDefined();
    expect(Pencil.Square).toBeDefined();
    expect(Pencil.Image).toBeDefined();
    expect(Pencil.Arc).toBeDefined();
    expect(Pencil.Circle).toBeDefined();
    expect(Pencil.Text).toBeDefined();
    expect(Pencil.Slider).toBeDefined();
    expect(Pencil.Path).toBeDefined();
    expect(Pencil.Checkbox).toBeDefined();
    expect(Pencil.Input).toBeDefined();
    expect(Pencil.Button).toBeDefined();
    expect(Pencil.from).toBeDefined();
    expect(Pencil.OffScreenCanvas).toBeDefined();
    /* eslint-enable */
});

test("Pencil named imports", () => {
    expect(BaseEvent).toBeDefined();
    expect(MouseEvent).toBeDefined();
    expect(KeyboardEvent).toBeDefined();
    expect(Math).toBeDefined();
    expect(Position).toBeDefined();
    expect(Vector).toBeDefined();
    expect(Line).toBeDefined();
    expect(Spline).toBeDefined();
    expect(EventEmitter).toBeDefined();
    expect(Container).toBeDefined();
    expect(Scene).toBeDefined();
    expect(Component).toBeDefined();
    expect(Polygon).toBeDefined();
    expect(RegularPolygon).toBeDefined();
    expect(Triangle).toBeDefined();
    expect(Star).toBeDefined();
    expect(Rectangle).toBeDefined();
    expect(Square).toBeDefined();
    expect(Image).toBeDefined();
    expect(Arc).toBeDefined();
    expect(Circle).toBeDefined();
    expect(Text).toBeDefined();
    expect(Slider).toBeDefined();
    expect(Path).toBeDefined();
    expect(Checkbox).toBeDefined();
    expect(Input).toBeDefined();
    expect(Button).toBeDefined();
    expect(from).toBeDefined();
    expect(OffScreenCanvas).toBeDefined();
});
