/**
 * @author       Richard Davey <rich@phaser.io>
 * @author       Angry Bytes (and contributors)
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

const Device = require('../../device');

function Compare(a: any, b: any): number
{
    return String(a).localeCompare(b);
}

function Process<T>(array: T[], compare: (a: T, b: T) => number): T[]
{
    const len = array.length;

    if (len <= 1)
    {
        return array;
    }

    let buffer: any[] = new Array<T>(len);

    for (let chk = 1; chk < len; chk *= 2)
    {
        RunPass(array, compare, chk, buffer);

        const tmp = array;
        array = buffer as T[];
        buffer = tmp as any;
    }

    return array;
}

function RunPass<T>(arr: T[], comp: ((a: T, b: T) => number) | null, chk: number, result: any[]): void
{
    const len = arr.length;
    let i = 0;
    const dbl = chk * 2;
    let l: number, r: number, e: number;
    let li: number, ri: number;

    for (l = 0; l < len; l += dbl)
    {
        r = l + chk;
        e = r + chk;

        if (r > len)
        {
            r = len;
        }

        if (e > len)
        {
            e = len;
        }

        // Iterate both chunks in parallel.
        li = l;
        ri = r;

        while (true)
        {
            if (li < r && ri < e)
            {
                if (comp!(arr[li], arr[ri]) <= 0)
                {
                    result[i++] = arr[li++];
                }
                else
                {
                    result[i++] = arr[ri++];
                }
            }
            else if (li < r)
            {
                result[i++] = arr[li++];
            }
            else if (ri < e)
            {
                result[i++] = arr[ri++];
            }
            else
            {
                break;
            }
        }
    }
}

/**
 * An in-place stable array sort, because `Array#sort()` is not guaranteed stable.
 *
 * This is an implementation of merge sort, without recursion.
 *
 * Function based on the Two-Screen/stable sort 0.1.8 from https://github.com/Two-Screen/stable
 *
 * @function Phaser.Utils.Array.StableSort
 * @since 3.0.0
 *
 * @param {array} array - The input array to be sorted.
 * @param {function} [compare] - The comparison function.
 *
 * @return {array} The sorted result.
 */
export const StableSort = <T>(array: T[], compare?: (a: T, b: T) => number): T[] =>
{
    if (compare === undefined) { compare = Compare; }

    if (!array || array.length < 2)
    {
        return array;
    }

    if (Device.features.stableSort)
    {
        return array.sort(compare);
    }

    const result = Process(array, compare);

    if (result !== array)
    {
        RunPass(result, null, array.length, array);
    }

    return array;
};
