/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { GetAdvancedValue } from '../../utils/object/GetAdvancedValue';
import { Image } from './Image';

import { BuildGameObject } from '../BuildGameObject';
import { GameObjectCreator } from '../GameObjectCreator';

/**
 * Creates a new Image Game Object and returns it.
 *
 * Note: This method will only be available if the Image Game Object has been built into Phaser.
 *
 * @method Phaser.GameObjects.GameObjectCreator#image
 * @since 3.0.0
 *
 * @param {Phaser.Types.GameObjects.Sprite.SpriteConfig} config - The configuration object this Game Object will use to create itself.
 * @param {boolean} [addToScene] - Add this Game Object to the Scene after creating it? If set this argument overrides the `add` property in the config object.
 *
 * @return {Phaser.GameObjects.Image} The Game Object that was created.
 */
GameObjectCreator.register('image', function (this: any, config: Record<string, any>, addToScene?: boolean): any
{
    if (config === undefined) { config = {}; }

    const key = GetAdvancedValue(config, 'key', null);
    const frame = GetAdvancedValue(config, 'frame', null);

    const image = new Image(this.scene, 0, 0, key, frame);

    if (addToScene !== undefined)
    {
        config.add = addToScene;
    }

    BuildGameObject(this.scene, image, config);

    return image;
});

//  When registering a factory function 'this' refers to the GameObjectCreator context.


