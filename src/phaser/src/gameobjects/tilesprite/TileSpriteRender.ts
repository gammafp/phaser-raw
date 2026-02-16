/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { NOOP } from '../../utils/NOOP';
import { TileSpriteWebGLRenderer } from './TileSpriteWebGLRenderer';

let renderWebGL: Function = NOOP;
let renderCanvas: Function = NOOP;

if (typeof WEBGL_RENDERER)
{
    renderWebGL = TileSpriteWebGLRenderer;
}

if (typeof CANVAS_RENDERER)
{
    renderCanvas = require('./TileSpriteCanvasRenderer');
}

export { renderWebGL, renderCanvas };
