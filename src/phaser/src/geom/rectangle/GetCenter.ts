/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { Vector2 } from '../../math/Vector2';

/**
 * Returns the center of a Rectangle as a Vector2.
 *
 * @function Phaser.Geom.Rectangle.GetCenter
 * @since 3.0.0
 *
 * @generic {Phaser.Math.Vector2} O - [out,$return]
 *
 * @param {Phaser.Geom.Rectangle} rect - The Rectangle to get the center of.
 * @param {Phaser.Math.Vector2} [out] - Optional Vector2 to update with the center coordinates.
 *
 * @return {Phaser.Math.Vector2} The modified `out` object, or a new Vector2 if none was provided.
 */
export const GetCenter = (rect: any, out?: Vector2): Vector2 =>
{
    if (out === undefined) { out = new Vector2(); }

    out.x = rect.centerX;
    out.y = rect.centerY;

    return out;
};
