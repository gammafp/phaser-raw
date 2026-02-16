/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { Merge } from '../../../../utils/object/Merge';
import { SubmitterQuad } from './SubmitterQuad';

/**
 * @classdesc
 * The SubmitterTile RenderNode submits data for tiles.
 *
 * @class SubmitterTile
 * @extends Phaser.Renderer.WebGL.RenderNodes.SubmitterQuad
 * @memberof Phaser.Renderer.WebGL.RenderNodes
 * @constructor
 * @since 4.0.0
 * @param {Phaser.Renderer.WebGL.WebGLRenderer} manager - The WebGLRenderer that owns this Submitter.
 * @param {Phaser.Types.Renderer.WebGL.RenderNodes.SubmitterQuadConfig} [config] - The configuration object for this Submitter. This is a SubmitterQuad configuration object with the `name` defaulting to `SubmitterTile`.
 */
export class SubmitterTile extends SubmitterQuad {

    static defaultConfig = {
        name: 'SubmitterTile',
        role: 'Submitter',
        batchHandler: 'BatchHandler'
    };

    constructor(manager: any, config?: any)
    {
        config = Merge(config || {}, SubmitterTile.defaultConfig);
        super(manager, config);

        this._renderOptions.clampFrame = true;
    }

    run(
        drawingContext: any,
        gameObject: any,
        parentMatrix: any,
        element: any,
        texturerNode: any,
        transformerNode: any,
        tinterNode?: any,
        normalMap?: any,
        normalMapRotation?: number
    ): void
    {
        this.onRunBegin(drawingContext);

        let tintEffect: number;
        let tintTopLeft: number;
        let tintBottomLeft: number;
        let tintTopRight: number;
        let tintBottomRight: number;

        if (texturerNode.run)
        {
            texturerNode.run(drawingContext, gameObject, element);
        }
        if (transformerNode.run)
        {
            transformerNode.run(drawingContext, gameObject, texturerNode, parentMatrix, element);
        }
        if (tinterNode)
        {
            if (tinterNode.run)
            {
                tinterNode.run(drawingContext, gameObject, element);
            }
            tintEffect = tinterNode.tintEffect;
            tintTopLeft = tinterNode.tintTopLeft;
            tintBottomLeft = tinterNode.tintBottomLeft;
            tintTopRight = tinterNode.tintTopRight;
            tintBottomRight = tinterNode.tintBottomRight;
        }
        else
        {
            tintEffect = gameObject.tintFill;
            const tint = 0xffffffff;
            tintTopLeft = tint;
            tintBottomLeft = tint;
            tintTopRight = tint;
            tintBottomRight = tint;
        }

        const frame = texturerNode.frame;
        const quad = transformerNode.quad;
        const uvSource = texturerNode.uvSource;
        const u0 = uvSource.u0;
        const v0 = uvSource.v0;
        const u1 = uvSource.u1;
        const v1 = uvSource.v1;

        this.setRenderOptions(gameObject, normalMap, normalMapRotation);

        (
            gameObject.customRenderNodes[this.batchHandler] ||
            gameObject.defaultRenderNodes[this.batchHandler]
        ).batch(
            drawingContext,
            frame.source.glTexture,
            quad[0], quad[1],
            quad[2], quad[3],
            quad[6], quad[7],
            quad[4], quad[5],
            u0, v0, u1 - u0, v1 - v0,
            tintEffect,
            tintTopLeft, tintBottomLeft, tintTopRight, tintBottomRight,
            this._renderOptions,
            u0, v1,
            u0, v0,
            u1, v1,
            u1, v0
        );

        this.onRunEnd(drawingContext);
    }
}
