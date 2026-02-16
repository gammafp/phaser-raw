/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { TransformMatrix } from '../../../../gameobjects/components/TransformMatrix';
import { RenderNode } from '../RenderNode';

/**
 * @classdesc
 * A RenderNode which handles texturing for a single TileSprite GameObject.
 *
 * This node stores values relevant to texturing, such as UVs and frame data.
 * These values should be read off before the node is reused.
 *
 * @class TexturerTileSprite
 * @memberof Phaser.Renderer.WebGL.RenderNodes
 * @constructor
 * @since 4.0.0
 * @extends Phaser.Renderer.WebGL.RenderNodes.RenderNode
 * @param {Phaser.Renderer.WebGL.RenderNodes.RenderNodeManager} manager - The manager that owns this RenderNode.
 */
export class TexturerTileSprite extends RenderNode {

    frame: any;
    uvMatrix: TransformMatrix;

    constructor(manager: any)
    {
        super('TexturerTileSprite', manager);

        this.frame = null;
        this.uvMatrix = new TransformMatrix();
    }

    run(drawingContext: any, gameObject: any, element?: any): void
    {
        this.onRunBegin(drawingContext);

        const frame = gameObject.frame;
        this.frame = frame;

        if (gameObject.isCropped)
        {
            const crop = gameObject._crop;

            if (crop.flipX !== gameObject.flipX || crop.flipY !== gameObject.flipY)
            {
                gameObject.frame.updateCropUVs(crop, gameObject.flipX, gameObject.flipY);
            }
        }

        this.uvMatrix.loadIdentity();

        this.uvMatrix.scale(1 / frame.width, 1 / frame.height);

        this.uvMatrix.translate(gameObject.tilePositionX, gameObject.tilePositionY);
        this.uvMatrix.scale(1 / gameObject.tileScaleX, 1 / gameObject.tileScaleY);
        this.uvMatrix.rotate(-gameObject.tileRotation);

        this.uvMatrix.setQuad(0, 0, gameObject.width, gameObject.height);

        this.onRunEnd(drawingContext);
    }
}
