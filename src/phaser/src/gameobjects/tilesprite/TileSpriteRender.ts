import { NOOP } from '../../utils/NOOP';
import { TileSpriteWebGLRenderer } from './TileSpriteWebGLRenderer';
import { TileSpriteCanvasRenderer } from './TileSpriteCanvasRenderer';

export const renderWebGL = (typeof WEBGL_RENDERER !== 'undefined') ? TileSpriteWebGLRenderer : NOOP;
export const renderCanvas = (typeof CANVAS_RENDERER !== 'undefined') ? TileSpriteCanvasRenderer : NOOP;

export const TileSpriteRender = {
    renderWebGL,
    renderCanvas
};
