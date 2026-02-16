/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { BaseFilterShader } from './BaseFilterShader';
import { FilterImageLightFrag } from '../../shaders/FilterImageLight-frag';

/**
 * @classdesc
 * This RenderNode renders the ImageLight filter effect.
 * See {@link Phaser.Filters.ImageLight}.
 *
 * @class FilterImageLight
 * @extends Phaser.Renderer.WebGL.RenderNodes.BaseFilterShader
 * @memberof Phaser.Renderer.WebGL.RenderNodes
 * @constructor
 * @since 4.0.0
 * @param {Phaser.Renderer.WebGL.RenderNodes.RenderNodeManager} manager - The manager that owns this RenderNode.
 */
export class FilterImageLight extends BaseFilterShader {

    constructor (manager: Phaser.Renderer.WebGL.RenderNodes.RenderNodeManager)
    {
        super('FilterImageLight', manager, null, FilterImageLightFrag);
    }

    setupTextures (controller: Phaser.Filters.Controller, textures: Phaser.Renderer.WebGL.Wrappers.WebGLTextureWrapper[], _drawingContext: Phaser.Renderer.WebGL.DrawingContext): void
    {
        // Environment map texture.
        textures[1] = controller.environmentGlTexture;

        // Normal map texture.
        textures[2] = controller.normalGlTexture;
    }

    setupUniforms (controller: Phaser.Filters.Controller, _drawingContext: Phaser.Renderer.WebGL.DrawingContext): void
    {
        const programManager = this.programManager;

        programManager.setUniform('uEnvSampler', 1);
        programManager.setUniform('uNormSampler', 2);
        programManager.setUniform('uViewMatrix', controller.viewMatrix.val);
        programManager.setUniform('uModelRotation', controller.getModelRotation());
        programManager.setUniform('uBulge', controller.bulge);
        programManager.setUniform('uColorFactor', controller.colorFactor);
    }
}
