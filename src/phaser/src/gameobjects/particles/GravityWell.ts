/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { GetFastValue } from '../../utils/object/GetFastValue';
import { ParticleProcessor } from './ParticleProcessor';

/**
 * @classdesc
 * The Gravity Well Particle Processor applies a force on the particles to draw
 * them towards, or repel them from, a single point.
 *
 * The force applied is inversely proportional to the square of the distance
 * from the particle to the point, in accordance with Newton's law of gravity.
 *
 * This simulates the effect of gravity over large distances (as between planets, for example).
 *
 * @class GravityWell
 * @extends Phaser.GameObjects.Particles.ParticleProcessor
 * @memberof Phaser.GameObjects.Particles
 * @constructor
 * @since 3.0.0
 */
export class GravityWell extends ParticleProcessor
{
    /**
     * Internal gravity value.
     */
    _gravity: number;

    /**
     * Internal power value.
     */
    _power: number;

    /**
     * Internal epsilon value.
     */
    _epsilon: number;

    constructor (x?: number | any, y?: number, power?: number, epsilon?: number, gravity?: number)
    {
        if (typeof x === 'object')
        {
            var config = x;

            x = GetFastValue(config, 'x', 0);
            y = GetFastValue(config, 'y', 0);
            power = GetFastValue(config, 'power', 0);
            epsilon = GetFastValue(config, 'epsilon', 100);
            gravity = GetFastValue(config, 'gravity', 50);
        }
        else
        {
            if (x === undefined) { x = 0; }
            if (y === undefined) { y = 0; }
            if (power === undefined) { power = 0; }
            if (epsilon === undefined) { epsilon = 100; }
            if (gravity === undefined) { gravity = 50; }
        }

        super(x as number, y as number, true);

        this._gravity = gravity!;
        this._power = power! * gravity!;
        this._epsilon = epsilon! * epsilon!;
    }

    /**
     * Takes a Particle and updates it based on the properties of this Gravity Well.
     */
    update (particle: any, delta: number): void
    {
        var x = this.x - particle.x;
        var y = this.y - particle.y;
        var dSq = x * x + y * y;

        if (dSq === 0)
        {
            return;
        }

        var d = Math.sqrt(dSq);

        if (dSq < this._epsilon)
        {
            dSq = this._epsilon;
        }

        var factor = ((this._power * delta) / (dSq * d)) * 100;

        particle.velocityX += x * factor;
        particle.velocityY += y * factor;
    }

    /**
     * The minimum distance for which the gravity force is calculated.
     * Defaults to 100.
     */
    get epsilon (): number
    {
        return Math.sqrt(this._epsilon);
    }

    set epsilon (value: number)
    {
        this._epsilon = value * value;
    }

    /**
     * The strength of the gravity force - larger numbers produce a stronger force.
     * Defaults to 0.
     */
    get power (): number
    {
        return this._power / this._gravity;
    }

    set power (value: number)
    {
        this._power = value * this._gravity;
    }

    /**
     * The gravitational force of this Gravity Well.
     * Defaults to 50.
     */
    get gravity (): number
    {
        return this._gravity;
    }

    set gravity (value: number)
    {
        var pwr = this.power;
        this._gravity = value;
        this.power = pwr;
    }
}
