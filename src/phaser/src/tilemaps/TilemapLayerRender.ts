/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */


import { NOOP } from '../utils/NOOP';
let renderWebGL: any = NOOP;
let renderCanvas: any = NOOP;

if (typeof WEBGL_RENDERER)
{
}

if (typeof CANVAS_RENDERER)
{
}

export {
    renderWebGL,
    renderCanvas
};
