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
    const { ImageWebGLRenderer } = require('./ImageWebGLRenderer');
    renderWebGL = ImageWebGLRenderer;
}

if (typeof CANVAS_RENDERER)
{
    const { ImageCanvasRenderer } = require('./ImageCanvasRenderer');
    renderCanvas = ImageCanvasRenderer;
}

module.exports = {
    renderWebGL: renderWebGL,
    renderCanvas: renderCanvas
};
