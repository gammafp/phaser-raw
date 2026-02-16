/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { BaseFilterShader } from './BaseFilterShader';
import { FilterNormalToolsFrag } from '../../shaders/FilterNormalTools-frag';

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
export class FilterNormalTools extends BaseFilterShader {

    constructor (manager: Phaser.Renderer.WebGL.RenderNodes.RenderNodeManager)
    {
        const additions = [
            {
                name: 'view',
                additions: {
                    fragmentHeader: '#define VIEW_MATRIX'
                },
                tags: [ 'header' ]
            }
        ];

        super('FilterNormalTools', manager, null, FilterNormalToolsFrag, additions);
    }

    updateShaderConfig (controller: Phaser.Filters.Controller, drawingContext: Phaser.Renderer.WebGL.DrawingContext): void
    {
        const headerAddition = this.programManager.getAdditionsByTag('header')[0];
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
    }

    setupUniforms (controller: Phaser.Filters.Controller, drawingContext: Phaser.Renderer.WebGL.DrawingContext): void
    {
        const programManager = this.programManager;

        programManager.setUniform('uViewMatrix', controller.viewMatrix.val);

        if (controller.facingPower !== 1)
        {
            programManager.setUniform('uFacingPower', controller.facingPower);
        }

        if (controller.outputRatio)
        {
            const rv = controller.ratioVector;
            programManager.setUniform('uRatioVector', [ rv.x, rv.y, rv.z ]);
            programManager.setUniform('uRatioRadius', controller.ratioRadius);
        }
    }
}
