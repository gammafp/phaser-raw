/**
* A polyfill for Array.forEach
* https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach
*/
if (!Array.prototype.forEach)
{
    Array.prototype.forEach = function (fun: Function /*, thisArg */)
    {
        'use strict';

        if (this === void 0 || this === null)
        {
            throw new TypeError();
        }

        const t = Object(this);
        const len = t.length >>> 0;

        if (typeof fun !== 'function')
        {
            throw new TypeError();
        }

        const thisArg = arguments.length >= 2 ? arguments[1] : void 0;

        for (let i = 0; i < len; i++)
        {
            if (i in t)
            {
                fun.call(thisArg, t[i], i, t);
            }
        }
    };
}
