/**
 * @author       Greg McLean <GregDevProjects>
 * @copyright    2021 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Interpolates two given Vectors and returns a new Vector between them.
 *
 * Does not modify either of the passed Vectors.
 *
 * @function Phaser.Math.LinearXY
 * @since 3.60.0
 *
 * @param {Phaser.Math.Vector2} vector1 - Starting vector
 * @param {Phaser.Math.Vector2} vector2 - Ending vector
 * @param {number} [t=0] - The percentage between vector1 and vector2 to return, represented as a number between 0 and 1.
 *
 * @return {Phaser.Math.Vector2} The step t% of the way between vector1 and vector2.
 */
export const LinearXY = (vector1: any, vector2: any, t: number = 0): any =>
{
    return vector1.clone().lerp(vector2, t);
};
