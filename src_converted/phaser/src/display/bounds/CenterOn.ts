/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { SetCenterX } from './SetCenterX';
import { SetCenterY } from './SetCenterY';

/**
 * Positions the Game Object so that it is centered on the given coordinates.
 *
 * @function Phaser.Display.Bounds.CenterOn
 * @since 3.0.0
 *
 * @generic {Phaser.GameObjects.GameObject} G - [gameObject,$return]
 *
 * @param {Phaser.GameObjects.GameObject} gameObject - The Game Object that will be re-positioned.
 * @param {number} x - The horizontal coordinate to position the Game Object on.
 * @param {number} y - The vertical coordinate to position the Game Object on.
 *
 * @return {Phaser.GameObjects.GameObject} The Game Object that was positioned.
 */
export const CenterOn = (gameObject: Phaser.GameObjects.GameObject, x: number, y: number): Phaser.GameObjects.GameObject =>
{
    SetCenterX(gameObject, x);

    return SetCenterY(gameObject, y);
};
