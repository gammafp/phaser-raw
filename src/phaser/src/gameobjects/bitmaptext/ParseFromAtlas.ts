/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { ParseXMLBitmapFont } from './ParseXMLBitmapFont';

export const ParseFromAtlas = (scene: any, fontName: string, textureKey: string, frameKey: string, xmlKey: string, xSpacing?: number, ySpacing?: number): boolean =>
{
    const texture = scene.sys.textures.get(textureKey);
    const frame = texture.get(frameKey);
    const xml = scene.sys.cache.xml.get(xmlKey);

    if (frame && xml)
    {
        const data = ParseXMLBitmapFont(xml, frame, xSpacing, ySpacing, texture);
        scene.sys.cache.bitmapFont.add(fontName, { data: data, texture: textureKey, frame: frameKey, fromAtlas: true });
        return true;
    }
    else
    {
        return false;
    }
};
