/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { BaseFilterShader } from './BaseFilterShader';
import { FilterThresholdFrag } from '../../shaders/FilterThreshold-frag';

/**
 * @classdesc
 * This RenderNode renders the Threshold filter effect.
 * See {@link Phaser.Filters.Threshold}.
 *
 * @class FilterThreshold
 * @extends Phaser.Renderer.WebGL.RenderNodes.BaseFilterShader
 * @memberof Phaser.Renderer.WebGL.RenderNodes
 * @constructor
 * @since 4.0.0
 * @param {Phaser.Renderer.WebGL.RenderNodes.RenderNodeManager} manager - The manager that owns this RenderNode.
 */
export class FilterThreshold extends BaseFilterShader {

    constructor (manager: Phaser.Renderer.WebGL.RenderNodes.RenderNodeManager)
    {
        super('FilterThreshold', manager, null, FilterThresholdFrag);
    }

    setupUniforms (controller: Phaser.Filters.Controller, drawingContext: Phaser.Renderer.WebGL.DrawingContext): void
    {
        const programManager = this.programManager;

        programManager.setUniform('edge1', controller.edge1);
        programManager.setUniform('edge2', controller.edge2);
        programManager.setUniform('invert', controller.invert);
    }
}
