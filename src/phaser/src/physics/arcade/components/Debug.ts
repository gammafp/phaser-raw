/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Provides methods used for setting the debug properties of an Arcade Physics Body.
 */
export interface Debug {
    setDebug(showBody: boolean, showVelocity: boolean, bodyColor: number): this;
    setDebugBodyColor(value: number): this;
    debugShowBody: boolean;
    debugShowVelocity: boolean;
    debugBodyColor: number;
}

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

    get debugShowBody(): boolean
    {
        return (this as any).body.debugShowBody;
    },

    set debugShowBody(value: boolean)
    {
        (this as any).body.debugShowBody = value;
    },

    get debugShowVelocity(): boolean
    {
        return (this as any).body.debugShowVelocity;
    },

    set debugShowVelocity(value: boolean)
    {
        (this as any).body.debugShowVelocity = value;
    },

    get debugBodyColor(): number
    {
        return (this as any).body.debugBodyColor;
    },

    set debugBodyColor(value: number)
    {
        (this as any).body.debugBodyColor = value;
    }

};
