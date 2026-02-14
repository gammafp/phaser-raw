/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

const FLIPPED_HORIZONTAL = 0x80000000;
const FLIPPED_VERTICAL = 0x40000000;
const FLIPPED_ANTI_DIAGONAL = 0x20000000; // Top-right is swapped with bottom-left corners

/**
 * See Tiled documentation on tile flipping:
 * http://docs.mapeditor.org/en/latest/reference/tmx-map-format/
 *
 * @function Phaser.Tilemaps.Parsers.Tiled.ParseGID
 * @since 3.0.0
 *
 * @param {number} gid - A Tiled GID.
 *
 * @return {Phaser.Types.Tilemaps.GIDData} The GID Data.
 */
export const ParseGID = (gid: number): any =>
{
    const flippedHorizontal = Boolean(gid & FLIPPED_HORIZONTAL);
    const flippedVertical = Boolean(gid & FLIPPED_VERTICAL);
    const flippedAntiDiagonal = Boolean(gid & FLIPPED_ANTI_DIAGONAL);
    gid = gid & ~(FLIPPED_HORIZONTAL | FLIPPED_VERTICAL | FLIPPED_ANTI_DIAGONAL);

    // Parse the flip flags into something Phaser can use
    let rotation = 0;
    let flipped = false;

    if (flippedHorizontal && flippedVertical && flippedAntiDiagonal)
    {
        rotation = Math.PI / 2;
        flipped = true;
    }
    else if (flippedHorizontal && flippedVertical && !flippedAntiDiagonal)
    {
        rotation = Math.PI;
        flipped = false;
    }
    else if (flippedHorizontal && !flippedVertical && flippedAntiDiagonal)
    {
        rotation = Math.PI / 2;
        flipped = false;
    }
    else if (flippedHorizontal && !flippedVertical && !flippedAntiDiagonal)
    {
        rotation = 0;
        flipped = true;
    }
    else if (!flippedHorizontal && flippedVertical && flippedAntiDiagonal)
    {
        rotation = 3 * Math.PI / 2;
        flipped = false;
    }
    else if (!flippedHorizontal && flippedVertical && !flippedAntiDiagonal)
    {
        rotation = Math.PI;
        flipped = true;
    }
    else if (!flippedHorizontal && !flippedVertical && flippedAntiDiagonal)
    {
        rotation = 3 * Math.PI / 2;
        flipped = true;
    }
    else if (!flippedHorizontal && !flippedVertical && !flippedAntiDiagonal)
    {
        rotation = 0;
        flipped = false;
    }

    return {
        gid: gid,
        flippedHorizontal: flippedHorizontal,
        flippedVertical: flippedVertical,
        flippedAntiDiagonal: flippedAntiDiagonal,
        rotation: rotation,
        flipped: flipped
    };
};
