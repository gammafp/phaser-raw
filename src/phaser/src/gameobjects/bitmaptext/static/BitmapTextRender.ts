/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { NOOP } from '../../../utils/NOOP';
import { BitmapTextWebGLRenderer } from './BitmapTextWebGLRenderer';
import { BitmapTextCanvasRenderer } from './BitmapTextCanvasRenderer';

export const renderWebGL = (typeof WEBGL_RENDERER !== 'undefined') ? BitmapTextWebGLRenderer : NOOP;
export const renderCanvas = (typeof CANVAS_RENDERER !== 'undefined') ? BitmapTextCanvasRenderer : NOOP;

export const BitmapTextRender = {
    renderWebGL,
    renderCanvas
};
