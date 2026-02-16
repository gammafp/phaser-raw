/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { NOOP } from '../../utils/NOOP';
import { VideoWebGLRenderer } from './VideoWebGLRenderer';
import { VideoCanvasRenderer } from './VideoCanvasRenderer';

let renderWebGL: Function = NOOP;
let renderCanvas: Function = NOOP;

if (typeof WEBGL_RENDERER !== 'undefined')
{
    renderWebGL = VideoWebGLRenderer;
}

if (typeof CANVAS_RENDERER !== 'undefined')
{
    renderCanvas = VideoCanvasRenderer;
}

export { renderWebGL, renderCanvas };
