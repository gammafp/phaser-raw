/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */


import { TransformMatrix } from '../gameobjects/components/TransformMatrix';

const camMatrix = new TransformMatrix();
const layerMatrix = new TransformMatrix();
const calcMatrix = new TransformMatrix();

/**
 * Renders this Game Object with the Canvas Renderer to the given Camera.
 * The object will not render if any of its renderFlags are set or it is being actively filtered out by the Camera.
 * This method should not be called directly. It is a utility function of the Render module.
 *
 * @method Phaser.Tilemaps.TilemapLayer#renderCanvas
 * @since 3.50.0
 * @private
 *
 * @param {Phaser.Renderer.Canvas.CanvasRenderer} renderer - A reference to the current active Canvas renderer.
 * @param {Phaser.Tilemaps.TilemapLayer} src - The Game Object being rendered in this call.
 * @param {Phaser.Cameras.Scene2D.Camera} camera - The Camera that is rendering the Game Object.
 * @param {Phaser.GameObjects.Components.TransformMatrix} parentMatrix - This transform matrix is defined if the game object is nested
 */
export const TilemapLayerCanvasRenderer = (renderer: any, src: any, camera: any, parentMatrix?: any): void =>
{
    const renderTiles = src.cull(camera);

    const tileCount = renderTiles.length;
    const alpha = camera.alpha * src.alpha;

    if (tileCount === 0 || alpha <= 0)
    {
        return;
    }

    layerMatrix.applyITRS(src.x, src.y, src.rotation, src.scaleX, src.scaleY);

    const ctx = renderer.currentContext;
    const gidMap = src.gidMap;

    ctx.save();

    camMatrix.copyWithScrollFactorFrom(
        camera.matrixCombined,
        camera.scrollX, camera.scrollY,
        src.scrollFactorX, src.scrollFactorY
    );

    if (parentMatrix)
    {
        camMatrix.multiply(parentMatrix);
    }

    camMatrix.multiply(layerMatrix, calcMatrix);

    calcMatrix.setToContext(ctx);

    if (!renderer.antialias || src.scaleX > 1 || src.scaleY > 1)
    {
        ctx.imageSmoothingEnabled = false;
    }

    for (let i = 0; i < tileCount; i++)
    {
        const tile = renderTiles[i];

        const tileset = gidMap[tile.index];

        if (!tileset)
        {
            continue;
        }

        const image = tileset.image.getSourceImage();

        const tileTexCoords = tileset.getTileTextureCoordinates(tile.index);
        const tileWidth = tileset.tileWidth;
        const tileHeight = tileset.tileHeight;

        if (tileTexCoords === null || tileWidth === 0 || tileHeight === 0)
        {
            continue;
        }

        const halfWidth = tileWidth * 0.5;
        const halfHeight = tileHeight * 0.5;

        tileTexCoords.x += tileset.tileOffset.x;
        tileTexCoords.y += tileset.tileOffset.y;

        ctx.save();

        ctx.translate(tile.pixelX + halfWidth, tile.pixelY + halfHeight);

        if (tile.rotation !== 0)
        {
            ctx.rotate(tile.rotation);
        }

        if (tile.flipX || tile.flipY)
        {
            ctx.scale((tile.flipX) ? -1 : 1, (tile.flipY) ? -1 : 1);
        }

        ctx.globalAlpha = alpha * tile.alpha;

        ctx.drawImage(
            image,
            tileTexCoords.x, tileTexCoords.y,
            tileWidth , tileHeight,
            -halfWidth, -halfHeight,
            tileWidth, tileHeight
        );

        ctx.restore();
    }

    ctx.restore();
};
