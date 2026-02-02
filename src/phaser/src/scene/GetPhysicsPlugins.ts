/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { GetFastValue } from '../utils/object/GetFastValue';
import { UppercaseFirst } from '../utils/string/UppercaseFirst';

/**
 * Builds an array of which physics plugins should be activated for the given Scene.
 *
 * @function Phaser.Scenes.GetPhysicsPlugins
 * @since 3.0.0
 *
 * @param {Phaser.Scenes.Systems} sys - The scene system to get the physics systems of.
 *
 * @return {array} An array of Physics systems to start for this Scene.
 */
export const GetPhysicsPlugins = (sys: any): string[] | undefined =>
{
    const defaultSystem = sys.game.config.defaultPhysicsSystem;
    const sceneSystems = GetFastValue(sys.settings, 'physics', false);

    if (!defaultSystem && !sceneSystems)
    {
        //  No default physics system or systems in this scene
        return;
    }

    //  Let's build the systems array
    const output: string[] = [];

    if (defaultSystem)
    {
        output.push(UppercaseFirst(defaultSystem + 'Physics'));
    }

    if (sceneSystems)
    {
        for (let key in sceneSystems)
        {
            key = UppercaseFirst(key.concat('Physics'));

            if (output.indexOf(key) === -1)
            {
                output.push(key);
            }
        }
    }

    //  An array of Physics systems to start for this Scene
    return output;
};
