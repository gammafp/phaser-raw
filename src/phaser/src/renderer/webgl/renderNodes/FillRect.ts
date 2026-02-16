/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { TransformMatrix } from '../../../gameobjects/components/TransformMatrix';

import { RenderNode } from './RenderNode';

/**
 * @classdesc
 * A RenderNode which renders a filled rectangle.
 * This is useful for full-screen effects and rectangle geometry.
 *
 * @class FillRect
 * @memberof Phaser.Renderer.WebGL.RenderNodes
 * @constructor
 * @since 4.0.0
 * @extends Phaser.Renderer.WebGL.RenderNodes.RenderNode
 * @param {Phaser.Renderer.WebGL.RenderNodes.RenderNodeManager} manager - The manager that owns this RenderNode.
 */
export class FillRect extends RenderNode {

    _batchHandlerDefault: any;
    _identityMatrix: TransformMatrix;
    _indexedTriangles: number[];

    constructor(manager: any)
    {
        super('FillRect', manager);

        this._batchHandlerDefault = manager.getNode('BatchHandlerTriFlat');

        this._identityMatrix = new TransformMatrix();

        this._indexedTriangles = [
            0, 1, 2,
            2, 3, 0
        ];
    }

    run(
        drawingContext: any,
        currentMatrix: any,
        submitterNode: any,
        x: number,
        y: number,
        width: number,
        height: number,
        tintTL: number,
        tintTR: number,
        tintBL: number,
        tintBR: number,
        lighting?: boolean
    ): void
    {
        this.onRunBegin(drawingContext);

        if (!currentMatrix)
        {
            currentMatrix = this._identityMatrix;
        }

        if (!submitterNode)
        {
            submitterNode = this._batchHandlerDefault;
        }

        const quad = currentMatrix.setQuad(x, y, x + width, y + height);

        submitterNode.batch(
            drawingContext,
            this._indexedTriangles,
            quad,
            [
                tintTL, tintBL, tintBR, tintTR
            ],
            lighting
        );

        this.onRunEnd(drawingContext);
    }
}
