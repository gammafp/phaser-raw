/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { CheckMatrix } from './CheckMatrix';
import { TransposeMatrix } from './TransposeMatrix';

/**
 * Rotates the array matrix based on the given rotation value.
 *
 * The value can be given in degrees: 90, -90, 270, -270 or 180,
 * or a string command: `rotateLeft`, `rotateRight` or `rotate180`.
 *
 * Based on the routine from {@link http://jsfiddle.net/MrPolywhirl/NH42z/}.
 *
 * A matrix is a two-dimensional array (array of arrays), where all sub-arrays (rows)
 * have the same length. There must be at least two rows. This is an example matrix:
 *
 * ```
 * [
 *    [ 1, 1, 1, 1, 1, 1 ],
 *    [ 2, 0, 0, 0, 0, 4 ],
 *    [ 2, 0, 1, 2, 0, 4 ],
 *    [ 2, 0, 3, 4, 0, 4 ],
 *    [ 2, 0, 0, 0, 0, 4 ],
 *    [ 3, 3, 3, 3, 3, 3 ]
 * ]
 * ```
 *
 * @function Phaser.Utils.Array.Matrix.RotateMatrix
 * @since 3.0.0
 *
 * @generic T
 * @genericUse {T[][]} - [matrix,$return]
 *
 * @param {T[][]} [matrix] - The array to rotate.
 * @param {(number|string)} [direction=90] - The amount to rotate the matrix by.
 *
 * @return {T[][]} The rotated matrix array. The source matrix should be discard for the returned matrix.
 */
export const RotateMatrix = <T>(matrix: T[][], direction: number | string = 90): T[][] | null =>
{
    if (!CheckMatrix(matrix))
    {
        return null;
    }

    if (typeof direction !== 'string')
    {
        direction = ((direction % 360) + 360) % 360;
    }

    if (direction === 90 || direction === -270 || direction === 'rotateLeft')
    {
        matrix = TransposeMatrix(matrix);
        matrix.reverse();
    }
    else if (direction === -90 || direction === 270 || direction === 'rotateRight')
    {
        matrix.reverse();
        matrix = TransposeMatrix(matrix);
    }
    else if (Math.abs(direction as number) === 180 || direction === 'rotate180')
    {
        for (let i = 0; i < matrix.length; i++)
        {
            matrix[i].reverse();
        }

        matrix.reverse();
    }

    return matrix;
};
