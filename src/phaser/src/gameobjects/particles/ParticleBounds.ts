/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { Rectangle } from '../../geom/rectangle/Rectangle';
import { ParticleProcessor } from './ParticleProcessor';

/**
 * @classdesc
 * The Particle Bounds Processor.
 *
 * Defines a rectangular region, in world space, within which particle movement
 * is restrained.
 *
 * Use the properties `collideLeft`, `collideRight`, `collideTop` and
 * `collideBottom` to control if a particle will rebound off the sides
 * of this boundary, or not.
 *
 * This happens when the particles worldPosition x/y coordinate hits the boundary.
 *
 * The strength of the rebound is determined by the `Particle.bounce` property.
 *
 * @class ParticleBounds
 * @extends Phaser.GameObjects.Particles.ParticleProcessor
 * @memberof Phaser.GameObjects.Particles
 * @constructor
 * @since 3.60.0
 */
export class ParticleBounds extends ParticleProcessor
{
    /**
     * A rectangular boundary constraining particle movement.
     */
    bounds: any;

    /**
     * Whether particles interact with the left edge of the emitter bounds.
     */
    collideLeft: boolean;

    /**
     * Whether particles interact with the right edge of the emitter bounds.
     */
    collideRight: boolean;

    /**
     * Whether particles interact with the top edge of the emitter bounds.
     */
    collideTop: boolean;

    /**
     * Whether particles interact with the bottom edge of the emitter bounds.
     */
    collideBottom: boolean;

    constructor (x: number, y: number, width: number, height: number, collideLeft: boolean = true, collideRight: boolean = true, collideTop: boolean = true, collideBottom: boolean = true)
    {
        super(x, y, true);

        this.bounds = new Rectangle(x, y, width, height);
        this.collideLeft = collideLeft;
        this.collideRight = collideRight;
        this.collideTop = collideTop;
        this.collideBottom = collideBottom;
    }

    /**
     * Takes a Particle and updates it against the bounds.
     */
    update (particle: any): void
    {
        var bounds = this.bounds;
        var bounce = -particle.bounce;
        var pos = particle.worldPosition;

        if (pos.x < bounds.x && this.collideLeft)
        {
            particle.x += bounds.x - pos.x;
            particle.velocityX *= bounce;
        }
        else if (pos.x > bounds.right && this.collideRight)
        {
            particle.x -= pos.x - bounds.right;
            particle.velocityX *= bounce;
        }

        if (pos.y < bounds.y && this.collideTop)
        {
            particle.y += bounds.y - pos.y;
            particle.velocityY *= bounce;
        }
        else if (pos.y > bounds.bottom && this.collideBottom)
        {
            particle.y -= pos.y - bounds.bottom;
            particle.velocityY *= bounce;
        }
    }
}
