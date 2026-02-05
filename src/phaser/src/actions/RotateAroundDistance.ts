/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { RotateAroundDistance as MathRotateAroundDistance } from '../math/RotateAroundDistance';

/**
 * Rotates an array of Game Objects around a point by the given angle and distance.
 *
 * @function Phaser.Actions.RotateAroundDistance
 * @since 3.0.0
 *
 * @generic {Phaser.GameObjects.GameObject[]} G - [items,$return]
 *
 * @param {(array|Phaser.GameObjects.GameObject[])} items - An array of Game Objects. The contents of this array are updated by this Action.
 * @param {object} point - Any object with public `x` and `y` properties.
 * @param {number} angle - The angle to rotate by, in radians.
 * @param {number} distance - The distance from the point of rotation in pixels.
 *
 * @return {(array|Phaser.GameObjects.GameObject[])} The array of Game Objects that was passed to this Action.
 */
export const RotateAroundDistance = <G extends any[]>(
    items: G,
    point: { x: number; y: number },
    angle: number,
    distance: number
): G =>
{
    const x = point.x;
    const y = point.y;

    //  There's nothing to do
    if (distance === 0)
    {
        return items;
    }

    for (let i = 0; i < items.length; i++)
    {
        MathRotateAroundDistance(items[i], x, y, angle, distance);
    }

    return items;
};
