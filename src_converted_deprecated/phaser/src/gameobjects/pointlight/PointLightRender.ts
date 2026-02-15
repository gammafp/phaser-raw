/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { NOOP } from '../../utils/NOOP';
import { PointLightWebGLRenderer } from './PointLightWebGLRenderer';

export const renderWebGL = (typeof WEBGL_RENDERER !== 'undefined') ? PointLightWebGLRenderer : NOOP;
export const renderCanvas = NOOP;

export const PointLightRender = {
    renderWebGL,
    renderCanvas
};
