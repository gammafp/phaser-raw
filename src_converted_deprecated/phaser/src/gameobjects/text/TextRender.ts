/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { NOOP } from '../../utils/NOOP';
import { TextWebGLRenderer } from './TextWebGLRenderer';
import { TextCanvasRenderer } from './TextCanvasRenderer';

let renderWebGL: Function = NOOP;
let renderCanvas: Function = NOOP;

if (typeof WEBGL_RENDERER)
{
    renderWebGL = TextWebGLRenderer;
}

if (typeof CANVAS_RENDERER)
{
    renderCanvas = TextCanvasRenderer;
}

export { renderWebGL, renderCanvas };
