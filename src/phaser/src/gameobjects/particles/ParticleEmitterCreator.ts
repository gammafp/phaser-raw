/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { GetAdvancedValue } from '../../utils/object/GetAdvancedValue';
import { GetFastValue } from '../../utils/object/GetFastValue';
import { ParticleEmitter } from './ParticleEmitter';

var BuildGameObject = require('../BuildGameObject');
var GameObjectCreator = require('../GameObjectCreator');

/**
 * Creates a new Particle Emitter Game Object and returns it.
 *
 * Prior to Phaser v3.60 this function would create a `ParticleEmitterManager`. These were removed
 * in v3.60 and replaced with creating a `ParticleEmitter` instance directly. Please see the
 * updated function parameters and class documentation for more details.
 *
 * Note: This method will only be available if the Particles Game Object has been built into Phaser.
 *
 * @method Phaser.GameObjects.GameObjectCreator#particles
 * @since 3.0.0
 */
export const ParticleEmitterCreator = function (this: any, config: any, addToScene?: boolean): any
{
    if (config === undefined) { config = {}; }

    var key = GetAdvancedValue(config, 'key', null);
    var emitterConfig = GetFastValue(config, 'config', null);

    var emitter = new ParticleEmitter(this.scene, 0, 0, key);

    if (addToScene !== undefined)
    {
        config.add = addToScene;
    }

    BuildGameObject(this.scene, emitter, config);

    if (emitterConfig)
    {
        emitter.setConfig(emitterConfig);
    }

    return emitter;
};

GameObjectCreator.register('particles', ParticleEmitterCreator);
