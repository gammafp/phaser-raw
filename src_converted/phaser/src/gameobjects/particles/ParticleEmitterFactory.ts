/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { ParticleEmitter } from './ParticleEmitter';
import { GameObjectFactory } from '../GameObjectFactory';

GameObjectFactory.register('particles', function (this: any, x?: number, y?: number, texture?: string, config?: any): ParticleEmitter
{
    return this.displayList.add(new ParticleEmitter(this.scene, x, y, texture, config));
});

