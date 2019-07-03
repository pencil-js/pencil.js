/**
 * Return true if two number are equal within JS precision
 * @param {Number} one - Any number
 * @param {Number} two - Any number
 * @return {Boolean}
 */
export default function almostEqual (one, two) {
    return Math.abs(one - two) < 1e-10;
}
