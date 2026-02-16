/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { NOOP } from '../../../utils/NOOP';
import { RectangleWebGLRenderer } from './RectangleWebGLRenderer';

var renderWebGL: Function = NOOP;
var renderCanvas: Function = NOOP;

if (typeof WEBGL_RENDERER)
{
    renderWebGL = RectangleWebGLRenderer;
}

if (typeof CANVAS_RENDERER)
{
    renderCanvas = require('./RectangleCanvasRenderer');
}

export const RectangleRender = {
    renderWebGL: renderWebGL,
    renderCanvas: renderCanvas
};
