/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

// The Stamp inherits WebGL rendering properties from the Image class.

import { NOOP } from '../../utils/NOOP';

let renderCanvas: Function = NOOP;

if (typeof CANVAS_RENDERER)
{
    renderCanvas = require('./StampCanvasRenderer');
}

export { renderCanvas };
