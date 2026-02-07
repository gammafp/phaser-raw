import { NOOP } from '../../utils/NOOP';
import { ShaderWebGLRenderer } from './ShaderWebGLRenderer';
import { ShaderCanvasRenderer } from './ShaderCanvasRenderer';

export const renderWebGL = (typeof WEBGL_RENDERER !== 'undefined') ? ShaderWebGLRenderer : NOOP;
export const renderCanvas = (typeof CANVAS_RENDERER !== 'undefined') ? ShaderCanvasRenderer : NOOP;

export const ShaderRender = {
    renderWebGL,
    renderCanvas
};
