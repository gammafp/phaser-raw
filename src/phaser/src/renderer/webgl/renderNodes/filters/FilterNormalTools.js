/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../../../utils/Class');
var BaseFilterShader = require('./BaseFilterShader');

var ShaderSourceFS = require('../../shaders/FilterNormalTools-frag.js');

/**
 * @classdesc
 * This RenderNode renders the NormalTools filter effect.
 * See {@link Phaser.Filters.NormalTools}.
 *
 * @class FilterNormalTools
 * @extends Phaser.Renderer.WebGL.RenderNodes.BaseFilterShader
 * @memberof Phaser.Renderer.WebGL.RenderNodes
 * @constructor
 * @since 4.0.0
 * @param {Phaser.Renderer.WebGL.RenderNodes.RenderNodeManager} manager - The manager that owns this RenderNode.
 */
var FilterNormalTools = new Class({
    Extends: BaseFilterShader,

    initialize: function FilterNormalTools (manager)
    {
        var additions = [
            {
                name: 'view',
                additions: {
                    fragmentHeader: '#define VIEW_MATRIX'
                },
                tags: [ 'header' ]
            }
        ];

        BaseFilterShader.call(this, 'FilterNormalTools', manager, null, ShaderSourceFS, additions);
    },

    updateShaderConfig: function (controller, drawingContext)
    {
        var headerAddition = this.programManager.getAdditionsByTag('header')[0];
        headerAddition.name = 'view';
        headerAddition.additions.fragmentHeader = '#define VIEW_MATRIX';

        if (controller.facingPower !== 1)
        {
            headerAddition.name += '_facingPower';
            headerAddition.additions.fragmentHeader += '\n#define FACING_POWER';
        }

        if (controller.outputRatio)
        {
            headerAddition.name += '_ratio';
            headerAddition.additions.fragmentHeader += '\n#define OUTPUT_RATIO';
        }
    },

    setupUniforms: function (controller, drawingContext)
    {
        var programManager = this.programManager;

        programManager.setUniform('uViewMatrix', controller.viewMatrix.val);

        if (controller.facingPower !== 1)
        {
            programManager.setUniform('uFacingPower', controller.facingPower);
        }

        if (controller.outputRatio)
        {
            var rv = controller.ratioVector;
            programManager.setUniform('uRatioVector', [ rv.x, rv.y, rv.z ]);
            programManager.setUniform('uRatioRadius', controller.ratioRadius);
        }
    }
});

module.exports = FilterNormalTools;
