/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Returns the center y coordinate from the bounds of the Game Object.
 *
 * @function Phaser.Display.Bounds.GetCenterY
 * @since 3.0.0
 *
 * @param {Phaser.GameObjects.GameObject} gameObject - The Game Object to get the bounds value from.
 *
 * @return {number} The center y coordinate of the bounds of the Game Object.
 */
export const GetCenterY = (gameObject: Phaser.GameObjects.GameObject): number =>
{
    // @ts-ignore
    return gameObject.y - (gameObject.height * gameObject.originY) + (gameObject.height * 0.5);
}
