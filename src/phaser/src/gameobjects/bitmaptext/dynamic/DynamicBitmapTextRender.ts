/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { NOOP } from '../../../utils/NOOP';
import { DynamicBitmapTextWebGLRenderer } from './DynamicBitmapTextWebGLRenderer';
import { DynamicBitmapTextCanvasRenderer } from './DynamicBitmapTextCanvasRenderer';

export const renderWebGL = (typeof WEBGL_RENDERER !== 'undefined') ? DynamicBitmapTextWebGLRenderer : NOOP;
export const renderCanvas = (typeof CANVAS_RENDERER !== 'undefined') ? DynamicBitmapTextCanvasRenderer : NOOP;

export const DynamicBitmapTextRender = {
    renderWebGL,
    renderCanvas
};
