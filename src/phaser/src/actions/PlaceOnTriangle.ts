/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

const BresenhamPoints = require('../geom/line/BresenhamPoints');

/**
 * Takes an array of Game Objects and positions them on evenly spaced points around the edges of a Triangle.
 * 
 * If you wish to pass a `Phaser.GameObjects.Triangle` Shape to this function, you should pass its `geom` property.
 *
 * @function Phaser.Actions.PlaceOnTriangle
 * @since 3.0.0
 *
 * @generic {Phaser.GameObjects.GameObject[]} G - [items,$return]
 *
 * @param {(array|Phaser.GameObjects.GameObject[])} items - An array of Game Objects. The contents of this array are updated by this Action.
 * @param {Phaser.Geom.Triangle} triangle - The Triangle to position the Game Objects on.
 * @param {number} [stepRate=1] - An optional step rate, to increase or decrease the packing of the Game Objects on the lines.
 *
 * @return {(array|Phaser.GameObjects.GameObject[])} The array of Game Objects that was passed to this Action.
 */
export const PlaceOnTriangle = <G extends any[]>(
    items: G,
    triangle: { x1: number; y1: number; x2: number; y2: number; x3: number; y3: number },
    stepRate?: number
): G =>
{
    let p1 = BresenhamPoints({ x1: triangle.x1, y1: triangle.y1, x2: triangle.x2, y2: triangle.y2 }, stepRate);
    let p2 = BresenhamPoints({ x1: triangle.x2, y1: triangle.y2, x2: triangle.x3, y2: triangle.y3 }, stepRate);
    let p3 = BresenhamPoints({ x1: triangle.x3, y1: triangle.y3, x2: triangle.x1, y2: triangle.y1 }, stepRate);

    //  Remove overlaps
    p1.pop();
    p2.pop();
    p3.pop();

    p1 = p1.concat(p2, p3);

    const step = p1.length / items.length;
    let p = 0;

    for (let i = 0; i < items.length; i++)
    {
        const item = items[i];
        const point = p1[Math.floor(p)];

        item.x = point.x;
        item.y = point.y;

        p += step;
    }

    return items;
};
