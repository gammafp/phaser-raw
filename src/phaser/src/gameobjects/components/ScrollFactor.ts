/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Provides methods used for getting and setting the Scroll Factor of a Game Object.
 */
export interface ScrollFactor {
    scrollFactorX: number;
    scrollFactorY: number;
    setScrollFactor(x: number, y?: number): this;
}

export const ScrollFactor = {

    scrollFactorX: 1,
    scrollFactorY: 1,

    setScrollFactor(this: any, x: number, y?: number): any {
        if (y === undefined) { y = x; }
        this.scrollFactorX = x;
        this.scrollFactorY = y;
        return this;
    }
};
