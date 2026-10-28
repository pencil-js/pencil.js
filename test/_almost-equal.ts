/**
 * Return true if two number are equal within JS precision
 * @param one - Any number
 * @param two - Any number
 */
export default function almostEqual (one: number, two: number): boolean {
    return Math.abs(one - two) < 1e-10;
}
