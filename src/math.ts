/**
 * Set of math helpers.
 */

/**
 * Constrain a number between two limits.
 * @param value - Any number
 * @param min - Minimal limit for the value
 * @param max - Maximal limit for the value
 * @example
 * constrain(999, 0, 50); // => 50
 * constrain(-999, 0, 50); // => 0
 */
export const constrain = (value: number, min: number, max: number): number => Math.min(Math.max(value, min), max);

/**
 * Determine if two number can considered equals accounting for JS precision.
 * @param number1 - Any number
 * @param number2 - Any number
 * @param epsilon - Maximum difference to consider two number equal.
 * @example
 * equals(0.1 + 0.2, 0.3); // => true
 */
export const equals = (number1: number, number2: number, epsilon = Number.EPSILON): boolean => (
    Math.abs(number1 - number2) < epsilon
);

/**
 * Return a random number between limits
 * @param min - Lower limit, or upper limit if max is omitted
 * @param max - Upper limit, can be omitted
 * @example
 * random(); // => 0.5918807307648482
 * random(10); // => 4.4856764978326735
 * random(100, 200); // => 134.57047268453047
 */
export const random = (min = 1, max?: number): number => {
    const [from, to] = max === undefined ? [0, min] : [min, max];
    return (Math.random() * (to - from)) + from;
};

/**
 * Truncate a number to its integer part.
 * @param value - Any number
 * @example
 * truncate(12.3); // => 12
 * truncate(-4.9); // => -4
 */
export const truncate = (value: number): number => Math.trunc(value);

/**
 * Full rotation on radian circle
 */
export const radianCircle: number = Math.PI * 2;

/**
 * Full rotation on degree circle
 */
export const degreeCircle = 360;

/**
 * Golden ratio number
 */
export const phi: number = (Math.sqrt(5) + 1) / 2;

/**
 * Return modulo with the same sign as the divisor (Floored division)
 * @param value - Dividend
 * @param divisor - Divisor
 * @example
 * modulo(10, 3); // => 1
 * modulo(10, -3); // => -2
 */
export const modulo = (value: number, divisor: number): number => {
    const remainder = value % divisor;
    if (remainder === 0) {
        // Avoid -0
        return 0;
    }
    return Math.sign(remainder) === Math.sign(divisor) ? remainder : remainder + divisor;
};

/**
 * Returns an array of evenly distributed value across a range
 * @param nbValue - Number of value to generate
 * @param min - Starting value of the range
 * @param max - Ending value of the range
 * @example
 * distribute(10); // => Number[10] evenly distributed across [0, 1]
 * distribute(5, 10, 20); // => Number[5] evenly distributed across [10, 20]
 */
export const distribute = (nbValue: number, min = 0, max = 1): Array<number> => {
    const start = random(min, max);
    const diff = max - min;
    return Array.from({ length: nbValue }, (_, i) => min + modulo(start - min + (i * phi * diff), diff));
};

/**
 * Add up all values passed as argument
 * @param values - Any set of number
 * @example
 * sum(1, 2, 3); // => 6
 */
export const sum = (...values: Array<number>): number => values.reduce((acc, value) => acc + value, 0);

/**
 * Return the average of all values
 * @param values - Any set of number
 * @example
 * average(1, 2, 3); // => 2
 */
export const average = (...values: Array<number>): number => sum(...values) / values.length;

/**
 * Return the equivalent of a value from a scale to another
 * @param value - Value to use
 * @param fromMin - Start of the origin scale
 * @param fromMax - End of the origin scale
 * @param toMin - Start of the target scale
 * @param toMax - End of the target scale
 * @example
 * map(5, 0, 10, 100, 200); // => 150
 */
export const map = (value: number, fromMin: number, fromMax: number, toMin = 0, toMax = 1): number => (
    (((value - fromMin) / (fromMax - fromMin)) * (toMax - toMin)) + toMin
);

/**
 * Linear interpolation computation, useful when doing animation
 * @param from - Starting value
 * @param to - Ending value
 * @param ratio - Interpolation ratio, 0 is the starting value and 1 the ending value
 * @example
 * lerp(10, 20, 0.5); // => 15
 */
export const lerp = (from: number, to: number, ratio: number): number => from + ((to - from) * ratio);
