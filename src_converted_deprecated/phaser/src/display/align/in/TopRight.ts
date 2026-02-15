/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { GetRight } from '../../bounds/GetRight';
import { GetTop } from '../../bounds/GetTop';
import { SetRight } from '../../bounds/SetRight';
import { SetTop } from '../../bounds/SetTop';

/**
 * Takes given Game Object and aligns it so that it is positioned in the top right of the other.
 *
 * @function Phaser.Display.Align.In.TopRight
 * @since 3.0.0
 *
 * @generic {Phaser.GameObjects.GameObject} G - [gameObject,$return]
 *
 * @param {Phaser.GameObjects.GameObject} gameObject - The Game Object that will be positioned.
 * @param {Phaser.GameObjects.GameObject} alignIn - The Game Object to base the alignment position on.
 * @param {number} [offsetX=0] - Optional horizontal offset from the position.
 * @param {number} [offsetY=0] - Optional vertical offset from the position.
 *
 * @return {Phaser.GameObjects.GameObject} The Game Object that was aligned.
 */
export const TopRight = (
    gameObject: Phaser.GameObjects.GameObject,
    alignIn: Phaser.GameObjects.GameObject,
    offsetX: number = 0,
    offsetY: number = 0
): Phaser.GameObjects.GameObject =>
{
    SetRight(gameObject, GetRight(alignIn) + offsetX);
    SetTop(gameObject, GetTop(alignIn) - offsetY);

    return gameObject;
}
