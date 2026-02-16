/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { NOOP } from '../../utils/NOOP';
import { BlitterWebGLRenderer } from './BlitterWebGLRenderer';
import { BlitterCanvasRenderer } from './BlitterCanvasRenderer';

let renderWebGL: Function = NOOP;
let renderCanvas: Function = NOOP;

if (typeof WEBGL_RENDERER !== 'undefined')
{
    renderWebGL = BlitterWebGLRenderer;
}

if (typeof CANVAS_RENDERER !== 'undefined')
{
    renderCanvas = BlitterCanvasRenderer;
}

export interface BlitterRender {
    renderWebGL: Function;
    renderCanvas: Function;
}

export const BlitterRender = {
    renderWebGL,
    renderCanvas
};
