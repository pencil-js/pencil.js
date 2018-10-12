import convert from "color-convert";
import { constrain, truncate, average } from "@pencil.js/math";

/**
 *
 * @param {Number} hex -
 * @param {Number} n -
 * @return {Number}
 */
function hexToRatio (hex, n) {
    // eslint-disable-next-line no-bitwise
    return ((hex >> (8 * n)) & 0xff) / 0xff;
}

/**
 *
 * @param {Number} ratio -
 * @return {Number}
 */
function ratioToNum (ratio) {
    return truncate((ratio * 0xff) + 0.5);
}

/**
 *
 * @param {Number} ratio -
 * @return {String}
 */
function ratioToHex (ratio) {
    return ratioToNum(ratio).toString(16).padStart(2, "0");
}

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
     * new Color("indigo"); // All CSS color names
     * new Color("#123456"); // Hex string definition
     * new Color(0x123456); // Hex number definition
     * new Color(0.1, 0.2, 0.3, 0.5); // Red, Green, Blue and Alpha definition
     */
    constructor (...colorDefinition) {
        this.red = 0;
        this.green = 0;
        this.blue = 0;
        this.alpha = 1;

        this.set(...colorDefinition);
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
    get rgb () {
        return `#${this.array.map(channel => ratioToHex(channel)).join("")}`;
    }

    /**
     * Return rgba notation
     * @example "rgba(10,20,30,0.5)"
     * @return {String}
     */
    get rgba () {
        return `rgba(${this.array.map(channel => ratioToNum(channel)).concat(this.alpha).join(",")})`;
    }

    /**
     * Return the closest CSS color name
     * @example "aliceblue"
     * @return {String}
     */
    get name () {
        return convert.rgb.keyword(this.array.map(channel => ratioToNum(channel)));
    }

    // TODO: do we need more output ? User only need to interact with Color, not read values.

    /**
     * Change this values
     * @param {ColorDefinition} colorDefinition - Any supported color definition (see constructor)
     * @return {Color} Itself
     */
    set (...colorDefinition) {
        if (colorDefinition.length > 0 && colorDefinition.length <= 2) {
            const param = colorDefinition[0];
            if (param instanceof Color) {
                this.red = param.red;
                this.green = param.green;
                this.blue = param.blue;
                this.alpha = param.alpha;
            }
            else {
                let hex = param;
                if (typeof param === "string") {
                    if (param.startsWith("#")) {
                        hex = Number.parseInt(param.substr(1), 16);
                    }
                    else {
                        const rgb = convert.keyword.rgb(param);
                        this.red = rgb[0] / 255;
                        this.green = rgb[1] / 255;
                        this.blue = rgb[2] / 255;
                    }
                }
                if (typeof hex === "number") {
                    this.red = hexToRatio(hex, 2);
                    this.green = hexToRatio(hex, 1);
                    this.blue = hexToRatio(hex, 0);
                }
            }
            this.alpha = constrain(colorDefinition[1] || this.alpha, 0, 1);
        }
        else if (colorDefinition.length >= 3) {
            this.red = constrain(colorDefinition[0], 0, 1);
            this.green = constrain(colorDefinition[1], 0, 1);
            this.blue = constrain(colorDefinition[2], 0, 1);
            this.alpha = constrain(colorDefinition[3] || this.alpha, 0, 1);
        }
        return this;
    }

    /**
     * Change to its greyscale value
     * @return {Color} Itself
     */
    grey () {
        const weights = [0.299, 0.587, 0.114];
        const target = average(...this.array.map((channel, index) => channel * weights[index]));
        return this.set(target, target, target);
    }

    /**
     * Change hue value (0 = red, 0.5 = blue, 1 = red)
     * @param {Number} value - Any value between 0 and 1
     * @return {Color} Itself
     */
    hue (value) {
        const hsl = convert.rgb.hsl(this.array.map(channel => ratioToNum(channel)));
        hsl[0] = value * 360;
        return this.set(...convert.hsl.rgb(hsl).map(channel => channel / 0xff));
    }

    /**
     * Change saturation value (0 = grey, 1 = pure color)
     * @param {Number} value - Any value between 0 and 1
     * @return {Color} Itself
     */
    saturation (value) {
        const target = average(Math.min(...this.array), Math.max(...this.array));
        return this.set(...this.array.map(channel => target + (value * (channel - target))));
    }

    /**
     * Change lightness value (0 = black, 0.5 = pure color, 1 = white)
     * @param {Number} value - Any value between 0 and 1
     * @return {Color} Itself
     */
    lightness (value) {
        const fn = value < 0.5 ?
            channel => channel * value :
            channel => channel + ((1 - channel) * (value - 0.5) * 2);
        return this.set(...this.array.map(fn));
    }

    /**
     * Invert the color value
     * @return {Color} Itself
     */
    reverse () {
        return this.set(...this.array.map(channel => 1 - channel));
    }

    /**
     * Restrict color's channels to set amount of value
     * @param {Number} number - Number of allowed value on each channel
     * @return {Color} Itself
     */
    level (number) {
        return this.set(...this.array.map(channel => truncate((channel * number) + 1) / (number + 1)));
    }

    /**
     * Change the color toward another color
     * @param {ColorDefinition} colorDefinition - Any other color
     * @param {Number|Function} ratio - Ratio of distance to move (0 = no change, 0.5 = equal mix, 1 = same as target color)
     * @return {Color} Itself
     */
    lerp (colorDefinition, ratio) {
        const weight = typeof ratio === "function" ? ratio() : ratio;
        const color = Color.from(colorDefinition);
        const thisArray = this.array.concat(this.alpha);
        const colorArray = color.array.concat(color.alpha);
        return this.set(...thisArray.map((channel, index) => channel * (1 - weight) + colorArray[index] * weight));
    }

    /**
     * @return {String}
     */
    toString () {
        if (this.alpha === 1) {
            return this.rgb;
        }
        else {
            return this.rgba;
        }
    }

    /**
     * Return a json ready array
     * @return {Array<Number>}
     */
    toJSON () {
        return this.array.concat(this.alpha);
    }

    /**
     * Return an instance from a generic definition
     * @param {ColorDefinition} colorDefinition - Any valid color definition (see constructor)
     * @return {Color}
     */
    static from (colorDefinition) {
        if (colorDefinition instanceof Color) {
            return colorDefinition;
        }
        const color = new Color();
        color.set(...(Array.isArray(colorDefinition) ? colorDefinition : [colorDefinition]));
        return color;
    }
}
