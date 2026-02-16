// @ts-nocheck

/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Renders this Game Object with the Canvas Renderer to the given Camera.
 * The object will not render if any of its renderFlags are set or it is being actively filtered out by the Camera.
 * This method should not be called directly. It is a utility function of the Render module.
 *
 * @method Phaser.GameObjects.Blitter#renderCanvas
 * @since 3.0.0
 * @private
 *
 * @param {Phaser.Renderer.Canvas.CanvasRenderer} renderer - A reference to the current active Canvas renderer.
 * @param {Phaser.GameObjects.Blitter} src - The Game Object being rendered in this call.
 * @param {Phaser.Cameras.Scene2D.Camera} camera - The Camera that is rendering the Game Object.
 * @param {Phaser.GameObjects.Components.TransformMatrix} parentMatrix - This transform matrix is defined if the game object is nested
 */
export const BlitterCanvasRenderer = function (renderer: any, src: any, camera: any, parentMatrix: any): void
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
