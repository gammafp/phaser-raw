/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { NOOP } from '../../../utils/NOOP';
import { BitmapTextWebGLRenderer } from './BitmapTextWebGLRenderer';

var renderWebGL: Function = NOOP;
var renderCanvas: Function = NOOP;

if (typeof WEBGL_RENDERER)
{
    renderWebGL = BitmapTextWebGLRenderer;
}

if (typeof CANVAS_RENDERER)
{
    renderCanvas = require('./BitmapTextCanvasRenderer');
}

export { renderWebGL, renderCanvas };
