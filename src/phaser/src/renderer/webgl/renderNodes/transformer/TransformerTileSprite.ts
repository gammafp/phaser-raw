/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { Merge } from '../../../../utils/object/Merge';
import { TransformerImage } from './TransformerImage';

/**
 * @classdesc
 * A RenderNode which handles transformation data for a single TileSprite GameObject.
 *
 * @class TransformerTileSprite
 * @memberof Phaser.Renderer.WebGL.RenderNodes
 * @constructor
 * @since 4.0.0
 * @extends Phaser.Renderer.WebGL.RenderNodes.TransformerImage
 * @param {Phaser.Renderer.WebGL.RenderNodes.RenderNodeManager} manager - The manager that owns this RenderNode.
 * @param {object} [config] - The configuration object for this RenderNode.
 */
export class TransformerTileSprite extends TransformerImage {

    static defaultConfig = {
        name: 'TransformerTileSprite',
        role: 'Transformer'
    };

    constructor(manager: any, config?: any)
    {
        config = Merge(config || {}, TransformerTileSprite.defaultConfig);
        super(manager, config);
    }

    run(drawingContext: any, gameObject: any, texturerNode?: any, parentMatrix?: any, element?: any): void
    {
        this.onRunBegin(drawingContext);

        const width = gameObject.width;
        const height = gameObject.height;

        const displayOriginX = gameObject.displayOriginX;
        const displayOriginY = gameObject.displayOriginY;

        let x = -displayOriginX;
        let y = -displayOriginY;

        let flipX = 1;
        let flipY = 1;

        if (gameObject.flipX)
        {
            x += (-width + (displayOriginX * 2));

            flipX = -1;
        }

        if (gameObject.flipY)
        {
            y += (-height + (displayOriginY * 2));

            flipY = -1;
        }

        const gx = gameObject.x;
        const gy = gameObject.y;

        const camera = drawingContext.camera;
        const calcMatrix = this._calcMatrix;
        const spriteMatrix = this._spriteMatrix;

        calcMatrix.copyWithScrollFactorFrom(
            camera.getViewMatrix(!drawingContext.useCanvas),
            camera.scrollX, camera.scrollY,
            gameObject.scrollFactorX, gameObject.scrollFactorY
        );

        if (parentMatrix)
        {
            calcMatrix.multiply(parentMatrix);
        }

        spriteMatrix.applyITRS(
            gx, gy,
            gameObject.rotation,
            gameObject.scaleX * flipX, gameObject.scaleY * flipY
        );

        calcMatrix.multiply(spriteMatrix);

        calcMatrix.setQuad(
            x,
            y,
            x + width,
            y + height,
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
