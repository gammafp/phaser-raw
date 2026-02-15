/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Returns the bottom coordinate from the bounds of the Game Object.
 *
 * @function Phaser.Display.Bounds.GetBottom
 * @since 3.0.0
 *
 * @param {Phaser.GameObjects.GameObject} gameObject - The Game Object to get the bounds value from.
 *
 * @return {number} The bottom coordinate of the bounds of the Game Object.
 */
export const GetBottom = (gameObject: Phaser.GameObjects.GameObject): number => {
    // @ts-ignore
    return (gameObject.y + gameObject.height) - (gameObject.height * gameObject.originY);
}
