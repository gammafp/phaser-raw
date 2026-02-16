/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { RenderNode } from './RenderNode';

/**
 * @classdesc
 * A RenderNode which fills a camera with a color.
 *
 * @class FillCamera
 * @memberof Phaser.Renderer.WebGL.RenderNodes
 * @constructor
 * @since 4.0.0
 * @extends Phaser.Renderer.WebGL.RenderNodes.RenderNode
 * @param {Phaser.Renderer.WebGL.RenderNodes.RenderNodeManager} manager - The manager that owns this RenderNode.
 */
export class FillCamera extends RenderNode {

    fillRectNode: any;

    constructor(manager: any)
    {
        super('FillCamera', manager);

        this.fillRectNode = this.manager.getNode('FillRect');
    }

    run(drawingContext: any, color: number, isFramebufferCamera?: boolean): void
    {
        this.onRunBegin(drawingContext);

        const camera = drawingContext.camera;
        const cx = isFramebufferCamera ? 0 : camera.x;
        const cy = isFramebufferCamera ? 0 : camera.y;
        const cw = camera.width;
        const ch = camera.height;

        this.fillRectNode.run(drawingContext, null, null, cx, cy, cw, ch, color, color, color, color, false);

        this.onRunEnd(drawingContext);
    }
}
