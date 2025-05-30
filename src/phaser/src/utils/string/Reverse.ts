/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Takes the given string and reverses it, returning the reversed string.
 * For example if given the string `Atari 520ST` it would return `TS025 iratA`.
 *
 * @function Phaser.Utils.String.Reverse
 * @since 3.0.0
 *
 * @param {string} string - The string to be reversed.
 *
 * @return {string} The reversed string.
 */
export const Reverse = (string: string) => string.split('').reverse().join('');

