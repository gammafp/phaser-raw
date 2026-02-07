/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { GetValue } from '../../utils/object/GetValue';

export const ParseRetroFont = (scene: any, config: any): any =>
{
    const w = config.width;
    const h = config.height;
    const cx = Math.floor(w / 2);
    const cy = Math.floor(h / 2);
    const letters = GetValue(config, 'chars', '');

    if (letters === '')
    {
        return;
    }

    const key = GetValue(config, 'image', '');
    const frame = scene.sys.textures.getFrame(key);
    const textureX = frame.cutX;
    const textureY = frame.cutY;
    const textureWidth = frame.source.width;
    const textureHeight = frame.source.height;
    const offsetX = GetValue(config, 'offset.x', 0);
    const offsetY = GetValue(config, 'offset.y', 0);
    const spacingX = GetValue(config, 'spacing.x', 0);
    const spacingY = GetValue(config, 'spacing.y', 0);
    const lineSpacing = GetValue(config, 'lineSpacing', 0);

    let charsPerRow = GetValue(config, 'charsPerRow', null);

    if (charsPerRow === null)
    {
        charsPerRow = textureWidth / w;
        if (charsPerRow > letters.length)
        {
            charsPerRow = letters.length;
        }
    }

    let x = offsetX;
    let y = offsetY;

    const data: any = {
        retroFont: true,
        font: key,
        size: w,
        lineHeight: h + lineSpacing,
        chars: {}
    };

    let r = 0;

    for (let i = 0; i < letters.length; i++)
    {
        const charCode = letters.charCodeAt(i);
        const u0 = (textureX + x) / textureWidth;
        const v0 = (textureY + y) / textureHeight;
        const u1 = (textureX + x + w) / textureWidth;
        const v1 = (textureY + y + h) / textureHeight;

        data.chars[charCode] = {
            x: x,
            y: y,
            width: w,
            height: h,
            centerX: cx,
            centerY: cy,
            xOffset: 0,
            yOffset: 0,
            xAdvance: w,
            data: {},
            kerning: {},
            u0: u0,
            v0: v0,
            u1: u1,
            v1: v1
        };

        r++;

        if (r === charsPerRow)
        {
            r = 0;
            x = offsetX;
            y += h + spacingY;
        }
        else
        {
            x += w + spacingX;
        }
    }

    return {
        data: data,
        frame: null,
        texture: key
    };
};
