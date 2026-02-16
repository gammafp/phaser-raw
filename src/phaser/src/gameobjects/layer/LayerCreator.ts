/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { GetAdvancedValue } from '../../utils/object/GetAdvancedValue';
import { Layer } from './Layer';

const BuildGameObject = require('../BuildGameObject');
const GameObjectCreator = require('../GameObjectCreator');

/**
 * Creates a new Layer Game Object and returns it.
 *
 * Note: This method will only be available if the Layer Game Object has been built into Phaser.
 *
 * @method Phaser.GameObjects.GameObjectCreator#layer
 * @since 3.50.0
 *
 * @param {Phaser.Types.GameObjects.Sprite.SpriteConfig} config - The configuration object this Game Object will use to create itself.
 * @param {boolean} [addToScene] - Add this Game Object to the Scene after creating it? If set this argument overrides the `add` property in the config object.
 *
 * @return {Phaser.GameObjects.Layer} The Game Object that was created.
 */
export const LayerCreator = function (this: any, config?: any, addToScene?: boolean): any
{
    if (config === undefined) { config = {}; }

    const children = GetAdvancedValue(config, 'children', null);

    const layer = new Layer(this.scene, children);

    if (addToScene !== undefined)
    {
        config.add = addToScene;
    }

    BuildGameObject(this.scene, layer, config);

    return layer;
};

GameObjectCreator.register('layer', LayerCreator);
