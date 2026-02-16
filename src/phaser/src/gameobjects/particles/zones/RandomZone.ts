/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { Vector2 } from '../../../math/Vector2';

/**
 * @classdesc
 * A zone that places particles randomly within a shapes area.
 *
 * @class RandomZone
 * @memberof Phaser.GameObjects.Particles.Zones
 * @constructor
 * @since 3.0.0
 */
export class RandomZone
{
    /**
     * An object instance with a `getRandomPoint(point)` method.
     */
    source: any;

    /**
     * Internal calculation vector.
     */
    _tempVec: Vector2;

    /**
     * The total number of particles this zone will emit before the Emitter
     * transfers control over to the next zone in its emission zone list.
     */
    total: number;

    constructor (source: any)
    {
        this.source = source;
        this._tempVec = new Vector2();
        this.total = -1;
    }

    /**
     * Get the next point in the Zone and set its coordinates on the given Particle.
     */
    getPoint (particle: any): void
    {
        var vec = this._tempVec;

        this.source.getRandomPoint(vec);

        particle.x = vec.x;
        particle.y = vec.y;
    }
}
