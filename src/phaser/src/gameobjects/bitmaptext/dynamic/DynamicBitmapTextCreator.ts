/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { GetAdvancedValue } from '../../../utils/object/GetAdvancedValue';
import { DynamicBitmapText } from './DynamicBitmapText';
import { BuildGameObject } from '../../BuildGameObject';
import { GameObjectCreator } from '../../GameObjectCreator';

GameObjectCreator.register('dynamicBitmapText', function (this: any, config?: any, addToScene?: boolean): DynamicBitmapText
{
    if (config === undefined) { config = {}; }

    const font = GetAdvancedValue(config, 'font', '');
    const text = GetAdvancedValue(config, 'text', '');
    const size = GetAdvancedValue(config, 'size', false);

    const bitmapText = new DynamicBitmapText(this.scene, 0, 0, font, text, size);

    if (addToScene !== undefined)
    {
        config.add = addToScene;
    }

    BuildGameObject(this.scene, bitmapText, config);

    return bitmapText;
});


