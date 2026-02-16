/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { NOOP } from '../../utils/NOOP';
import { ParticleEmitterWebGLRenderer } from './ParticleEmitterWebGLRenderer';

var renderWebGL: any = NOOP;
var renderCanvas: any = NOOP;

if (typeof WEBGL_RENDERER)
{
    renderWebGL = ParticleEmitterWebGLRenderer;
}

if (typeof CANVAS_RENDERER)
{
    renderCanvas = require('./ParticleEmitterCanvasRenderer');
}

module.exports = {

    renderWebGL: renderWebGL,
    renderCanvas: renderCanvas

};
