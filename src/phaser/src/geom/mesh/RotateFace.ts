/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Rotates the vertices of a Face to the given angle.
 *
 * The actual vertex positions are adjusted, not their transformed positions.
 *
 * Therefore, this updates the vertex data directly.
 *
 * @function Phaser.Geom.Mesh.RotateFace
 * @since 3.50.0
 *
 * @param {Phaser.Geom.Mesh.Face} face - The Face to rotate.
 * @param {number} angle - The angle to rotate to, in radians.
 * @param {number} [cx] - An optional center of rotation. If not given, the Face in-center is used.
 * @param {number} [cy] - An optional center of rotation. If not given, the Face in-center is used.
 */
export const RotateFace = (face: any, angle: number, cx?: number, cy?: number): void =>
{
    let x;
    let y;

    //  No point of rotation? Use the inCenter instead, then.
    if (cx === undefined && cy === undefined)
    {
        const inCenter = face.getInCenter();

        x = inCenter.x;
        y = inCenter.y;
    }

    const c = Math.cos(angle);
    const s = Math.sin(angle);

    const v1 = face.vertex1;
    const v2 = face.vertex2;
    const v3 = face.vertex3;

    let tx = v1.x - x;
    let ty = v1.y - y;

    v1.set(tx * c - ty * s + x, tx * s + ty * c + y);

    tx = v2.x - x;
    ty = v2.y - y;

    v2.set(tx * c - ty * s + x, tx * s + ty * c + y);

    tx = v3.x - x;
    ty = v3.y - y;

    v3.set(tx * c - ty * s + x, tx * s + ty * c + y);
};
