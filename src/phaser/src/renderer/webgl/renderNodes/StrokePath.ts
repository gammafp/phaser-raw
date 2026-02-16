/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { RenderNode } from './RenderNode';

/**
 * @classdesc
 * A RenderNode which renders a stroke path consisting of several line segments,
 * potentially closed at the end.
 *
 * @class StrokePath
 * @memberof Phaser.Renderer.WebGL.RenderNodes
 * @constructor
 * @since 4.0.0
 * @extends Phaser.Renderer.WebGL.RenderNodes.RenderNode
 * @param {Phaser.Renderer.WebGL.RenderNodes.RenderNodeManager} manager - The manager that owns this RenderNode.
 */
export class StrokePath extends RenderNode {

    drawLineNode: any;

    constructor(manager: any)
    {
        super('StrokePath', manager);

        this.drawLineNode = this.manager.getNode('DrawLine');
    }

    run(
        drawingContext: any,
        submitterNode: any,
        path: any[],
        lineWidth: number,
        open: boolean,
        currentMatrix: any,
        tintTL: number,
        tintTR: number,
        tintBL: number,
        tintBR: number,
        detail?: number,
        lighting?: boolean
    ): void
    {
        this.onRunBegin(drawingContext);

        const drawLineNode = this.drawLineNode;

        const pathLength = path.length - 1;

        let point: any;
        let nextPoint: any;

        let connect = false;
        let connectLoop = false;

        if (lineWidth > 2 && pathLength > 1)
        {
            connect = true;
            if (!open)
            {
                connectLoop = true;
            }
        }

        const indices: number[] = [];
        let indexOffset = 0;

        const vertices: number[] = [];
        let vertexOffset = 0;
        let vertexCount: number;

        const colors: number[] = [];
        let colorOffset = 0;

        let dx: number;
        let dy: number;
        let tdx: number;
        let tdy: number;
        const detailSquared = (detail || 0) * (detail || 0);

        let first: boolean;
        let last: boolean;
        let iterate: number;

        for (let i = 0; i < pathLength; i += iterate)
        {
            first = i === 0;
            last = i === pathLength - 1;
            iterate = 1;

            point = path[i];
            nextPoint = path[i + iterate];

            if (detailSquared && !last)
            {
                dx = nextPoint.x - point.x;
                dy = nextPoint.y - point.y;
                tdx = currentMatrix.getX(dx, dy) - currentMatrix.tx;
                tdy = currentMatrix.getY(dx, dy) - currentMatrix.ty;
                while (
                    i + iterate < pathLength - 1 &&
                    tdx * tdx + tdy * tdy <= detailSquared
                )
                {
                    iterate++;
                    nextPoint = path[i + iterate];
                    dx = nextPoint.x - point.x;
                    dy = nextPoint.y - point.y;
                    tdx = currentMatrix.getX(dx, dy) - currentMatrix.tx;
                    tdy = currentMatrix.getY(dx, dy) - currentMatrix.ty;
                }
            }

            drawLineNode.run(
                drawingContext,
                currentMatrix,
                point.x,
                point.y,
                nextPoint.x,
                nextPoint.y,
                point.width / 2,
                nextPoint.width / 2,
                vertices
            );

            vertexOffset += 8;

            vertexCount = vertexOffset / 2;

            colors[colorOffset++] = tintTL;
            colors[colorOffset++] = tintBL;
            colors[colorOffset++] = tintBR;
            colors[colorOffset++] = tintTR;

            indices[indexOffset++] = vertexCount - 4;
            indices[indexOffset++] = vertexCount - 3;
            indices[indexOffset++] = vertexCount - 2;
            indices[indexOffset++] = vertexCount - 2;
            indices[indexOffset++] = vertexCount - 1;
            indices[indexOffset++] = vertexCount - 4;

            if (connect && !first)
            {
                indices[indexOffset++] = vertexCount - 4;
                indices[indexOffset++] = vertexCount - 3;
                indices[indexOffset++] = vertexCount - 6;
                indices[indexOffset++] = vertexCount - 6;
                indices[indexOffset++] = vertexCount - 5;
                indices[indexOffset++] = vertexCount - 4;

                if (connectLoop && last)
                {
                    indices[indexOffset++] = vertexCount - 2;
                    indices[indexOffset++] = vertexCount - 1;
                    indices[indexOffset++] = 0;
                    indices[indexOffset++] = 0;
                    indices[indexOffset++] = 1;
                    indices[indexOffset++] = vertexCount - 2;
                }
            }
        }

        submitterNode.batch(drawingContext, indices, vertices, colors, lighting);

        this.onRunEnd(drawingContext);
    }
}
