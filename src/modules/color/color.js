import { colord, extend } from "colord";
import namesPlugin from "colord/plugins/names";
import mixPlugin from "colord/plugins/mix";
import { truncate, constrain } from "@pencil.js/math";

extend([namesPlugin, mixPlugin]);

/**
 * @module Color
 */

const parsedKey = Symbol("_parsed");

/**
 * Color class
 * @class
 */
export default class Color {
    /**
     * @typedef {Color|String|Number|Array<Number>} ColorDefinition
     */
    /**
     * Color constructor
     * @param {ColorDefinition} colorDefinition - Many types accepted (other Color instance, color name, hex string, hex number, red/green/blue/alpha value)
     * @example
     * new Color("indigo"); // Any valid CSS color name
     * new Color("#123456"); // Hex string definition
     * new Color("#123"); // Hex shorthand string definition, #123 <=> #112233
     * new Color(0x123456); // Hex number definition
     * new Color(0.1, 0.2, 0.3); // Red, Green, Blue definition
     * Every definition can have one more optional parameter for alpha (opacity)
     * new Color("violet", 0.5);
     */
    constructor (...colorDefinition) {
        /**
         * @type {colord}
         */
        this[parsedKey] = null;
        this.set(...colorDefinition);
    }

    /**
     * Create a new copy of this color
     * @return {Color}
     */
    clone () {
        return new Color(this);
    }

    /**
     * Get the red channel value
     * @return {Number}
     */
    get red () {
        return this[parsedKey].rgba.r / 255;
    }

    /**
     * Set the red channel
     * @param {Number} value - New value
     */
    set red (value) {
        this[parsedKey].rgba.r = constrain(value * 255, 0, 255);
    }

    /**
     * Get the green channel value
     * @return {Number}
     */
    get green () {
        return this[parsedKey].rgba.g / 255;
    }

    /**
     * Set the green channel
     * @param {Number} value - New value
     */
    set green (value) {
        this[parsedKey].rgba.g = constrain(value * 255, 0, 255);
    }

    /**
     * Get the blue channel value
     * @return {Number}
     */
    get blue () {
        return this[parsedKey].rgba.b / 255;
    }

    /**
     * Set the blue channel
     * @param {Number} value - New value
     */
    set blue (value) {
        this[parsedKey].rgba.b = constrain(value * 255, 0, 255);
    }

    /**
     * Get the transparency channel value
     * @return {Number}
     */
    get alpha () {
        return this[parsedKey].rgba.a;
    }

    /**
     * Set the transparency channel
     * @param {Number} value - New value
     */
    set alpha (value) {
        this[parsedKey].rgba.a = constrain(value, 0, 1);
    }

    /**
     * Return an array with red, green and blue value
     * @example [0.1, 0.2, 0.3]
     * @return {Array<Number>}
     */
    get array () {
        return [
            this.red,
            this.green,
            this.blue,
        ];
    }

    /**
     * Return hexadecimal rgb notation
     * @example "#123456"
     * @return {String}
     */
    get hex () {
        return this[parsedKey].toHex();
    }

    /**
     * Return hexadecimal rgb notation
     * @example "#123456"
     * @return {String}
     * @alias hex
     */
    get rgb () {
        return this.hex;
    }

    /**
     * Return the closest CSS color name
     * @example "aliceblue"
     * @return {String}
     */
    get name () {
        return this[parsedKey].toName();
    }

    // TODO: do we need more getters ? User only need to interact with Color, not read values.

    /**
     * Change this values
     * @param {ColorDefinition} colorDefinition - Any supported color definition (see constructor)
     * @return {Color} Itself
     */
    set (...colorDefinition) {
        const [first] = colorDefinition;
        let input;
        let alpha;
        if (first instanceof Color) {
            input = first[parsedKey].rgba;
            [, alpha = input.a] = colorDefinition;
        }
        else if (typeof first === "string") {
            input = first;
            [, alpha = 1] = colorDefinition;
        }
        else if (first === undefined || first === null) {
            input = "#000";
            alpha = 1;
        }
        else if (colorDefinition.length < 3) {
            input = `#${truncate(colorDefinition[0]).toString(16)}`;
            [, alpha = 1] = colorDefinition;
        }
        else {
            const [r, g, b] = colorDefinition.slice(0, 3).map(value => value * 255);
            [,,, alpha = 1] = colorDefinition;
            input = {
                r,
                g,
                b,
            };
        }
        // console.log(colorDefinition);
        // console.log(input, alpha);
        this[parsedKey] = colord(input).alpha(alpha);
        return this;
    }

    /**
     * Change to its greyscale value
     * @return {Color} Itself
     */
    grey () {
        this[parsedKey] = this[parsedKey].grayscale();
        return this;
    }

    /**
     * Change hue value (0 = red, 0.5 = blue, 1 = red, 1.5 = blue ...)
     * @param {Number} value - Any value between 0 and 1
     * @return {Color} Itself
     */
    hue (value) {
        const hsl = this[parsedKey].toHsl();
        hsl.h = value * 360;
        this[parsedKey] = colord(hsl);
        return this;
    }

    /**
     * Change saturation value (0 = grey, 1 = pure color)
     * @param {Number} value - Any value between 0 and 1
     * @return {Color} Itself
     */
    saturation (value) {
        const hsl = this[parsedKey].toHsl();
        hsl.s = value * 100;
        this[parsedKey] = colord(hsl);
        return this;
    }

    /**
     * Change lightness value (0 = black, 0.5 = pure color, 1 = white)
     * @param {Number} value - Any value between 0 and 1
     * @return {Color} Itself
     */
    lightness (value) {
        const hsl = this[parsedKey].toHsl();
        hsl.l = value * 100;
        this[parsedKey] = colord(hsl);
        return this;
    }

    /**
     * Invert the color value
     * @return {Color} Itself
     */
    reverse () {
        this[parsedKey] = this[parsedKey].invert();
        return this;
    }

    /**
     * Restrict the color space to an amount of possible value
     * @param {Number} number - Number of allowed value
     * @return {Color} Itself
     */
    level (number) {
        const { r, g, b } = this[parsedKey].rgba;
        const p = 255 / number;
        this[parsedKey].rgba.r = truncate(r / p) * p + (p / 2);
        this[parsedKey].rgba.g = truncate(g / p) * p + (p / 2);
        this[parsedKey].rgba.b = truncate(b / p) * p + (p / 2);
        return this;
    }

    /**
     * Change the color toward another color
     * @param {ColorDefinition} colorDefinition - Any other color
     * @param {Number} ratio - Ratio of distance to move (0 = no change, 0.5 = equal mix, 1 = same as target color)
     * @return {Color} Itself
     */
    lerp (colorDefinition, ratio) {
        const color = Color.from(colorDefinition);
        this[parsedKey] = this[parsedKey].mix(color[parsedKey], ratio);
        return this;
    }

    /**
     * @return {String}
     */
    toString () {
        return this.hex;
    }

    /**
     * Return a json ready array
     * @return {Array<Number>}
     */
    toJSON () {
        return [
            ...this.array,
            this.alpha,
        ];
    }

    /**
     * Return an instance from a generic definition
     * @param {ColorDefinition} colorDefinition - Any valid color definition (see constructor)
     * @return {Color}
     */
    static from (...colorDefinition) {
        const param = colorDefinition[0];
        if (param instanceof Color) {
            return param;
        }
        return new Color(...colorDefinition);
    }
}

Color.prototype.gray = Color.prototype.grey;
Color.prototype.mix = Color.prototype.lerp;
