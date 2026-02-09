/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../../../utils/Class');
var BaseFilterShader = require('./BaseFilterShader');

var ShaderSourceFS = require('../../shaders/FilterPanoramaBlur-frag.js');

/**
 * @classdesc
 * This RenderNode renders the PanoramaBlue filter effect.
 * See {@link Phaser.Filters.PanoramaBlue}.
 *
 * @class FilterPanoramaBlue
 * @extends Phaser.Renderer.WebGL.RenderNodes.BaseFilterShader
 * @memberof Phaser.Renderer.WebGL.RenderNodes
 * @constructor
 * @since 4.0.0
 * @param {Phaser.Renderer.WebGL.RenderNodes.RenderNodeManager} manager - The manager that owns this RenderNode.
 */
var FilterPanoramaBlur = new Class({
    Extends: BaseFilterShader,

    initialize: function FilterPanoramaBlur (manager)
    {
        var additions = [
            {
                name: 'samples_32_16',
                additions: {
                    fragmentHeader: '#define SAMPLES_X 32.0\n#define SAMPLES_Y 16.0'
                },
                tags: [ 'samples' ]
            }
        ];

        BaseFilterShader.call(this, 'FilterPanoramaBlur', manager, null, ShaderSourceFS, additions);
    },

    updateShaderConfig: function (controller, drawingContext)
    {
        var samplesX = controller.samplesX.toFixed(0);
        var samplesY = controller.samplesY.toFixed(0);
        var samplesAddition = this.programManager.getAdditionsByTag('samples')[0];
        samplesAddition.name = 'samples_' + samplesX + '_' + samplesY;
        samplesAddition.additions.fragmentHeader = '#define SAMPLES_X ' + samplesX + '.0\n#define SAMPLES_Y ' + samplesY + '.0';
    },

    setupUniforms: function (controller, _drawingContext)
    {
        var programManager = this.programManager;

        programManager.setUniform('uRadius', controller.radius);
        programManager.setUniform('uPower', controller.power);
    }
});

module.exports = FilterPanoramaBlur;
