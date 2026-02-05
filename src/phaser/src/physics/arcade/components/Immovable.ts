/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

export const Immovable = {

    setImmovable(this: any, value: boolean = true): any
    {
        this.body.immovable = value;

        return this;
    }

};
