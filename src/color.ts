import { colord, extend, type Colord, type RgbaColor } from "colord";
import namesPlugin from "colord/plugins/names";
import mixPlugin from "colord/plugins/mix";
import { constrain, degreeCircle, truncate } from "./math.js";

extend([namesPlugin, mixPlugin]);

/**
 * Any value that can be turned into a {@link Color}
 * (other Color instance, color name, hex string, hex number, red/green/blue/alpha values)
 */
export type ColorDefinition = Color | string | number | null | undefined;

/**
 * Color class
 */
export class Color {
    #value!: Colord;

    /** Hexadecimal notation, kept until the color changes (used at each render) */
    #hex: string | null = null;

    get #parsed (): Colord {
        return this.#value;
    }

    set #parsed (value: Colord) {
        this.#value = value;
        this.#hex = null;
    }

    /**
     * Color constructor
     * @param colorDefinition - Many types accepted (other Color instance, color name, hex string, hex number, red/green/blue/alpha value)
     * @example
     * new Color("indigo"); // Any valid CSS color name
     * new Color("#123456"); // Hex string definition
     * new Color("#123"); // Hex shorthand string definition, #123 <=> #112233
     * new Color("rgb(10, 20, 30)"); // Any valid CSS color string
     * new Color(0x123456); // Hex number definition
     * new Color(0.1, 0.2, 0.3); // Red, Green, Blue definition
     * // Every definition can have one more optional parameter for alpha (opacity)
     * new Color("violet", 0.5);
     */
    constructor (...colorDefinition: Array<ColorDefinition>) {
        this.set(...colorDefinition);
    }

    /**
     * Create a new copy of this color
     */
    clone (): Color {
        return new Color(this);
    }

    #setChannel (channel: keyof RgbaColor, value: number): void {
        this.#parsed = colord({
            ...this.#parsed.rgba,
            [channel]: channel === "a" ? constrain(value, 0, 1) : constrain(value * 255, 0, 255),
        });
    }

    /**
     * Red channel value (from 0 to 1)
     */
    get red (): number {
        return this.#parsed.rgba.r / 255;
    }

    set red (value: number) {
        this.#setChannel("r", value);
    }

    /**
     * Green channel value (from 0 to 1)
     */
    get green (): number {
        return this.#parsed.rgba.g / 255;
    }

    set green (value: number) {
        this.#setChannel("g", value);
    }

    /**
     * Blue channel value (from 0 to 1)
     */
    get blue (): number {
        return this.#parsed.rgba.b / 255;
    }

    set blue (value: number) {
        this.#setChannel("b", value);
    }

    /**
     * Transparency channel value (from 0 to 1)
     */
    get alpha (): number {
        return this.#parsed.rgba.a;
    }

    set alpha (value: number) {
        this.#setChannel("a", value);
    }

    /**
     * Return an array with red, green and blue value
     * @example [0.1, 0.2, 0.3]
     */
    get array (): [number, number, number] {
        return [this.red, this.green, this.blue];
    }

    /**
     * Return hexadecimal notation (with alpha when not opaque)
     * @example "#123456"
     */
    get hex (): string {
        this.#hex ??= this.#value.toHex();
        return this.#hex;
    }

    /**
     * Return hexadecimal notation (alias of hex)
     * @example "#123456"
     */
    get rgb (): string {
        return this.hex;
    }

    /**
     * Return the closest CSS color name
     * @example "aliceblue"
     */
    get name (): string {
        return this.#parsed.toName({
            closest: true,
        }) ?? "";
    }

    /**
     * Change this values
     * @param colorDefinition - Any supported color definition (see constructor)
     * @returns Itself
     */
    set (...colorDefinition: Array<ColorDefinition>): this {
        const [first] = colorDefinition;
        let input: string | RgbaColor;
        let alpha: number;
        if (first instanceof Color) {
            input = first.#parsed.rgba;
            alpha = (colorDefinition[1] as number | undefined) ?? input.a;
        }
        else if (typeof first === "string") {
            input = first;
            alpha = (colorDefinition[1] as number | undefined) ?? colord(first).alpha();
        }
        else if (first == null) {
            input = "#000";
            alpha = 1;
        }
        else if (colorDefinition.length < 3) {
            input = `#${truncate(first).toString(16).padStart(6, "0")}`;
            alpha = (colorDefinition[1] as number | undefined) ?? 1;
        }
        else {
            const [r, g, b] = (colorDefinition.slice(0, 3) as Array<number>).map(value => value * 255);
            alpha = (colorDefinition[3] as number | undefined) ?? 1;
            input = {
                r,
                g,
                b,
                a: 1,
            };
        }
        this.#parsed = colord(input).alpha(alpha);
        return this;
    }

    /**
     * Change to its greyscale value
     * @returns Itself
     */
    grey (): this {
        this.#parsed = this.#parsed.grayscale();
        return this;
    }

    /**
     * Change to its greyscale value (alias of grey)
     * @returns Itself
     */
    gray (): this {
        return this.grey();
    }

    /**
     * Change hue value (0 = red, 0.5 = cyan, 1 = red, 1.5 = cyan ...)
     * @param value - Any value between 0 and 1
     * @returns Itself
     */
    hue (value: number): this {
        this.#parsed = this.#parsed.hue(value * degreeCircle);
        return this;
    }

    /**
     * Change saturation value (0 = grey, 1 = pure color)
     * @param value - Any value between 0 and 1
     * @returns Itself
     */
    saturation (value: number): this {
        this.#parsed = colord({
            ...this.#parsed.toHsl(),
            s: constrain(value, 0, 1) * 100,
        });
        return this;
    }

    /**
     * Change lightness value (0 = black, 0.5 = pure color, 1 = white)
     * @param value - Any value between 0 and 1
     * @returns Itself
     */
    lightness (value: number): this {
        this.#parsed = colord({
            ...this.#parsed.toHsl(),
            l: constrain(value, 0, 1) * 100,
        });
        return this;
    }

    /**
     * Invert the color value
     * @returns Itself
     */
    reverse (): this {
        this.#parsed = this.#parsed.invert();
        return this;
    }

    /**
     * Restrict the color space to an amount of possible value
     * @param number - Number of allowed value
     * @returns Itself
     */
    level (number: number): this {
        const { r, g, b, a } = this.#parsed.rgba;
        const step = 255 / number;
        const round = (value: number) => Math.min((truncate(value / step) * step) + (step / 2), 255);
        this.#parsed = colord({
            r: round(r),
            g: round(g),
            b: round(b),
            a,
        });
        return this;
    }

    /**
     * Change the color toward another color
     * @param colorDefinition - Any other color
     * @param ratio - Ratio of distance to move (0 = no change, 0.5 = equal mix, 1 = same as target color)
     * @returns Itself
     */
    lerp (colorDefinition: ColorDefinition, ratio: number): this {
        const color = Color.from(colorDefinition);
        this.#parsed = this.#parsed.mix(color.#parsed, ratio);
        return this;
    }

    /**
     * Change the color toward another color (alias of lerp)
     * @param colorDefinition - Any other color
     * @param ratio - Ratio of distance to move (0 = no change, 0.5 = equal mix, 1 = same as target color)
     * @returns Itself
     */
    mix (colorDefinition: ColorDefinition, ratio: number): this {
        return this.lerp(colorDefinition, ratio);
    }

    /**
     * Return a CSS compatible color string
     */
    toString (): string {
        return this.hex;
    }

    /**
     * Return a json ready array [red, green, blue, alpha]
     */
    toJSON (): [number, number, number, number] {
        return [...this.array, this.alpha];
    }

    /**
     * Return an instance from a generic definition
     * @param colorDefinition - Any valid color definition (see constructor)
     */
    static from (...colorDefinition: Array<ColorDefinition> | [[number, number, number, number?]]): Color {
        const [param] = colorDefinition;
        if (param instanceof Color) {
            return param;
        }
        if (Array.isArray(param)) {
            return new Color(...param);
        }
        return new Color(...colorDefinition as Array<ColorDefinition>);
    }
}

export default Color;
