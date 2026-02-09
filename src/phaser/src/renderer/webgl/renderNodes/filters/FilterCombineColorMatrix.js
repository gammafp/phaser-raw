/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../../../utils/Class');
var BaseFilterShader = require('./BaseFilterShader');

var ShaderSourceFS = require('../../shaders/FilterCombineColorMatrix-frag.js');

/**
 * @classdesc
 * This RenderNode renders the Combine Color Matrix filter effect.
 * See {@link Phaser.Filters.CombineColorMatrix}.
 *
 * @class FilterCombineColorMatrix
 * @extends Phaser.Renderer.WebGL.RenderNodes.BaseFilterShader
 * @memberof Phaser.Renderer.WebGL.RenderNodes
 * @constructor
 * @since 4.0.0
 * @param {Phaser.Renderer.WebGL.RenderNodes.RenderNodeManager} manager - The manager that owns this RenderNode.
 */
var FilterCombineColorMatrix = new Class({
    Extends: BaseFilterShader,

    initialize: function FilterColorMatrix (manager)
    {
        BaseFilterShader.call(this, 'FilterCombineColorMatrix', manager, null, ShaderSourceFS);
    },

    setupTextures: function (controller, textures, _drawingContext)
    {
        textures[1] = controller.glTexture;
    },

    setupUniforms: function (controller, drawingContext)
    {
        var programManager = this.programManager;

        programManager.setUniform('uTransferSampler', 1);
        programManager.setUniform('uColorMatrixSelf[0]', controller.colorMatrixSelf.getData());
        programManager.setUniform('uColorMatrixTransfer[0]', controller.colorMatrixTransfer.getData());
        programManager.setUniform('uAlphaSelf', controller.colorMatrixSelf.alpha);
        programManager.setUniform('uAlphaTransfer', controller.colorMatrixTransfer.alpha);
        programManager.setUniform('uAdditions', controller.additions);
        programManager.setUniform('uMultiplications', controller.multiplications);
    }
});

module.exports = FilterCombineColorMatrix;
