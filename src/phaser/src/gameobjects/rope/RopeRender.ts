/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { NOOP } from '../../utils/NOOP';
import { RopeWebGLRenderer } from './RopeWebGLRenderer';
import { RopeCanvasRenderer } from './RopeCanvasRenderer';

let renderWebGL: Function = NOOP;
let renderCanvas: Function = NOOP;

if (typeof WEBGL_RENDERER)
{
    renderWebGL = RopeWebGLRenderer;
}

if (typeof CANVAS_RENDERER)
{
    renderCanvas = RopeCanvasRenderer;
}

export { renderWebGL, renderCanvas };
