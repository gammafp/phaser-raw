/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Returns the left coordinate from the bounds of the Game Object.
 *
 * @function Phaser.Display.Bounds.GetLeft
 * @since 3.0.0
 *
 * @param {Phaser.GameObjects.GameObject} gameObject - The Game Object to get the bounds value from.
 *
 * @return {number} The left coordinate of the bounds of the Game Object.
 */
export const GetLeft = (gameObject: any): number =>
{
    return gameObject.x - (gameObject.width * gameObject.originX);
};