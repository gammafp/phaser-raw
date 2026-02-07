import { NOOP } from '../../utils/NOOP';
import { NineSliceWebGLRenderer } from './NineSliceWebGLRenderer';
import { NineSliceCanvasRenderer } from './NineSliceCanvasRenderer';

export const renderWebGL = (typeof WEBGL_RENDERER !== 'undefined') ? NineSliceWebGLRenderer : NOOP;
export const renderCanvas = (typeof CANVAS_RENDERER !== 'undefined') ? NineSliceCanvasRenderer : NOOP;

export const NineSliceRender = {
    renderWebGL,
    renderCanvas
};
