/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { BaseFilterShader } from './BaseFilterShader';
import { FilterVignetteFrag } from '../../shaders/FilterVignette-frag';

/**
 * @classdesc
 * This RenderNode renders the Vignette filter effect.
 * See {@link Phaser.Filters.Vignette}.
 *
 * @class FilterVignette
 * @extends Phaser.Renderer.WebGL.RenderNodes.BaseFilterShader
 * @memberof Phaser.Renderer.WebGL.RenderNodes
 * @constructor
 * @since 4.0.0
 * @param {Phaser.Renderer.WebGL.RenderNodes.RenderNodeManager} manager - The manager that owns this RenderNode.
 */
export class FilterVignette extends BaseFilterShader {

    constructor (manager: Phaser.Renderer.WebGL.RenderNodes.RenderNodeManager)
    {
        super('FilterVignette', manager, null, FilterVignetteFrag);
    }

    setupUniforms (controller: Phaser.Filters.Controller, _drawingContext: Phaser.Renderer.WebGL.DrawingContext): void
    {
        const programManager = this.programManager;

        const c = controller.color;

        programManager.setUniform('uRadius', controller.radius);
        programManager.setUniform('uStrength', controller.strength);
        programManager.setUniform('uPosition', [ controller.x, controller.y ]);
        programManager.setUniform('uColor', [ c.redGL, c.greenGL, c.blueGL, c.alphaGL ]);
        programManager.setUniform('uBlendMode', controller.blendMode);
    }
}
