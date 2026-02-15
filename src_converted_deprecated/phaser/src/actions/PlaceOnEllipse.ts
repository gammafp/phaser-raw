/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Takes an array of Game Objects and positions them on evenly spaced points around the perimeter of an Ellipse.
 * 
 * If you wish to pass a `Phaser.GameObjects.Ellipse` Shape to this function, you should pass its `geom` property.
 *
 * @function Phaser.Actions.PlaceOnEllipse
 * @since 3.0.0
 *
 * @generic {Phaser.GameObjects.GameObject[]} G - [items,$return]
 *
 * @param {(array|Phaser.GameObjects.GameObject[])} items - An array of Game Objects. The contents of this array are updated by this Action.
 * @param {Phaser.Geom.Ellipse} ellipse - The Ellipse to position the Game Objects on.
 * @param {number} [startAngle=0] - Optional angle to start position from, in radians.
 * @param {number} [endAngle=6.28] - Optional angle to stop position at, in radians.
 *
 * @return {(array|Phaser.GameObjects.GameObject[])} The array of Game Objects that was passed to this Action.
 */
export const PlaceOnEllipse = <G extends any[]>(
    items: G,
    ellipse: { x: number; y: number; width: number; height: number },
    startAngle: number = 0,
    endAngle: number = 6.28
): G =>
{
    let angle = startAngle;
    const angleStep = (endAngle - startAngle) / items.length;

    const a = ellipse.width / 2;
    const b = ellipse.height / 2;

    for (let i = 0; i < items.length; i++)
    {
        items[i].x = ellipse.x + a * Math.cos(angle);
        items[i].y = ellipse.y + b * Math.sin(angle);

        angle += angleStep;
    }

    return items;
};
