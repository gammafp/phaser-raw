/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

const RotateAroundDistance = require('../math/RotateAroundDistance');
const DistanceBetween = require('../math/distance/DistanceBetween');

/**
 * Rotates each item around the given point by the given angle.
 *
 * @function Phaser.Actions.RotateAround
 * @since 3.0.0
 * @see Phaser.Math.RotateAroundDistance
 *
 * @generic {Phaser.GameObjects.GameObject[]} G - [items,$return]
 *
 * @param {(array|Phaser.GameObjects.GameObject[])} items - An array of Game Objects. The contents of this array are updated by this Action.
 * @param {object} point - Any object with public `x` and `y` properties.
 * @param {number} angle - The angle to rotate by, in radians.
 *
 * @return {(array|Phaser.GameObjects.GameObject[])} The array of Game Objects that was passed to this Action.
 */
export const RotateAround = <G extends any[]>(
    items: G,
    point: { x: number; y: number },
    angle: number
): G =>
{
    const x = point.x;
    const y = point.y;

    for (let i = 0; i < items.length; i++)
    {
        const item = items[i];

        RotateAroundDistance(item, x, y, angle, Math.max(1, DistanceBetween(item.x, item.y, x, y)));
    }

    return items;
};
