/**
 * @author       samme
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { Rectangle } from '../../geom/rectangle/Rectangle';
import { GetBottom } from './GetBottom';
import { GetLeft } from './GetLeft';
import { GetRight } from './GetRight';
import { GetTop } from './GetTop';

/**
 * Returns the unrotated bounds of the Game Object as a rectangle.
 *
 * @function Phaser.Display.Bounds.GetBounds
 * @since 3.24.0
 *
 * @param {Phaser.GameObjects.GameObject} gameObject - The Game Object to get the bounds value from.
 * @param {(Phaser.Geom.Rectangle|object)} [output] - An object to store the values in. If not provided a new Rectangle will be created.
 *
 * @return {(Phaser.Geom.Rectangle|object)} - The bounds of the Game Object.
 */
export const GetBounds = (gameObject: any, output?: any): any =>
{
    if (output === undefined) { output = new Rectangle(); }

    var left = GetLeft(gameObject);
    var top = GetTop(gameObject);

    output.x = left;
    output.y = top;
    output.width = GetRight(gameObject) - left;
    output.height = GetBottom(gameObject) - top;

    return output;
};
