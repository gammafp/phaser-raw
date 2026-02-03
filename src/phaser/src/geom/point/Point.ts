/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { GEOM_CONST } from '../const';

/**
 * @classdesc
 * Defines a Point in 2D space, with an x and y component.
 *
 * @class Point
 * @memberof Phaser.Geom
 * @constructor
 * @since 3.0.0
 *
 * @param {number} [x=0] - The x coordinate of this Point.
 * @param {number} [y=x] - The y coordinate of this Point.
 */
export class Point {

    readonly type: number;
    x: number;
    y: number;

    constructor(x: number = 0, y?: number)
    {
        if (y === undefined) { y = x; }

        this.type = GEOM_CONST.POINT;
        this.x = x;
        this.y = y;
    }

    /**
     * Set the x and y coordinates of the point to the given values.
     */
    setTo(x: number = 0, y?: number): this
    {
        if (y === undefined) { y = x; }
        this.x = x;
        this.y = y;
        return this;
    }

}
