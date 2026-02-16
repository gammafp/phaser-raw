/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * @classdesc
 * This class provides the structured required for all Particle Processors.
 *
 * You should extend it and add the functionality required for your processor,
 * including tidying up any resources this may create in the `destroy` method.
 *
 * See the GravityWell for an example of a processor.
 *
 * @class ParticleProcessor
 * @memberof Phaser.GameObjects.Particles
 * @constructor
 * @since 3.60.0
 */
export class ParticleProcessor
{
    /**
     * A reference to the Particle Emitter that owns this Processor.
     */
    emitter: any;

    /**
     * The x coordinate of the Particle Processor, in world space.
     */
    x: number;

    /**
     * The y coordinate of the Particle Processor, in world space.
     */
    y: number;

    /**
     * The active state of the Particle Processor.
     */
    active: boolean;

    constructor (x: number = 0, y: number = 0, active: boolean = true)
    {
        this.emitter = undefined;
        this.x = x;
        this.y = y;
        this.active = active;
    }

    /**
     * The Particle Processor update method should be overriden by your own
     * method and handle the processing of the particles, typically modifying
     * their velocityX/Y values based on the criteria of this processor.
     */
    update (particle?: any, delta?: number, step?: number, t?: number): void
    {
    }

    /**
     * Destroys this Particle Processor by removing all external references.
     */
    destroy (): void
    {
        this.emitter = null;
    }
}
