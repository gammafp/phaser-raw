/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { NOOP } from '../utils/NOOP';

let renderWebGL = NOOP;
let renderCanvas = NOOP;

if (typeof WEBGL_RENDERER)
{
    renderWebGL = require('./TilemapLayerWebGLRenderer');
}

if (typeof CANVAS_RENDERER)
{
    renderCanvas = require('./TilemapLayerCanvasRenderer');
}

export { renderWebGL, renderCanvas };
