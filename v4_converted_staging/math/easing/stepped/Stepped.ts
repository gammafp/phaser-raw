/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Stepped easing.
 *
 * @function Phaser.Math.Easing.Stepped
 * @since 3.0.0
 *
 * @param {number} v - The value to be tweened.
 * @param {number} [steps=1] - The number of steps in the ease.
 *
 * @return {number} The tweened value.
 */
export const Stepped = (v: number, steps: number = 1): number =>
{
    if (v <= 0)
    {
        return 0;
    }
    else if (v >= 1)
    {
        return 1;
    }
    else
    {
        return (((steps * v) | 0) + 1) * (1 / steps);
    }
};
