import test from "ava";
import Pattern from ".";
import OffScreenCanvas from "../offscreen-canvas";
import Image from "../image";

const img = new window.Image();
test.beforeEach((t) => {
    t.context = new Pattern(img, {
        repeat: "???",
        scale: 2,
        origin: [1, 2],
    });
});

test("constructor", (t) => {
    t.is(typeof t.context.options, "object");
    t.is(t.context.source, img);
});

test("get and set source", (t) => {
    const source = new window.Image();
    const blueprint = new Pattern(source);

    t.context.source = blueprint;
    t.is(t.context.source, blueprint.source);

    const canvas = new OffScreenCanvas(11, 22);
    t.context.source = canvas;
    t.is(t.context.source, canvas.ctx.canvas);

    const image = new Image([], "url");
    image.isLoaded = true;
    t.context.source = image;
    t.is(t.context.source, image.file);
});

test("get width and height", (t) => {
    img.width = 1;
    img.height = 2;
    t.is(t.context.width, 1);
    t.is(t.context.height, 2);
});

test("toString", (t) => {
    const pattern = {
        setTransform (matrix) {
            t.is(matrix.a, 2);
            t.is(matrix.d, 2);
        },
    };
    const ctx = {
        createPattern () {
            return pattern;
        },
    };
    t.is(t.context.toString(ctx), pattern);

    t.context.options.scale = [2, 2];
    t.is(t.context.toString(ctx), pattern);
});

test("defaultOptions", (t) => {
    const { repeat, scale, origin } = Pattern.defaultOptions;
    t.is(repeat, Pattern.repetition.repeat);
    t.is(scale, 1);
    t.is(origin.x, 0);
    t.is(origin.y, 0);
});
