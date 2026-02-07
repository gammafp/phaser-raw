/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

export const BlitterCanvasRenderer = (renderer: any, src: any, camera: any, parentMatrix: any): void =>
{
    const list = src.getRenderList();

    if (list.length === 0)
    {
        return;
    }

    const ctx = renderer.currentContext;

    const alpha = camera.alpha * src.alpha;

    if (alpha === 0)
    {
        //  Nothing to see, so abort early
        return;
    }

    camera.addToRenderList(src);

    //  Blend Mode + Scale Mode
    ctx.globalCompositeOperation = renderer.blendModes[src.blendMode];

    ctx.imageSmoothingEnabled = !src.frame.source.scaleMode;

    const cameraScrollX = src.x - camera.scrollX * src.scrollFactorX;
    const cameraScrollY = src.y - camera.scrollY * src.scrollFactorY;

    ctx.save();

    if (parentMatrix)
    {
        parentMatrix.copyToContext(ctx);
    }

    const roundPixels = camera.roundPixels;

    //  Render bobs
    for (let i = 0; i < list.length; i++)
    {
        const bob = list[i];
        const flip = (bob.flipX || bob.flipY);
        const frame = bob.frame;
        const cd = frame.canvasData;
        let dx = frame.x;
        let dy = frame.y;
        let fx = 1;
        let fy = 1;

        const bobAlpha = bob.alpha * alpha;

        if (bobAlpha === 0)
        {
            continue;
        }

        ctx.globalAlpha = bobAlpha;

        if (!flip)
        {
            if (roundPixels)
            {
                dx = Math.round(dx);
                dy = Math.round(dy);
            }

            if (cd.width > 0 && cd.height > 0)
            {
                ctx.drawImage(
                    frame.source.image,
                    cd.x,
                    cd.y,
                    cd.width,
                    cd.height,
                    dx + bob.x + cameraScrollX,
                    dy + bob.y + cameraScrollY,
                    cd.width,
                    cd.height
                );
            }
        }
        else
        {
            if (bob.flipX)
            {
                fx = -1;
                dx -= cd.width;
            }

            if (bob.flipY)
            {
                fy = -1;
                dy -= cd.height;
            }

            if (cd.width > 0 && cd.height > 0)
            {
                ctx.save();
                ctx.translate(bob.x + cameraScrollX, bob.y + cameraScrollY);
                ctx.scale(fx, fy);
                ctx.drawImage(frame.source.image, cd.x, cd.y, cd.width, cd.height, dx, dy, cd.width, cd.height);
                ctx.restore();
            }
        }
    }

    ctx.restore();
};
