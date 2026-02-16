/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { NOOP } from '../../../utils/NOOP';
import { CurveWebGLRenderer } from './CurveWebGLRenderer';

var renderWebGL: Function = NOOP;
var renderCanvas: Function = NOOP;

if (typeof WEBGL_RENDERER)
{
    renderWebGL = CurveWebGLRenderer;
}

if (typeof CANVAS_RENDERER)
{
    renderCanvas = require('./CurveCanvasRenderer');
}

export const CurveRender = {
    renderWebGL: renderWebGL,
    renderCanvas: renderCanvas
};
