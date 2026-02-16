/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { BaseFilter } from './BaseFilter';

/**
 * @classdesc
 * This RenderNode handles the Sampler filter.
 *
 * The Sampler filter is a special RenderNode that samples the texture
 * being passed in, without any modifications.
 *
 * @class FilterSampler
 * @memberof Phaser.Renderer.WebGL.RenderNodes
 * @extends Phaser.Renderer.WebGL.RenderNodes.BaseFilter
 * @constructor
 * @since 4.0.0
 * @param {Phaser.Renderer.WebGL.RenderNodes.RenderNodeManager} manager - The manager that owns this RenderNode.
 */
export class FilterSampler extends BaseFilter {

    constructor (manager: Phaser.Renderer.WebGL.RenderNodes.RenderNodeManager)
    {
        super('FilterSampler', manager);
    }

    run (controller: Phaser.Filters.Controller, inputDrawingContext: Phaser.Renderer.WebGL.DrawingContext, outputDrawingContext?: Phaser.Renderer.WebGL.DrawingContext, padding?: Phaser.Geom.Rectangle): Phaser.Renderer.WebGL.DrawingContext
    {
        this.onRunBegin(inputDrawingContext);

        const renderer = this.manager.renderer;
        let x = 0;
        let y = 0;
        let width = 1;
        let height = 1;
        const bufferWidth = inputDrawingContext.width;
        const bufferHeight = inputDrawingContext.height;
        let getPixel = false;

        if (controller.region)
        {
            x = controller.region.x;
            y = controller.region.y;

            if (controller.region.width !== undefined)
            {
                // Region is a Rectangle.
                width = controller.region.width;
                height = controller.region.height;
            }
            else
            {
                // Region is a point.
                getPixel = true;
            }
        }
        else
        {
            // Sample the whole buffer.
            width = bufferWidth;
            height = bufferHeight;
        }

        renderer.snapshotFramebuffer(
            inputDrawingContext.framebuffer,
            bufferWidth, bufferHeight,
            controller.callback,
            getPixel,
            x, y,
            width, height
        );

        this.onRunEnd(inputDrawingContext);

        return inputDrawingContext;
    }
}
