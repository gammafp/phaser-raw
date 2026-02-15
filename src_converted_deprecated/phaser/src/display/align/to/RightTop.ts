/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { GetRight } from '../../bounds/GetRight';
import { GetTop } from '../../bounds/GetTop';
import { SetLeft } from '../../bounds/SetLeft';
import { SetTop } from '../../bounds/SetTop';

/**
 * Takes given Game Object and aligns it so that it is positioned next to the right top position of the other.
 *
 * @function Phaser.Display.Align.To.RightTop
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
export const RightTop = (
    gameObject: Phaser.GameObjects.GameObject,
    alignTo: Phaser.GameObjects.GameObject, 
    offsetX: number = 0, 
    offsetY: number = 0
): Phaser.GameObjects.GameObject => {
    SetLeft(gameObject, GetRight(alignTo) + offsetX);
    SetTop(gameObject, GetTop(alignTo) - offsetY);

    return gameObject;
}
