/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { Merge } from '../../../../utils/object/Merge';
import { TransformerImage } from './TransformerImage';

/**
 * @classdesc
 * A RenderNode which handles transformation data for a single Tile within a TilemapLayer.
 *
 * @class TransformerTile
 * @memberof Phaser.Renderer.WebGL.RenderNodes
 * @constructor
 * @since 4.0.0
 * @extends Phaser.Renderer.WebGL.RenderNodes.TransformerImage
 * @param {Phaser.Renderer.WebGL.RenderNodes.RenderNodeManager} manager - The manager that owns this RenderNode.
 * @param {object} [config] - The configuration object for this RenderNode.
 */
export class TransformerTile extends TransformerImage {

    static defaultConfig = {
        name: 'TransformerTile',
        role: 'Transformer'
    };

    constructor(manager: any, config?: any)
    {
        config = Merge(config || {}, TransformerTile.defaultConfig);
        super(manager, config);
    }

    run(drawingContext: any, gameObject: any, texturerNode: any, parentMatrix?: any, element?: any): void
    {
        this.onRunBegin(drawingContext);

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

        const frameWidth = texturerNode.frameWidth;
        const frameHeight = texturerNode.frameHeight;

        let width = frameWidth;
        let height = frameHeight;

        const halfWidth = frameWidth / 2;
        const halfHeight = frameHeight / 2;

        const sx = gameObject.scaleX;
        const sy = gameObject.scaleY;

        const tileset = gameObject.gidMap[element.index];

        const tOffsetX = tileset.tileOffset.x;
        const tOffsetY = tileset.tileOffset.y;

        const srcX = gameObject.x + element.pixelX * sx + (halfWidth * sx - tOffsetX);
        const srcY = gameObject.y + element.pixelY * sy + (halfHeight * sy - tOffsetY);

        let x = -halfWidth;
        let y = -halfHeight;

        if (element.flipX)
        {
            width *= -1;
            x += frameWidth;
        }

        if (element.flipY)
        {
            height *= -1;
            x += frameHeight;
        }

        spriteMatrix.applyITRS(
            srcX,
            srcY,
            element.rotation,
            sx,
            sy
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
