/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { NOOP } from '../../utils/NOOP';
import { ImageWebGLRenderer } from './ImageWebGLRenderer';
import { ImageCanvasRenderer } from './ImageCanvasRenderer';

let renderWebGL: Function = NOOP;
let renderCanvas: Function = NOOP;

if (typeof WEBGL_RENDERER !== 'undefined')
{
    renderWebGL = ImageWebGLRenderer;
}

if (typeof CANVAS_RENDERER !== 'undefined')
{
    renderCanvas = ImageCanvasRenderer;
}

export { renderWebGL, renderCanvas };
