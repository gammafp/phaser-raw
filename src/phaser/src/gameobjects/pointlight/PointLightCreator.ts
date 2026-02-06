/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { GetAdvancedValue } from '../../utils/object/GetAdvancedValue';
import { BuildGameObject } from '../BuildGameObject';
import { GameObjectCreator } from '../GameObjectCreator';
import { PointLight } from './PointLight';

GameObjectCreator.register('pointlight', function (this: any, config?: any, addToScene?: boolean): PointLight
{
    if (config === undefined) { config = {}; }

    const color = GetAdvancedValue(config, 'color', 0xffffff);
    const radius = GetAdvancedValue(config, 'radius', 128);
    const intensity = GetAdvancedValue(config, 'intensity', 1);
    const attenuation = GetAdvancedValue(config, 'attenuation', 0.1);

    const layer = new PointLight(this.scene, 0, 0, color, radius, intensity, attenuation);

    if (addToScene !== undefined)
    {
        config.add = addToScene;
    }

    BuildGameObject(this.scene, layer, config);

    return layer;
});


