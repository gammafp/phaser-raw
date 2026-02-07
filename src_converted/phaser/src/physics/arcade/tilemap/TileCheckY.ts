/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

const ProcessTileSeparationY = require('./ProcessTileSeparationY');

export const TileCheckY = (body: any, tile: any, tileTop: number, tileBottom: number, tileBias: number, isLayer: boolean): number =>
{
    var oy = 0;

    var faceTop = tile.faceTop;
    var faceBottom = tile.faceBottom;
    var collideUp = tile.collideUp;
    var collideDown = tile.collideDown;

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
