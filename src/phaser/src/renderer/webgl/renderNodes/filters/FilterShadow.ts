/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { BaseFilterShader } from './BaseFilterShader';
import { FilterShadowFrag } from '../../shaders/FilterShadow-frag';

/**
 * @classdesc
 * This RenderNode renders the Shadow filter effect.
 * See {@link Phaser.Filters.Shadow}.
 *
 * @class FilterShadow
 * @extends Phaser.Renderer.WebGL.RenderNodes.BaseFilterShader
 * @memberof Phaser.Renderer.WebGL.RenderNodes
 * @constructor
 * @since 4.0.0
 * @param {Phaser.Renderer.WebGL.RenderNodes.RenderNodeManager} manager - The manager that owns this RenderNode.
 */
export class FilterShadow extends BaseFilterShader {

    constructor (manager: Phaser.Renderer.WebGL.RenderNodes.RenderNodeManager)
    {
        super('FilterShadow', manager, null, FilterShadowFrag);
    }

    setupUniforms (controller: Phaser.Filters.Controller, drawingContext: Phaser.Renderer.WebGL.DrawingContext): void
    {
        const programManager = this.programManager;
        const samples = controller.samples;

        programManager.setUniform('lightPosition', [ controller.x, 1 - controller.y ]);
        programManager.setUniform('decay', controller.decay);
        programManager.setUniform('power', controller.power / samples);
        programManager.setUniform('color', controller.glcolor);
        programManager.setUniform('samples', samples);
        programManager.setUniform('intensity', controller.intensity);
    }
}
