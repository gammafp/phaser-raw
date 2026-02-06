/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { NOOP } from '../../utils/NOOP';
import { BlitterWebGLRenderer } from './BlitterWebGLRenderer';
import { BlitterCanvasRenderer } from './BlitterCanvasRenderer';

export const renderWebGL = (typeof WEBGL_RENDERER !== 'undefined') ? BlitterWebGLRenderer : NOOP;
export const renderCanvas = (typeof CANVAS_RENDERER !== 'undefined') ? BlitterCanvasRenderer : NOOP;

export const BlitterRender = {
    renderWebGL,
    renderCanvas
};
