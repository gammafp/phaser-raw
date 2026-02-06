/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { NOOP } from '../../utils/NOOP';
import { MeshWebGLRenderer } from './MeshWebGLRenderer';
import { MeshCanvasRenderer } from './MeshCanvasRenderer';

export const renderWebGL = (typeof WEBGL_RENDERER !== 'undefined') ? MeshWebGLRenderer : NOOP;
export const renderCanvas = (typeof CANVAS_RENDERER !== 'undefined') ? MeshCanvasRenderer : NOOP;

export const MeshRender = {
    renderWebGL,
    renderCanvas
};
