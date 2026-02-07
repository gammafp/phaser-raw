/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

const GetCalcMatrix = require('../../GetCalcMatrix');
import { TransformMatrix } from '../../components/TransformMatrix';
const Utils = require('../../../renderer/webgl/Utils');

const tempMatrix = new TransformMatrix();

export const DynamicBitmapTextWebGLRenderer = (renderer: any, src: any, camera: any, parentMatrix: any): void =>
{
    let text = src.text;
    let textLength = text.length;

    if (textLength === 0)
    {
        return;
    }

    camera.addToRenderList(src);

    const pipeline = renderer.pipelines.set(src.pipeline, src);
    const result = GetCalcMatrix(src, camera, parentMatrix);

    renderer.pipelines.preBatch(src);

    const spriteMatrix = result.sprite;
    const calcMatrix = result.calc;
    const fontMatrix = tempMatrix;
    const crop = (src.cropWidth > 0 || src.cropHeight > 0);

    if (crop)
    {
        pipeline.flush();
        renderer.pushScissor(
            calcMatrix.tx,
            calcMatrix.ty,
            src.cropWidth * calcMatrix.scaleX,
            src.cropHeight * calcMatrix.scaleY
        );
    }

    const frame = src.frame;
    const texture = frame.glTexture;
    const tintEffect = src.tintFill;
    let tintTL = Utils.getTintAppendFloatAlpha(src.tintTopLeft, camera.alpha * src._alphaTL);
    let tintTR = Utils.getTintAppendFloatAlpha(src.tintTopRight, camera.alpha * src._alphaTR);
    let tintBL = Utils.getTintAppendFloatAlpha(src.tintBottomLeft, camera.alpha * src._alphaBL);
    let tintBR = Utils.getTintAppendFloatAlpha(src.tintBottomRight, camera.alpha * src._alphaBR);
    let textureUnit = pipeline.setGameObject(src);

    let xAdvance = 0;
    let yAdvance = 0;
    let charCode = 0;
    let lastCharCode = 0;
    const letterSpacing = src.letterSpacing;
    let glyph: any;
    let glyphW = 0;
    let glyphH = 0;
    let lastGlyph: any;
    const scrollX = src.scrollX;
    const scrollY = src.scrollY;

    const fontData = src.fontData;
    const chars = fontData.chars;
    const lineHeight = fontData.lineHeight;
    let scale = (src.fontSize / fontData.size);
    let rotation = 0;

    const align = src._align;
    let currentLine = 0;
    let lineOffsetX = 0;

    const bounds = src.getTextBounds(false);

    if (src.maxWidth > 0)
    {
        text = bounds.wrappedText;
        textLength = text.length;
    }

    const lineData = src._bounds.lines;

    if (align === 1)
    {
        lineOffsetX = (lineData.longest - lineData.lengths[0]) / 2;
    }
    else if (align === 2)
    {
        lineOffsetX = (lineData.longest - lineData.lengths[0]);
    }

    const roundPixels = camera.roundPixels;
    const displayCallback = src.displayCallback;
    const callbackData = src.callbackData;

    for (let i = 0; i < textLength; i++)
    {
        charCode = text.charCodeAt(i);

        if (charCode === 10)
        {
            currentLine++;

            if (align === 1)
            {
                lineOffsetX = (lineData.longest - lineData.lengths[currentLine]) / 2;
            }
            else if (align === 2)
            {
                lineOffsetX = (lineData.longest - lineData.lengths[currentLine]);
            }

            xAdvance = 0;
            yAdvance += lineHeight;
            lastGlyph = null;
            continue;
        }

        glyph = chars[charCode];

        if (!glyph)
        {
            continue;
        }

        glyphW = glyph.width;
        glyphH = glyph.height;

        let x = (glyph.xOffset + xAdvance) - scrollX;
        let y = (glyph.yOffset + yAdvance) - scrollY;

        if (lastGlyph !== null)
        {
            const kerningOffset = glyph.kerning[lastCharCode] || 0;
            x += kerningOffset;
            xAdvance += kerningOffset;
        }

        xAdvance += glyph.xAdvance + letterSpacing;
        lastGlyph = glyph;
        lastCharCode = charCode;

        if (glyphW === 0 || glyphH === 0 || charCode === 32)
        {
            continue;
        }

        scale = (src.fontSize / src.fontData.size);
        rotation = 0;

        if (displayCallback)
        {
            callbackData.color = 0;
            callbackData.tint.topLeft = tintTL;
            callbackData.tint.topRight = tintTR;
            callbackData.tint.bottomLeft = tintBL;
            callbackData.tint.bottomRight = tintBR;
            callbackData.index = i;
            callbackData.charCode = charCode;
            callbackData.x = x;
            callbackData.y = y;
            callbackData.scale = scale;
            callbackData.rotation = rotation;
            callbackData.data = glyph.data;

            const output = displayCallback(callbackData);

            x = output.x;
            y = output.y;
            scale = output.scale;
            rotation = output.rotation;

            if (output.color)
            {
                tintTL = output.color;
                tintTR = output.color;
                tintBL = output.color;
                tintBR = output.color;
            }
            else
            {
                tintTL = output.tint.topLeft;
                tintTR = output.tint.topRight;
                tintBL = output.tint.bottomLeft;
                tintBR = output.tint.bottomRight;
            }

            tintTL = Utils.getTintAppendFloatAlpha(tintTL, camera.alpha * src._alphaTL);
            tintTR = Utils.getTintAppendFloatAlpha(tintTR, camera.alpha * src._alphaTR);
            tintBL = Utils.getTintAppendFloatAlpha(tintBL, camera.alpha * src._alphaBL);
            tintBR = Utils.getTintAppendFloatAlpha(tintBR, camera.alpha * src._alphaBR);
        }

        x *= scale;
        y *= scale;
        x -= src.displayOriginX;
        y -= src.displayOriginY;
        x += lineOffsetX;

        fontMatrix.applyITRS(x, y, rotation, scale, scale);
        calcMatrix.multiply(fontMatrix, spriteMatrix);

        const u0 = glyph.u0;
        const v0 = glyph.v0;
        const u1 = glyph.u1;
        const v1 = glyph.v1;
        const xw = glyphW;
        const yh = glyphH;

        let tx0 = spriteMatrix.e;
        let ty0 = spriteMatrix.f;
        let tx1 = yh * spriteMatrix.c + spriteMatrix.e;
        let ty1 = yh * spriteMatrix.d + spriteMatrix.f;
        let tx2 = xw * spriteMatrix.a + yh * spriteMatrix.c + spriteMatrix.e;
        let ty2 = xw * spriteMatrix.b + yh * spriteMatrix.d + spriteMatrix.f;
        let tx3 = xw * spriteMatrix.a + spriteMatrix.e;
        let ty3 = xw * spriteMatrix.b + spriteMatrix.f;

        if (roundPixels)
        {
            tx0 = Math.round(tx0);
            ty0 = Math.round(ty0);
            tx1 = Math.round(tx1);
            ty1 = Math.round(ty1);
            tx2 = Math.round(tx2);
            ty2 = Math.round(ty2);
            tx3 = Math.round(tx3);
            ty3 = Math.round(ty3);
        }

        if (pipeline.shouldFlush(6))
        {
            pipeline.flush();
            textureUnit = pipeline.setGameObject(src);
        }

        pipeline.batchQuad(src, tx0, ty0, tx1, ty1, tx2, ty2, tx3, ty3, u0, v0, u1, v1, tintTL, tintTR, tintBL, tintBR, tintEffect, texture, textureUnit);
    }

    if (crop)
    {
        pipeline.flush();
        renderer.popScissor();
    }

    renderer.pipelines.postBatch(src);
};

