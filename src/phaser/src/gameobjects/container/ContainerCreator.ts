/**
 * @author       Richard Davey <rich@phaser.io>
 * @author       Felipe Alfonso <@bitnenfer>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { GetAdvancedValue } from '../../utils/object/GetAdvancedValue';
import { GetFastValue } from '../../utils/object/GetFastValue';
import { Container } from './Container';

var BuildGameObject = require('../BuildGameObject');
var GameObjectCreator = require('../GameObjectCreator');

/**
 * Creates a new Container Game Object and returns it.
 *
 * Note: This method will only be available if the Container Game Object has been built into Phaser.
 *
 * @method Phaser.GameObjects.GameObjectCreator#container
 * @since 3.4.0
 *
 * @param {Phaser.Types.GameObjects.Container.ContainerConfig} config - The configuration object this Game Object will use to create itself.
 * @param {boolean} [addToScene] - Add this Game Object to the Scene after creating it? If set this argument overrides the `add` property in the config object.
 *
 * @return {Phaser.GameObjects.Container} The Game Object that was created.
 */
export const ContainerCreator = function (this: any, config?: any, addToScene?: boolean): any
{
    if (config === undefined) { config = {}; }

    const x = GetAdvancedValue(config, 'x', 0);
    const y = GetAdvancedValue(config, 'y', 0);
    const children = GetFastValue(config, 'children', null);

    const container = new Container(this.scene, x, y, children);

    if (addToScene !== undefined)
    {
        config.add = addToScene;
    }

    BuildGameObject(this.scene, container, config);

    return container;
};

GameObjectCreator.register('container', ContainerCreator);
