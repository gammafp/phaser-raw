/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { RotateAroundXY } from './RotateAroundXY';
import { InCenter } from './InCenter';

/**
 * Rotates a Triangle about its incenter, which is the point at which its three angle bisectors meet.
 *
 * @function Phaser.Geom.Triangle.Rotate
 * @since 3.0.0
 *
 * @generic {Phaser.Geom.Triangle} O - [triangle,$return]
 *
 * @param {Phaser.Geom.Triangle} triangle - The Triangle to rotate.
 * @param {number} angle - The angle by which to rotate the Triangle, in radians.
 *
 * @return {Phaser.Geom.Triangle} The rotated Triangle.
 */
export const Rotate = <T extends any>(triangle: T, angle: number): T =>
{
    const point = InCenter(triangle);

    return RotateAroundXY(triangle, point.x, point.y, angle);
};
