/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { Merge } from '../../../../utils/object/Merge';
import { Utils } from '../../Utils';
import { SubmitterQuad } from './SubmitterQuad';

const getTint = Utils.getTintAppendFloatAlpha;

/**
 * @classdesc
 * The SubmitterTileSprite RenderNode submits data for rendering a single TileSprite GameObject.
 * It uses a BatchHandler to render the TileSprite as part of a batch.
 *
 * This node receives the drawing context, game object, and parent matrix.
 * It also receives the texturer, tinter, and transformer nodes
 * from the node that invoked it.
 * This allows the behavior to be configured by setting the appropriate nodes
 * on the GameObject for individual tweaks, or on the invoking Renderer node
 * for global changes.
 *
 * @class SubmitterTileSprite
 * @memberof Phaser.Renderer.WebGL.RenderNodes
 * @constructor
 * @since 4.0.0
 * @extends Phaser.Renderer.WebGL.RenderNodes.SubmitterQuad
 * @param {Phaser.Renderer.WebGL.RenderNodes.RenderNodeManager} manager - The manager that owns this RenderNode.
 * @param {Phaser.Types.Renderer.WebGL.RenderNodes.SubmitterQuadConfig} [config] - The configuration object for this Submitter. This is a SubmitterQuad configuration object with the `name` defaulting to `SubmitterTileSprite`.
 */
export class SubmitterTileSprite extends SubmitterQuad {

    static defaultConfig = {
        name: 'SubmitterTileSprite',
        role: 'Submitter',
        batchHandler: 'BatchHandler'
    };

    constructor(manager: any, config?: any)
    {
        config = Merge(config || {}, SubmitterTileSprite.defaultConfig);
        super(manager, config);

        this._renderOptions.wrapFrame = true;
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
            tintTopLeft = getTint(gameObject.tintTopLeft, gameObject._alphaTL);
            tintBottomLeft = getTint(gameObject.tintBottomLeft, gameObject._alphaBL);
            tintTopRight = getTint(gameObject.tintTopRight, gameObject._alphaTR);
            tintBottomRight = getTint(gameObject.tintBottomRight, gameObject._alphaBR);
        }

        const frame = texturerNode.frame;
        const quad = transformerNode.quad;
        const uvSource = frame;
        const u0 = uvSource.u0;
        const v0 = uvSource.v0;
        const u1 = uvSource.u1;
        const v1 = uvSource.v1;
        const uvQuad = texturerNode.uvMatrix.quad;

        this.setRenderOptions(gameObject, normalMap, normalMapRotation);

        this._lightingOptions.normalMapRotation += gameObject.tileRotation;

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
            uvQuad[0], uvQuad[1],
            uvQuad[2], uvQuad[3],
            uvQuad[6], uvQuad[7],
            uvQuad[4], uvQuad[5]
        );

        this.onRunEnd(drawingContext);
    }
}
