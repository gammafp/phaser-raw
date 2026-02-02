/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * @namespace Phaser.Display
 */

import * as Color from './color';
import { BaseShader } from './shader/BaseShader';
import { ColorMatrix } from './ColorMatrix';
import { RGB } from './RGB';

export { Color };
export { BaseShader };
export { ColorMatrix };
export { RGB };

const Align = require('./align');
const Bounds = require('./bounds');
const Canvas = require('./canvas');
const Masks = require('./mask');

export default {
    Align,
    BaseShader,
    Bounds,
    Canvas,
    ColorMatrix,
    Masks,
    RGB
};
