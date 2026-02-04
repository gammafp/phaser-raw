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
import { GetInterpolationFunction } from './GetInterpolationFunction';
import { GetNewValue } from './GetNewValue';
import { GetProps } from './GetProps';
import { GetTargets } from './GetTargets';
import { GetValueOp } from './GetValueOp';
import { BaseTween } from '../tween/BaseTween';
import { TWEEN_DEFAULTS as Defaults } from '../tween/Defaults';
import { Tween } from '../tween/Tween';

/**
 * Creates a new Tween.
 *
 * @function Phaser.Tweens.Builders.TweenBuilder
 * @since 3.0.0
 *
 * @param {Phaser.Tweens.TweenManager} parent - The owner of the new Tween.
 * @param {Phaser.Types.Tweens.TweenBuilderConfig|object} config - Configuration for the new Tween.
 * @param {Phaser.Types.Tweens.TweenConfigDefaults} defaults - Tween configuration defaults.
 *
 * @return {Phaser.Tweens.Tween} The new tween.
 */
export const TweenBuilder = (parent: any, config: any, defaults?: any): any =>
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

    //  Create arrays of the Targets and the Properties. This Targets array should not be manipulated outside of this Tween.
    let targets = GetTargets(config);

    if (!targets && defaults.targets)
    {
        targets = defaults.targets;
    }

    const props = GetProps(config);

    //  Default Tween values

    const delay = GetFastValue(config, 'delay', defaults.delay);
    const duration = GetFastValue(config, 'duration', defaults.duration);
    const easeParams = GetFastValue(config, 'easeParams', defaults.easeParams);
    const ease = GetFastValue(config, 'ease', defaults.ease);
    const hold = GetFastValue(config, 'hold', defaults.hold);
    const repeat = GetFastValue(config, 'repeat', defaults.repeat);
    const repeatDelay = GetFastValue(config, 'repeatDelay', defaults.repeatDelay);
    const yoyo = GetBoolean(config, 'yoyo', defaults.yoyo);
    const flipX = GetBoolean(config, 'flipX', defaults.flipX);
    const flipY = GetBoolean(config, 'flipY', defaults.flipY);
    const interpolation = GetFastValue(config, 'interpolation', defaults.interpolation);

    const addTarget = (tween: any, targetIndex: number, key: string, value: any) =>
    {
        if (key === 'texture')
        {
            let texture = value;
            let frame: any = undefined;

            if (Array.isArray(value))
            {
                texture = value[0];
                frame = value[1];
            }
            else if (value.hasOwnProperty('value'))
            {
                texture = value.value;

                if (Array.isArray(value.value))
                {
                    texture = value.value[0];
                    frame = value.value[1];
                }
                else if (typeof value.value === 'string')
                {
                    texture = value.value;
                }
            }
            else if (typeof value === 'string')
            {
                texture = value;
            }

            tween.addFrame(
                targetIndex,
                texture,
                frame,
                GetNewValue(value, 'delay', delay),
                GetFastValue(value, 'duration', duration),
                GetFastValue(value, 'hold', hold),
                GetFastValue(value, 'repeat', repeat),
                GetFastValue(value, 'repeatDelay', repeatDelay),
                GetBoolean(value, 'flipX', flipX),
                GetBoolean(value, 'flipY', flipY)
            );
        }
        else
        {
            const ops = GetValueOp(key, value);

            const interpolationFunc = GetInterpolationFunction(GetFastValue(value, 'interpolation', interpolation));

            tween.add(
                targetIndex,
                key,
                ops.getEnd,
                ops.getStart,
                ops.getActive,
                GetEaseFunction(GetFastValue(value, 'ease', ease), GetFastValue(value, 'easeParams', easeParams)),
                GetNewValue(value, 'delay', delay),
                GetFastValue(value, 'duration', duration),
                GetBoolean(value, 'yoyo', yoyo),
                GetFastValue(value, 'hold', hold),
                GetFastValue(value, 'repeat', repeat),
                GetFastValue(value, 'repeatDelay', repeatDelay),
                GetBoolean(value, 'flipX', flipX),
                GetBoolean(value, 'flipY', flipY),
                interpolationFunc,
                (interpolationFunc) ? value : null
            );
        }
    };

    const tween = new Tween(parent, targets);

    //  Loop through every property defined in the Tween, i.e.: props { x, y, alpha }
    for (let p = 0; p < props.length; p++)
    {
        const key = props[p].key;
        const value = props[p].value;

        //  Create 1 TweenData per target, per property
        for (let targetIndex = 0; targetIndex < targets.length; targetIndex++)
        {
            //  Special-case for scale short-cut:
            if (key === 'scale' && !targets[targetIndex].hasOwnProperty('scale'))
            {
                addTarget(tween, targetIndex, 'scaleX', value);
                addTarget(tween, targetIndex, 'scaleY', value);
            }
            else
            {
                addTarget(tween, targetIndex, key, value);
            }
        }
    }

    tween.completeDelay = GetAdvancedValue(config, 'completeDelay', 0);
    tween.loop = Math.round(GetAdvancedValue(config, 'loop', 0));
    tween.loopDelay = Math.round(GetAdvancedValue(config, 'loopDelay', 0));
    tween.paused = GetBoolean(config, 'paused', false);
    tween.persist = GetBoolean(config, 'persist', false);

    //  Set the Callbacks
    tween.callbackScope = GetFastValue(config, 'callbackScope', tween);

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
