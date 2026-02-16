/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { Extend } from '../../utils/object/Extend';
import { RETRO_FONT_CONST } from './const';
import { ParseRetroFont } from './ParseRetroFont';

/**
 * @namespace Phaser.GameObjects.RetroFont
 * @since 3.6.0
 */

var RetroFont: any = { Parse: ParseRetroFont };

//   Merge in the consts
RetroFont = Extend(false, RetroFont, RETRO_FONT_CONST);

export { RetroFont };
