/**
* Low-budget Float32Array knock-off, suitable for use with P2.js in IE9
* Source: http://www.html5gamedevs.com/topic/5988-phaser-12-ie9/
* Cameron Foale (http://www.kibibu.com)
*/
if (typeof window.Uint32Array !== 'function' && typeof window.Uint32Array !== 'object')
{
    const CheapArray = function (fakeType: string)
    {
        const proto = new Array(); // jshint ignore:line

        (window as any)[fakeType] = function(arg: any) {

            if (typeof(arg) === 'number')
            {
                Array.call(this, arg);

                this.length = arg;

                for (let i = 0; i < this.length; i++)
                {
                    this[i] = 0;
                }
            }
            else
            {
                Array.call(this, arg.length);

                this.length = arg.length;

                for (let i = 0; i < this.length; i++)
                {
                    this[i] = arg[i];
                }
            }
        };

        (window as any)[fakeType].prototype = proto;
        (window as any)[fakeType].constructor = (window as any)[fakeType];
    };

    CheapArray('Float32Array'); // jshint ignore:line
    CheapArray('Uint32Array'); // jshint ignore:line
    CheapArray('Uint16Array'); // jshint ignore:line
    CheapArray('Int16Array'); // jshint ignore:line
    CheapArray('ArrayBuffer'); // jshint ignore:line
    CheapArray('Int8Array'); // jshint ignore:line
    CheapArray('Uint8Array'); // jshint ignore:line
}
