/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { GetAdvancedValue } from '../../utils/object/GetAdvancedValue';
import { GetFastValue } from '../../utils/object/GetFastValue';
import { ParticleEmitter } from './ParticleEmitter';
import { BuildGameObject } from '../BuildGameObject';
import { GameObjectCreator } from '../GameObjectCreator';

GameObjectCreator.register('particles', function (this: any, config?: any, addToScene?: boolean): ParticleEmitter
{
    if (config === undefined) { config = {}; }

    const key = GetAdvancedValue(config, 'key', null);

    const emitter = new ParticleEmitter(this.scene, 0, 0, key, config);

    if (addToScene !== undefined)
    {
        config.add = addToScene;
    }

    BuildGameObject(this.scene, emitter, config);

    return emitter;
});


