import { NOOP } from '../../utils/NOOP';
import { LayerWebGLRenderer } from './LayerWebGLRenderer';
import { LayerCanvasRenderer } from './LayerCanvasRenderer';

export const renderWebGL = (typeof WEBGL_RENDERER !== 'undefined') ? LayerWebGLRenderer : NOOP;
export const renderCanvas = (typeof CANVAS_RENDERER !== 'undefined') ? LayerCanvasRenderer : NOOP;

export const LayerRender = {
    renderWebGL,
    renderCanvas
};
