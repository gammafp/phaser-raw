/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

const MarchingAnts = require('../geom/rectangle/MarchingAnts');
const RotateLeft = require('../utils/array/RotateLeft');
const RotateRight = require('../utils/array/RotateRight');

/**
 * Takes an array of Game Objects and positions them on evenly spaced points around the perimeter of a Rectangle.
 * 
 * Placement starts from the top-left of the rectangle, and proceeds in a clockwise direction.
 * If the `shift` parameter is given you can offset where placement begins.
 *
 * @function Phaser.Actions.PlaceOnRectangle
 * @since 3.0.0
 *
 * @generic {Phaser.GameObjects.GameObject[]} G - [items,$return]
 *
 * @param {(array|Phaser.GameObjects.GameObject[])} items - An array of Game Objects. The contents of this array are updated by this Action.
 * @param {Phaser.Geom.Rectangle} rect - The Rectangle to position the Game Objects on.
 * @param {number} [shift=0] - An optional positional offset.
 *
 * @return {(array|Phaser.GameObjects.GameObject[])} The array of Game Objects that was passed to this Action.
 */
export const PlaceOnRectangle = <G extends any[]>(
    items: G,
    rect: any,
    shift: number = 0
): G =>
{
    let points = MarchingAnts(rect, false, items.length);

    if (shift > 0)
    {
        RotateLeft(points, shift);
    }
    else if (shift < 0)
    {
        RotateRight(points, Math.abs(shift));
    }

    for (let i = 0; i < items.length; i++)
    {
        items[i].x = points[i].x;
        items[i].y = points[i].y;
    }

    return items;
};
