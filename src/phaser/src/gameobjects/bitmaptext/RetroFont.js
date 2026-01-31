/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

// TODO: Convert this file to TypeScript

import { Extend } from '../../utils/object/Extend';

var RETRO_FONT_CONST = require('./const');

/**
 * @namespace Phaser.GameObjects.RetroFont
 * @since 3.6.0
 */

var RetroFont = { Parse: require('./ParseRetroFont') };

//   Merge in the consts
RetroFont = Extend(false, RetroFont, RETRO_FONT_CONST);

module.exports = RetroFont;
