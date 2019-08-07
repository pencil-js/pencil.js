import test from "ava";
import Scene from ".";
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

test("from", (t) => {
    const scene = Scene.from({
        options: {
            fill: "red",
        },
    });
    t.true(scene instanceof Scene);
    t.is(scene.options.fill, "red");
});

test("buildCanvas", (t) => {
    const ctx = Scene.buildCanvas({
        scrollWidth: 10,
        scrollHeight: 20,
    });
    t.is(ctx.constructor.name, "CanvasRenderingContext2D");
    t.is(ctx.canvas.width, 10);
    t.is(ctx.canvas.height, 20);

    const nothing = Scene.buildCanvas(null);
    t.is(nothing, null);
});

test("defaultOptions", (t) => {
    t.is(Scene.defaultOptions.cursor, "default");
});
