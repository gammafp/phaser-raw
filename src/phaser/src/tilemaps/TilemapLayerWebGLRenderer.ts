/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { TintModes } from '../renderer/TintModes';
import { Utils } from '../renderer/webgl/Utils';

const getTint = Utils.getTintAppendFloatAlpha;

const texturerData = {
    frame: {
        source: {
            glTexture: null
        }
    },
    uvSource: {
        u0: 0,
        v0: 0,
        u1: 1,
        v1: 1
    },
    frameWidth: 0,
    frameHeight: 0
};

const tinterData = {
    tintEffect: TintModes.MULTIPLY,
    tintTopLeft: 0,
    tintTopRight: 0,
    tintBottomLeft: 0,
    tintBottomRight: 0
};

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
 * @param {Phaser.Renderer.WebGL.DrawingContext} drawingContext - The current drawing context.
 * @param {Phaser.GameObjects.Components.TransformMatrix} [parentMatrix] - This transform matrix is defined if the game object is nested
 */
export const TilemapLayerWebGLRenderer = (renderer: any, src: any, drawingContext: any, parentMatrix?: any): void =>
{
    const camera = drawingContext.camera;
    const renderTiles = src.cull(camera);

    const tileCount = renderTiles.length;
    const alpha = src.alpha;

    if (tileCount === 0 || alpha <= 0)
    {
        return;
    }

    const gidMap = src.gidMap;

    const submitterNode = src.customRenderNodes.Submitter || src.defaultRenderNodes.Submitter;
    const transformerNode = src.customRenderNodes.Transformer || src.defaultRenderNodes.Transformer;

    const timeElapsed = src.timeElapsed;

    for (let i = 0; i < tileCount; i++)
    {
        const tile = renderTiles[i];

        const tileset = gidMap[tile.index];

        if (!tileset)
        {
            continue;
        }

        const tileIndex = tileset.getAnimatedTileId(tile.index, timeElapsed);

        if (tileIndex === null)
        {
            continue;
        }

        const tileTexCoords = tileset.getTileTextureCoordinates(tileIndex);
        const tileWidth = tileset.tileWidth;
        const tileHeight = tileset.tileHeight;

        if (!tileTexCoords || tileWidth === 0 || tileHeight === 0)
        {
            continue;
        }

        const texture = tileset.glTexture;

        const frameWidth = tileWidth;
        const frameHeight = tileHeight;

        const frameX = tileTexCoords.x;
        const frameY = tileTexCoords.y;

        const tint = getTint(tile.tint, alpha * tile.alpha);

        texturerData.frame.source.glTexture = tileset.glTexture;
        texturerData.frameWidth = frameWidth;
        texturerData.frameHeight = frameHeight;
        texturerData.uvSource.u0 = frameX / texture.width;
        texturerData.uvSource.v0 = 1 - (frameY + frameHeight) / texture.height;
        texturerData.uvSource.u1 = (frameX + frameWidth) / texture.width;
        texturerData.uvSource.v1 = 1 - frameY / texture.height;

        tinterData.tintEffect = tile.tintFill;
        tinterData.tintTopLeft = tint;
        tinterData.tintTopRight = tint;
        tinterData.tintBottomLeft = tint;
        tinterData.tintBottomRight = tint;

        submitterNode.run(
            drawingContext,
            src,
            parentMatrix,
            tile,
            texturerData,
            transformerNode,
            tinterData
        );
    }
};
