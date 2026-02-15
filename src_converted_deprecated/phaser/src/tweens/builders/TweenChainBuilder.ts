/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { GetAdvancedValue } from '../../utils/object/GetAdvancedValue';
import { GetValue } from '../../utils/object/GetValue';
import { GetBoolean } from './GetBoolean';
import { GetTargets } from './GetTargets';
import { TweenBuilder } from './TweenBuilder';

import { BaseTween } from '../tween/BaseTween';
import { TweenChain } from '../tween/TweenChain';

/**
 * Creates a new Tween Chain instance.
 *
 * @function Phaser.Tweens.Builders.TweenChainBuilder
 * @since 3.60.0
 *
 * @param {Phaser.Tweens.TweenManager} parent - The owner of the new Tween.
 * @param {Phaser.Types.Tweens.TweenChainBuilderConfig|object} config - Configuration for the new Tween.
 *
 * @return {Phaser.Tweens.TweenChain} The new Tween Chain.
 */
export const TweenChainBuilder = (parent: any, config: any): any =>
{
    if (config instanceof TweenChain)
    {
        config.parent = parent;

        return config;
    }

    //  Default TweenChain values

    const chain = new TweenChain(parent);

    chain.startDelay = GetValue(config, 'delay', 0);
    chain.completeDelay = GetAdvancedValue(config, 'completeDelay', 0);
    chain.loop = Math.round(GetAdvancedValue(config, 'loop', GetValue(config, 'repeat', 0)));
    chain.loopDelay = Math.round(GetAdvancedValue(config, 'loopDelay', GetValue(config, 'repeatDelay', 0)));
    chain.paused = GetBoolean(config, 'paused', false);
    chain.persist = GetBoolean(config, 'persist', false);

    //  Set the Callbacks
    chain.callbackScope = GetValue(config, 'callbackScope', chain);

    let i: number;
    const callbacks = BaseTween.TYPES;

    for (i = 0; i < callbacks.length; i++)
    {
        const type = callbacks[i];

        const callback = GetValue(config, type, false);

        if (callback)
        {
            const callbackParams = GetValue(config, type + 'Params', []);

            chain.setCallback(type, callback, callbackParams);
        }
    }

    //  Add in the Tweens
    const tweens = GetValue(config, 'tweens', null);

    if (Array.isArray(tweens))
    {
        const chainedTweens: any[] = [];

        const targets = GetTargets(config);
        let defaults: any = undefined;

        if (targets)
        {
            defaults = { targets: targets };
        }

        for (i = 0; i < tweens.length; i++)
        {
            chainedTweens.push(TweenBuilder(chain, tweens[i], defaults));
        }

        chain.add(chainedTweens);
    }

    return chain;
};
