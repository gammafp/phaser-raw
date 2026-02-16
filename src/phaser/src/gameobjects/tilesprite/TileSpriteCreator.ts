/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { GetAdvancedValue } from '../../utils/object/GetAdvancedValue';
import { TileSprite } from './TileSprite';

const BuildGameObject = require('../BuildGameObject');
const GameObjectCreator = require('../GameObjectCreator');

/**
 * Creates a new TileSprite Game Object and returns it.
 *
 * Note: This method will only be available if the TileSprite Game Object has been built into Phaser.
 *
 * @method Phaser.GameObjects.GameObjectCreator#tileSprite
 * @since 3.0.0
 *
 * @param {Phaser.Types.GameObjects.TileSprite.TileSpriteConfig} config - The configuration object this Game Object will use to create itself.
 * @param {boolean} [addToScene] - Add this Game Object to the Scene after creating it? If set this argument overrides the `add` property in the config object.
 *
 * @return {Phaser.GameObjects.TileSprite} The Game Object that was created.
 */
export const TileSpriteCreator = function (this: any, config: any, addToScene?: boolean): TileSprite {
    if (config === undefined) { config = {}; }

    const x = GetAdvancedValue(config, 'x', 0);
    const y = GetAdvancedValue(config, 'y', 0);
    const width = GetAdvancedValue(config, 'width', 512);
    const height = GetAdvancedValue(config, 'height', 512);
    const key = GetAdvancedValue(config, 'key', '');
    const frame = GetAdvancedValue(config, 'frame', '');

    const tile = new TileSprite(this.scene, x, y, width, height, key, frame);

    if (addToScene !== undefined)
    {
        config.add = addToScene;
    }

    BuildGameObject(this.scene, tile, config);

    return tile;
};

GameObjectCreator.register('tileSprite', TileSpriteCreator);
