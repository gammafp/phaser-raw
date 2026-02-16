/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { EmitterColorOp } from './EmitterColorOp';
import { EmitterOp } from './EmitterOp';
import { GravityWell } from './GravityWell';
import { Particle } from './Particle';
import { ParticleBounds } from './ParticleBounds';
import { ParticleEmitter } from './ParticleEmitter';
import { ParticleProcessor } from './ParticleProcessor';

var Events = require('./events');
var Zones = require('./zones');

/**
 * @namespace Phaser.GameObjects.Particles
 */

module.exports = {

    EmitterColorOp: EmitterColorOp,
    EmitterOp: EmitterOp,
    Events: Events,
    GravityWell: GravityWell,
    Particle: Particle,
    ParticleBounds: ParticleBounds,
    ParticleEmitter: ParticleEmitter,
    ParticleProcessor: ParticleProcessor,
    Zones: Zones

};
