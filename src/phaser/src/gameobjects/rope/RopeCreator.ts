/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { GetAdvancedValue } from '../../utils/object/GetAdvancedValue';
import { GetValue } from '../../utils/object/GetValue';
import { Rope } from './Rope';

const BuildGameObject = require('../BuildGameObject');
const GameObjectCreator = require('../GameObjectCreator');

/**
 * Creates a new Rope Game Object and returns it.
 *
 * Note: This method will only be available if the Rope Game Object and WebGL support have been built into Phaser.
 *
 * @method Phaser.GameObjects.GameObjectCreator#rope
 * @since 3.23.0
 *
 * @param {Phaser.Types.GameObjects.Rope.RopeConfig} config - The configuration object this Game Object will use to create itself.
 * @param {boolean} [addToScene] - Add this Game Object to the Scene after creating it? If set this argument overrides the `add` property in the config object.
 *
 * @return {Phaser.GameObjects.Rope} The Game Object that was created.
 */
export const RopeCreator = function (this: any, config: any, addToScene?: boolean): Rope {
    if (config === undefined) { config = {}; }

    const key = GetAdvancedValue(config, 'key', null);
    const frame = GetAdvancedValue(config, 'frame', null);
    const horizontal = GetAdvancedValue(config, 'horizontal', true);
    const points = GetValue(config, 'points', undefined);
    const colors = GetValue(config, 'colors', undefined);
    const alphas = GetValue(config, 'alphas', undefined);

    const rope = new Rope(this.scene, 0, 0, key, frame, points, horizontal, colors, alphas);

    if (addToScene !== undefined)
    {
        config.add = addToScene;
    }

    BuildGameObject(this.scene, rope, config);

    return rope;
};

GameObjectCreator.register('rope', RopeCreator);

//  When registering a factory function 'this' refers to the GameObjectCreator context.
