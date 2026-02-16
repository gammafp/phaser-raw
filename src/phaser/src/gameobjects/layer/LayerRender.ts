/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { NOOP } from '../../utils/NOOP';
import { LayerWebGLRenderer } from './LayerWebGLRenderer';

let renderWebGL: Function = NOOP;
let renderCanvas: Function = NOOP;

if (typeof WEBGL_RENDERER !== 'undefined')
{
    renderWebGL = LayerWebGLRenderer;
}

if (typeof CANVAS_RENDERER !== 'undefined')
{
    renderCanvas = require('./LayerCanvasRenderer');
}

export interface LayerRender {
    renderWebGL: Function;
    renderCanvas: Function;
}

export const LayerRender = {
    renderWebGL,
    renderCanvas
};
