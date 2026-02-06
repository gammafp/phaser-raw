/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

const SetTransform = require('../../../renderer/canvas/utils/SetTransform');

export const DynamicBitmapTextCanvasRenderer = (renderer: any, src: any, camera: any, parentMatrix: any): void =>
{
    const text = src._text;
    const textLength = text.length;
    const ctx = renderer.currentContext;

    if (textLength === 0 || !SetTransform(renderer, ctx, src, camera, parentMatrix))
    {
        return;
    }

    camera.addToRenderList(src);

    const textureFrame = src.fromAtlas ? src.frame : src.texture.frames['__BASE'];
    const displayCallback = src.displayCallback;
    const callbackData = src.callbackData;
    const chars = src.fontData.chars;
    const lineHeight = src.fontData.lineHeight;
    const letterSpacing = src._letterSpacing;

    let xAdvance = 0;
    let yAdvance = 0;
    let charCode = 0;
    let glyph: any = null;
    let glyphX = 0;
    let glyphY = 0;
    let glyphW = 0;
    let glyphH = 0;
    let x = 0;
    let y = 0;
    let lastGlyph: any = null;
    let lastCharCode = 0;

    const image = src.frame.source.image;
    const textureX = textureFrame.cutX;
    const textureY = textureFrame.cutY;

    let rotation = 0;
    let scale = 0;
    const baseScale = (src._fontSize / src.fontData.size);
    const align = src._align;
    let currentLine = 0;
    let lineOffsetX = 0;

    src.getTextBounds(false);

    const lineData = src._bounds.lines;

    if (align === 1)
    {
        lineOffsetX = (lineData.longest - lineData.lengths[0]) / 2;
    }
    else if (align === 2)
    {
        lineOffsetX = (lineData.longest - lineData.lengths[0]);
    }

    ctx.translate(-src.displayOriginX, -src.displayOriginY);

    const roundPixels = camera.roundPixels;

    if (src.cropWidth > 0 && src.cropHeight > 0)
    {
        ctx.beginPath();
        ctx.rect(0, 0, src.cropWidth, src.cropHeight);
        ctx.clip();
    }

    for (let i = 0; i < textLength; i++)
    {
        scale = baseScale;
        rotation = 0;

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

        glyphX = textureX + glyph.x;
        glyphY = textureY + glyph.y;
        glyphW = glyph.width;
        glyphH = glyph.height;

        x = (glyph.xOffset + xAdvance) - src.scrollX;
        y = (glyph.yOffset + yAdvance) - src.scrollY;

        let kerningOffset: number | undefined;
        if (lastGlyph !== null)
        {
            kerningOffset = glyph.kerning[lastCharCode];
            x += (kerningOffset !== undefined) ? kerningOffset : 0;
        }

        if (displayCallback)
        {
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
        }

        x *= scale;
        y *= scale;
        x += lineOffsetX;

        xAdvance += glyph.xAdvance + letterSpacing + ((kerningOffset !== undefined) ? kerningOffset : 0);
        lastGlyph = glyph;
        lastCharCode = charCode;

        if (glyphW === 0 || glyphH === 0 || charCode === 32)
        {
            continue;
        }

        if (roundPixels)
        {
            x = Math.round(x);
            y = Math.round(y);
        }

        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(rotation);
        ctx.scale(scale, scale);
        ctx.drawImage(image, glyphX, glyphY, glyphW, glyphH, 0, 0, glyphW, glyphH);
        ctx.restore();
    }

    ctx.restore();
};
