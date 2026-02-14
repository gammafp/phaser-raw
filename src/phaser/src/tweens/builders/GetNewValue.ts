/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Internal function used by the Tween Builder to create a function that will return
 * the given value from the source.
 *
 * @function Phaser.Tweens.Builders.GetNewValue
 * @since 3.0.0
 *
 * @param {any} source - The source object to get the value from.
 * @param {string} key - The property to get from the source.
 * @param {any} defaultValue - A default value to return should the source not have the property set.
 *
 * @return {function} A function which, when called, will return the property value from the source.
 */
export const GetNewValue = (source: any, key: string, defaultValue: any): Function => {
    let valueCallback: Function;

    if (source.hasOwnProperty(key))
    {
        const t = typeof(source[key]);

        if (t === 'function')
        {
            valueCallback = function (target: any, targetKey: string, value: any, targetIndex: number, totalTargets: number, tween: any): any {
                return source[key](target, targetKey, value, targetIndex, totalTargets, tween);
            };
        }
        else
        {
            valueCallback = function (): any {
                return source[key];
            };
        }
    }
    else if (typeof defaultValue === 'function')
    {
        valueCallback = defaultValue;
    }
    else
    {
        valueCallback = function (): any {
            return defaultValue;
        };
    }

    return valueCallback;
};
