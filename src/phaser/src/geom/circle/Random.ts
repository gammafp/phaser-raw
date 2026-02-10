/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { Vector2 } from '../../math/Vector2';

/**
 * Returns a uniformly distributed random point from anywhere within the given Circle.
 *
 * @function Phaser.Geom.Circle.Random
 * @since 3.0.0
 *
 * @generic {Phaser.Math.Vector2} O - [out,$return]
 *
 * @param {Phaser.Geom.Circle} circle - The Circle to get a random point from.
 * @param {Phaser.Math.Vector2} [out] - A Vector2 to set the random `x` and `y` values in.
 *
 * @return {Phaser.Math.Vector2} A Vector2 with the random values set in the `x` and `y` properties.
 */
export const Random = (circle: any, out?: Vector2): Vector2 =>
{
    if (out === undefined) { out = new Vector2(); }

    const t = 2 * Math.PI * Math.random();
    const u = Math.random() + Math.random();
    const r = (u > 1) ? 2 - u : u;
    const x = r * Math.cos(t);
    const y = r * Math.sin(t);

    out.x = circle.x + (x * circle.radius);
    out.y = circle.y + (y * circle.radius);

    return out;
};
