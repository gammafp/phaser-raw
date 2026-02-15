/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Provides methods used for setting the tint of a Game Object.
 * Should be applied as a mixin and not used directly.
 */
export interface Tint {
    tintTopLeft: number;
    tintTopRight: number;
    tintBottomLeft: number;
    tintBottomRight: number;
    tintFill: boolean;
    tint: number;
    isTinted: boolean;
    clearTint(): this;
    setTint(topLeft?: number, topRight?: number, bottomLeft?: number, bottomRight?: number): this;
    setTintFill(topLeft?: number, topRight?: number, bottomLeft?: number, bottomRight?: number): this;
}

export const Tint = {

    tintTopLeft: 0xffffff,
    tintTopRight: 0xffffff,
    tintBottomLeft: 0xffffff,
    tintBottomRight: 0xffffff,
    tintFill: false,

    clearTint(this: any): any {
        this.setTint(0xffffff);
        return this;
    },

    setTint(this: any, topLeft: number = 0xffffff, topRight?: number, bottomLeft?: number, bottomRight?: number): any {
        if (topRight === undefined) {
            topRight = topLeft;
            bottomLeft = topLeft;
            bottomRight = topLeft;
        }

        this.tintTopLeft = topLeft;
        this.tintTopRight = topRight;
        this.tintBottomLeft = bottomLeft;
        this.tintBottomRight = bottomRight;
        this.tintFill = false;

        return this;
    },

    setTintFill(this: any, topLeft?: number, topRight?: number, bottomLeft?: number, bottomRight?: number): any {
        this.setTint(topLeft, topRight, bottomLeft, bottomRight);
        this.tintFill = true;
        return this;
    },

    tint: {
        get(this: any): number {
            return this.tintTopLeft;
        },

        set(this: any, value: number): void {
            this.setTint(value, value, value, value);
        }
    },

    isTinted: {
        get(this: any): boolean {
            const white = 0xffffff;
            return (
                this.tintFill ||
                this.tintTopLeft !== white ||
                this.tintTopRight !== white ||
                this.tintBottomLeft !== white ||
                this.tintBottomRight !== white
            );
        }
    }
};
