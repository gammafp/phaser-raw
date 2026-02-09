/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../../../utils/Class');
var BaseFilterShader = require('./BaseFilterShader');

var ShaderSourceFS = require('../../shaders/FilterWipe-frag.js');

/**
 * @classdesc
 * This RenderNode renders the Wipe filter effect.
 * See {@link Phaser.Filters.Wipe}.
 *
 * @class FilterWipe
 * @extends Phaser.Renderer.WebGL.RenderNodes.BaseFilterShader
 * @memberof Phaser.Renderer.WebGL.RenderNodes
 * @constructor
 * @since 4.0.0
 * @param {Phaser.Renderer.WebGL.RenderNodes.RenderNodeManager} manager - The manager that owns this RenderNode.
 */
var FilterWipe = new Class({
    Extends: BaseFilterShader,

    initialize: function FilterWipe (manager)
    {
        BaseFilterShader.call(this, 'FilterWipe', manager, null, ShaderSourceFS);
    },

    setupTextures: function (controller, textures, _drawingContext)
    {
        // Reveal texture
        textures[1] = controller.wipeTexture.get().glTexture;
    },

    setupUniforms: function (controller, _drawingContext)
    {
        var programManager = this.programManager;

        programManager.setUniform('uMainSampler2', 1);
        programManager.setUniform('uProgress_WipeWidth_Direction_Axis', [ controller.progress, controller.wipeWidth, controller.direction, controller.axis ]);
        programManager.setUniform('uReveal', controller.reveal);
    }
});

module.exports = FilterWipe;
