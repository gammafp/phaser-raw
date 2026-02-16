/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { BlendModes } from '../renderer/BlendModes';

import type { AddEffectBloomConfig } from './typedefs/AddEffectBloomConfig';
import type { AddEffectBloomReturn } from './typedefs/AddEffectBloomReturn';

/**
 * Adds a Bloom effect to a Camera or GameObject.
 *
 * Bloom is a phenomenon where bright light spreads across an image.
 * It can be used to add to the realism of a scene,
 * although too much is obvious and a subtle effect is best.
 *
 * This Action creates a Bloom effect by applying several Filters to the target.
 *
 * - `ParallelFilters` splits the filter stream, allowing us to combine
 *   the results of other filters with the original image.
 *   The other filters are added to the `top` stream.
 * - `Threshold` removes darker colors.
 * - `Blur` spreads the remaining bright colors out.
 *
 * This Action returns an object containing references to these filters.
 * You can control their properties directly,
 * e.g. if you want to animate the Bloom,
 * or if you want to set properties this Action doesn't surface.
 *
 * The Bloom effect will be destroyed like any other filter on target shutdown.
 * To disable or remove the Bloom effect manually, access the `parallelFilters`
 * controller in the return object. It holds the other filters.
 *
 * - `parallelFilters.active = false`: deactivate Bloom
 * - `parallelFilters.destroy()`: destroy Bloom
 *
 * @function Phaser.Actions.AddEffectBloom
 * @since 4.0.0
 *
 * @param {Phaser.Cameras.Scene2D.Camera|Phaser.GameObjects.GameObject} target - Recipient of the Bloom effect
 * @param {Phaser.Types.Actions.AddEffectBloomConfig} [config] - Initial configuration of the Bloom effect.
 *
 * @return {Phaser.Types.Actions.AddEffectBloomReturn} An object containing the filters which were created.
 */
export const AddEffectBloom = (
    target: any,
    config?: AddEffectBloomConfig
): AddEffectBloomReturn =>
{
    if (!config) { config = {}; }
    const threshold = config.threshold === undefined ? 0.5 : config.threshold;
    const blurRadius = config.blurRadius === undefined ? 2 : config.blurRadius;
    const blurSteps = config.blurSteps === undefined ? 4 : config.blurSteps;
    const blurQuality = config.blurQuality === undefined ? 0 : config.blurQuality;
    const blendAmount = config.blendAmount === undefined ? 1 : config.blendAmount;
    const blendMode = config.blendMode === undefined ? BlendModes.ADD : config.blendMode;

    if (target.enableFilters) { target.enableFilters(); }
    const filterList = config.useInternal ? target.filters.internal : target.filters.external;
    const parallelFilters = filterList.addParallelFilters();
    const thresholdFilter = parallelFilters.top.addThreshold(threshold, 1);
    const blurFilter = parallelFilters.top.addBlur(blurQuality, blurRadius, blurRadius, 1, 0xffffff, blurSteps);
    parallelFilters.blend.blendMode = blendMode;
    parallelFilters.blend.amount = blendAmount;

    return {
        parallelFilters,
        threshold: thresholdFilter,
        blur: blurFilter
    };
};
