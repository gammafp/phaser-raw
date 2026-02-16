/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { BaseFilterShader } from './BaseFilterShader';
import { FilterMaskFrag } from '../../shaders/FilterMask-frag';

/**
 * @classdesc
 * This RenderNode renders the Mask filter effect.
 * See {@link Phaser.Filters.Mask}.
 *
 * @class FilterMask
 * @extends Phaser.Renderer.WebGL.RenderNodes.BaseFilterShader
 * @memberof Phaser.Renderer.WebGL.RenderNodes
 * @constructor
 * @since 4.0.0
 * @param {Phaser.Renderer.WebGL.RenderNodes.RenderNodeManager} manager - The manager that owns this RenderNode.
 */
export class FilterMask extends BaseFilterShader {

    constructor (manager: Phaser.Renderer.WebGL.RenderNodes.RenderNodeManager)
    {
        super('FilterMask', manager, null, FilterMaskFrag);
    }

    setupTextures (controller: Phaser.Filters.Controller, textures: Phaser.Renderer.WebGL.Wrappers.WebGLTextureWrapper[], drawingContext: Phaser.Renderer.WebGL.DrawingContext): void
    {
        // Mask texture.
        textures[1] = controller.glTexture;
    }

    setupUniforms (controller: Phaser.Filters.Controller, drawingContext: Phaser.Renderer.WebGL.DrawingContext): void
    {
        const programManager = this.programManager;

        programManager.setUniform('uMaskSampler', 1);
        programManager.setUniform('invert', controller.invert);
    }
}
