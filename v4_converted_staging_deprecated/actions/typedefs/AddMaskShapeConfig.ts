/**
 * @since 4.0.0
 */
export type AddMaskShapeConfig = {
    /** The type of shape to create. This can be 'circle', 'ellipse', 'square' or 'rectangle'. */
    shape?: 'circle' | 'ellipse' | 'square' | 'rectangle';
    /** The aspect ratio of width to height for ellipse and rectangle shapes. */
    aspectRatio?: number;
    /** Whether to invert the mask, typically for creating borders. */
    invert?: boolean;
    /** Whether to use the internal or external filter list. */
    useInternal?: boolean;
    /** The radius of blur to apply to the mask. If 0, no blur is applied. */
    blurRadius?: number;
    /** The number of steps to run blur on the mask. This value should always be an integer. */
    blurSteps?: number;
    /** The quality of any blur: 0 (low), 1 (medium) or 2 (high). */
    blurQuality?: number;
    /** The scale mode to use when fitting the shape. 0 = fill independently, -1 = fit inside, 1 = fit outside. */
    scaleMode?: number;
    /** Padding applies an inset around the edge of the masked region. */
    padding?: number;
    /** The region to fit. If not defined, it will be inferred from the target's scene scale. */
    region?: { x: number; y: number; width: number; height: number };
};
