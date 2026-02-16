/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

export const MakeDefineTexCount = function (maxTextures: any, disable?: any): any {
    return {
        name: maxTextures + 'TexCount',
        additions: {
            fragmentDefine: '#define TEXTURE_COUNT ' + maxTextures
        },
        tags: [ 'TexCount' ],
        disable: !!disable
    };
};
