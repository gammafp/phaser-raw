/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

// TODO: Convert this complex export pattern to modern TypeScript
// This file uses Extend to merge ALIGN_CONST into the Align object

import { Extend } from '../../utils/object/Extend';
import { ALIGN_CONST } from './const';

/**
 * @namespace Phaser.Display.Align
 */

const In = require('./in');
const To = require('./to');

let Align: any = {

    In,
    To

};

//   Merge in the consts
Align = Extend(false, Align, ALIGN_CONST);

export default Align;
