/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Returns the amount the Game Object is visually offset from its x coordinate.
 * This is the same as `width * origin.x`.
 * This value will only be > 0 if `origin.x` is not equal to zero.
 *
 * @function Phaser.Display.Bounds.GetOffsetX
 * @since 3.0.0
 *
 * @param {Phaser.GameObjects.GameObject} gameObject - The Game Object to get the bounds value from.
 *
 * @return {number} The horizontal offset of the Game Object.
 */
export const GetOffsetX = (gameObject: Phaser.GameObjects.GameObject): number =>
{
    // @ts-ignore
    return gameObject.width * gameObject.originX;
}
