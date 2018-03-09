/**
 * Truncate a floating number to its integer part.
 * @param {Number} value - Any number
 * @returns {Number}
 * @example
 * truncate(12.3); // 12
 * truncate(-4.9); // -4
 */
// eslint-disable-next-line no-bitwise
export const truncate = value => value << 0;

/**
 * Constrain a number between two limits.
 * @param {Number} value - Any number
 * @param {Number} min - Minimal limit for the value
 * @param {Number} max - Maximal limit for the value
 * @returns {Number}
 * @example
 * constain(999, 0, 50); // 50
 * constain(-999, 0, 50); // 0
 */
export const constain = (value, min, max) => Math.min(Math.max(value, min), max);

/**
 * Determine if two number can considered equals accounting for JS precision.
 * @param {Number} number1 - Any number
 * @param {Number} number2 - Any number
 * @returns {Boolean}
 */
export const equal = (number1, number2) => Math.abs(number1 - number2) < Number.EPSILON;
