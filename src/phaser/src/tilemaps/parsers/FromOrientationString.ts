/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { ORIENTATION_CONST } from '../const/ORIENTATION_CONST';

/**
 * Get the Tilemap orientation from the given string.
 *
 * @function Phaser.Tilemaps.Parsers.FromOrientationString
 * @since 3.50.0
 *
 * @param {string} [orientation] - The orientation type as a string.
 *
 * @return {Phaser.Tilemaps.OrientationType} The Tilemap Orientation type.
 */
export const FromOrientationString = (orientation?: string): number =>
{
    const lower = orientation?.toLowerCase() || '';

    if (lower === 'isometric')
    {
        return ORIENTATION_CONST.ISOMETRIC;
    }
    else if (lower === 'staggered')
    {
        return ORIENTATION_CONST.STAGGERED;
    }
    else if (lower === 'hexagonal')
    {
        return ORIENTATION_CONST.HEXAGONAL;
    }
    else
    {
        return ORIENTATION_CONST.ORTHOGONAL;
    }
};
