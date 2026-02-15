/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

const Utils = require('../renderer/webgl/Utils');

/**
 * Renders this Game Object with the WebGL Renderer to the given Camera.
 * The object will not render if any of its renderFlags are set or it is being actively filtered out by the Camera.
 * This method should not be called directly. It is a utility function of the Render module.
 *
 * @method Phaser.Tilemaps.TilemapLayer#renderWebGL
 * @since 3.0.0
 * @private
 *
 * @param {Phaser.Renderer.WebGL.WebGLRenderer} renderer - A reference to the current active WebGL renderer.
 * @param {Phaser.Tilemaps.TilemapLayer} src - The Game Object being rendered in this call.
 * @param {Phaser.Cameras.Scene2D.Camera} camera - The Camera that is rendering the Game Object.
 */
export const TilemapLayerWebGLRenderer = (renderer: any, src: any, camera: any): void =>
{
    const renderTiles = src.cull(camera);

    const tileCount = renderTiles.length;
    const alpha = camera.alpha * src.alpha;

    if (tileCount === 0 || alpha <= 0)
    {
        return;
    }

    const gidMap = src.gidMap;
    const pipeline = renderer.pipelines.set(src.pipeline, src);

    const getTint = Utils.getTintAppendFloatAlpha;

    const scrollFactorX = src.scrollFactorX;
    const scrollFactorY = src.scrollFactorY;

    const x = src.x;
    const y = src.y;

    const sx = src.scaleX;
    const sy = src.scaleY;

    renderer.pipelines.preBatch(src);

    for (let i = 0; i < tileCount; i++)
    {
        const tile = renderTiles[i];

        const tileset = gidMap[tile.index];

        if (!tileset)
        {
            continue;
        }

        const tileTexCoords = tileset.getTileTextureCoordinates(tile.index);
        const tileWidth = tileset.tileWidth;
        const tileHeight = tileset.tileHeight;

        if (!tileTexCoords || tileWidth === 0 || tileHeight === 0)
        {
            continue;
        }

        const halfWidth = tileWidth * 0.5;
        const halfHeight = tileHeight * 0.5;

        const texture = tileset.glTexture;

        const textureUnit = pipeline.setTexture2D(texture, src);

        const frameWidth = tileWidth;
        const frameHeight = tileHeight;

        const frameX = tileTexCoords.x;
        const frameY = tileTexCoords.y;

        const tOffsetX = tileset.tileOffset.x;
        const tOffsetY = tileset.tileOffset.y;

        const tint = getTint(tile.tint, alpha * tile.alpha);

        pipeline.batchTexture(
            src,
            texture,
            texture.width, texture.height,
            x + tile.pixelX * sx + (halfWidth * sx - tOffsetX),
            y + tile.pixelY * sy + (halfHeight * sy - tOffsetY),
            tileWidth, tileHeight,
            sx, sy,
            tile.rotation,
            tile.flipX, tile.flipY,
            scrollFactorX, scrollFactorY,
            halfWidth, halfHeight,
            frameX, frameY, frameWidth, frameHeight,
            tint, tint, tint, tint, tile.tintFill,
            0, 0,
            camera,
            null,
            true,
            textureUnit,
            true
        );
    }

    renderer.pipelines.postBatch(src);
};
