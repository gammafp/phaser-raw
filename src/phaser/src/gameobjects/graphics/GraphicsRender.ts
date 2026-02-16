/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { NOOP } from '../../utils/NOOP';
import { GraphicsCanvasRenderer } from './GraphicsCanvasRenderer';
import { GraphicsWebGLRenderer } from './GraphicsWebGLRenderer';

let renderWebGL: Function = NOOP;
let renderCanvas: Function = NOOP;

if (typeof WEBGL_RENDERER)
{
    renderWebGL = GraphicsWebGLRenderer;

    //  Needed for Graphics.generateTexture
    renderCanvas = GraphicsCanvasRenderer;
}

if (typeof CANVAS_RENDERER)
{
    renderCanvas = GraphicsCanvasRenderer;
}

export interface GraphicsRender {
    renderWebGL: Function;
    renderCanvas: Function;
}

export const GraphicsRender = {

    renderWebGL: renderWebGL,
    renderCanvas: renderCanvas

};
