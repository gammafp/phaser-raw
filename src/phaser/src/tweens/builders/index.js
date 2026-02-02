/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * @namespace Phaser.Tweens.Builders
 */

import { GetBoolean } from './GetBoolean';
import { GetNewValue } from './GetNewValue';
import { GetProps } from './GetProps';

module.exports = {

    GetBoolean,
    GetEaseFunction: require('./GetEaseFunction'),
    GetInterpolationFunction: require('./GetInterpolationFunction'),
    GetNewValue,
    GetProps,
    GetTargets: require('./GetTargets'),
    GetValueOp: require('./GetValueOp'),
    NumberTweenBuilder: require('./NumberTweenBuilder'),
    StaggerBuilder: require('./StaggerBuilder'),
    TweenBuilder: require('./TweenBuilder')

};
