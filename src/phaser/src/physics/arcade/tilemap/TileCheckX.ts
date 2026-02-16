/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { ProcessTileSeparationX } from './ProcessTileSeparationX';

/**
 * Check the body against the given tile on the X axis.
 * Used internally by the SeparateTile function.
 */
export const TileCheckX = function (body: any, tile: any, tileLeft: number, tileRight: number, tileBias: number, isLayer: boolean): number
{
    let ox = 0;

    let faceLeft = tile.faceLeft;
    let faceRight = tile.faceRight;
    let collideLeft = tile.collideLeft;
    let collideRight = tile.collideRight;

    if (!isLayer)
    {
        faceLeft = true;
        faceRight = true;
        collideLeft = true;
        collideRight = true;
    }

    if (body.deltaX() < 0 && collideRight && body.checkCollision.left)
    {
        //  Body is moving LEFT
        if (faceRight && body.x < tileRight)
        {
            ox = body.x - tileRight;

            if (ox < -tileBias)
            {
                ox = 0;
            }
        }
    }
    else if (body.deltaX() > 0 && collideLeft && body.checkCollision.right)
    {
        //  Body is moving RIGHT
        if (faceLeft && body.right > tileLeft)
        {
            ox = body.right - tileLeft;

            if (ox > tileBias)
            {
                ox = 0;
            }
        }
    }

    if (ox !== 0)
    {
        if (body.customSeparateX)
        {
            body.overlapX = ox;
        }
        else
        {
            ProcessTileSeparationX(body, ox);
        }
    }

    return ox;
};
