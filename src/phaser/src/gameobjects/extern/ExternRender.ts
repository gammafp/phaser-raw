/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { NOOP } from '../../utils/NOOP';
import { ExternWebGLRenderer } from './ExternWebGLRenderer';

export const renderWebGL = (typeof WEBGL_RENDERER !== 'undefined') ? ExternWebGLRenderer : NOOP;
export const renderCanvas = NOOP;

export const ExternRender = {
    renderWebGL,
    renderCanvas
};
