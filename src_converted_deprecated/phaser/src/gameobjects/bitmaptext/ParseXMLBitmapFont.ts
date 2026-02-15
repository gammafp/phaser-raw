/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

const getValue = (node: Element, attribute: string): number =>
{
    return parseInt(node.getAttribute(attribute) || '0', 10);
};

export const ParseXMLBitmapFont = (xml: XMLDocument, frame: any, xSpacing: number = 0, ySpacing: number = 0, texture?: any): any =>
{
    const textureX = frame.cutX;
    const textureY = frame.cutY;
    const textureWidth = frame.source.width;
    const textureHeight = frame.source.height;
    const sourceIndex = frame.sourceIndex;

    const data: any = {};
    const info = xml.getElementsByTagName('info')[0];
    const common = xml.getElementsByTagName('common')[0];

    data.font = info.getAttribute('face');
    data.size = getValue(info, 'size');
    data.lineHeight = getValue(common, 'lineHeight') + ySpacing;
    data.chars = {};

    const letters = xml.getElementsByTagName('char');
    const adjustForTrim = (frame !== undefined && frame.trimmed);

    let top = 0;
    let left = 0;

    if (adjustForTrim)
    {
        top = frame.height;
        left = frame.width;
    }

    for (let i = 0; i < letters.length; i++)
    {
        const node = letters[i];
        const charCode = getValue(node, 'id');
        const letter = String.fromCharCode(charCode);
        let gx = getValue(node, 'x');
        let gy = getValue(node, 'y');
        const gw = getValue(node, 'width');
        const gh = getValue(node, 'height');

        if (adjustForTrim)
        {
            if (gx < left) left = gx;
            if (gy < top) top = gy;
        }

        if (adjustForTrim && top !== 0 && left !== 0)
        {
            gx -= frame.x;
            gy -= frame.y;
        }

        const u0 = (textureX + gx) / textureWidth;
        const v0 = (textureY + gy) / textureHeight;
        const u1 = (textureX + gx + gw) / textureWidth;
        const v1 = (textureY + gy + gh) / textureHeight;

        data.chars[charCode] = {
            x: gx,
            y: gy,
            width: gw,
            height: gh,
            centerX: Math.floor(gw / 2),
            centerY: Math.floor(gh / 2),
            xOffset: getValue(node, 'xoffset'),
            yOffset: getValue(node, 'yoffset'),
            xAdvance: getValue(node, 'xadvance') + xSpacing,
            data: {},
            kerning: {},
            u0: u0,
            v0: v0,
            u1: u1,
            v1: v1
        };

        if (texture && gw !== 0 && gh !== 0)
        {
            const charFrame = texture.add(letter, sourceIndex, gx, gy, gw, gh);
            if (charFrame)
            {
                charFrame.setUVs(gw, gh, u0, v0, u1, v1);
            }
        }
    }

    const kernings = xml.getElementsByTagName('kerning');

    for (let i = 0; i < kernings.length; i++)
    {
        const kern = kernings[i];
        const first = getValue(kern, 'first');
        const second = getValue(kern, 'second');
        const amount = getValue(kern, 'amount');
        data.chars[second].kerning[first] = amount;
    }

    return data;
};
