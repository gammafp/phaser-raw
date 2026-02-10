/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * @ignore
 */
function P0(t: number, p: number): number
{
    const k = 1 - t;

    return k * k * k * p;
}

/**
 * @ignore
 */
function P1(t: number, p: number): number
{
    const k = 1 - t;

    return 3 * k * k * t * p;
}

/**
 * @ignore
 */
function P2(t: number, p: number): number
{
    return 3 * (1 - t) * t * t * p;
}

/**
 * @ignore
 */
function P3(t: number, p: number): number
{
    return t * t * t * p;
}

/**
 * A cubic bezier interpolation method.
 *
 * https://medium.com/@adrian_cooney/bezier-interpolation-13b68563313a
 *
 * @function Phaser.Math.Interpolation.CubicBezier
 * @since 3.0.0
 *
 * @param {number} t - The percentage of interpolation, between 0 and 1.
 * @param {number} p0 - The start point.
 * @param {number} p1 - The first control point.
 * @param {number} p2 - The second control point.
 * @param {number} p3 - The end point.
 *
 * @return {number} The interpolated value.
 */
export const CubicBezierInterpolation = (t: number, p0: number, p1: number, p2: number, p3: number): number =>
{
    return P0(t, p0) + P1(t, p1) + P2(t, p2) + P3(t, p3);
};
