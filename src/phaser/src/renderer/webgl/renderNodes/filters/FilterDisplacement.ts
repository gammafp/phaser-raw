/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { BaseFilterShader } from './BaseFilterShader';
import { FilterDisplacementFrag } from '../../shaders/FilterDisplacement-frag';

/**
 * @classdesc
 * This RenderNode renders the Displacement filter effect.
 * See {@link Phaser.Filters.Displacement}.
 *
 * @class FilterDisplacement
 * @extends Phaser.Renderer.WebGL.RenderNodes.BaseFilterShader
 * @memberof Phaser.Renderer.WebGL.RenderNodes
 * @constructor
 * @since 4.0.0
 * @param {Phaser.Renderer.WebGL.RenderNodes.RenderNodeManager} manager - The manager that owns this RenderNode.
 */
export class FilterDisplacement extends BaseFilterShader {

    constructor (manager: Phaser.Renderer.WebGL.RenderNodes.RenderNodeManager)
    {
        super('FilterDisplacement', manager, null, FilterDisplacementFrag);
    }

    setupTextures (controller: Phaser.Filters.Controller, textures: Phaser.Renderer.WebGL.Wrappers.WebGLTextureWrapper[], drawingContext: Phaser.Renderer.WebGL.DrawingContext): void
    {
        // Displacement texture.
        textures[1] = controller.glTexture;
    }

    setupUniforms (controller: Phaser.Filters.Controller, drawingContext: Phaser.Renderer.WebGL.DrawingContext): void
    {
        const programManager = this.programManager;

        programManager.setUniform('uDisplacementSampler', 1);
        programManager.setUniform('amount', [ controller.x, controller.y ]);
    }
}
