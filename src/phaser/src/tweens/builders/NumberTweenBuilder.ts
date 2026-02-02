/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { GetAdvancedValue } from '../../utils/object/GetAdvancedValue';
import { GetFastValue } from '../../utils/object/GetFastValue';
import { GetValue } from '../../utils/object/GetValue';
import { MergeRight } from '../../utils/object/MergeRight';
import { GetBoolean } from './GetBoolean';
import { GetEaseFunction } from './GetEaseFunction';
import { GetNewValue } from './GetNewValue';
import { GetValueOp } from './GetValueOp';

const BaseTween = require('../tween/BaseTween');
const Defaults = require('../tween/Defaults');
const Tween = require('../tween/Tween');

/**
 * Creates a new Number Tween.
 *
 * @function Phaser.Tweens.Builders.NumberTweenBuilder
 * @since 3.0.0
 *
 * @param {Phaser.Tweens.TweenManager} parent - The owner of the new Tween.
 * @param {Phaser.Types.Tweens.NumberTweenBuilderConfig} config - Configuration for the new Tween.
 * @param {Phaser.Types.Tweens.TweenConfigDefaults} defaults - Tween configuration defaults.
 *
 * @return {Phaser.Tweens.Tween} The new tween.
 */
export const NumberTweenBuilder = (parent: any, config: any, defaults?: any): any =>
{
    if (config instanceof Tween)
    {
        config.parent = parent;

        return config;
    }

    if (defaults === undefined)
    {
        defaults = Defaults;
    }
    else
    {
        defaults = MergeRight(Defaults, defaults);
    }

    //  var tween = this.tweens.addCounter({
    //      from: 100,
    //      to: 200,
    //      ... (normal tween properties)
    //  })
    //
    //  Then use it in your game via:
    //
    //  tween.getValue()

    const from = GetFastValue(config, 'from', 0);
    const to = GetFastValue(config, 'to', 1);

    const targets = [ { value: from } ];

    const delay = GetFastValue(config, 'delay', defaults.delay);
    const easeParams = GetFastValue(config, 'easeParams', defaults.easeParams);
    const ease = GetFastValue(config, 'ease', defaults.ease);

    const ops = GetValueOp('value', to);

    const tween = new Tween(parent, targets);

    const tweenData = tween.add(
        0,
        'value',
        ops.getEnd,
        ops.getStart,
        ops.getActive,
        GetEaseFunction(GetFastValue(config, 'ease', ease), GetFastValue(config, 'easeParams', easeParams)),
        GetNewValue(config, 'delay', delay),
        GetFastValue(config, 'duration', defaults.duration),
        GetBoolean(config, 'yoyo', defaults.yoyo),
        GetFastValue(config, 'hold', defaults.hold),
        GetFastValue(config, 'repeat', defaults.repeat),
        GetFastValue(config, 'repeatDelay', defaults.repeatDelay),
        false,
        false
    );

    tweenData.start = from;
    tweenData.current = from;

    tween.completeDelay = GetAdvancedValue(config, 'completeDelay', 0);
    tween.loop = Math.round(GetAdvancedValue(config, 'loop', 0));
    tween.loopDelay = Math.round(GetAdvancedValue(config, 'loopDelay', 0));
    tween.paused = GetBoolean(config, 'paused', false);
    tween.persist = GetBoolean(config, 'persist', false);
    tween.isNumberTween = true;

    //  Set the Callbacks
    tween.callbackScope = GetValue(config, 'callbackScope', tween);

    const callbacks = BaseTween.TYPES;

    for (let i = 0; i < callbacks.length; i++)
    {
        const type = callbacks[i];

        const callback = GetValue(config, type, false);

        if (callback)
        {
            const callbackParams = GetValue(config, type + 'Params', []);

            tween.setCallback(type, callback, callbackParams);
        }
    }

    return tween;
};
