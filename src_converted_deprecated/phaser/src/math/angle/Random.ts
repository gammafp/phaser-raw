/**
 * @author       Richard Davey <rich@phaser.io>
 * @author       @samme
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { FloatBetween } from '../FloatBetween';

/**
 * Returns a random angle in the range [-pi, pi].
 *
 * @function Phaser.Math.Angle.Random
 * @since 3.23.0
 *
 * @return {number} The angle, in radians.
 */
export const Random = (): number =>
{
    return FloatBetween(-Math.PI, Math.PI);
};
