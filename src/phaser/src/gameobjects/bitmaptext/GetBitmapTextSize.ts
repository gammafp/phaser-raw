/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

export const GetBitmapTextSize = (src: any, round?: boolean, updateOrigin: boolean = false, out?: any): any =>
{
    if (out === undefined)
    {
        out = {
            local: { x: 0, y: 0, width: 0, height: 0 },
            global: { x: 0, y: 0, width: 0, height: 0 },
            lines: { shortest: 0, longest: 0, lengths: null, height: 0 },
            wrappedText: '',
            words: [],
            characters: [],
            scaleX: 0,
            scaleY: 0
        };
        return out;
    }

    let text = src.text;
    let textLength = text.length;
    const maxWidth = src.maxWidth;
    const wordWrapCharCode = src.wordWrapCharCode;
    let bx = Number.MAX_VALUE;
    let by = Number.MAX_VALUE;
    let bw = 0;
    let bh = 0;
    const chars = src.fontData.chars;
    const lineHeight = src.fontData.lineHeight;
    const letterSpacing = src.letterSpacing;
    const lineSpacing = src.lineSpacing;
    let xAdvance = 0;
    let yAdvance = 0;
    let charCode = 0;
    let glyph: any = null;
    const align = src._align;
    let x = 0;
    let y = 0;
    const scale = (src.fontSize / src.fontData.size);
    const sx = scale * src.scaleX;
    const sy = scale * src.scaleY;
    let lastGlyph: any = null;
    let lastCharCode = 0;
    const lineWidths: number[] = [];
    let shortestLine = Number.MAX_VALUE;
    let longestLine = 0;
    let currentLine = 0;
    let currentLineWidth = 0;
    let i: number;
    let j: number;
    let lines: any;
    const words: any[] = [];
    const characters: any[] = [];
    let current: any = null;

    const measureTextWidth = (text: string, fontData: any): number => {
        let width = 0;
        for (let i = 0; i < text.length; i++) {
            const charCode = text.charCodeAt(i);
            const glyph = fontData.chars[charCode];
            if (glyph) width += glyph.xAdvance;
        }
        return width * sx;
    };
    
    if (maxWidth > 0) {
        lines = text.split('\n');
        const wrappedLines: string[] = [];
        for (i = 0; i < lines.length; i++) {
            const line = lines[i];
            let word = '';
            let wrappedLine = '';
            let lineToCheck = '';
            let lineWithWord = '';
            for (j = 0; j < line.length; j++) {
                charCode = line.charCodeAt(j);
                word += line[j];
                if (charCode === wordWrapCharCode || j === line.length - 1) {
                    lineWithWord = lineToCheck + word;
                    const textWidth = measureTextWidth(lineWithWord, src.fontData);
                    if (textWidth <= maxWidth) {
                        lineToCheck = lineWithWord;
                    } else {
                        wrappedLine = wrappedLine.slice(0, -1);
                        wrappedLine += (wrappedLine ? '\n' : '') + lineToCheck;
                        lineToCheck = word;
                    }
                    word = '';
                }
            }
            wrappedLine = wrappedLine.slice(0, -1);
            wrappedLine += (wrappedLine ? '\n' : '') + lineToCheck;
            wrappedLines.push(wrappedLine);
        }
        text = wrappedLines.join('\n');
        out.wrappedText = text;
        textLength = text.length;
    }

    let charIndex = 0;
    for (i = 0; i < textLength; i++) {
        charCode = text.charCodeAt(i);
        if (charCode === 10) {
            if (current !== null) {
                words.push({ word: current.word, i: current.i, x: current.x * sx, y: current.y * sy, w: current.w * sx, h: current.h * sy });
                current = null;
            }
            lastGlyph = null;
            lineWidths[currentLine] = currentLineWidth;
            if (currentLineWidth > longestLine) longestLine = currentLineWidth;
            if (currentLineWidth < shortestLine) shortestLine = currentLineWidth;
            currentLine++;
            currentLineWidth = 0;
            xAdvance = 0;
            yAdvance = (lineHeight + lineSpacing) * currentLine;
            continue;
        }
        glyph = chars[charCode];
        if (!glyph) continue;
        x = xAdvance;
        y = yAdvance;
        let kerningOffset: number | undefined;
        if (lastGlyph !== null) {
            kerningOffset = glyph.kerning[lastCharCode];
            x += (kerningOffset !== undefined) ? kerningOffset : 0;
        }
        if (bx > x) bx = x;
        if (by > y) by = y;
        const gw = x + glyph.xAdvance;
        const gh = y + lineHeight;
        if (bw < gw) bw = gw;
        if (bh < gh) bh = gh;
        const charWidth = glyph.xOffset + glyph.xAdvance + ((kerningOffset !== undefined) ? kerningOffset : 0);
        if (charCode === wordWrapCharCode) {
            if (current !== null) {
                words.push({ word: current.word, i: current.i, x: current.x * sx, y: current.y * sy, w: current.w * sx, h: current.h * sy });
                current = null;
            }
        } else {
            if (current === null) {
                current = { word: '', i: charIndex, x: xAdvance, y: yAdvance, w: 0, h: lineHeight };
            }
            current.word = current.word.concat(text[i]);
            current.w += charWidth;
        }
        characters.push({ i: charIndex, idx: i, char: text[i], code: charCode, x: (glyph.xOffset + x) * scale, y: (glyph.yOffset + yAdvance) * scale, w: glyph.width * scale, h: glyph.height * scale, t: yAdvance * scale, r: gw * scale, b: lineHeight * scale, line: currentLine, glyph: glyph });
        xAdvance += glyph.xAdvance + letterSpacing + ((kerningOffset !== undefined) ? kerningOffset : 0);
        lastGlyph = glyph;
        lastCharCode = charCode;
        currentLineWidth = gw * scale;
        charIndex++;
    }

    if (current !== null) {
        words.push({ word: current.word, i: current.i, x: current.x * sx, y: current.y * sy, w: current.w * sx, h: current.h * sy });
    }

    lineWidths[currentLine] = currentLineWidth;
    if (currentLineWidth > longestLine) longestLine = currentLineWidth;
    if (currentLineWidth < shortestLine) shortestLine = currentLineWidth;

    if (align > 0) {
        for (let c = 0; c < characters.length; c++) {
            const currentChar = characters[c];
            if (align === 1) {
                const ax1 = ((longestLine - lineWidths[currentChar.line]) / 2);
                currentChar.x += ax1;
                currentChar.r += ax1;
            } else if (align === 2) {
                const ax2 = (longestLine - lineWidths[currentChar.line]);
                currentChar.x += ax2;
                currentChar.r += ax2;
            }
        }
    }

    const local = out.local;
    const global = out.global;
    lines = out.lines;

    local.x = bx * scale;
    local.y = by * scale;
    local.width = bw * scale;
    local.height = bh * scale;

    global.x = (src.x - src._displayOriginX) + (bx * sx);
    global.y = (src.y - src._displayOriginY) + (by * sy);
    global.width = bw * sx;
    global.height = bh * sy;

    lines.shortest = shortestLine;
    lines.longest = longestLine;
    lines.lengths = lineWidths;

    if (round) {
        local.x = Math.ceil(local.x);
        local.y = Math.ceil(local.y);
        local.width = Math.ceil(local.width);
        local.height = Math.ceil(local.height);
        global.x = Math.ceil(global.x);
        global.y = Math.ceil(global.y);
        global.width = Math.ceil(global.width);
        global.height = Math.ceil(global.height);
        lines.shortest = Math.ceil(shortestLine);
        lines.longest = Math.ceil(longestLine);
    }

    if (updateOrigin) {
        src._displayOriginX = (src.originX * local.width);
        src._displayOriginY = (src.originY * local.height);
        global.x = src.x - (src._displayOriginX * src.scaleX);
        global.y = src.y - (src._displayOriginY * src.scaleY);
        if (round) {
            global.x = Math.ceil(global.x);
            global.y = Math.ceil(global.y);
        }
    }

    out.words = words;
    out.characters = characters;
    out.lines.height = lineHeight;
    out.scale = scale;
    out.scaleX = src.scaleX;
    out.scaleY = src.scaleY;

    return out;
};
