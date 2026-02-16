/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * @namespace Phaser.Renderer
 */

/**
 * @namespace Phaser.Types.Renderer
 */

export const Renderer: any = {

    Events: require('./events'),
    Snapshot: require('./snapshot')

};

if (typeof CANVAS_RENDERER)
{
    Renderer.Canvas = require('./canvas');
}

if (typeof WEBGL_RENDERER)
{
    Renderer.WebGL = require('./webgl');
}

export default Renderer;
