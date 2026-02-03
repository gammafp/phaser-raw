/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { GetAdvancedValue } from '../../utils/object/GetAdvancedValue';
import { Sprite } from './Sprite';

const BuildGameObject = require('../BuildGameObject');
const BuildGameObjectAnimation = require('../BuildGameObjectAnimation');
const GameObjectCreator = require('../GameObjectCreator');

/**
 * Creates a new Sprite Game Object and returns it.
 *
 * Note: This method will only be available if the Sprite Game Object has been built into Phaser.
 *
 * @method Phaser.GameObjects.GameObjectCreator#sprite
 * @since 3.0.0
 *
 * @param {Phaser.Types.GameObjects.Sprite.SpriteConfig} config - The configuration object this Game Object will use to create itself.
 * @param {boolean} [addToScene=true] - Add this Game Object to the Scene after creating it? If set this argument overrides the `add` property in the config object.
 *
 * @return {Phaser.GameObjects.Sprite} The Game Object that was created.
 */
GameObjectCreator.register('sprite', function (this: any, config: Record<string, any>, addToScene?: boolean): any
{
    if (config === undefined) { config = {}; }

    const key = GetAdvancedValue(config, 'key', null);
    const frame = GetAdvancedValue(config, 'frame', null);

    const sprite = new Sprite(this.scene, 0, 0, key, frame);

    if (addToScene !== undefined)
    {
        config.add = addToScene;
    }

    BuildGameObject(this.scene, sprite, config);

    //  Sprite specific config options:
    BuildGameObjectAnimation(sprite, config);

    return sprite;
});
