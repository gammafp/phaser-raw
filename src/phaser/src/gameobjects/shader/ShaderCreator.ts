/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { GetAdvancedValue } from '../../utils/object/GetAdvancedValue';
import { Shader } from './Shader';

const BuildGameObject = require('../BuildGameObject');
const GameObjectCreator = require('../GameObjectCreator');

/**
 * Creates a new Shader Game Object and returns it.
 *
 * Note: This method will only be available if the Shader Game Object and WebGL support have been built into Phaser.
 *
 * @method Phaser.GameObjects.GameObjectCreator#shader
 * @since 3.17.0
 *
 * @param {Phaser.Types.GameObjects.Shader.ShaderConfig} config - The configuration object this Game Object will use to create itself.
 * @param {boolean} [addToScene] - Add this Game Object to the Scene after creating it? If set this argument overrides the `add` property in the config object.
 *
 * @return {Phaser.GameObjects.Shader} The Game Object that was created.
 */
export const ShaderCreator = function (this: any, config: any, addToScene?: boolean): Shader {
    if (config === undefined) { config = {}; }

    const quadConfig = GetAdvancedValue(config, 'config', null);
    const x = GetAdvancedValue(config, 'x', 0);
    const y = GetAdvancedValue(config, 'y', 0);
    const width = GetAdvancedValue(config, 'width', 128);
    const height = GetAdvancedValue(config, 'height', 128);

    const shader = new Shader(this.scene, quadConfig, x, y, width, height);

    if (addToScene !== undefined)
    {
        config.add = addToScene;
    }

    BuildGameObject(this.scene, shader, config);

    return shader;
};

GameObjectCreator.register('shader', ShaderCreator);

//  When registering a factory function 'this' refers to the GameObjectCreator context.
