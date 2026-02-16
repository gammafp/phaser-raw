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
 * A RenderNode which handles transformation data for a single Image-like GameObject.
 *
 * @class TransformerImage
 * @memberof Phaser.Renderer.WebGL.RenderNodes
 * @constructor
 * @since 4.0.0
 * @extends Phaser.Renderer.WebGL.RenderNodes.RenderNode
 * @param {Phaser.Renderer.WebGL.RenderNodes.RenderNodeManager} manager - The manager that owns this RenderNode.
 * @param {object} [config] - The configuration object for this RenderNode.
 */
export class TransformerImage extends RenderNode {

    quad: Float32Array;
    _spriteMatrix: TransformMatrix;
    _calcMatrix: TransformMatrix;

    static defaultConfig = {
        name: 'TransformerImage',
        role: 'Transformer'
    };

    constructor(manager: any, config?: any)
    {
        config = Merge(config || {}, TransformerImage.defaultConfig);

        super(config.name, manager);

        this.quad = new Float32Array(8);
        this._spriteMatrix = new TransformMatrix();
        this._calcMatrix = new TransformMatrix();
    }

    run(drawingContext: any, gameObject: any, texturerNode: any, parentMatrix?: any, element?: any): void
    {
        this.onRunBegin(drawingContext);

        const frame = texturerNode.frame;
        const uvSource = texturerNode.uvSource;

        let frameX = uvSource.x;
        let frameY = uvSource.y;

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

        const camera = drawingContext.camera;
        const spriteMatrix = this._spriteMatrix;
        const calcMatrix = this._calcMatrix.copyWithScrollFactorFrom(
            camera.getViewMatrix(!drawingContext.useCanvas),
            camera.scrollX, camera.scrollY,
            gameObject.scrollFactorX, gameObject.scrollFactorY
        );

        if (parentMatrix)
        {
            calcMatrix.multiply(parentMatrix);
        }

        spriteMatrix.applyITRS(
            gameObject.x, gameObject.y,
            gameObject.rotation,
            gameObject.scaleX * flipX, gameObject.scaleY * flipY
        );

        calcMatrix.multiply(spriteMatrix);

        calcMatrix.setQuad(
            x,
            y,
            x + texturerNode.frameWidth,
            y + texturerNode.frameHeight,
            this.quad
        );

        const cmm = calcMatrix.matrix;
        const onlyTranslate = cmm[0] === 1 && cmm[1] === 0 && cmm[2] === 0 && cmm[3] === 1;

        if (gameObject.willRoundVertices(camera, onlyTranslate))
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
