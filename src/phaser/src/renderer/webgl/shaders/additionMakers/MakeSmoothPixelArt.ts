/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { DefineBlockyTexCoord } from '../DefineBlockyTexCoord-glsl';

export const MakeSmoothPixelArt = function (disable?: any): any {
    return {
        name: 'SmoothPixelArt',
        additions: {
            extensions: '#extension GL_OES_standard_derivatives : enable',
            fragmentHeader: DefineBlockyTexCoord,
            texCoord: 'texCoord = getBlockyTexCoord(texCoord, getTexRes());'
        },
        disable: !!disable
    };
};
