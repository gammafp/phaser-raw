/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { NOOP } from '../../utils/NOOP';
import { DOMElementCSSRenderer } from './DOMElementCSSRenderer';

let renderWebGL: Function = NOOP;
let renderCanvas: Function = NOOP;

if (typeof WEBGL_RENDERER !== 'undefined')
{
    renderWebGL = DOMElementCSSRenderer;
}

if (typeof CANVAS_RENDERER !== 'undefined')
{
    renderCanvas = DOMElementCSSRenderer;
}

export interface DOMElementRender {
    renderWebGL: Function;
    renderCanvas: Function;
}

export const DOMElementRender = {
    renderWebGL,
    renderCanvas
};
