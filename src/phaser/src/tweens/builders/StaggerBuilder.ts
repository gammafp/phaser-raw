/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { GetValue } from '../../utils/object/GetValue';

import { MATH_CONST } from '../../math/const';

import { GetEaseFunction } from './GetEaseFunction';

/**
 * Creates a Stagger function to be used by a Tween property.
 *
 * The stagger function will allow you to stagger changes to the value of the property across all targets of the tween.
 *
 * This is only worth using if the tween has multiple targets.
 *
 * The following will stagger the delay by 100ms across all targets of the tween, causing them to scale down to 0.2
 * over the duration specified:
 *
 * ```javascript
 * this.tweens.add({
 *     targets: [ ... ],
 *     scale: 0.2,
 *     ease: 'linear',
 *     duration: 1000,
 *     delay: this.tweens.stagger(100)
 * });
 * ```
 *
 * The following will stagger the delay by 500ms across all targets of the tween using a 10 x 6 grid, staggering
 * from the center out, using a cubic ease.
 *
 * ```javascript
 * this.tweens.add({
 *     targets: [ ... ],
 *     scale: 0.2,
 *     ease: 'linear',
 *     duration: 1000,
 *     delay: this.tweens.stagger(500, { grid: [ 10, 6 ], from: 'center', ease: 'cubic.out' })
 * });
 * ```
 *
 * @function Phaser.Tweens.Builders.StaggerBuilder
 * @since 3.19.0
 *
 * @param {(number|number[])} value - The amount to stagger by, or an array containing two elements representing the min and max values to stagger between.
 * @param {Phaser.Types.Tweens.StaggerConfig} [config] - A Stagger Configuration object.
 *
 * @return {function} The stagger function.
 */
export const StaggerBuilder = (value: number | number[], options?: any): Function => {
    if (options === undefined) { options = {}; }

    let result: Function;

    let start = GetValue(options, 'start', 0);
    const ease = GetValue(options, 'ease', null);
    const grid = GetValue(options, 'grid', null);

    const from = GetValue(options, 'from', 0);

    const fromFirst = (from === 'first');
    const fromCenter = (from === 'center');
    const fromLast = (from === 'last');
    const fromValue = (typeof(from) === 'number');

    const isRange = (Array.isArray(value));
    const value1 = (isRange) ? parseFloat((value as number[])[0] as any) : parseFloat(value as any);
    const value2 = (isRange) ? parseFloat((value as number[])[1] as any) : 0;
    const maxValue = Math.max(value1, value2);

    if (isRange)
    {
        start += value1;
    }

    if (grid)
    {
        //  Pre-calc the grid to save doing it for every TweenData update
        const gridWidth = grid[0];
        const gridHeight = grid[1];

        let fromX = 0;
        let fromY = 0;

        let distanceX = 0;
        let distanceY = 0;

        const gridValues: number[][] = [];

        if (fromLast)
        {
            fromX = gridWidth - 1;
            fromY = gridHeight - 1;
        }
        else if (fromValue)
        {
            fromX = from % gridWidth;
            fromY = Math.floor(from / gridWidth);
        }
        else if (fromCenter)
        {
            fromX = (gridWidth - 1) / 2;
            fromY = (gridHeight - 1) / 2;
        }

        let gridMax = MATH_CONST.MIN_SAFE_INTEGER;

        for (let toY = 0; toY < gridHeight; toY++)
        {
            gridValues[toY] = [];

            for (let toX = 0; toX < gridWidth; toX++)
            {
                distanceX = fromX - toX;
                distanceY = fromY - toY;

                const dist = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

                if (dist > gridMax)
                {
                    gridMax = dist;
                }

                gridValues[toY][toX] = dist;
            }
        }

        const easeFunction = (ease) ? GetEaseFunction(ease) : null;

        result = function (target: any, key: string, value: any, index: number): number {
            let gridSpace = 0;
            const toX = index % gridWidth;
            const toY = Math.floor(index / gridWidth);

            if (toX >= 0 && toX < gridWidth && toY >= 0 && toY < gridHeight)
            {
                gridSpace = gridValues[toY][toX];
            }

            let output: number;

            if (isRange)
            {
                const diff = (value2 - value1);

                if (easeFunction)
                {
                    output = ((gridSpace / gridMax) * diff) * (easeFunction as any)(gridSpace / gridMax);
                }
                else
                {
                    output = (gridSpace / gridMax) * diff;
                }
            }
            else if (easeFunction)
            {
                output = (gridSpace * value1) * (easeFunction as any)(gridSpace / gridMax);
            }
            else
            {
                output = gridSpace * value1;
            }

            return output + start;
        };
    }
    else
    {
        const easeFunction = (ease) ? GetEaseFunction(ease) : null;

        result = function (target: any, key: string, value: any, index: number, total: number): number {
            //  zero offset
            total--;

            let fromIndex: number;

            if (fromFirst)
            {
                fromIndex = index;
            }
            else if (fromCenter)
            {
                fromIndex = Math.abs((total / 2) - index);
            }
            else if (fromLast)
            {
                fromIndex = total - index;
            }
            else if (fromValue)
            {
                fromIndex = Math.abs(from - index);
            }

            let output: number;

            if (isRange)
            {
                let spacing: number;

                if (fromCenter)
                {
                    spacing = ((value2 - value1) / total) * (fromIndex * 2);
                }
                else
                {
                    spacing = ((value2 - value1) / total) * fromIndex;
                }

                if (easeFunction)
                {
                    output = spacing * (easeFunction as any)(fromIndex / total);
                }
                else
                {
                    output = spacing;
                }
            }
            else if (easeFunction)
            {
                output = (total * maxValue) * (easeFunction as any)(fromIndex / total);
            }
            else
            {
                output = fromIndex * value1;
            }

            return output + start;
        };
    }

    return result;
};
