import { NOOP } from '../../utils/NOOP';
import { DOMElementWebGLRenderer } from './DOMElementWebGLRenderer';
import { DOMElementCanvasRenderer } from './DOMElementCanvasRenderer';

export const renderWebGL = (typeof WEBGL_RENDERER !== 'undefined') ? DOMElementWebGLRenderer : NOOP;
export const renderCanvas = (typeof CANVAS_RENDERER !== 'undefined') ? DOMElementCanvasRenderer : NOOP;

export const DOMElementRender = {
    renderWebGL,
    renderCanvas
};
