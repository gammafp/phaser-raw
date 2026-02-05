/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { Extend } from '../utils/object/Extend';
import CONST, { Center, Orientation, ScaleModes, Zoom } from './const';
import * as Events from './events';
import { ScaleManager } from './ScaleManager';

/**
 * @namespace Phaser.Scale
 */

let Scale: any = {
    Center,
    Events,
    Orientation,
    ScaleManager,
    ScaleModes,
    Zoom
};

Scale = Extend(false, Scale, CONST.CENTER);
Scale = Extend(false, Scale, CONST.ORIENTATION);
Scale = Extend(false, Scale, CONST.SCALE_MODE);
Scale = Extend(false, Scale, CONST.ZOOM);

export default Scale;
