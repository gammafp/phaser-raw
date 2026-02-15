/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import type { Color } from './Color';
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
 *
 * @return {Phaser.Display.Color} A Color object.
 */
export const ValueToColor = (input: string | number | Phaser.Types.Display.InputColorObject): Color =>
{
    const t = typeof input;

    switch (t)
    {
        case 'string':

            if ((input as string).substring(0, 3).toLowerCase() === 'rgb')
            {
                return RGBStringToColor(input as string);
            }
            else
            {
                return HexStringToColor(input as string);
            }

        case 'number':

            return IntegerToColor(input as number);

        case 'object':

            return ObjectToColor(input as Phaser.Types.Display.InputColorObject);

        default:

            throw new Error('Invalid color input');
    }
}
