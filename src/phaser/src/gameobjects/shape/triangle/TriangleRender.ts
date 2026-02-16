/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { NOOP } from '../../../utils/NOOP';
import { TriangleWebGLRenderer } from './TriangleWebGLRenderer';

var renderWebGL: Function = NOOP;
var renderCanvas: Function = NOOP;

if (typeof WEBGL_RENDERER)
{
    renderWebGL = TriangleWebGLRenderer;
}

if (typeof CANVAS_RENDERER)
{
    renderCanvas = require('./TriangleCanvasRenderer');
}

export const TriangleRender = {
    renderWebGL: renderWebGL,
    renderCanvas: renderCanvas
};
