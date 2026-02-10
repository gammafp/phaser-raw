/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { Vector2 } from '../../math/Vector2';

/**
 * Returns a uniformly distributed random point from anywhere within the given Ellipse.
 *
 * @function Phaser.Geom.Ellipse.Random
 * @since 3.0.0
 *
 * @generic {Phaser.Math.Vector2} O - [out,$return]
 *
 * @param {Phaser.Geom.Ellipse} ellipse - The Ellipse to get a random point from.
 * @param {Phaser.Math.Vector2} [out] - A Vector2 to set the random `x` and `y` values in.
 *
 * @return {Phaser.Math.Vector2} A Vector2 with the random values set in the `x` and `y` properties.
 */
export const Random = (ellipse: any, out?: Vector2): Vector2 =>
{
    if (out === undefined) { out = new Vector2(); }

    const p = Math.random() * Math.PI * 2;
    const s = Math.sqrt(Math.random());

    out.x = ellipse.x + ((s * Math.cos(p)) * ellipse.width / 2);
    out.y = ellipse.y + ((s * Math.sin(p)) * ellipse.height / 2);

    return out;
};
