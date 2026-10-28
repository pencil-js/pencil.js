import { test, expect, beforeEach, vi } from "vitest";


let context: any;
import Sprite from "./sprite.js";
import almostEqual from "../test/_almost-equal.js";

beforeEach(() => {
    context = new Sprite([1, 2], "url", [{
        sourceSize: {},
        spriteSourceSize: {},
        frame: {},
    }, {
        sourceSize: {},
        spriteSourceSize: {},
        frame: {},
    }]);
});

test("constructor", () => {
    expect(context.constructor.name).toBe("Sprite");
    expect(context.url).toBe("url");
    expect(context.frames.length).toBe(2);
    expect(context.frame).toBe(0);
    expect(context.isPaused).toBe(false);
});

test("makePath", async () => {
    const frame = (x: number) => ({
        sourceSize: { w: 10, h: 10 },
        spriteSourceSize: { x: 0, y: 0, w: 10, h: 10 },
        frame: { x, y: 0, w: 10, h: 10 },
    });
    const sprite = new Sprite([0, 0], "sheet-20x10.png", [frame(0), frame(10)], {
        loop: false,
        speed: 0.5,
    });
    await new Promise(resolve => sprite.once("ready", resolve));
    const events: Array<string> = [];
    sprite.on(Object.values(Sprite.events), event => events.push(event.name));
    const ctx = window.document.createElement("canvas").getContext("2d")!;
    const draw = vi.spyOn(ctx, "drawImage");

    sprite.makePath(ctx);
    expect(sprite.width).toBe(10);
    expect(sprite.frame).toBe(0.5);
    sprite.makePath(ctx);
    expect(sprite.frame).toBe(1);
    sprite.makePath(ctx);
    // Not looping, stay on the last frame
    expect(sprite.frame).toBe(1);
    expect(events).toEqual(["sprite-start", "sprite-frame", "sprite-end"]);
    expect(draw).toHaveBeenCalledTimes(3);
});

test("setFrame", () => {
    context.setFrame(0.5);
    expect(almostEqual(context.frame, 0.5)).toBe(true);

    context.setFrame(5.3);
    expect(almostEqual(context.frame, 1.3)).toBe(true);
});

test("toJSON", () => {
    const json = context.toJSON();

    expect(json.url).toBe("url");
    expect(json.frames.length).toBe(2);
    expect(json.frame).toBe(0);
    expect(json.isPaused).toBe(false);
});

test("from", () => {
    const sprite = Sprite.from({
        constructor: "Sprite",
        position: [10, 20],
        url: "url",
        frames: [{}],
        frame: 0.6,
        isPaused: true,
    });

    expect(sprite.url).toBe("url");
    expect(sprite.frames.length).toBe(1);
    expect(almostEqual(sprite.frame, 0.6)).toBe(true);
    expect(sprite.isPaused).toBe(true);
});

test("sheet", async () => {
    const json = {
        meta: {
            image: "sheet.png",
        },
        frames: {
            "res/a.png": "1",
            "images/b.png": "2",
            "res/sub/c.jpg": "3",
        },
    };
    const fetch = vi.spyOn(window, "fetch").mockResolvedValue({
        json: () => Promise.resolve(json),
    } as Response);

    const sheet = await Sprite.sheet("assets/sheet.json");
    expect(fetch).toHaveBeenCalledWith("assets/sheet.json");
    expect(typeof sheet.json === "object").toBe(true);
    // Image is relative to the json file
    expect(sheet.file?.getAttribute("src")).toMatch(/assets\/sheet\.png$/);

    expect(sheet.get()).toEqual(["1", "2", "3"]);
    expect(sheet.get("*.png")).toEqual(["1", "2"]);
    expect(sheet.get("res/*.png")).toEqual(["1"]);
    expect(sheet.get(key => key.startsWith("images"))).toEqual(["2"]);
    expect(sheet.get("images/b.png")).toEqual(["2"]);
    expect(sheet.get(/c/)).toEqual(["3"]);

    const sprite = sheet.extract();
    expect(sprite instanceof Sprite).toBe(true);
    fetch.mockRestore();
});

test("play / pause", () => {
    context.options.speed = 0.1;
    context.pause();

    expect(context.options.speed).toBe(0.1);
    expect(context.isPaused).toBe(true);

    context.play();
    expect(context.options.speed).toBe(0.1);
    expect(context.isPaused).toBe(false);

    context.play(2);
    expect(context.options.speed).toBe(2);
});

test("defaultOptions", () => {
    expect(Sprite.defaultOptions.speed).toBe(1);
    expect(Sprite.defaultOptions.loop).toBe(true);
});
