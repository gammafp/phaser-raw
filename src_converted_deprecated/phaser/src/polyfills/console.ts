/**
 * Also fix for the absent console in IE9
 */
if (!window.console)
{
    (window as any).console = {};
    (window.console as any).log = (window.console as any).assert = function(){};
    (window.console as any).warn = (window.console as any).assert = function(){};
}
