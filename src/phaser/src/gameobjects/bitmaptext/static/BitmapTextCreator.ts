/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { GetAdvancedValue } from '../../../utils/object/GetAdvancedValue';
import { GetValue } from '../../../utils/object/GetValue';
import { BitmapText } from './BitmapText';

import { BuildGameObject } from '../../BuildGameObject';
import { GameObjectCreator } from '../../GameObjectCreator';

/**
 * Creates a new Bitmap Text Game Object and returns it.
 *
 * @method Phaser.GameObjects.GameObjectCreator#bitmapText
 * @since 3.0.0
 *
 * @param {Phaser.Types.GameObjects.BitmapText.BitmapTextConfig} config - The configuration object this Game Object will use to create itself.
 * @param {boolean} [addToScene] - Add this Game Object to the Scene after creating it?
 *
 * @return {Phaser.GameObjects.BitmapText} The Game Object that was created.
 */
export const BitmapTextCreator = function (this: any, config: any, addToScene?: boolean): any
{
    if (config === undefined) { config = {}; }

    var font = GetValue(config, 'font', '');
    var text = GetAdvancedValue(config, 'text', '');
    var size = GetAdvancedValue(config, 'size', false);
    var align = GetValue(config, 'align', 0);

    var bitmapText = new BitmapText(this.scene, 0, 0, font, text, size, align);

    if (addToScene !== undefined)
    {
        config.add = addToScene;
    }

    BuildGameObject(this.scene, bitmapText, config);

    return bitmapText;
};

GameObjectCreator.register('bitmapText', BitmapTextCreator);
