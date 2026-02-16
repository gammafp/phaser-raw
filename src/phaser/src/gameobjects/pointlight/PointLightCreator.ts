/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { GetAdvancedValue } from '../../utils/object/GetAdvancedValue';
import { PointLight } from './PointLight';

import { BuildGameObject } from '../BuildGameObject';
import { GameObjectCreator } from '../GameObjectCreator';

/**
 * Creates a new Point Light Game Object and returns it.
 *
 * Note: This method will only be available if the Point Light Game Object has been built into Phaser.
 *
 * @method Phaser.GameObjects.GameObjectCreator#pointlight
 * @since 3.50.0
 *
 * @param {object} config - The configuration object this Game Object will use to create itself.
 * @param {boolean} [addToScene] - Add this Game Object to the Scene after creating it? If set this argument overrides the `add` property in the config object.
 *
 * @return {Phaser.GameObjects.PointLight} The Game Object that was created.
 */
export const PointLightCreator = function (this: any, config: any, addToScene?: boolean): PointLight {
    if (config === undefined) { config = {}; }

    const color = GetAdvancedValue(config, 'color', 0xffffff);
    const radius = GetAdvancedValue(config, 'radius', 128);
    const intensity = GetAdvancedValue(config, 'intensity', 1);
    const attenuation = GetAdvancedValue(config, 'attenuation', 0.1);

    const layer = new PointLight(this.scene, 0, 0, color, radius, intensity, attenuation);

    if (addToScene !== undefined)
    {
        config.add = addToScene;
    }

    BuildGameObject(this.scene, layer, config);

    return layer;
};

GameObjectCreator.register('pointlight', PointLightCreator);
