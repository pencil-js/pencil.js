/* global test expect */

import Pencil from "./pencil";
import {
    BaseEvent, MouseEvent, Position, Vector, Line, EventEmitter, Container, Scene,
    Component, Polygon, RegularPolygon, Star, Rectangle, Square, Circle, Text, Slider
} from "./pencil";

test("Pencil namespace", () => {
    expect(Pencil.BaseEvent).toBeDefined();
    expect(Pencil.MouseEvent).toBeDefined();
    expect(Pencil.Position).toBeDefined();
    expect(Pencil.Vector).toBeDefined();
    expect(Pencil.Line).toBeDefined();
    expect(Pencil.EventEmitter).toBeDefined();
    expect(Pencil.Container).toBeDefined();
    expect(Pencil.Scene).toBeDefined();
    expect(Pencil.Component).toBeDefined();
    expect(Pencil.Polygon).toBeDefined();
    expect(Pencil.RegularPolygon).toBeDefined();
    expect(Pencil.Star).toBeDefined();
    expect(Pencil.Rectangle).toBeDefined();
    expect(Pencil.Square).toBeDefined();
    expect(Pencil.Circle).toBeDefined();
    expect(Pencil.Text).toBeDefined();
    expect(Pencil.Slider).toBeDefined();
});

test("Named imports", () => {
    expect(BaseEvent).toBeDefined();
    expect(MouseEvent).toBeDefined();
    expect(Position).toBeDefined();
    expect(Vector).toBeDefined();
    expect(Line).toBeDefined();
    expect(EventEmitter).toBeDefined();
    expect(Container).toBeDefined();
    expect(Scene).toBeDefined();
    expect(Component).toBeDefined();
    expect(Polygon).toBeDefined();
    expect(RegularPolygon).toBeDefined();
    expect(Star).toBeDefined();
    expect(Rectangle).toBeDefined();
    expect(Square).toBeDefined();
    expect(Circle).toBeDefined();
    expect(Text).toBeDefined();
    expect(Slider).toBeDefined();
});
