/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * @namespace Phaser.Tweens.Builders
 */

import { GetBoolean } from './GetBoolean';
import { GetEaseFunction } from './GetEaseFunction';
import { GetInterpolationFunction } from './GetInterpolationFunction';
import { GetNewValue } from './GetNewValue';
import { GetProps } from './GetProps';
import { GetTargets } from './GetTargets';
import { GetValueOp } from './GetValueOp';

module.exports = {

    GetBoolean,
    GetEaseFunction,
    GetInterpolationFunction,
    GetNewValue,
    GetProps,
    GetTargets,
    GetValueOp,
    NumberTweenBuilder: require('./NumberTweenBuilder'),
    StaggerBuilder: require('./StaggerBuilder'),
    TweenBuilder: require('./TweenBuilder')

};
