/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { Angle } from './Angle';
import { NormalAngle } from './NormalAngle';

/**
 * Calculate the reflected angle between two lines.
 *
 * This is the outgoing angle based on the angle of Line 1 and the normalAngle of Line 2.
 *
 * @function Phaser.Geom.Line.ReflectAngle
 * @since 3.0.0
 *
 * @param {Phaser.Geom.Line} lineA - The first line.
 * @param {Phaser.Geom.Line} lineB - The second line.
 *
 * @return {number} The reflected angle between each line.
 */
export const ReflectAngle = (lineA: any, lineB: any): number =>
{
    return (2 * NormalAngle(lineB) - Math.PI - Angle(lineA));
};
