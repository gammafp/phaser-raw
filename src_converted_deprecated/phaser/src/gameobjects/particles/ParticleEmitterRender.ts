/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { NOOP } from '../../utils/NOOP';
import { ParticleEmitterWebGLRenderer } from './ParticleEmitterWebGLRenderer';
import { ParticleEmitterCanvasRenderer } from './ParticleEmitterCanvasRenderer';

export const renderWebGL = (typeof WEBGL_RENDERER !== 'undefined') ? ParticleEmitterWebGLRenderer : NOOP;
export const renderCanvas = (typeof CANVAS_RENDERER !== 'undefined') ? ParticleEmitterCanvasRenderer : NOOP;

export const ParticleEmitterRender = {
    renderWebGL,
    renderCanvas
};
