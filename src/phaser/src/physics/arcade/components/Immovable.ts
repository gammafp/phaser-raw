/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Provides methods used for setting the immovable properties of an Arcade Physics Body.
 */
export interface Immovable {
    setImmovable(value?: boolean): this;
}

export const Immovable = {

    setImmovable(this: any, value?: boolean): any
    {
        if (value === undefined) { value = true; }

        this.body.immovable = value;

        return this;
    }

};
