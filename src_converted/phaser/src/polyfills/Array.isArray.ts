/**
* A polyfill for Array.isArray
*/
if (!Array.isArray)
{
    Array.isArray = function (arg: any): arg is any[]
    {
        return Object.prototype.toString.call(arg) === '[object Array]';
    };
}
