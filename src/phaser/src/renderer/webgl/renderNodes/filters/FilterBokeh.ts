/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { BaseFilterShader } from './BaseFilterShader';
import { FilterBokehFrag } from '../../shaders/FilterBokeh-frag';

/**
 * @classdesc
 * This RenderNode renders the Bokeh filter effect.
 * See {@link Phaser.Filters.Bokeh}.
 *
 * @class FilterBokeh
 * @extends Phaser.Renderer.WebGL.RenderNodes.BaseFilterShader
 * @memberof Phaser.Renderer.WebGL.RenderNodes
 * @constructor
 * @since 4.0.0
 * @param {Phaser.Renderer.WebGL.RenderNodes.RenderNodeManager} manager - The manager that owns this RenderNode.
 */
export class FilterBokeh extends BaseFilterShader {

    constructor (manager: Phaser.Renderer.WebGL.RenderNodes.RenderNodeManager)
    {
        super('FilterBokeh', manager, null, FilterBokehFrag);
    }

    setupUniforms (controller: Phaser.Filters.Controller, drawingContext: Phaser.Renderer.WebGL.DrawingContext): void
    {
        const programManager = this.programManager;

        programManager.setUniform('radius', controller.radius);
        programManager.setUniform('amount', controller.amount);
        programManager.setUniform('contrast', controller.contrast);
        programManager.setUniform('strength', controller.strength);
        programManager.setUniform('blur', [ controller.blurX, controller.blurY ]);
        programManager.setUniform('isTiltShift', controller.isTiltShift);
        programManager.setUniform('resolution', [ drawingContext.width, drawingContext.height ]);
    }
}
