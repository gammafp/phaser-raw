import { NOOP } from '../../utils/NOOP';
import { RopeWebGLRenderer } from './RopeWebGLRenderer';
import { RopeCanvasRenderer } from './RopeCanvasRenderer';

export const renderWebGL = (typeof WEBGL_RENDERER !== 'undefined') ? RopeWebGLRenderer : NOOP;
export const renderCanvas = (typeof CANVAS_RENDERER !== 'undefined') ? RopeCanvasRenderer : NOOP;

export const RopeRender = {
    renderWebGL,
    renderCanvas
};
