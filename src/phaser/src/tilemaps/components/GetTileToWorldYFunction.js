/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { NOOP } from '../../utils/NOOP';
var CONST = require('../const/ORIENTATION_CONST');
var StaggeredTileToWorldY = require('./StaggeredTileToWorldY');
var TileToWorldY = require('./TileToWorldY');

/**
 * Gets the correct function to use to translate tiles, based on the map orientation.
 *
 * @function Phaser.Tilemaps.Components.GetTileToWorldYFunction
 * @since 3.50.0
 *
 * @param {number} orientation - The Tilemap orientation constant.
 *
 * @return {function} The function to use to translate tiles for the given map type.
 */
var GetTileToWorldYFunction = function (orientation)
{
    if (orientation === CONST.ORTHOGONAL)
    {
        return TileToWorldY;
    }
    else if (orientation === CONST.STAGGERED)
    {
        return StaggeredTileToWorldY;
    }
    else
    {
        return NOOP;
    }
};

module.exports = GetTileToWorldYFunction;
