/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { Rectangle } from '../rectangle/Rectangle';

/**
 * Returns the bounds of the Circle object.
 *
 * @function Phaser.Geom.Circle.GetBounds
 * @since 3.0.0
 *
 * @generic {Phaser.Geom.Rectangle} O - [out,$return]
 *
 * @param {Phaser.Geom.Circle} circle - The Circle to get the bounds from.
 * @param {(Phaser.Geom.Rectangle|object)} [out] - A Rectangle, or rectangle-like object, to store the circle bounds in. If not given a new Rectangle will be created.
 *
 * @return {(Phaser.Geom.Rectangle|object)} The Rectangle object containing the Circles bounds.
 */
export const GetBounds = (circle: any, out?: any): any =>
{
    if (out === undefined) { out = new Rectangle(); }

    out.x = circle.left;
    out.y = circle.top;
    out.width = circle.diameter;
    out.height = circle.diameter;

    return out;
};
