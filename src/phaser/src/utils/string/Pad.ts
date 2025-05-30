/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Takes the given string and pads it out, to the length required, using the character
 * specified. For example if you need a string to be 6 characters long, you can call:
 *
 * `pad('bob', 6, '-', 2)`
 *
 * This would return: `bob---` as it has padded it out to 6 characters, using the `-` on the right.
 *
 * You can also use it to pad numbers (they are always returned as strings):
 *
 * `pad(512, 6, '0', 1)`
 *
 * Would return: `000512` with the string padded to the left.
 *
 * If you don't specify a direction it'll pad to both sides:
 *
 * `pad('c64', 7, '*')`
 *
 * Would return: `**c64**`
 *
 * @function Phaser.Utils.String.Pad
 * @since 3.0.0
 *
 * @param {string|number|object} str - The target string. `toString()` will be called on the string, which means you can also pass in common data types like numbers.
 * @param {number} [len=0] - The number of characters to be added.
 * @param {string} [pad=" "] - The string to pad it out with (defaults to a space).
 * @param {number} [dir=3] - The direction dir = 1 (left), 2 (right), 3 (both).
 *
 * @return {string} The padded string.
 */
// TODO: Check this code: Pad(Pad('X', 5, 'ab', 3)) -> (abXab) return this instead ('ababXabab')
export const Pad = (
    str: string | number | object,
    len: number = 0,
    pad: string = ' ',
    dir: 1 | 2 | 3 = 3
): string =>
{
    const input = str.toString();

    if (len + 1 < input.length)
    {
        return input;
    }

    const padlen = len - input.length;

    switch (dir)
    {
        case 1:
            return pad.repeat(padlen) + input;

        case 3: {
            const right = Math.ceil(padlen / 2);
            const left = padlen - right;
            return pad.repeat(left) + input + pad.repeat(right);
        }

        case 2:
        default:
            return input + pad.repeat(padlen);
    }
}
