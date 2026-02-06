/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { GetAdvancedValue } from '../../../utils/object/GetAdvancedValue';
import { GetValue } from '../../../utils/object/GetValue';
import { BitmapText } from './BitmapText';
import { BuildGameObject } from '../../BuildGameObject';
import { GameObjectCreator } from '../../GameObjectCreator';

GameObjectCreator.register('bitmapText', function (this: any, config?: any, addToScene?: boolean): BitmapText
{
    if (config === undefined) { config = {}; }

    const font = GetValue(config, 'font', '');
    const text = GetAdvancedValue(config, 'text', '');
    const size = GetAdvancedValue(config, 'size', false);
    const align = GetValue(config, 'align', 0);

    const bitmapText = new BitmapText(this.scene, 0, 0, font, text, size, align);

    if (addToScene !== undefined)
    {
        config.add = addToScene;
    }

    BuildGameObject(this.scene, bitmapText, config);

    return bitmapText;
});


