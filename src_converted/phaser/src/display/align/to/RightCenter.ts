/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { GetCenterY } from '../../bounds/GetCenterY';
import { GetRight } from '../../bounds/GetRight';
import { SetCenterY } from '../../bounds/SetCenterY';
import { SetLeft } from '../../bounds/SetLeft';

/**
 * Takes given Game Object and aligns it so that it is positioned next to the right center position of the other.
 *
 * @function Phaser.Display.Align.To.RightCenter
 * @since 3.0.0
 *
 * @generic {Phaser.GameObjects.GameObject} G - [gameObject,$return]
 *
 * @param {Phaser.GameObjects.GameObject} gameObject - The Game Object that will be positioned.
 * @param {Phaser.GameObjects.GameObject} alignTo - The Game Object to base the alignment position on.
 * @param {number} [offsetX=0] - Optional horizontal offset from the position.
 * @param {number} [offsetY=0] - Optional vertical offset from the position.
 *
 * @return {Phaser.GameObjects.GameObject} The Game Object that was aligned.
 */
export const RightCenter = (
    gameObject: Phaser.GameObjects.GameObject,
    alignTo: Phaser.GameObjects.GameObject,
    offsetX: number = 0,
    offsetY: number = 0
): Phaser.GameObjects.GameObject => {
    SetLeft(gameObject, GetRight(alignTo) + offsetX);
    SetCenterY(gameObject, GetCenterY(alignTo) + offsetY);

    return gameObject;
}
