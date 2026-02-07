/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Merges the source rectangle into the target rectangle and returns the target.
 * Neither rectangle should have a negative width or height.
 *
 * @function Phaser.Geom.Rectangle.MergeRect
 * @since 3.0.0
 *
 * @generic {Phaser.Geom.Rectangle} O - [target,$return]
 *
 * @param {Phaser.Geom.Rectangle} target - Target rectangle. Will be modified to include source rectangle.
 * @param {Phaser.Geom.Rectangle} source - Rectangle that will be merged into target rectangle.
 *
 * @return {Phaser.Geom.Rectangle} Modified target rectangle that contains source rectangle.
 */
export const MergeRect = <T extends any>(target: T, source: any): T =>
{
    const minX = Math.min(target.x, source.x);
    const maxX = Math.max(target.right, source.right);

    target.x = minX;
    target.width = maxX - minX;

    const minY = Math.min(target.y, source.y);
    const maxY = Math.max(target.bottom, source.bottom);

    target.y = minY;
    target.height = maxY - minY;

    return target;
};
