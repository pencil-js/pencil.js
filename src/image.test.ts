import { test, expect, beforeEach, vi } from "vitest";
import Image from "./image.js";
import NetworkEvent from "./network-event.js";

let context: Image;

const getContext = () => window.document.createElement("canvas").getContext("2d")!;
const waitReady = (image: Image) => new Promise<void>((resolve, reject) => {
    image.once(NetworkEvent.events.ready, () => resolve());
    image.once(NetworkEvent.events.error, () => reject(new Error("Load failed")));
});

beforeEach(() => {
    context = new Image([10, 20], "url");
    // Silent the expected loading error
    context.on(NetworkEvent.events.error, () => {});
});

test("constructor", () => {
    expect(context.file).toBe(null);
    expect(context.isLoaded).toBe(false);
});

test("get and set url", async () => {
    expect(context.url).toBe("url");

    context.url = null;
    expect(context.isLoaded).toBe(false);
    context.url = "loadable-10x20.png";
    await waitReady(context);

    expect(context.isLoaded).toBe(true);
    expect(context.width).toBe(10);
    expect(context.height).toBe(20);
    expect(context.url).toBe("loadable-10x20.png");
});

test("set same url", () => {
    const spy = vi.spyOn(Image, "load");
    context.url = "url";
    expect(spy).not.toHaveBeenCalled();
    spy.mockRestore();
});

test("fail url load", async () => {
    context.url = "fail";
    await new Promise<void>((resolve, reject) => {
        context
            .on("ready", () => reject(new Error("Should fail")))
            .on("error", (event) => {
                expect(event.target).toBe(context);
                resolve();
            });
    });
});

test("ignore outdated load", async () => {
    context.url = "first-10x10.png";
    context.url = "second-30x40.png";
    await waitReady(context);
    expect(context.url).toBe("second-30x40.png");
    expect(context.width).toBe(30);
});

test("set url as a image file", async () => {
    const file = window.document.createElement("img");
    file.src = "whoa.png";

    context.url = file;
    await waitReady(context);

    expect(context.url).toBe("whoa.png");
    expect(context.file).toBe(file);
});

test("set url as another Image", async () => {
    const blueprint = new Image(undefined, "blueprint-5x6.png");
    context.url = blueprint;
    await waitReady(context);

    expect(context.url).toBe(blueprint.url);
    expect(context.file).toBe(blueprint.file);
    expect(context.width).toBe(5);

    const other = new Image(undefined, blueprint);
    expect(other.isLoaded).toBe(true);
});

test("makePath", async () => {
    context.url = "image.png";
    await waitReady(context);
    context.options.fill = "red";
    context.options.stroke = "blue";
    const ctx = getContext();
    const spies = ["save", "restore", "translate", "drawImage", "fill", "stroke"]
        .map(name => vi.spyOn(ctx, name as keyof CanvasRenderingContext2D));
    context.makePath(ctx);
    spies.forEach(spy => expect(spy).toHaveBeenCalled());
});

test("makePath not loaded", () => {
    const ctx = getContext();
    const spy = vi.spyOn(ctx, "drawImage");
    context.makePath(ctx);
    expect(spy).not.toHaveBeenCalled();
});

test("isHover", async () => {
    // Not loaded
    expect(context.isHover([0, 0], getContext())).toBe(false);

    context.url = "image-10x10.png";
    await waitReady(context);
    expect(context.isHover([5, 5], getContext())).toBe(true);
    expect(context.isHover([15, 5], getContext())).toBe(false);
    // Fill option is restored
    expect(context.options.fill).toBe(null);
});

test("tint option", async () => {
    context.url = "image-4x4.png";
    await waitReady(context);
    context.options.tint = "#00ff00";

    const ctx = getContext();
    const spy = vi.spyOn(ctx, "drawImage");
    context.draw(ctx);
    const [canvas, x, y] = spy.mock.calls[0];
    // Drawn from a cached canvas
    expect(typeof (canvas as HTMLCanvasElement).getContext).toBe("function");
    expect(x).toBe(0);
    expect(y).toBe(0);

    const { data } = (canvas as HTMLCanvasElement).getContext("2d")!.getImageData(0, 0, 1, 1);
    expect([...data]).toEqual([0, 255, 0, 255]);
});

test("toJSON", () => {
    const json = context.toJSON();

    expect(json.url).toBe("url");
    expect(json.width).toBe(undefined);
});

test("from", () => {
    const image = Image.from({
        constructor: "Image",
        position: [1, 2],
        url: "url",
    });

    image.on("error", () => {});
    expect(image.url).toBe("url");
});

test("load", async () => {
    const promise = Image.load([
        "url.png",
    ]);
    expect(promise instanceof Promise).toBe(true);
    const [img] = await promise;
    expect(img).toBeInstanceOf(window.HTMLImageElement);

    await expect(Image.load("error.png")).rejects.toThrow(URIError);
});

test("defaultOptions", () => {
    expect(Image.defaultOptions.fill).toBe(null);
});
