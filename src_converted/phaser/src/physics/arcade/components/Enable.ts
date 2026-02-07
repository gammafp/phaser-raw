/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

export const Enable = {

    setDirectControl(this: any, value?: boolean): any
    {
        this.body.setDirectControl(value);

        return this;
    },

    enableBody(this: any, reset?: boolean, x?: number, y?: number, enableGameObject?: boolean, showGameObject?: boolean): any
    {
        if (reset)
        {
            this.body.reset(x, y);
        }

        if (enableGameObject)
        {
            this.body.gameObject.active = true;
        }

        if (showGameObject)
        {
            this.body.gameObject.visible = true;
        }

        this.body.enable = true;

        return this;
    },

    disableBody(this: any, disableGameObject: boolean = false, hideGameObject: boolean = false): any
    {
        this.body.stop();

        this.body.enable = false;

        if (disableGameObject)
        {
            this.body.gameObject.active = false;
        }

        if (hideGameObject)
        {
            this.body.gameObject.visible = false;
        }

        return this;
    },

    refreshBody(this: any): any
    {
        this.body.updateFromGameObject();

        return this;
    }

};
