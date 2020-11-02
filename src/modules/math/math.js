/**
 * @module Math
 */

/**
 * Constrain a number between two limits.
 * @param {Number} value - Any number
 * @param {Number} min - Minimal limit for the value
 * @param {Number} max - Maximal limit for the value
 * @return {Number}
 * @example
 * constrain(999, 0, 50); // => 50
 * constrain(-999, 0, 50); // => 0
 */
export const constrain = (value, min, max) => Math.min(Math.max(value, min), max);

/**
 * Determine if two number can considered equals accounting for JS precision.
 * @param {Number} number1 - Any number
 * @param {Number} number2 - Any number
 * @param {Number} [epsilon=Number.EPSILON] - Maximum difference to consider two number equal.
 * @return {Boolean}
 * @example
 * equals(0.1 + 0.2, 0.3); // => true
 */
export const equals = (number1, number2, epsilon = Number.EPSILON) => Math.abs(number1 - number2) < epsilon;

/**
 * Return a random number between limits
 * @param {Number} [min=1] - Lower limit, or upper limit if max is omitted
 * @param {Number} [max] - Upper limit, can be omitted
 * @return {Number}
 * @example
 * random(); // => 0.5918807307648482
 * random(10); // => 4.4856764978326735
 * random(100, 200); // => 134.57047268453047
 */
export const random = (min = 1, max) => {
    let from = min;
    let to = max;
    if (max === undefined) {
        from = 0;
        to = min;
    }
    return (Math.random() * (to - from)) + from;
};

/**
 * Truncate a number to its integer part.
 * @param {Number} value - Any number
 * @return {Number}
 * @example
 * truncate(12.3); // => 12
 * truncate(-4.9); // => -4
 */
// eslint-disable-next-line no-bitwise
export const truncate = value => value << 0;

/**
 * Full rotation on radian circle
 * @type {Number}
 */
export const radianCircle = Math.PI * 2;

/**
 * Full rotation on degree circle
 * @type {Number}
 */
export const degreeCircle = 360;

/**
 * Golden ratio number
 * @type {Number}
 */
export const phi = (Math.sqrt(5) + 1) / 2;

/**
 * Return modulo with the same sign as the divisor (Floored division)
 * @param {Number} value - Dividend
 * @param {Number} divisor - Divisor
 * @return {Number}
 * @example
 * modulo(10, 3); // => 1
 * modulo(10, -3); // => -2
 */
export const modulo = (value, divisor) => {
    const remainder = value % divisor;
    return !value || Math.sign(value) === Math.sign(divisor) ? remainder : remainder + divisor;
};

/**
 * Returns an array of evenly distributed value across a range
 * @param {Number} nbValue - Number of value to generate
 * @param {Number} [min=0] - Starting value of the range
 * @param {Number} [max=1] - Ending value of the range
 * @return {Array<Number>}
 * @example
 * distribute(10); // => Number[10] evenly distributed across [0, 1]
 * distribute(5, 10, 20); // => Number[5] evenly distributed across [10, 20]
 */
export const distribute = (nbValue, min = 0, max = 1) => {
    const start = random(min, max);
    const diff = max - min;
    return [...new Array(nbValue)].map((_, i) => min + modulo(start + (i * phi * diff), diff));
};

/**
 * Add up all values passed as argument
 * @param {...Number} values - Any set of number
 * @return {Number}
 * @example
 * sum(1, 2, 3); // => 6
 */
export const sum = (...values) => values.reduce((acc, value) => acc + value, 0);

/**
 * Return the average of all values
 * @param {...Number} values - Any set of number
 * @return {Number}
 * @example
 * sum(1, 2, 3); // => 2
 */
export const average = (...values) => sum(...values) / values.length;

/**
 * Return the equivalent of a value from a scale to another
 * @param {Number} value - Value to use
 * @param {Number} fromMin - Start of the origin scale
 * @param {Number} fromMax - End of the origin scale
 * @param {Number} [toMin=0] - Start of the target scale
 * @param {Number} [toMax=1] - End of the target scale
 * @return {Number}
 * @example
 * map(5, 0, 10, 100, 200); // => 150
 */
export const map = (value, fromMin, fromMax, toMin = 0, toMax = 1) => (
    ((value - fromMin) / (fromMax - fromMin)) * (toMax - toMin) + toMin
);

/**
 * Linear extrapolation computation, useful when doing animation
 * @param {Number} from - Starting value
 * @param {Number} to - Ending value
 * @param {Number} ratio - Extrapolation ratio, 0 is the starting value and 1 the ending value
 * @return {Number}
 */
export const lerp = (from, to, ratio) => from + ((to - from) * ratio);
