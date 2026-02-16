/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { RenderNode } from '../RenderNode';

/**
 * @classdesc
 * A RenderNode which handles texturing for a single Image-like GameObject.
 *
 * This node stores values relevant to texturing, such as UVs and frame data.
 * These values should be read off before the node is reused.
 *
 * @class TexturerImage
 * @memberof Phaser.Renderer.WebGL.RenderNodes
 * @constructor
 * @since 4.0.0
 * @extends Phaser.Renderer.WebGL.RenderNodes.RenderNode
 * @param {Phaser.Renderer.WebGL.RenderNodes.RenderNodeManager} manager - The manager that owns this RenderNode.
 */
export class TexturerImage extends RenderNode {

    frame: any;
    frameWidth: number;
    frameHeight: number;
    uvSource: any;

    constructor(manager: any)
    {
        super('TexturerImage', manager);

        this.frame = null;
        this.frameWidth = 0;
        this.frameHeight = 0;
        this.uvSource = null;
    }

    run(drawingContext: any, gameObject: any, element?: any): void
    {
        this.onRunBegin(drawingContext);

        const frame = gameObject.frame;
        this.frame = frame;

        this.frameWidth = frame.cutWidth;
        this.frameHeight = frame.cutHeight;

        this.uvSource = frame;
        if (gameObject.isCropped)
        {
            const crop = gameObject._crop;
            this.uvSource = crop;

            if (crop.flipX !== gameObject.flipX || crop.flipY !== gameObject.flipY)
            {
                gameObject.frame.updateCropUVs(crop, gameObject.flipX, gameObject.flipY);
            }

            this.frameWidth = crop.width;
            this.frameHeight = crop.height;
        }

        const resolution = frame.source.resolution;
        this.frameWidth /= resolution;
        this.frameHeight /= resolution;

        this.onRunEnd(drawingContext);
    }
}
