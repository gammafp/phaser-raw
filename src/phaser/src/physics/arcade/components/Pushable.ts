/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Provides methods used for setting the pushable property of an Arcade Physics Body.
 */
export interface Pushable {
    setPushable(value?: boolean): this;
}

export const Pushable = {

    setPushable(this: any, value?: boolean): any
    {
        if (value === undefined) { value = true; }

        this.body.pushable = value;

        return this;
    }

};
