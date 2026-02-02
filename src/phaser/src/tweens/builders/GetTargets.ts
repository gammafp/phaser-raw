/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { GetValue } from '../../utils/object/GetValue';

/**
 * Extracts an array of targets from a Tween configuration object.
 *
 * The targets will be looked for in a `targets` property. If it's a function, its return value will be used as the result.
 *
 * @function Phaser.Tweens.Builders.GetTargets
 * @since 3.0.0
 *
 * @param {object} config - The configuration object to use.
 *
 * @return {array} An array of targets (may contain only one element), or `null` if no targets were specified.
 */
export const GetTargets = (config: any): any[] | null =>
{
    let targets = GetValue(config, 'targets', null);

    if (targets === null)
    {
        return targets;
    }

    if (typeof targets === 'function')
    {
        targets = targets.call();
    }

    if (!Array.isArray(targets))
    {
        targets = [ targets ];
    }

    return targets;
};
