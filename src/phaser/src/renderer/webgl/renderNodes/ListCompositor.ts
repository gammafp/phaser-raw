/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { PHASER_CONST as CONST } from '../../../const';
import { RenderNode } from './RenderNode';

/**
 * Render a list of Game Objects.
 *
 * @class ListCompositor
 * @memberof Phaser.Renderer.WebGL.RenderNodes
 * @constructor
 * @since 4.0.0
 * @extends Phaser.Renderer.WebGL.RenderNodes.RenderNode
 * @param {Phaser.Renderer.WebGL.RenderNodes.RenderNodeManager} manager - The manager that owns this RenderNode.
 */
export class ListCompositor extends RenderNode {

    constructor(manager: any)
    {
        super('ListCompositor', manager);
    }

    run(
        displayContext: any,
        children: any[],
        parentTransformMatrix?: any,
        renderStep?: number
    ): void
    {
        this.onRunBegin(displayContext);

        let currentContext = displayContext;
        const baseBlendMode = displayContext.blendMode;
        let currentBlendMode = baseBlendMode;
        const renderer = this.manager.renderer;

        for (let i = 0; i < children.length; i++)
        {
            const child = children[i];

            if (
                child.blendMode !== currentBlendMode &&
                child.blendMode !== CONST.BlendModes.SKIP_CHECK
            )
            {
                if (currentContext !== displayContext)
                {
                    currentContext.release();
                }

                currentBlendMode = child.blendMode;

                if (currentBlendMode === baseBlendMode)
                {
                    currentContext = displayContext;
                }
                else
                {
                    currentContext = displayContext.getClone();
                    currentContext.setBlendMode(currentBlendMode);
                    currentContext.use();
                }
            }

            child.renderWebGLStep(renderer, child, currentContext, parentTransformMatrix, renderStep, children, i);
        }

        if (currentContext !== displayContext)
        {
            currentContext.release();
        }

        this.onRunEnd(displayContext);
    }
}
