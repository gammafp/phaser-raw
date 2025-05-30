/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { NOOP } from '../../utils/NOOP';
var CONST = require('../const/ORIENTATION_CONST');
var CullTiles = require('./CullTiles');
var HexagonalCullTiles = require('./HexagonalCullTiles');
var IsometricCullTiles = require('./IsometricCullTiles');
var StaggeredCullTiles = require('./StaggeredCullTiles');

/**
 * Gets the correct function to use to cull tiles, based on the map orientation.
 *
 * @function Phaser.Tilemaps.Components.GetCullTilesFunction
 * @since 3.50.0
 *
 * @param {number} orientation - The Tilemap orientation constant.
 *
 * @return {function} The function to use to cull tiles for the given map type.
 */
var GetCullTilesFunction = function (orientation)
{
    if (orientation === CONST.ORTHOGONAL)
    {
        return CullTiles;
    }
    else if (orientation === CONST.HEXAGONAL)
    {
        return HexagonalCullTiles;
    }
    else if (orientation === CONST.STAGGERED)
    {
        return StaggeredCullTiles;
    }
    else if (orientation === CONST.ISOMETRIC)
    {
        return IsometricCullTiles;
    }
    else
    {
        return NOOP;
    }
};

module.exports = GetCullTilesFunction;
