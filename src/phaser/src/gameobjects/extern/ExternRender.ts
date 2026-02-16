/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { NOOP } from '../../utils/NOOP';
import { ExternWebGLRenderer } from './ExternWebGLRenderer';

let renderWebGL: Function = NOOP;
let renderCanvas: Function = NOOP;

if (typeof WEBGL_RENDERER)
{
    renderWebGL = ExternWebGLRenderer;
}

if (typeof CANVAS_RENDERER)
{
    renderCanvas = require('./ExternCanvasRenderer');
}

export { renderWebGL, renderCanvas };
