/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { Rectangle } from '../../../../geom/rectangle/Rectangle';
import { BlendModes } from '../../../BlendModes';
import { BaseFilter } from './BaseFilter';

/**
 * @classdesc
 * This RenderNode runs a series of filters in parallel.
 * See {@link Phaser.Filters.ParallelFilters}.
 *
 * This filter redirects to other RenderNodes during operation.
 *
 * @class FilterParallelFilters
 * @extends Phaser.Renderer.WebGL.RenderNodes.BaseFilter
 * @memberof Phaser.Renderer.WebGL.RenderNodes
 * @constructor
 * @since 4.0.0
 * @param {Phaser.Renderer.WebGL.RenderNodes.RenderNodeManager} manager - The manager that owns this RenderNode.
 */
export class FilterParallelFilters extends BaseFilter {

    constructor (manager: Phaser.Renderer.WebGL.RenderNodes.RenderNodeManager)
    {
        super('FilterParallelFilters', manager);
    }

    run (controller: Phaser.Filters.Controller, inputDrawingContext: Phaser.Renderer.WebGL.DrawingContext, outputDrawingContext?: Phaser.Renderer.WebGL.DrawingContext, padding?: Phaser.Geom.Rectangle): Phaser.Renderer.WebGL.DrawingContext
    {
        this.onRunBegin(outputDrawingContext);

        // Prevent the input from being sent back to its pool.
        inputDrawingContext.lock(this);

        const bottomFilters = controller.bottom.getActive();
        const topFilters = controller.top.getActive();
        let initialPadding = padding || controller.getPadding();

        if (bottomFilters.length + topFilters.length > 0)
        {
            let bottomContext = inputDrawingContext;
            let topContext = inputDrawingContext;

            // Process bottom filters.

            if (bottomFilters.length > 0)
            {
                padding = initialPadding;

                for (let i = 0; i < bottomFilters.length; i++)
                {
                    const childController = bottomFilters[i];
                    let filter = this.manager.getNode(childController.renderNode);

                    bottomContext = filter.run(
                        childController,
                        bottomContext,
                        null,
                        padding
                    );

                    // Don't apply more padding after the first filter.
                    if (i === 0 && i < bottomFilters.length - 1)
                    {
                        padding = new Rectangle();
                    }
                }
            }

            // Process top filters.

            if (topFilters.length > 0)
            {
                padding = initialPadding;

                for (let i = 0; i < topFilters.length; i++)
                {
                    const childController = topFilters[i];
                    const filter = this.manager.getNode(childController.renderNode);

                    topContext = filter.run(
                        childController,
                        topContext,
                        null,
                        padding
                    );

                    // Don't apply more padding after the first filter.
                    if (i === 0 && i < topFilters.length - 1)
                    {
                        padding = new Rectangle();
                    }
                }
            }

            inputDrawingContext.unlock(this);

            // Check whether the input is no longer in use,
            // and won't be released automatically below.
            // If it is the bottom context, it will be released by the Blend.
            // If it is the top context, it will be released directly.
            if (
                inputDrawingContext !== bottomContext &&
                inputDrawingContext !== topContext
            )
            {
                inputDrawingContext.release();
            }

            // Blend the top and bottom filters.
            const blendController = controller.blend;
            blendController.glTexture = topContext.texture;
            const filter = this.manager.getNode('FilterBlend');
            outputDrawingContext = this.manager.getNode('FilterBlend').run(
                controller.blend,
                bottomContext,
                outputDrawingContext,
                padding // This will be 0 because at least one filter has already been applied.
            );

            // Whether top context is new or the input, it now needs to be released.
            topContext.release();
        }
        else
        {
            // No filters to run.
            // Copy the input to the output.
            const filter = this.manager.getNode('FilterBlend');
            const proxyController = {
                blendMode: BlendModes.COPY,
                glTexture: inputDrawingContext.texture,
                amount: 1,
                color: [ 1, 1, 1, 1 ]
            };
            inputDrawingContext.unlock(this);
            outputDrawingContext = this.manager.getNode('FilterBlend').run(
                proxyController,
                inputDrawingContext,
                outputDrawingContext,
                initialPadding
            );
        }

        this.onRunEnd(outputDrawingContext);

        return outputDrawingContext;
    }
}
