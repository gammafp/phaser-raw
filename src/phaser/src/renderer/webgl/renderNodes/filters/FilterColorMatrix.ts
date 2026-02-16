/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { BaseFilterShader } from './BaseFilterShader';
import { FilterColorMatrixFrag } from '../../shaders/FilterColorMatrix-frag';

/**
 * @classdesc
 * This RenderNode renders the Color Matrix filter effect.
 * See {@link Phaser.Filters.ColorMatrix}.
 *
 * @class FilterColorMatrix
 * @extends Phaser.Renderer.WebGL.RenderNodes.BaseFilterShader
 * @memberof Phaser.Renderer.WebGL.RenderNodes
 * @constructor
 * @since 4.0.0
 * @param {Phaser.Renderer.WebGL.RenderNodes.RenderNodeManager} manager - The manager that owns this RenderNode.
 */
export class FilterColorMatrix extends BaseFilterShader {

    constructor (manager: Phaser.Renderer.WebGL.RenderNodes.RenderNodeManager)
    {
        super('FilterColorMatrix', manager, null, FilterColorMatrixFrag);
    }

    setupUniforms (controller: Phaser.Filters.Controller, drawingContext: Phaser.Renderer.WebGL.DrawingContext): void
    {
        const programManager = this.programManager;

        programManager.setUniform('uColorMatrix[0]', controller.colorMatrix.getData());
        programManager.setUniform('uAlpha', controller.colorMatrix.alpha);
    }
}
