/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

export const Debug = {

    setDebug(this: any, showBody: boolean, showVelocity: boolean, bodyColor: number): any
    {
        this.debugShowBody = showBody;
        this.debugShowVelocity = showVelocity;
        this.debugBodyColor = bodyColor;

        return this;
    },

    setDebugBodyColor(this: any, value: number): any
    {
        this.body.debugBodyColor = value;

        return this;
    },

    debugShowBody: {

        get(this: any): boolean
        {
            return this.body.debugShowBody;
        },

        set(this: any, value: boolean)
        {
            this.body.debugShowBody = value;
        }

    },

    debugShowVelocity: {

        get(this: any): boolean
        {
            return this.body.debugShowVelocity;
        },

        set(this: any, value: boolean)
        {
            this.body.debugShowVelocity = value;
        }

    },

    debugBodyColor: {

        get(this: any): number
        {
            return this.body.debugBodyColor;
        },

        set(this: any, value: number)
        {
            this.body.debugBodyColor = value;
        }

    }

};
