/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { BaseFilterShader } from './BaseFilterShader';
import { FilterCombineColorMatrixFrag } from '../../shaders/FilterCombineColorMatrix-frag';

/**
 * @classdesc
 * This RenderNode renders the Combine Color Matrix filter effect.
 * See {@link Phaser.Filters.CombineColorMatrix}.
 *
 * @class FilterCombineColorMatrix
 * @extends Phaser.Renderer.WebGL.RenderNodes.BaseFilterShader
 * @memberof Phaser.Renderer.WebGL.RenderNodes
 * @constructor
 * @since 4.0.0
 * @param {Phaser.Renderer.WebGL.RenderNodes.RenderNodeManager} manager - The manager that owns this RenderNode.
 */
export class FilterCombineColorMatrix extends BaseFilterShader {

    constructor (manager: Phaser.Renderer.WebGL.RenderNodes.RenderNodeManager)
    {
        super('FilterCombineColorMatrix', manager, null, FilterCombineColorMatrixFrag);
    }

    setupTextures (controller: Phaser.Filters.Controller, textures: Phaser.Renderer.WebGL.Wrappers.WebGLTextureWrapper[], _drawingContext: Phaser.Renderer.WebGL.DrawingContext): void
    {
        textures[1] = controller.glTexture;
    }

    setupUniforms (controller: Phaser.Filters.Controller, drawingContext: Phaser.Renderer.WebGL.DrawingContext): void
    {
        const programManager = this.programManager;

        programManager.setUniform('uTransferSampler', 1);
        programManager.setUniform('uColorMatrixSelf[0]', controller.colorMatrixSelf.getData());
        programManager.setUniform('uColorMatrixTransfer[0]', controller.colorMatrixTransfer.getData());
        programManager.setUniform('uAlphaSelf', controller.colorMatrixSelf.alpha);
        programManager.setUniform('uAlphaTransfer', controller.colorMatrixTransfer.alpha);
        programManager.setUniform('uAdditions', controller.additions);
        programManager.setUniform('uMultiplications', controller.multiplications);
    }
}
