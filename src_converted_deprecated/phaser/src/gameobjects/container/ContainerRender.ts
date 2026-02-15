import { NOOP } from '../../utils/NOOP';
import { ContainerWebGLRenderer } from './ContainerWebGLRenderer';
import { ContainerCanvasRenderer } from './ContainerCanvasRenderer';

export const renderWebGL = (typeof WEBGL_RENDERER !== 'undefined') ? ContainerWebGLRenderer : NOOP;
export const renderCanvas = (typeof CANVAS_RENDERER !== 'undefined') ? ContainerCanvasRenderer : NOOP;

export const ContainerRender = {
    renderWebGL,
    renderCanvas
};
