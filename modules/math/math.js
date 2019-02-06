
/**
 * Constrain a number between two limits.
 * @param {Number} value - Any number
 * @param {Number} min - Minimal limit for the value
 * @param {Number} max - Maximal limit for the value
 * @returns {Number}
 * @example
 * constrain(999, 0, 50); // 50
 * constrain(-999, 0, 50); // 0
 */
export const constrain = (value, min, max) => Math.min(Math.max(value, min), max);

/**
 * Determine if two number can considered equals accounting for JS precision.
 * @param {Number} number1 - Any number
 * @param {Number} number2 - Any number
 * @param {Number} [epsilon=Number.EPSILON] - Maximum difference to consider two number equal.
 * @returns {Boolean}
 */
export const equals = (number1, number2, epsilon = Number.EPSILON) => Math.abs(number1 - number2) < epsilon;

/**
 * Return a random number between limits
 * @param {Number} [min=1] - Lower limit, or upper limit if max is omitted
 * @param {Number} [max] - Upper limit, can be omitted
 * @returns {Number}
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
 * Truncate (quickly) a number to its integer part.
 * @param {Number} value - Any number
 * @returns {Number}
 * @example
 * truncate(12.3); // 12
 * truncate(-4.9); // -4
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
 * Return with the same sign as the divisor (Floored division)
 * @param {Number} value - Dividend
 * @param {Number} divisor - Divisor
 * @return {Number}
 */
export const modulo = (value, divisor) => ((value % divisor) + divisor) % divisor;

/**
 * Return the average
 * @param {...Number} values - Any set of number
 * @return {Number}
 */
export const average = (...values) => values.reduce((sum, value) => sum + value, 0) / values.length;
