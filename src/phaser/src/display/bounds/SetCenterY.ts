/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Positions the Game Object so that the center top of its bounds aligns with the given coordinate.
 *
 * @function Phaser.Display.Bounds.SetCenterY
 * @since 3.0.0
 *
 * @generic {Phaser.GameObjects.GameObject} G - [gameObject,$return]
 *
 * @param {Phaser.GameObjects.GameObject} gameObject - The Game Object that will be re-positioned.
 * @param {number} y - The coordinate to position the Game Object bounds on.
 *
 * @return {Phaser.GameObjects.GameObject} The Game Object that was positioned.
 */
export const SetCenterY = (gameObject: Phaser.GameObjects.GameObject, y: number): Phaser.GameObjects.GameObject =>
{
    // @ts-ignore
    const offsetY = gameObject.height * gameObject.originY;

    // @ts-ignore
    gameObject.y = (y + offsetY) - (gameObject.height * 0.5);

    return gameObject;
}
