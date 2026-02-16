/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { RenderNode } from './RenderNode';

/**
 * @classdesc
 * A RenderNode which computes the geometry of a line segment.
 *
 * @class DrawLine
 * @memberof Phaser.Renderer.WebGL.RenderNodes
 * @constructor
 * @since 4.0.0
 * @extends Phaser.Renderer.WebGL.RenderNodes.RenderNode
 * @param {Phaser.Renderer.WebGL.RenderNodes.RenderNodeManager} manager - The manager that owns this RenderNode.
 */
export class DrawLine extends RenderNode {

    constructor(manager: any)
    {
        super('DrawLine', manager);
    }

    run(
        drawingContext: any,
        currentMatrix: any,
        ax: number,
        ay: number,
        bx: number,
        by: number,
        aLineWidth: number,
        bLineWidth: number,
        vertices: number[]
    ): void
    {
        this.onRunBegin(drawingContext);

        const dx = bx - ax;
        const dy = by - ay;

        const len = Math.sqrt(dx * dx + dy * dy);

        const al0 = aLineWidth * (by - ay) / len;
        const al1 = aLineWidth * (ax - bx) / len;
        const bl0 = bLineWidth * (by - ay) / len;
        const bl1 = bLineWidth * (ax - bx) / len;

        const lx0 = bx - bl0;
        const ly0 = by - bl1;
        const lx1 = ax - al0;
        const ly1 = ay - al1;
        const lx2 = bx + bl0;
        const ly2 = by + bl1;
        const lx3 = ax + al0;
        const ly3 = ay + al1;

        const offset = vertices.length;

        if (currentMatrix)
        {
            vertices[offset + 0] = currentMatrix.getX(lx3, ly3);
            vertices[offset + 1] = currentMatrix.getY(lx3, ly3);
            vertices[offset + 2] = currentMatrix.getX(lx1, ly1);
            vertices[offset + 3] = currentMatrix.getY(lx1, ly1);
            vertices[offset + 4] = currentMatrix.getX(lx0, ly0);
            vertices[offset + 5] = currentMatrix.getY(lx0, ly0);
            vertices[offset + 6] = currentMatrix.getX(lx2, ly2);
            vertices[offset + 7] = currentMatrix.getY(lx2, ly2);
        }
        else
        {
            vertices[offset + 0] = lx3;
            vertices[offset + 1] = ly3;
            vertices[offset + 2] = lx1;
            vertices[offset + 3] = ly1;
            vertices[offset + 4] = lx0;
            vertices[offset + 5] = ly0;
            vertices[offset + 6] = lx2;
            vertices[offset + 7] = ly2;
        }

        this.onRunEnd(drawingContext);
    }
}
