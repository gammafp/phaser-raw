/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { RenderNode } from './RenderNode';

/**
 * @classdesc
 * A RenderNode which renders a filled triangle.
 *
 * @class FillTri
 * @memberof Phaser.Renderer.WebGL.RenderNodes
 * @constructor
 * @since 4.0.0
 * @extends Phaser.Renderer.WebGL.RenderNodes.RenderNode
 * @param {Phaser.Renderer.WebGL.RenderNodes.RenderNodeManager} manager - The manager that owns this RenderNode.
 */
export class FillTri extends RenderNode {

    _indexedTriangles: number[];

    constructor(manager: any)
    {
        super('FillTri', manager);

        this._indexedTriangles = [
            0, 1, 2
        ];
    }

    run(
        drawingContext: any,
        currentMatrix: any,
        submitterNode: any,
        xA: number,
        yA: number,
        xB: number,
        yB: number,
        xC: number,
        yC: number,
        tintA: number,
        tintB: number,
        tintC: number,
        lighting?: boolean
    ): void
    {
        this.onRunBegin(drawingContext);

        if (currentMatrix)
        {
            submitterNode.batch(
                drawingContext,
                this._indexedTriangles,
                [
                    currentMatrix.getX(xA, yA),
                    currentMatrix.getY(xA, yA),
                    currentMatrix.getX(xB, yB),
                    currentMatrix.getY(xB, yB),
                    currentMatrix.getX(xC, yC),
                    currentMatrix.getY(xC, yC)
                ],
                [
                    tintA,
                    tintB,
                    tintC
                ],
                lighting
            );
        }
        else
        {
            submitterNode.batch(
                drawingContext,
                this._indexedTriangles,
                [
                    xA,
                    yA,
                    xB,
                    yB,
                    xC,
                    yC
                ],
                [
                    tintA,
                    tintB,
                    tintC
                ],
                lighting
            );
        }

        this.onRunEnd(drawingContext);
    }
}
