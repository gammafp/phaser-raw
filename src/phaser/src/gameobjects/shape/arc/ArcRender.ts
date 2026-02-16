/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { NOOP } from '../../../utils/NOOP';
import { ArcWebGLRenderer } from './ArcWebGLRenderer';

var renderWebGL: Function = NOOP;
var renderCanvas: Function = NOOP;

if (typeof WEBGL_RENDERER)
{
    renderWebGL = ArcWebGLRenderer;
}

if (typeof CANVAS_RENDERER)
{
    renderCanvas = require('./ArcCanvasRenderer');
}

export const ArcRender = {
    renderWebGL: renderWebGL,
    renderCanvas: renderCanvas
};
