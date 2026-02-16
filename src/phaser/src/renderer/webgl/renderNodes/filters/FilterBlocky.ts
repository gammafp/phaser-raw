/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { BaseFilterShader } from './BaseFilterShader';
import { FilterBlockyFrag } from '../../shaders/FilterBlocky-frag';

/**
 * @classdesc
 * This RenderNode renders the Blocky filter effect.
 * See {@link Phaser.Filters.Blocky}.
 *
 * @class FilterBlocky
 * @extends Phaser.Renderer.WebGL.RenderNodes.BaseFilterShader
 * @memberof Phaser.Renderer.WebGL.RenderNodes
 * @constructor
 * @since 4.0.0
 * @param {Phaser.Renderer.WebGL.RenderNodes.RenderNodeManager} manager - The manager that owns this RenderNode.
 */
export class FilterBlocky extends BaseFilterShader {

    constructor (manager: Phaser.Renderer.WebGL.RenderNodes.RenderNodeManager)
    {
        super('FilterBlocky', manager, null, FilterBlockyFrag);
    }

    setupUniforms (controller: Phaser.Filters.Controller, drawingContext: Phaser.Renderer.WebGL.DrawingContext): void
    {
        const programManager = this.programManager;

        const sizeX = Math.max(1, controller.size.x);
        const sizeY = Math.max(1, controller.size.y);

        programManager.setUniform('resolution', [ drawingContext.width, drawingContext.height ]);
        programManager.setUniform('uSizeAndOffset', [ sizeX, sizeY, controller.offset.x, controller.offset.y ]);
    }
}
