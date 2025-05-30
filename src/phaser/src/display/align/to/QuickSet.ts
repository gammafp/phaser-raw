/**
 * @author       samme
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var ALIGN_CONST = require('../const');

import { BottomCenter } from './BottomCenter';
import { BottomLeft } from './BottomLeft';
import { BottomRight } from './BottomRight';
import { LeftBottom } from './LeftBottom';
import { LeftCenter } from './LeftCenter';
import { LeftTop } from './LeftTop';
import { RightBottom } from './RightBottom';
import { RightCenter } from './RightCenter';
import { RightTop } from './RightTop';
import { TopCenter } from './TopCenter';
import { TopLeft } from './TopLeft';
import { TopRight } from './TopRight';


var AlignToMap: any[] = [];

AlignToMap[ALIGN_CONST.BOTTOM_CENTER] = BottomCenter;
AlignToMap[ALIGN_CONST.BOTTOM_LEFT] = BottomLeft;
AlignToMap[ALIGN_CONST.BOTTOM_RIGHT] = BottomRight;
AlignToMap[ALIGN_CONST.LEFT_BOTTOM] = LeftBottom;
AlignToMap[ALIGN_CONST.LEFT_CENTER] = LeftCenter;
AlignToMap[ALIGN_CONST.LEFT_TOP] = LeftTop;
AlignToMap[ALIGN_CONST.RIGHT_BOTTOM] = RightBottom;
AlignToMap[ALIGN_CONST.RIGHT_CENTER] = RightCenter;
AlignToMap[ALIGN_CONST.RIGHT_TOP] = RightTop;
AlignToMap[ALIGN_CONST.TOP_CENTER] = TopCenter;
AlignToMap[ALIGN_CONST.TOP_LEFT] = TopLeft;
AlignToMap[ALIGN_CONST.TOP_RIGHT] = TopRight;

/**
 * Takes a Game Object and aligns it next to another, at the given position.
 * The alignment used is based on the `position` argument, which is a `Phaser.Display.Align` property such as `LEFT_CENTER` or `TOP_RIGHT`.
 *
 * @function Phaser.Display.Align.To.QuickSet
 * @since 3.22.0
 *
 * @generic {Phaser.GameObjects.GameObject} G - [child,$return]
 *
 * @param {Phaser.GameObjects.GameObject} child - The Game Object that will be positioned.
 * @param {Phaser.GameObjects.GameObject} alignTo - The Game Object to base the alignment position on.
 * @param {number} position - The position to align the Game Object with. This is an align constant, such as `Phaser.Display.Align.LEFT_CENTER`.
 * @param {number} [offsetX=0] - Optional horizontal offset from the position.
 * @param {number} [offsetY=0] - Optional vertical offset from the position.
 *
 * @return {Phaser.GameObjects.GameObject} The Game Object that was aligned.
 */
export const QuickSet = (
    child: Phaser.GameObjects.GameObject,
    alignTo: Phaser.GameObjects.GameObject,
    position: number,
    offsetX: number = 0,
    offsetY: number = 0
): Phaser.GameObjects.GameObject => {
    return AlignToMap[position](child, alignTo, offsetX, offsetY);
};
