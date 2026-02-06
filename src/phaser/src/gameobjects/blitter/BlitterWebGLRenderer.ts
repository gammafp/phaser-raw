/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { TransformMatrix } from '../components/TransformMatrix';
const Utils = require('../../renderer/webgl/Utils');

const tempMatrix = new TransformMatrix();

export const BlitterWebGLRenderer = (renderer: any, src: any, camera: any, parentMatrix: any): void =>
{
    const list = src.getRenderList();
    const alpha = camera.alpha * src.alpha;

    if (list.length === 0 || alpha === 0)
    {
        //  Nothing to see, so abort early
        return;
    }

    camera.addToRenderList(src);

    const pipeline = renderer.pipelines.set(src.pipeline, src);

    let cameraScrollX = camera.scrollX * src.scrollFactorX;
    let cameraScrollY = camera.scrollY * src.scrollFactorY;

    const matrix = tempMatrix.copyFrom(camera.matrix);

    if (parentMatrix)
    {
        matrix.multiplyWithOffset(parentMatrix, -cameraScrollX, -cameraScrollY);

        cameraScrollX = 0;
        cameraScrollY = 0;
    }

    const blitterX = src.x - cameraScrollX;
    const blitterY = src.y - cameraScrollY;
    const roundPixels = camera.roundPixels;
    const getTint = Utils.getTintAppendFloatAlpha;

    renderer.pipelines.preBatch(src);

    for (let i = 0; i < list.length; i++)
    {
        const bob = list[i];
        const frame = bob.frame;
        let width = frame.width;
        let height = frame.height;

        const x = blitterX + bob.x + frame.x;
        const y = blitterY + bob.y + frame.y;

        if (bob.flipX)
        {
            width *= -1;
        }

        if (bob.flipY)
        {
            height *= -1;
        }

        const quad = pipeline.batchQuad(src, x, y, x, y + height, x + width, y + height, x + width, y, frame.u0, frame.v0, frame.u1, frame.v1, getTint(bob.tint, camera.alpha * bob.alpha), 0, src.frame.glTexture, 0);

        if (quad && roundPixels)
        {
            quad.x0 = Math.round(quad.x0);
            quad.y0 = Math.round(quad.y0);
            quad.x1 = Math.round(quad.x1);
            quad.y1 = Math.round(quad.y1);
            quad.x2 = Math.round(quad.x2);
            quad.y2 = Math.round(quad.y2);
            quad.x3 = Math.round(quad.x3);
            quad.y3 = Math.round(quad.y3);
        }
    }

    renderer.pipelines.postBatch(src);
};
