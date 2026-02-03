/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { NOOP } from '../../utils/NOOP';

let renderWebGL: Function = NOOP;
let renderCanvas: Function = NOOP;

if (typeof WEBGL_RENDERER)
{
    const { SpriteWebGLRenderer } = require('./SpriteWebGLRenderer');
    renderWebGL = SpriteWebGLRenderer;
}

if (typeof CANVAS_RENDERER)
{
    const { SpriteCanvasRenderer } = require('./SpriteCanvasRenderer');
    renderCanvas = SpriteCanvasRenderer;
}

module.exports = {
    renderWebGL: renderWebGL,
    renderCanvas: renderCanvas
};
