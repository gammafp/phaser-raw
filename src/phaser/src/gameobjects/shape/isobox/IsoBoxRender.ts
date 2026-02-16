/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { NOOP } from '../../../utils/NOOP';
import { IsoBoxWebGLRenderer } from './IsoBoxWebGLRenderer';

var renderWebGL: Function = NOOP;
var renderCanvas: Function = NOOP;

if (typeof WEBGL_RENDERER)
{
    renderWebGL = IsoBoxWebGLRenderer;
}

if (typeof CANVAS_RENDERER)
{
    renderCanvas = require('./IsoBoxCanvasRenderer');
}

export const IsoBoxRender = {
    renderWebGL: renderWebGL,
    renderCanvas: renderCanvas
};
