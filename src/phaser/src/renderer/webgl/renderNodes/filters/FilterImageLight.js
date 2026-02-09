/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../../../utils/Class');
var BaseFilterShader = require('./BaseFilterShader');

var ShaderSourceFS = require('../../shaders/FilterImageLight-frag.js');

/**
 * @classdesc
 * This RenderNode renders the ImageLight filter effect.
 * See {@link Phaser.Filters.ImageLight}.
 *
 * @class FilterImageLight
 * @extends Phaser.Renderer.WebGL.RenderNodes.BaseFilterShader
 * @memberof Phaser.Renderer.WebGL.RenderNodes
 * @constructor
 * @since 4.0.0
 * @param {Phaser.Renderer.WebGL.RenderNodes.RenderNodeManager} manager - The manager that owns this RenderNode.
 */
var FilterImageLight = new Class({
    Extends: BaseFilterShader,

    initialize: function FilterImageLight (manager)
    {
        BaseFilterShader.call(this, 'FilterImageLight', manager, null, ShaderSourceFS);
    },

    setupTextures: function (controller, textures, _drawingContext)
    {
        // Environment map texture.
        textures[1] = controller.environmentGlTexture;

        // Normal map texture.
        textures[2] = controller.normalGlTexture;
    },

    setupUniforms: function (controller, _drawingContext)
    {
        var programManager = this.programManager;

        programManager.setUniform('uEnvSampler', 1);
        programManager.setUniform('uNormSampler', 2);
        programManager.setUniform('uViewMatrix', controller.viewMatrix.val);
        programManager.setUniform('uModelRotation', controller.getModelRotation());
        programManager.setUniform('uBulge', controller.bulge);
        programManager.setUniform('uColorFactor', controller.colorFactor);
    }
});

module.exports = FilterImageLight;
