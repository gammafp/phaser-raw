/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { Zone } from './Zone';
import { GameObjectCreator } from '../GameObjectCreator';
import { GetAdvancedValue } from '../../utils/object/GetAdvancedValue';

GameObjectCreator.register('zone', function (this: any, config: any, addToScene?: boolean): Zone
{
    if (config === undefined) { config = {}; }

    var x = GetAdvancedValue(config, 'x', 0);
    var y = GetAdvancedValue(config, 'y', 0);
    var width = GetAdvancedValue(config, 'width', 1);
    var height = GetAdvancedValue(config, 'height', width);

    var zone = new Zone(this.scene, x, y, width, height);

    if (addToScene !== undefined)
    {
        config.add = addToScene;
    }

    return zone;
});

