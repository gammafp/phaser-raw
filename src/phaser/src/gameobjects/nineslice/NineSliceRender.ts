/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { NOOP } from '../../utils/NOOP';
import { NineSliceWebGLRenderer } from './NineSliceWebGLRenderer';

let renderWebGL: Function = NOOP;
let renderCanvas: Function = NOOP;

if (typeof WEBGL_RENDERER !== 'undefined')
{
    renderWebGL = NineSliceWebGLRenderer;
}

export interface NineSliceRender {
    renderWebGL: Function;
    renderCanvas: Function;
}

export const NineSliceRender = {
    renderWebGL,
    renderCanvas
};
