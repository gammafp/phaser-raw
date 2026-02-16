/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { ProcessTileSeparationY } from './ProcessTileSeparationY';

/**
 * Check the body against the given tile on the Y axis.
 * Used internally by the SeparateTile function.
 */
export const TileCheckY = function (body: any, tile: any, tileTop: number, tileBottom: number, tileBias: number, isLayer: boolean): number
{
    let oy = 0;

    let faceTop = tile.faceTop;
    let faceBottom = tile.faceBottom;
    let collideUp = tile.collideUp;
    let collideDown = tile.collideDown;

    if (!isLayer)
    {
        faceTop = true;
        faceBottom = true;
        collideUp = true;
        collideDown = true;
    }

    if (body.deltaY() < 0 && collideDown && body.checkCollision.up)
    {
        //  Body is moving UP
        if (faceBottom && body.y < tileBottom)
        {
            oy = body.y - tileBottom;

            if (oy < -tileBias)
            {
                oy = 0;
            }
        }
    }
    else if (body.deltaY() > 0 && collideUp && body.checkCollision.down)
    {
        //  Body is moving DOWN
        if (faceTop && body.bottom > tileTop)
        {
            oy = body.bottom - tileTop;

            if (oy > tileBias)
            {
                oy = 0;
            }
        }
    }

    if (oy !== 0)
    {
        if (body.customSeparateY)
        {
            body.overlapY = oy;
        }
        else
        {
            ProcessTileSeparationY(body, oy);
        }
    }

    return oy;
};
