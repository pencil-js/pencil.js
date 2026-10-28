import { test, expect } from "vitest";
import Color from "./color.js";

test("Object constructor", () => {
    const origin = new Color(0.5, 0.4, 0.3, 0.2);
    const fromObject = new Color(origin);
    expect(fromObject.red).toBe(0.5);
    expect(fromObject.green).toBe(0.4);
    expect(fromObject.blue).toBe(0.3);
    expect(fromObject.alpha).toBe(0.2);
    expect(origin === fromObject).toBe(false);
});

test("Object constructor default", () => {
    const defaultColor = new Color();
    expect(defaultColor.red).toBe(0);
    expect(defaultColor.green).toBe(0);
    expect(defaultColor.blue).toBe(0);
    expect(defaultColor.alpha).toBe(1);
});

test("Object constructor all 0", () => {
    const defaultColorHex = new Color("#000000", 0);
    expect(defaultColorHex.red).toBe(0);
    expect(defaultColorHex.green).toBe(0);
    expect(defaultColorHex.blue).toBe(0);
    expect(defaultColorHex.alpha).toBe(0);
    const defaultColorRGB = new Color(0, 0, 0, 0);
    expect(defaultColorRGB.red).toBe(0);
    expect(defaultColorRGB.green).toBe(0);
    expect(defaultColorRGB.blue).toBe(0);
    expect(defaultColorRGB.alpha).toBe(0);
});

test("hex constructor", () => {
    const fromHex = new Color(0x3300ff + 0.9);
    expect(fromHex.red).toBe(0.2);
    expect(fromHex.green).toBe(0);
    expect(fromHex.blue).toBe(1);
    expect(fromHex.alpha).toBe(1);
});

test("hex string constructor", () => {
    const fromHex = new Color("#3300FF");
    expect(fromHex.red).toBe(0.2);
    expect(fromHex.green).toBe(0);
    expect(fromHex.blue).toBe(1);
    expect(fromHex.alpha).toBe(1);
});

test("hex short string constructor", () => {
    const fromHex = new Color("#30f");
    expect(fromHex.red).toBe(0.2);
    expect(fromHex.green).toBe(0);
    expect(fromHex.blue).toBe(1);
    expect(fromHex.alpha).toBe(1);
});

test("name string constructor", () => {
    const fromName = new Color("rebeccapurple", 0.5);
    expect(fromName.red).toBe(0.4);
    expect(fromName.green).toBe(0.2);
    expect(fromName.blue).toBe(0.6);
    expect(fromName.alpha).toBe(0.5);
});

test("rgba constructor", () => {
    const fromRGBA = new Color(-6, 2, 0.5, 0.1);
    expect(fromRGBA.red).toBe(0);
    expect(fromRGBA.green).toBe(1);
    expect(fromRGBA.blue).toBe(0.5);
    expect(fromRGBA.alpha).toBe(0.1);
});

test("get and set channels", () => {
    const color = new Color(0.1, 0.2, 0.3, 0.4);

    expect(color.red).toBe(0.1);
    expect(color.green).toBe(0.2);
    expect(color.blue).toBe(0.3);
    expect(color.alpha).toBe(0.4);

    color.red = 0.9;
    color.green = 0.8;
    color.blue = 0.7;
    color.alpha = 0.6;

    expect(color.red).toBe(0.9);
    expect(color.green).toBe(0.8);
    expect(color.blue).toBe(0.7);
    expect(color.alpha).toBe(0.6);
});

test("clone", () => {
    const origin = new Color(0.1, 0.2, 0.3, 0.4);
    const clone = origin.clone();
    expect(clone).not.toBe(origin);
    expect(clone).toEqual(origin);
});

test("get hex and rgb", () => {
    const color = new Color("#0066ff", 0.5);
    expect(color.hex).toBe("#0066ff80");
    expect(color.rgb).toBe("#0066ff80");
});

test("get name", () => {
    const color = new Color("#ff0000");
    expect(color.name).toBe("red");
    const colorApprox = new Color("#fe0000");
    expect(colorApprox.name).toBe("red");
});

test("grey", () => {
    const color = (new Color("blue")).grey();
    expect(color.red).toBe(color.blue);
    expect(color.red).toBe(color.green);
});

test("hue", () => {
    expect((new Color(1, 0, 0)).hue(0).rgb).toBe("#ff0000");
    expect((new Color(1, 0, 0)).hue(0.25).rgb).toBe("#80ff00");
    expect((new Color(1, 0, 0)).hue(0.5).rgb).toBe("#00ffff");
    expect((new Color(1, 0, 0)).hue(0.75).rgb).toBe("#8000ff");
    expect((new Color(1, 0, 0)).hue(1).rgb).toBe("#ff0000");
});

test("saturation", () => {
    expect((new Color(1, 0, 0.2)).saturation(1).rgb).toBe("#ff0033");
    expect((new Color(1, 0, 0.2)).saturation(0.5).rgb).toBe("#bf4059");
    expect((new Color(1, 0, 0.2)).saturation(0.25).rgb).toBe("#9f606c");
    expect((new Color(1, 0, 0.2)).saturation(0).rgb).toBe("#808080");
});

test("lightness", () => {
    expect((new Color(1, 0, 0)).lightness(0).rgb).toBe("#000000");
    expect((new Color(1, 0, 0)).lightness(1).rgb).toBe("#ffffff");
    expect((new Color(1, 0, 0)).lightness(0.5).rgb).toBe("#ff0000");
    expect((new Color(1, 0, 0)).lightness(0.75).rgb).toBe("#ff8080");
});

test("reverse", () => {
    expect((new Color("#ff0000")).reverse().rgb).toBe("#00ffff");
    expect((new Color("#3311aa")).reverse().rgb).toBe("#ccee55");
});

test("level", () => {
    expect((new Color("#f08806")).level(1).rgb).toBe("#808080");
    expect((new Color("#f08806")).level(4).rgb).toBe("#df9f20");
});

test("lerp", () => {
    expect((new Color(1, 0, 0.2)).lerp(new Color(0, 0.8, 1, 0.6), 0).rgb).toBe("#ff0033");
    expect((new Color(1, 0, 0.2)).lerp(new Color(0, 0.8, 1, 0.6), 1).rgb).toBe("#00ccff99");
});

test("toString", () => {
    const color = new Color(1, 0.5, 0);
    expect(`${color}`).toBe("#ff8000");
    const colorAlpha = new Color(1, 0.5, 0, 0.5);
    expect(`${colorAlpha}`).toBe("#ff800080");
});

test("toJSON", () => {
    const color = new Color(1, 0.1, 0, 0.5);
    expect(color.toJSON()).toEqual([1, 0.1, 0, 0.5]);
});

test("from", () => {
    const color = Color.from(1, 0.1, 0, 0.5);
    expect(color.red).toBe(1);
    expect(color.green).toBe(0.1);
    expect(color.blue).toBe(0);
    expect(color.alpha).toBe(0.5);

    const reference = Color.from(color);
    expect(reference === color).toBe(true);

    const other = Color.from(0xff0066);
    expect(other.red).toBe(1);
    expect(other.green).toBe(0);
    expect(other.blue).toBe(0.4);

    const fromStr = Color.from("fail");
    expect(fromStr.red).toBe(0);
    expect(fromStr.green).toBe(0);
    expect(fromStr.blue).toBe(0);
});
