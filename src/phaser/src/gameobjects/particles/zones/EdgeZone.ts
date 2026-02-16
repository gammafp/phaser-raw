/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * @classdesc
 * A zone that places particles on a shape's edges.
 *
 * @class EdgeZone
 * @memberof Phaser.GameObjects.Particles.Zones
 * @constructor
 * @since 3.0.0
 */
export class EdgeZone
{
    /**
     * An object instance with a `getPoints(quantity, stepRate)` method returning an array of points.
     */
    source: any;

    /**
     * The points placed on the source edge.
     */
    points: any[];

    /**
     * The number of particles to place on the source edge. Set to 0 to use `stepRate` instead.
     */
    quantity: number;

    /**
     * The distance between each particle. When set, `quantity` is implied and should be set to 0.
     */
    stepRate: number;

    /**
     * Whether particles are placed from start to end and then end to start.
     */
    yoyo: boolean;

    /**
     * The counter used for iterating the EdgeZone's points.
     */
    counter: number;

    /**
     * Whether one endpoint will be removed if it's identical to the other.
     */
    seamless: boolean;

    /**
     * An internal count of the points belonging to this EdgeZone.
     */
    _length: number;

    /**
     * An internal value used to keep track of the current iteration direction for the EdgeZone's points.
     * 0 = forwards, 1 = backwards
     */
    _direction: number;

    /**
     * The total number of particles this zone will emit before the Emitter
     * transfers control over to the next zone in its emission zone list.
     */
    total: number;

    constructor (source: any, quantity: number, stepRate?: number, yoyo: boolean = false, seamless: boolean = true, total: number = -1)
    {
        this.source = source;
        this.points = [];
        this.quantity = quantity;
        this.stepRate = stepRate!;
        this.yoyo = yoyo;
        this.counter = -1;
        this.seamless = seamless;
        this._length = 0;
        this._direction = 0;
        this.total = total;

        this.updateSource();
    }

    /**
     * Update the {@link Phaser.GameObjects.Particles.Zones.EdgeZone#points} from the EdgeZone's
     * {@link Phaser.GameObjects.Particles.Zones.EdgeZone#source}.
     *
     * Also updates internal properties.
     */
    updateSource (): this
    {
        this.points = this.source.getPoints(this.quantity, this.stepRate);

        //  Remove ends?
        if (this.seamless)
        {
            var a = this.points[0];
            var b = this.points[this.points.length - 1];

            if (a.x === b.x && a.y === b.y)
            {
                this.points.pop();
            }
        }

        var oldLength = this._length;

        this._length = this.points.length;

        //  Adjust counter if we now have less points than before
        if (this._length < oldLength && this.counter > this._length)
        {
            this.counter = this._length - 1;
        }

        return this;
    }

    /**
     * Change the source of the EdgeZone.
     */
    changeSource (source: any): this
    {
        this.source = source;

        return this.updateSource();
    }

    /**
     * Get the next point in the Zone and set its coordinates on the given Particle.
     */
    getPoint (particle: any): void
    {
        if (this._direction === 0)
        {
            this.counter++;

            if (this.counter >= this._length)
            {
                if (this.yoyo)
                {
                    this._direction = 1;
                    this.counter = this._length - 1;
                }
                else
                {
                    this.counter = 0;
                }
            }
        }
        else
        {
            this.counter--;

            if (this.counter === -1)
            {
                if (this.yoyo)
                {
                    this._direction = 0;
                    this.counter = 0;
                }
                else
                {
                    this.counter = this._length - 1;
                }
            }
        }

        var point = this.points[this.counter];

        if (point)
        {
            particle.x = point.x;
            particle.y = point.y;
        }
    }
}
