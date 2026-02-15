/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { NOOP } from '../utils/NOOP';
import { TilemapLayerWebGLRenderer } from './TilemapLayerWebGLRenderer';
import { TilemapLayerCanvasRenderer } from './TilemapLayerCanvasRenderer';

let renderWebGL: any = NOOP;
let renderCanvas: any = NOOP;

if (typeof WEBGL_RENDERER)
{
    renderWebGL = TilemapLayerWebGLRenderer;
}

if (typeof CANVAS_RENDERER)
{
    renderCanvas = TilemapLayerCanvasRenderer;
}

export { renderWebGL, renderCanvas };
