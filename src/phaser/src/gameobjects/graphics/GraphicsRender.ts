import { NOOP } from '../../utils/NOOP';
import { GraphicsWebGLRenderer } from './GraphicsWebGLRenderer';
import { GraphicsCanvasRenderer } from './GraphicsCanvasRenderer';

export const renderWebGL = (typeof WEBGL_RENDERER !== 'undefined') ? GraphicsWebGLRenderer : NOOP;
export const renderCanvas = (typeof CANVAS_RENDERER !== 'undefined') ? GraphicsCanvasRenderer : NOOP;

export const GraphicsRender = {
    renderWebGL,
    renderCanvas
};
