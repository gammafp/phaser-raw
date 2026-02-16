/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { TransformMatrix } from '../../../../gameobjects/components/TransformMatrix';
import { Merge } from '../../../../utils/object/Merge';
import { RenderNode } from '../RenderNode';

/**
 * @classdesc
 * A RenderNode which handles transformation data for a single Stamp-like GameObject.
 *
 * This is a modified version of the TransformerImage class.
 * It skips the camera matrix.
 *
 * @class TransformerStamp
 * @memberof Phaser.Renderer.WebGL.RenderNodes
 * @constructor
 * @since 4.0.0
 * @extends Phaser.Renderer.WebGL.RenderNodes.RenderNode
 * @param {Phaser.Renderer.WebGL.RenderNodes.RenderNodeManager} manager - The manager that owns this RenderNode.
 * @param {object} [config] - The configuration object for this RenderNode.
 */
export class TransformerStamp extends RenderNode {

    quad: Float32Array;
    _spriteMatrix: TransformMatrix;
    onlyTranslate: boolean;

    static defaultConfig = {
        name: 'TransformerStamp',
        role: 'Transformer'
    };

    constructor(manager: any, config?: any)
    {
        config = Merge(config || {}, TransformerStamp.defaultConfig);

        super(config.name, manager);

        this._spriteMatrix = new TransformMatrix();
        this.quad = this._spriteMatrix.quad;
    }

    run(drawingContext: any, gameObject: any, texturerNode: any, parentMatrix?: any, element?: any): void
    {
        this.onRunBegin(drawingContext);

        const frame = texturerNode.frame;
        const uvSource = texturerNode.uvSource;

        const frameX = uvSource.x;
        const frameY = uvSource.y;

        const displayOriginX = gameObject.displayOriginX;
        const displayOriginY = gameObject.displayOriginY;

        let x = -displayOriginX + frameX;
        let y = -displayOriginY + frameY;

        const customPivot = frame.customPivot;

        let flipX = 1;
        let flipY = 1;

        if (gameObject.flipX)
        {
            if (!customPivot)
            {
                x += (-frame.realWidth + (displayOriginX * 2));
            }

            flipX = -1;
        }

        if (gameObject.flipY)
        {
            if (!customPivot)
            {
                y += (-frame.realHeight + (displayOriginY * 2));
            }

            flipY = -1;
        }

        const gx = gameObject.x;
        const gy = gameObject.y;

        const spriteMatrix = this._spriteMatrix;

        spriteMatrix.applyITRS(gx, gy, gameObject.rotation, gameObject.scaleX * flipX, gameObject.scaleY * flipY);

        const m = spriteMatrix.matrix;
        this.onlyTranslate = m[0] === 1 && m[1] === 0 && m[2] === 0 && m[3] === 1;

        spriteMatrix.setQuad(
            x,
            y,
            x + texturerNode.frameWidth,
            y + texturerNode.frameHeight
        );

        const cmm = spriteMatrix.matrix;
        const onlyTranslate = cmm[0] === 1 && cmm[1] === 0 && cmm[2] === 0 && cmm[3] === 1;

        if (gameObject.willRoundVertices(drawingContext.camera, onlyTranslate))
        {
            const quad = this.quad;
            quad[0] = Math.round(quad[0]);
            quad[1] = Math.round(quad[1]);
            quad[2] = Math.round(quad[2]);
            quad[3] = Math.round(quad[3]);
            quad[4] = Math.round(quad[4]);
            quad[5] = Math.round(quad[5]);
            quad[6] = Math.round(quad[6]);
            quad[7] = Math.round(quad[7]);
        }

        this.onRunEnd(drawingContext);
    }
}
