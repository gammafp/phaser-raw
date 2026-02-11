/**
 * @since 4.0.0
 */
export type AddEffectBloomReturn = {
    /** The ParallelFilters filter which blends the blurred light with the original image. */
    parallelFilters: any;
    /** The Threshold filter which cuts off darker light from the image. */
    threshold: any;
    /** The Blur filter which spreads out bright light from the image. */
    blur: any;
};
