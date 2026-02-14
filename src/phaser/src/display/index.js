/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { BaseShader } from './shader/BaseShader';
import { ColorMatrix } from './ColorMatrix';
import { RGB } from './RGB';

/**
 * @namespace Phaser.Display
 */

module.exports = {

    Align: require('./align'),
    BaseShader: BaseShader,
    Bounds: require('./bounds'),
    Canvas: require('./canvas'),
    Color: require('./color'),
    ColorMatrix: ColorMatrix,
    Masks: require('./mask'),
    RGB: RGB

};
