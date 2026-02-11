/**
 * @since 3.0.0
 */
export type GridAlignConfig = {
    /**
     * The width of the grid in items (not pixels). -1 means lay all items out horizontally, regardless of quantity.
     * If both this value and height are set to -1 then this value overrides it and the `height` value is ignored.
     */
    width?: number;
    
    /**
     * The height of the grid in items (not pixels). -1 means lay all items out vertically, regardless of quantity.
     * If both this value and `width` are set to -1 then `width` overrides it and this value is ignored.
     */
    height?: number;
    
    /**
     * The width of the cell, in pixels, in which the item is positioned.
     */
    cellWidth?: number;
    
    /**
     * The height of the cell, in pixels, in which the item is positioned.
     */
    cellHeight?: number;
    
    /**
     * The alignment position. One of the Phaser.Display.Align consts such as `TOP_LEFT` or `RIGHT_CENTER`.
     */
    position?: number;
    
    /**
     * Optionally place the top-left of the final grid at this coordinate.
     */
    x?: number;
    
    /**
     * Optionally place the top-left of the final grid at this coordinate.
     */
    y?: number;
}