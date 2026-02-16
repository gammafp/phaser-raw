/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { BaseFilterShader } from './BaseFilterShader';
import { FilterPixelateFrag } from '../../shaders/FilterPixelate-frag';

/**
 * @classdesc
 * This RenderNode renders the Pixelate filter effect.
 * See {@link Phaser.Filters.Pixelate}.
 *
 * @class FilterPixelate
 * @extends Phaser.Renderer.WebGL.RenderNodes.BaseFilterShader
 * @memberof Phaser.Renderer.WebGL.RenderNodes
 * @constructor
 * @since 4.0.0
 * @param {Phaser.Renderer.WebGL.RenderNodes.RenderNodeManager} manager - The manager that owns this RenderNode.
 */
export class FilterPixelate extends BaseFilterShader {

    constructor (manager: Phaser.Renderer.WebGL.RenderNodes.RenderNodeManager)
    {
        super('FilterPixelate', manager, null, FilterPixelateFrag);
    }

    setupUniforms (controller: Phaser.Filters.Controller, drawingContext: Phaser.Renderer.WebGL.DrawingContext): void
    {
        const programManager = this.programManager;

        programManager.setUniform('resolution', [ drawingContext.width, drawingContext.height ]);
        programManager.setUniform('amount', controller.amount);
    }
}
