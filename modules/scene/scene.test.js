import test from "ava";
import Scene from "./scene";
import Component from "../component";

test.beforeEach((t) => {
    t.context = new Scene();
    t.context.ctx.canvas.width = 800;
    t.context.ctx.canvas.height = 600;
});

test("constructor", (t) => {
    t.truthy(t.context.ctx);
    t.true(t.context.cursorPosition.constructor.name === "Position");
    t.true(t.context.containerPosition.constructor.name === "Position");
    t.true(t.context.isScene);
    t.false(t.context.isLooped);
    t.is(t.context.fps, 0);
    t.is(t.context.lastTick, null);
});

test("constructor with container", (t) => {
    const container = window.document.createElement("canvas");
    const scene = new Scene(container);
    t.is(scene.ctx.canvas, container);
});

test("setCursor", (t) => {
    t.context.setCursor("whatever");
    t.is(t.context.ctx.canvas.style.cursor, "whatever");
});

test("isHover", (t) => {
    t.true(t.context.isHover());
});

test("clear", (t) => {
    t.context.ctx.clearRect = () => t.pass();
    t.context.ctx.fillRect = () => t.pass();

    t.context.options.fill = "red";
    t.context.clear();

    t.plan(3);
    t.is(t.context.ctx.fillStyle, "red");
});

test("startLoop and stopLoop", (t) => {
    t.false(t.context.isLooped);
    t.context.startLoop();
    t.true(t.context.isLooped);
    t.context.render();
    t.true(t.context.fps > 0);
    t.context.stopLoop();
    t.false(t.context.isLooped);
    t.true(t.context.fps === 0);
});

test("startLoop render fail", (t) => {
    t.context.add(new Component());
    t.throws(() => t.context.startLoop());
    t.false(t.context.isLooped);
});

test("hide and show", (t) => {
    t.true(t.context.options.shown);
    t.context.hide();
    t.false(t.context.options.shown);
    t.context.show();
    t.true(t.context.options.shown);
});

test("get width and height", (t) => {
    t.is(t.context.width, 800);
    t.is(t.context.height, 600);
});

test("get size", (t) => {
    const { size } = t.context;
    t.is(size.x, 800);
    t.is(size.y, 600);
});

test("get center", (t) => {
    const { center } = t.context;
    t.is(center.x, 400);
    t.is(center.y, 300);
});

test("getRandomPosition", (t) => {
    for (let i = 0; i < 100; ++i) {
        const position = t.context.getRandomPosition();
        t.true(position.x > 0 && position.x < 800);
        t.true(position.y > 0 && position.y < 600);
    }
});

test("from", (t) => {
    const scene = Scene.from({
        options: {
            fill: "red",
        },
    });
    t.true(scene instanceof Scene);
    t.is(scene.options.fill, "red");
});

test("defaultOptions", (t) => {
    t.is(Scene.defaultOptions.fill, null);
    t.is(Scene.defaultOptions.opacity, 1);
    t.is(Scene.defaultOptions.cursor, "default");
});
