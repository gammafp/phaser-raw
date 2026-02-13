/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { GetLeft } from '../../bounds/GetLeft';
import { GetTop } from '../../bounds/GetTop';
import { SetLeft } from '../../bounds/SetLeft';
import { SetTop } from '../../bounds/SetTop';

/**
 * Takes given Game Object and aligns it so that it is positioned in the top left of the other.
 *
 * @function Phaser.Display.Align.In.TopLeft
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
export const TopLeft = (gameObject: any, alignIn: any, offsetX?: number, offsetY?: number): any =>
{
    if (offsetX === undefined) { offsetX = 0; }
    if (offsetY === undefined) { offsetY = 0; }

    SetLeft(gameObject, GetLeft(alignIn) - offsetX);
    SetTop(gameObject, GetTop(alignIn) - offsetY);

    return gameObject;
};
