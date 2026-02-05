/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { NOOP } from '../../utils/NOOP';
import { ImageWebGLRenderer } from './ImageWebGLRenderer';
import { ImageCanvasRenderer } from './ImageCanvasRenderer';

let renderWebGL: Function = NOOP;
let renderCanvas: Function = NOOP;

if (typeof WEBGL_RENDERER)
{
    renderWebGL = ImageWebGLRenderer;
}

if (typeof CANVAS_RENDERER)
{
    renderCanvas = ImageCanvasRenderer;
}

export { renderWebGL, renderCanvas };
