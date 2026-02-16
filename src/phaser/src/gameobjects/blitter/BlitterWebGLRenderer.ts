// @ts-nocheck

/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { TransformMatrix } from '../components/TransformMatrix';

import { Utils } from '../../renderer/webgl/Utils';

const tempMatrix = new TransformMatrix();
const tempTransformer = {
    quad: new Float32Array(8)
};
const tempTexturer = {};
const tempTinter = {};

/**
 * Renders this Game Object with the WebGL Renderer to the given Camera.
 * The object will not render if any of its renderFlags are set or it is being actively filtered out by the Camera.
 * This method should not be called directly. It is a utility function of the Render module.
 *
 * @method Phaser.GameObjects.Blitter#renderWebGL
 * @since 3.0.0
 * @private
 *
 * @param {Phaser.Renderer.WebGL.WebGLRenderer} renderer - A reference to the current active WebGL renderer.
 * @param {Phaser.GameObjects.Blitter} src - The Game Object being rendered in this call.
 * @param {Phaser.Renderer.WebGL.DrawingContext} drawingContext - The current drawing context.
 * @param {Phaser.GameObjects.Components.TransformMatrix} parentMatrix - This transform matrix is defined if the game object is nested
 */
export const BlitterWebGLRenderer = function (renderer: any, src: any, drawingContext: any, parentMatrix: any): void
{
    const list = src.getRenderList();
    const camera = drawingContext.camera;
    const alpha = src.alpha;

    if (list.length === 0 || alpha === 0)
    {
        //  Nothing to see, so abort early
        return;
    }

    camera.addToRenderList(src);

    const calcMatrix = tempMatrix.copyWithScrollFactorFrom(
        camera.getViewMatrix(!drawingContext.useCanvas),
        camera.scrollX, camera.scrollY,
        src.scrollFactorX, src.scrollFactorY
    );

    if (parentMatrix)
    {
        calcMatrix.multiply(parentMatrix);
    }

    const blitterX = src.x;
    const blitterY = src.y;

    const customRenderNodes = src.customRenderNodes;
    const defaultRenderNodes = src.defaultRenderNodes;

    for (let i = 0; i < list.length; i++)
    {
        const bob = list[i];
        const frame = bob.frame;
        const bobAlpha = bob.alpha * alpha;

        if (bobAlpha === 0)
        {
            continue;
        }

        let width = frame.width;
        let height = frame.height;

        let x = blitterX + bob.x + frame.x;
        let y = blitterY + bob.y + frame.y;

        if (bob.flipX)
        {
            width *= -1;
            x += frame.width;
        }

        if (bob.flipY)
        {
            height *= -1;
            y += frame.height;
        }

        calcMatrix.setQuad(x, y, x + width, y + height, tempTransformer.quad);

        tempTexturer.frame = frame;
        tempTexturer.uvSource = frame;

        const tint = Utils.getTintAppendFloatAlpha(bob.tint, bobAlpha);

        tempTinter.tintTopLeft = tint;
        tempTinter.tintBottomLeft = tint;
        tempTinter.tintTopRight = tint;
        tempTinter.tintBottomRight = tint;

        (customRenderNodes.Submitter || defaultRenderNodes.Submitter).run(
            drawingContext,
            src,
            parentMatrix,
            0,
            tempTexturer,
            tempTransformer,
            tempTinter,

            // Optional normal map parameters.
            undefined,
            0
        );
    }
};
