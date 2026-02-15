/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

export const Mass = {

    setMass(this: any, value: number): any
    {
        this.body.mass = value;

        return this;
    }

};
