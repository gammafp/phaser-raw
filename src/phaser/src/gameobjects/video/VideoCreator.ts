/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { GetAdvancedValue } from '../../utils/object/GetAdvancedValue';
import { Video } from './Video';

import { BuildGameObject } from '../BuildGameObject';
import { GameObjectCreator } from '../GameObjectCreator';

/**
 * Creates a new Video Game Object and returns it.
 *
 * Note: This method will only be available if the Video Game Object has been built into Phaser.
 *
 * @method Phaser.GameObjects.GameObjectCreator#video
 * @since 3.20.0
 *
 * @param {Phaser.Types.GameObjects.Video.VideoConfig} config - The configuration object this Game Object will use to create itself.
 * @param {boolean} [addToScene] - Add this Game Object to the Scene after creating it? If set this argument overrides the `add` property in the config object.
 *
 * @return {Phaser.GameObjects.Video} The Game Object that was created.
 */
export const VideoCreator = function (this: any, config: any, addToScene?: boolean): any
{
    if (config === undefined) { config = {}; }

    var key = GetAdvancedValue(config, 'key', null);

    var video = new Video(this.scene, 0, 0, key);

    if (addToScene !== undefined)
    {
        config.add = addToScene;
    }

    BuildGameObject(this.scene, video, config);

    return video;
};

GameObjectCreator.register('video', VideoCreator);

//  When registering a factory function 'this' refers to the GameObjectCreator context.
