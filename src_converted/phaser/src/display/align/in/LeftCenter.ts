/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { GetCenterY } from '../../bounds/GetCenterY';
import { GetLeft } from '../../bounds/GetLeft';
import { SetCenterY } from '../../bounds/SetCenterY';
import { SetLeft } from '../../bounds/SetLeft';

/**
 * Takes given Game Object and aligns it so that it is positioned in the left center of the other.
 *
 * @function Phaser.Display.Align.In.LeftCenter
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
export const LeftCenter = (
    gameObject: Phaser.GameObjects.GameObject,
    alignIn: Phaser.GameObjects.GameObject,
    offsetX: number = 0,
    offsetY: number = 0
): Phaser.GameObjects.GameObject =>
{

    SetLeft(gameObject, GetLeft(alignIn) - offsetX);
    SetCenterY(gameObject, GetCenterY(alignIn) + offsetY);

    return gameObject;
}
