/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { GetAdvancedValue } from '../../utils/object/GetAdvancedValue';
import { Blitter } from './Blitter';

const BuildGameObject = require('../BuildGameObject');
const GameObjectCreator = require('../GameObjectCreator');

/**
 * Creates a new Blitter Game Object and returns it.
 *
 * Note: This method will only be available if the Blitter Game Object has been built into Phaser.
 *
 * @method Phaser.GameObjects.GameObjectCreator#blitter
 * @since 3.0.0
 *
 * @param {Phaser.Types.GameObjects.Sprite.SpriteConfig} config - The configuration object this Game Object will use to create itself.
 * @param {boolean} [addToScene] - Add this Game Object to the Scene after creating it? If set this argument overrides the `add` property in the config object.
 *
 * @return {Phaser.GameObjects.Blitter} The Game Object that was created.
 */
export const BlitterCreator = function (this: any, config?: any, addToScene?: boolean): any
{
    if (config === undefined) { config = {}; }

    const key = GetAdvancedValue(config, 'key', null);
    const frame = GetAdvancedValue(config, 'frame', null);

    const blitter = new Blitter(this.scene, 0, 0, key, frame);

    if (addToScene !== undefined)
    {
        config.add = addToScene;
    }

    BuildGameObject(this.scene, blitter, config);

    return blitter;
};

GameObjectCreator.register('blitter', BlitterCreator);

//  When registering a factory function 'this' refers to the GameObjectCreator context.
