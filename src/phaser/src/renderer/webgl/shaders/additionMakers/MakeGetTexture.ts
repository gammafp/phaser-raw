/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { GetTexture } from '../GetTexture-glsl';

export const MakeGetTexture = function (maxTextures?: number, disable?: any): any {
    if (maxTextures === undefined) { maxTextures = 1; }

    let texIdProcess = '';
    for (let i = 1; i < maxTextures; i++)
    {
        texIdProcess += 'ELSE_TEX_CASE(' + i + ')\n';
    }
    const header = GetTexture.replace('#pragma phaserTemplate(texIdProcess)', texIdProcess);

    return {
        name: 'GetTexture' + maxTextures,
        additions: {
            fragmentHeader: header,
            fragmentProcess: 'vec4 fragColor = getTexture(texCoord);'
        },
        tags: [ 'TEXTURE' ],
        disable: !!disable
    };
};
