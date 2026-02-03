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
    const { TextWebGLRenderer } = require('./TextWebGLRenderer');
    renderWebGL = TextWebGLRenderer;
}

if (typeof CANVAS_RENDERER)
{
    const { TextCanvasRenderer } = require('./TextCanvasRenderer');
    renderCanvas = TextCanvasRenderer;
}

module.exports = {
    renderWebGL: renderWebGL,
    renderCanvas: renderCanvas
};
