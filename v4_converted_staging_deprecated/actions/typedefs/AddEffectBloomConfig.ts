/**
 * @since 4.0.0
 */
export type AddEffectBloomConfig = {
    /** The lower brightness threshold for channels to contribute to the bloom, in the range 0-1. */
    threshold?: number;
    /** The radius of light blur in the bloom. */
    blurRadius?: number;
    /** The number of steps to run the blur in the bloom. This value should always be an integer. */
    blurSteps?: number;
    /** The quality of the light blur: 0 (low), 1 (medium) or 2 (high). */
    blurQuality?: number;
    /** The amount by which to blend the bloom over the original image. 0 is none, 1 is 100%. Higher values are allowed. */
    blendAmount?: number;
    /** The blend mode to use when applying the bloom. */
    blendMode?: number;
    /** Whether to add filters to the internal filter list of the effect target. By default, filters are added to the external filter list. */
    useInternal?: boolean;
};
