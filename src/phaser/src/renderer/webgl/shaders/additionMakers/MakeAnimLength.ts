/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

export const MakeAnimLength = function (maxAnims: any, disable?: any): any {
    return {
        name: maxAnims + 'Anims',
        additions: {
            fragmentDefine: '#undef MAX_ANIM_FRAMES\n#define MAX_ANIM_FRAMES ' + maxAnims
        },
        tags: [ 'MAXANIMS' ],
        disable: !!disable
    };
};
