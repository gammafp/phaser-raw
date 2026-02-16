/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { ParticleEmitter } from './ParticleEmitter';

var GameObjectFactory = require('../GameObjectFactory');

/**
 * Creates a new Particle Emitter Game Object and adds it to the Scene.
 *
 * If you wish to configure the Emitter after creating it, use the `ParticleEmitter.setConfig` method.
 *
 * Prior to Phaser v3.60 this function would create a `ParticleEmitterManager`. These were removed
 * in v3.60 and replaced with creating a `ParticleEmitter` instance directly. Please see the
 * updated function parameters and class documentation for more details.
 *
 * Note: This method will only be available if the Particles Game Object has been built into Phaser.
 *
 * @method Phaser.GameObjects.GameObjectFactory#particles
 * @since 3.60.0
 */
export const ParticleEmitterFactory = function (this: any, x: any, y: any, texture: any, config: any): any
{
    if (x !== undefined && typeof x === 'string')
    {
        console.warn('ParticleEmitterManager was removed in Phaser 3.60. See documentation for details');
    }

    return this.displayList.add(new ParticleEmitter(this.scene, x, y, texture, config));
};

GameObjectFactory.register('particles', ParticleEmitterFactory);
