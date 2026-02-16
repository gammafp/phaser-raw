/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { BaseFilterShader } from './BaseFilterShader';
import { FilterWipeFrag } from '../../shaders/FilterWipe-frag';

/**
 * @classdesc
 * This RenderNode renders the Wipe filter effect.
 * See {@link Phaser.Filters.Wipe}.
 *
 * @class FilterWipe
 * @extends Phaser.Renderer.WebGL.RenderNodes.BaseFilterShader
 * @memberof Phaser.Renderer.WebGL.RenderNodes
 * @constructor
 * @since 4.0.0
 * @param {Phaser.Renderer.WebGL.RenderNodes.RenderNodeManager} manager - The manager that owns this RenderNode.
 */
export class FilterWipe extends BaseFilterShader {

    constructor (manager: Phaser.Renderer.WebGL.RenderNodes.RenderNodeManager)
    {
        super('FilterWipe', manager, null, FilterWipeFrag);
    }

    setupTextures (controller: Phaser.Filters.Controller, textures: Phaser.Renderer.WebGL.Wrappers.WebGLTextureWrapper[], _drawingContext: Phaser.Renderer.WebGL.DrawingContext): void
    {
        // Reveal texture
        textures[1] = controller.wipeTexture.get().glTexture;
    }

    setupUniforms (controller: Phaser.Filters.Controller, _drawingContext: Phaser.Renderer.WebGL.DrawingContext): void
    {
        const programManager = this.programManager;

        programManager.setUniform('uMainSampler2', 1);
        programManager.setUniform('uProgress_WipeWidth_Direction_Axis', [ controller.progress, controller.wipeWidth, controller.direction, controller.axis ]);
        programManager.setUniform('uReveal', controller.reveal);
    }
}
