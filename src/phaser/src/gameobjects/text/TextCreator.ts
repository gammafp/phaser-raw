/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { GetAdvancedValue } from '../../utils/object/GetAdvancedValue';
import { Text } from './Text';

import { BuildGameObject } from '../BuildGameObject';
import { GameObjectCreator } from '../GameObjectCreator';

/**
 * Creates a new Text Game Object and returns it.
 *
 * Note: This method will only be available if the Text Game Object has been built into Phaser.
 *
 * @method Phaser.GameObjects.GameObjectCreator#text
 * @since 3.0.0
 *
 * @param {Phaser.Types.GameObjects.Text.TextConfig} config - The configuration object this Game Object will use to create itself.
 * @param {boolean} [addToScene] - Add this Game Object to the Scene after creating it? If set this argument overrides the `add` property in the config object.
 *
 * @return {Phaser.GameObjects.Text} The Game Object that was created.
 */
GameObjectCreator.register('text', function (this: any, config: Record<string, any>, addToScene?: boolean): any
{
    if (config === undefined) { config = {}; }

    const content = GetAdvancedValue(config, 'text', '');
    let style = GetAdvancedValue(config, 'style', null);

    const padding = GetAdvancedValue(config, 'padding', null);

    if (padding !== null)
    {
        style.padding = padding;
    }

    const text = new Text(this.scene, 0, 0, content, style);

    if (addToScene !== undefined)
    {
        config.add = addToScene;
    }

    BuildGameObject(this.scene, text, config);

    //  Text specific config options:
    text.autoRound = GetAdvancedValue(config, 'autoRound', true);
    text.resolution = GetAdvancedValue(config, 'resolution', 1);

    return text;
});

//  When registering a factory function 'this' refers to the GameObjectCreator context.


