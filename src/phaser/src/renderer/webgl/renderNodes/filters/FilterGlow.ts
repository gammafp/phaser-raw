/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { BaseFilterShader } from './BaseFilterShader';
import { FilterGlowFrag } from '../../shaders/FilterGlow-frag';

/**
 * @classdesc
 * This RenderNode renders the Glow filter effect.
 * See {@link Phaser.Filters.Glow}.
 *
 * @class FilterGlow
 * @extends Phaser.Renderer.WebGL.RenderNodes.BaseFilterShader
 * @memberof Phaser.Renderer.WebGL.RenderNodes
 * @constructor
 * @since 4.0.0
 * @param {Phaser.Renderer.WebGL.RenderNodes.RenderNodeManager} manager - The manager that owns this RenderNode.
 */
export class FilterGlow extends BaseFilterShader {

    constructor (manager: Phaser.Renderer.WebGL.RenderNodes.RenderNodeManager)
    {
        const shaderAdditions = [
            {
                name: 'distance_10.0',
                additions: {
                    fragmentDefine: '#define DISTANCE 10.0'
                },
                tags: [ 'distance' ]
            },
            {
                name: 'quality_0.1',
                additions: {
                    fragmentDefine: '#define QUALITY 0.1'
                },
                tags: [ 'quality' ]
            }
        ];

        super('FilterGlow', manager, null, FilterGlowFrag, shaderAdditions);
    }

    updateShaderConfig (controller: Phaser.Filters.Controller, drawingContext: Phaser.Renderer.WebGL.DrawingContext): void
    {
        const programManager = this.programManager;

        const distance = controller.distance.toFixed(0) + '.0';
        const distanceAddition = programManager.getAdditionsByTag('distance')[0];
        distanceAddition.name = 'distance_' + distance;
        distanceAddition.additions.fragmentDefine = '#undef DISTANCE\n#define DISTANCE ' + distance;

        const quality = controller.quality.toFixed(0) + '.0';
        const qualityAddition = programManager.getAdditionsByTag('quality')[0];
        qualityAddition.name = 'quality_' + quality;
        qualityAddition.additions.fragmentDefine = '#undef QUALITY\n#define QUALITY ' + quality;
    }

    setupUniforms (controller: Phaser.Filters.Controller, drawingContext: Phaser.Renderer.WebGL.DrawingContext): void
    {
        const programManager = this.programManager;

        programManager.setUniform('resolution', [ drawingContext.width, drawingContext.height ]);
        programManager.setUniform('glowColor', controller.glcolor);
        programManager.setUniform('outerStrength', controller.outerStrength);
        programManager.setUniform('innerStrength', controller.innerStrength);
        programManager.setUniform('scale', controller.scale);
        programManager.setUniform('knockout', controller.knockout);
    }
}
