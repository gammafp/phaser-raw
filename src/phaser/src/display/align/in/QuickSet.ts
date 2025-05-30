/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { BottomCenter } from './BottomCenter';
import { BottomLeft } from './BottomLeft';
import { BottomRight } from './BottomRight';
import { Center } from './Center';
import { LeftCenter } from './LeftCenter';
import { RightCenter } from './RightCenter';
import { TopCenter } from './TopCenter';
import { TopLeft } from './TopLeft';
import { TopRight } from './TopRight';

var ALIGN_CONST = require('../const');

// TODO: fix types
var AlignInMap: any[] = [];

AlignInMap[ALIGN_CONST.BOTTOM_CENTER] = BottomCenter;
AlignInMap[ALIGN_CONST.BOTTOM_LEFT] = BottomLeft;
AlignInMap[ALIGN_CONST.BOTTOM_RIGHT] = BottomRight;
AlignInMap[ALIGN_CONST.CENTER] = Center;
AlignInMap[ALIGN_CONST.LEFT_CENTER] = LeftCenter;
AlignInMap[ALIGN_CONST.RIGHT_CENTER] = RightCenter;
AlignInMap[ALIGN_CONST.TOP_CENTER] = TopCenter;
AlignInMap[ALIGN_CONST.TOP_LEFT] = TopLeft;
AlignInMap[ALIGN_CONST.TOP_RIGHT] = TopRight;
AlignInMap[ALIGN_CONST.LEFT_BOTTOM] = AlignInMap[ALIGN_CONST.BOTTOM_LEFT];
AlignInMap[ALIGN_CONST.LEFT_TOP] = AlignInMap[ALIGN_CONST.TOP_LEFT];
AlignInMap[ALIGN_CONST.RIGHT_BOTTOM] = AlignInMap[ALIGN_CONST.BOTTOM_RIGHT];
AlignInMap[ALIGN_CONST.RIGHT_TOP] = AlignInMap[ALIGN_CONST.TOP_RIGHT];

/**
 * Takes given Game Object and aligns it so that it is positioned relative to the other.
 * The alignment used is based on the `position` argument, which is an `ALIGN_CONST` value, such as `LEFT_CENTER` or `TOP_RIGHT`.
 *
 * @function Phaser.Display.Align.In.QuickSet
 * @since 3.0.0
 *
 * @generic {Phaser.GameObjects.GameObject} G - [child,$return]
 *
 * @param {Phaser.GameObjects.GameObject} child - The Game Object that will be positioned.
 * @param {Phaser.GameObjects.GameObject} alignIn - The Game Object to base the alignment position on.
 * @param {number} position - The position to align the Game Object with. This is an align constant, such as `ALIGN_CONST.LEFT_CENTER`.
 * @param {number} [offsetX=0] - Optional horizontal offset from the position.
 * @param {number} [offsetY=0] - Optional vertical offset from the position.
 *
 * @return {Phaser.GameObjects.GameObject} The Game Object that was aligned.
 */
export const QuickSet = (
    child: Phaser.GameObjects.GameObject,
    alignIn: Phaser.GameObjects.GameObject,
    position: number,
    offsetX: number = 0,
    offsetY: number = 0
): Phaser.GameObjects.GameObject =>
{
    return AlignInMap[position](child, alignIn, offsetX, offsetY);
};
