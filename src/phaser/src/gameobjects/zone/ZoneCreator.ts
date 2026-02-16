/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { GetAdvancedValue } from '../../utils/object/GetAdvancedValue';
import { Zone } from './Zone';

const GameObjectCreator = require('../GameObjectCreator');

/**
 * Creates a new Zone Game Object and returns it.
 *
 * Note: This method will only be available if the Zone Game Object has been built into Phaser.
 *
 * @method Phaser.GameObjects.GameObjectCreator#zone
 * @since 3.0.0
 *
 * @param {Phaser.Types.GameObjects.Zone.ZoneConfig} config - The configuration object this Game Object will use to create itself.
 *
 * @return {Phaser.GameObjects.Zone} The Game Object that was created.
 */
export const ZoneCreator = function (this: any, config: any): Zone {
    const x = GetAdvancedValue(config, 'x', 0);
    const y = GetAdvancedValue(config, 'y', 0);
    const width = GetAdvancedValue(config, 'width', 1);
    const height = GetAdvancedValue(config, 'height', width);

    return new Zone(this.scene, x, y, width, height);
};

GameObjectCreator.register('zone', ZoneCreator);

//  When registering a factory function 'this' refers to the GameObjectCreator context.
