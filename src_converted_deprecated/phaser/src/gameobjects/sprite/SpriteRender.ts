/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { NOOP } from '../../utils/NOOP';
import { SpriteWebGLRenderer } from './SpriteWebGLRenderer';
import { SpriteCanvasRenderer } from './SpriteCanvasRenderer';

let renderWebGL: Function = NOOP;
let renderCanvas: Function = NOOP;

if (typeof WEBGL_RENDERER)
{
    renderWebGL = SpriteWebGLRenderer;
}

if (typeof CANVAS_RENDERER)
{
    renderCanvas = SpriteCanvasRenderer;
}

export { renderWebGL, renderCanvas };
