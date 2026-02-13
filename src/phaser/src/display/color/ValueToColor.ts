/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { HexStringToColor } from './HexStringToColor';
import { IntegerToColor } from './IntegerToColor';
import { ObjectToColor } from './ObjectToColor';
import { RGBStringToColor } from './RGBStringToColor';

/**
 * Converts the given source color value into an instance of a Color class.
 * The value can be either a string, prefixed with `rgb` or a hex string, a number or an Object.
 *
 * @function Phaser.Display.Color.ValueToColor
 * @since 3.0.0
 *
 * @param {(string|number|Phaser.Types.Display.InputColorObject)} input - The source color value to convert.
 * @param {Phaser.Display.Color} [color] - The color where the new color will be stored. If not defined, a new color object is returned.
 *
 * @return {Phaser.Display.Color} A Color object.
 */
export const ValueToColor = (input: string | number | { r: number; g: number; b: number; a?: number }, color?: any): any =>
{
    const t = typeof input;

    switch (t)
    {
        case 'string':

            if ((input as string).substr(0, 3).toLowerCase() === 'rgb')
            {
                return RGBStringToColor(input as string, color);
            }
            else
            {
                return HexStringToColor(input as string, color);
            }

        case 'number':

            return IntegerToColor(input as number, color);

        case 'object':

            return ObjectToColor(input as { r: number; g: number; b: number; a?: number }, color);
    }
};
