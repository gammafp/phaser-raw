/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { NOOP } from '../../utils/NOOP';
import { RenderTextureCanvasRenderer } from './RenderTextureCanvasRenderer';
import { RenderTextureWebGLRenderer } from './RenderTextureWebGLRenderer';

let renderWebGL: Function = NOOP;
let renderCanvas: Function = NOOP;

if (typeof WEBGL_RENDERER)
{
    renderWebGL = RenderTextureWebGLRenderer;
}

if (typeof CANVAS_RENDERER)
{
    renderCanvas = RenderTextureCanvasRenderer;
}

export { renderWebGL, renderCanvas };
