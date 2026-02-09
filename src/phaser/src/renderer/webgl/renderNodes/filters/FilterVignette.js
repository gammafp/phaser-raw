/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../../../utils/Class');
var BaseFilterShader = require('./BaseFilterShader');

var ShaderSourceFS = require('../../shaders/FilterVignette-frag.js');

/**
 * @classdesc
 * This RenderNode renders the Vignette filter effect.
 * See {@link Phaser.Filters.Vignette}.
 *
 * @class FilterVignette
 * @extends Phaser.Renderer.WebGL.RenderNodes.BaseFilterShader
 * @memberof Phaser.Renderer.WebGL.RenderNodes
 * @constructor
 * @since 4.0.0
 * @param {Phaser.Renderer.WebGL.RenderNodes.RenderNodeManager} manager - The manager that owns this RenderNode.
 */
var FilterVignette = new Class({
    Extends: BaseFilterShader,

    initialize: function FilterVignette (manager)
    {
        BaseFilterShader.call(this, 'FilterVignette', manager, null, ShaderSourceFS);
    },

    setupUniforms: function (controller, _drawingContext)
    {
        var programManager = this.programManager;

        var c = controller.color;

        programManager.setUniform('uRadius', controller.radius);
        programManager.setUniform('uStrength', controller.strength);
        programManager.setUniform('uPosition', [ controller.x, controller.y ]);
        programManager.setUniform('uColor', [ c.redGL, c.greenGL, c.blueGL, c.alphaGL ]);
        programManager.setUniform('uBlendMode', controller.blendMode);
    }
});

module.exports = FilterVignette;
