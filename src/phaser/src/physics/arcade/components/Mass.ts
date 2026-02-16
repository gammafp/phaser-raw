/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Provides methods used for setting the mass properties of an Arcade Physics Body.
 */
export interface Mass {
    setMass(value: number): this;
}

export const Mass = {

    setMass(this: any, value: number): any
    {
        this.body.mass = value;

        return this;
    }

};
