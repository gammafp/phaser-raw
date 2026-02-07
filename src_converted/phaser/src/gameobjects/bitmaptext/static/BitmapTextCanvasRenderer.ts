/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

const SetTransform = require('../../../renderer/canvas/utils/SetTransform');

export const BitmapTextCanvasRenderer = (renderer: any, src: any, camera: any, parentMatrix: any): void =>
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
    const chars = src.fontData.chars;
    const lineHeight = src.fontData.lineHeight;
    const letterSpacing = src._letterSpacing;
    const lineSpacing = src._lineSpacing;

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

    const image = textureFrame.source.image;
    const textureX = textureFrame.cutX;
    const textureY = textureFrame.cutY;
    const scale = (src._fontSize / src.fontData.size);
    const align = src._align;
    let currentLine = 0;
    let lineOffsetX = 0;

    const bounds = src.getTextBounds(false);

    let wrappedText = text;
    if (src.maxWidth > 0)
    {
        wrappedText = bounds.wrappedText;
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

    ctx.translate(-src.displayOriginX, -src.displayOriginY);

    const roundPixels = camera.roundPixels;

    for (let i = 0; i < wrappedText.length; i++)
    {
        charCode = wrappedText.charCodeAt(i);

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
            yAdvance += lineHeight + lineSpacing;
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

        x = glyph.xOffset + xAdvance;
        y = glyph.yOffset + yAdvance;

        let kerningOffset: number | undefined;
        if (lastGlyph !== null)
        {
            kerningOffset = glyph.kerning[lastCharCode];
            x += (kerningOffset !== undefined) ? kerningOffset : 0;
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
        ctx.scale(scale, scale);
        ctx.drawImage(image, glyphX, glyphY, glyphW, glyphH, 0, 0, glyphW, glyphH);
        ctx.restore();
    }

    ctx.restore();
};
