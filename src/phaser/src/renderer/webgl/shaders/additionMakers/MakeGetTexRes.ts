/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { GetTexRes } from '../GetTexRes-glsl';

export const MakeGetTexRes = function (disable?: any): any {
    return {
        name: 'GetTexRes',
        additions: {
            fragmentHeader: GetTexRes
        },
        tags: [ 'TEXRES' ],
        disable: !!disable
    };
};
