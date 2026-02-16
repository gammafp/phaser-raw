/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { UppercaseFirst } from '../../utils/string/UppercaseFirst';

import { EaseMap } from '../../math/easing/EaseMap';


/**
 * This internal function is used to return the correct ease function for a Tween.
 *
 * It can take a variety of input, including an EaseMap based string, or a custom function.
 *
 * @function Phaser.Tweens.Builders.GetEaseFunction
 * @since 3.0.0
 *
 * @param {(string|function)} ease - The ease to find. This can be either a string from the EaseMap, or a custom function.
 * @param {number[]} [easeParams] - An optional array of ease parameters to go with the ease.
 *
 * @return {function} The ease function.
 */
export const GetEaseFunction = (ease: string | Function, easeParams?: number[]): Function => {
    //  Default ease function
    let easeFunction: Function = EaseMap.Power0;
    const easeMap = EaseMap as unknown as Record<string, Function>;

    //  Prepare ease function
    if (typeof ease === 'string')
    {
        //  String based look-up

        //  1) They specified it correctly
        if (Object.prototype.hasOwnProperty.call(easeMap, ease))
        {
            easeFunction = easeMap[ease];
        }
        else
        {
            //  Do some string manipulation to try and find it
            let direction = '';

            if (ease.indexOf('.'))
            {
                //  quad.in = Quad.easeIn
                //  quad.out = Quad.easeOut
                //  quad.inout = Quad.easeInOut

                direction = ease.substring(ease.indexOf('.') + 1);

                const directionLower = direction.toLowerCase();

                if (directionLower === 'in')
                {
                    direction = 'easeIn';
                }
                else if (directionLower === 'out')
                {
                    direction = 'easeOut';
                }
                else if (directionLower === 'inout')
                {
                    direction = 'easeInOut';
                }
            }

            ease = UppercaseFirst(ease.substring(0, ease.indexOf('.') + 1) + direction);

            if (Object.prototype.hasOwnProperty.call(easeMap, ease))
            {
                easeFunction = easeMap[ease];
            }
        }
    }
    else if (typeof ease === 'function')
    {
        //  Custom function
        easeFunction = ease;
    }

    //  No custom ease parameters?
    if (!easeParams)
    {
        //  Return ease function
        return easeFunction;
    }

    const cloneParams = easeParams.slice(0);

    cloneParams.unshift(0);

    //  Return ease function with custom ease parameters
    return function (this: any, v: number): number {
        cloneParams[0] = v;

        return easeFunction.apply(this, cloneParams);
    };
};
