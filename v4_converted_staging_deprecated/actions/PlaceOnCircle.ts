/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Takes an array of Game Objects and positions them on evenly spaced points around the perimeter of a Circle.
 *
 * If you wish to pass a `Phaser.GameObjects.Circle` Shape to this function, you should pass its `geom` property.
 *
 * @function Phaser.Actions.PlaceOnCircle
 * @since 3.0.0
 *
 * @generic {Phaser.GameObjects.GameObject[]} G - [items,$return]
 *
 * @param {(array|Phaser.GameObjects.GameObject[])} items - An array of Game Objects. The contents of this array are updated by this Action.
 * @param {Phaser.Geom.Circle} circle - The Circle to position the Game Objects on.
 * @param {number} [startAngle=0] - Optional angle to start position from, in radians.
 * @param {number} [endAngle=6.28] - Optional angle to stop position at, in radians.
 *
 * @return {(array|Phaser.GameObjects.GameObject[])} The array of Game Objects that was passed to this Action.
 */
export const PlaceOnCircle = <G extends any[]>(
    items: G,
    circle: { x: number; y: number; radius: number },
    startAngle: number = 0,
    endAngle: number = 6.28
): G =>
{
    let angle = startAngle;
    const angleStep = (endAngle - startAngle) / items.length;

    const cx = circle.x;
    const cy = circle.y;
    const radius = circle.radius;

    for (let i = 0; i < items.length; i++)
    {
        items[i].x = cx + (radius * Math.cos(angle));
        items[i].y = cy + (radius * Math.sin(angle));

        angle += angleStep;
    }

    return items;
};
