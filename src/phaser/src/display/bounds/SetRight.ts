/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Positions the Game Object so that the left of its bounds aligns with the given coordinate.
 *
 * @function Phaser.Display.Bounds.SetRight
 * @since 3.0.0
 *
 * @generic {Phaser.GameObjects.GameObject} G - [gameObject,$return]
 *
 * @param {Phaser.GameObjects.GameObject} gameObject - The Game Object that will be re-positioned.
 * @param {number} value - The coordinate to position the Game Object bounds on.
 *
 * @return {Phaser.GameObjects.GameObject} The Game Object that was positioned.
 */
export const SetRight = (gameObject: Phaser.GameObjects.GameObject, value: number): Phaser.GameObjects.GameObject =>
{
    // @ts-ignore
    gameObject.x = (value - gameObject.width) + (gameObject.width * gameObject.originX);

    return gameObject;
};
