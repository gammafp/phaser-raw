/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { Extend } from '../../utils/object/Extend';
import { ALIGN_CONST } from './const';
import * as In from './in';
import * as To from './to';

/**
 * @namespace Phaser.Display.Align
 */

let Align: any = {
    In,
    To
};

//   Merge in the consts
Align = Extend(false, Align, ALIGN_CONST);

export default Align;
