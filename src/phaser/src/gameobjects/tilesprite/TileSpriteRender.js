/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { NOOP } from '../../utils/NOOP';
var renderWebGL = NOOP;
var renderCanvas = NOOP;

if (typeof WEBGL_RENDERER)
{
    renderWebGL = require('./TileSpriteWebGLRenderer');
}

if (typeof CANVAS_RENDERER)
{
    renderCanvas = require('./TileSpriteCanvasRenderer');
}

module.exports = {

    renderWebGL: renderWebGL,
    renderCanvas: renderCanvas

};
