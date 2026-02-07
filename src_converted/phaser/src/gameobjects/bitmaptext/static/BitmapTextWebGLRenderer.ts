/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { BatchChar } from '../BatchChar';
const GetCalcMatrix = require('../../GetCalcMatrix');
const Utils = require('../../../renderer/webgl/Utils');

export const BitmapTextWebGLRenderer = (renderer: any, src: any, camera: any, parentMatrix: any): void =>
{
    const text = src._text;
    const textLength = text.length;

    if (textLength === 0)
    {
        return;
    }

    camera.addToRenderList(src);

    const pipeline = renderer.pipelines.set(src.pipeline, src);
    const calcMatrix = GetCalcMatrix(src, camera, parentMatrix).calc;

    renderer.pipelines.preBatch(src);

    const roundPixels = camera.roundPixels;
    const cameraAlpha = camera.alpha;
    const charColors = src.charColors;
    const tintEffect = src.tintFill;
    const getTint = Utils.getTintAppendFloatAlpha;

    const tintTL = getTint(src.tintTopLeft, cameraAlpha * src._alphaTL);
    const tintTR = getTint(src.tintTopRight, cameraAlpha * src._alphaTR);
    const tintBL = getTint(src.tintBottomLeft, cameraAlpha * src._alphaBL);
    const tintBR = getTint(src.tintBottomRight, cameraAlpha * src._alphaBR);

    const texture = src.frame.glTexture;
    let textureUnit = pipeline.setGameObject(src);

    const bounds = src.getTextBounds(false);
    let i: number;
    let char: any;
    let glyph: any;
    const characters = bounds.characters;
    const dropShadowX = src.dropShadowX;
    const dropShadowY = src.dropShadowY;
    const dropShadow = (dropShadowX !== 0 || dropShadowY !== 0);

    if (dropShadow)
    {
        const srcShadowColor = src.dropShadowColor;
        const srcShadowAlpha = src.dropShadowAlpha;
        const shadowTL = getTint(srcShadowColor, cameraAlpha * srcShadowAlpha * src._alphaTL);
        const shadowTR = getTint(srcShadowColor, cameraAlpha * srcShadowAlpha * src._alphaTR);
        const shadowBL = getTint(srcShadowColor, cameraAlpha * srcShadowAlpha * src._alphaBL);
        const shadowBR = getTint(srcShadowColor, cameraAlpha * srcShadowAlpha * src._alphaBR);

        for (i = 0; i < characters.length; i++)
        {
            char = characters[i];
            glyph = char.glyph;

            if (char.code === 32 || glyph.width === 0 || glyph.height === 0)
            {
                continue;
            }

            BatchChar(pipeline, src, char, glyph, dropShadowX, dropShadowY, calcMatrix, roundPixels, shadowTL, shadowTR, shadowBL, shadowBR, 1, texture, textureUnit);
        }
    }

    for (i = 0; i < characters.length; i++)
    {
        char = characters[i];
        glyph = char.glyph;

        if (char.code === 32 || glyph.width === 0 || glyph.height === 0)
        {
            continue;
        }

        if (pipeline.shouldFlush(6))
        {
            pipeline.flush();
            textureUnit = pipeline.setGameObject(src);
        }

        if (charColors[char.i])
        {
            const color = charColors[char.i];
            const charTintEffect = color.tintEffect;
            const charTintTL = getTint(color.tintTL, cameraAlpha * src._alphaTL);
            const charTintTR = getTint(color.tintTR, cameraAlpha * src._alphaTR);
            const charTintBL = getTint(color.tintBL, cameraAlpha * src._alphaBL);
            const charTintBR = getTint(color.tintBR, cameraAlpha * src._alphaBR);

            BatchChar(pipeline, src, char, glyph, 0, 0, calcMatrix, roundPixels, charTintTL, charTintTR, charTintBL, charTintBR, charTintEffect, texture, textureUnit);
        }
        else
        {
            BatchChar(pipeline, src, char, glyph, 0, 0, calcMatrix, roundPixels, tintTL, tintTR, tintBL, tintBR, tintEffect, texture, textureUnit);
        }
    }

    renderer.pipelines.postBatch(src);
};

