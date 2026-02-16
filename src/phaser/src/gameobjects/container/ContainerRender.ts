/**
 * @author       Richard Davey <rich@phaser.io>
 * @author       Felipe Alfonso <@bitnenfer>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { NOOP } from '../../utils/NOOP';
import { ContainerWebGLRenderer } from './ContainerWebGLRenderer';

let renderWebGL: Function = NOOP;
let renderCanvas: Function = NOOP;

if (typeof WEBGL_RENDERER !== 'undefined')
{
    renderWebGL = ContainerWebGLRenderer;
}

if (typeof CANVAS_RENDERER !== 'undefined')
{
    renderCanvas = require('./ContainerCanvasRenderer');
}

export interface ContainerRender {
    renderWebGL: Function;
    renderCanvas: Function;
}

export const ContainerRender = {
    renderWebGL,
    renderCanvas
};
