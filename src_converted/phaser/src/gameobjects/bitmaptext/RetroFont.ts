/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { Extend } from '../../utils/object/Extend';
import { ParseRetroFont } from './ParseRetroFont';
import { RETRO_FONT_CONST } from './const';

export const RetroFont = Extend(false, { Parse: ParseRetroFont }, RETRO_FONT_CONST);
