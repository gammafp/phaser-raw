import { NOOP } from '../../utils/NOOP';
import { VideoWebGLRenderer } from './VideoWebGLRenderer';
import { VideoCanvasRenderer } from './VideoCanvasRenderer';

export const renderWebGL = (typeof WEBGL_RENDERER !== 'undefined') ? VideoWebGLRenderer : NOOP;
export const renderCanvas = (typeof CANVAS_RENDERER !== 'undefined') ? VideoCanvasRenderer : NOOP;

export const VideoRender = {
    renderWebGL,
    renderCanvas
};
