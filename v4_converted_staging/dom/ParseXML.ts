/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Takes the given data string and parses it as XML.
 * First tries to use the window.DOMParser and reverts to the Microsoft.XMLDOM if that fails.
 * The parsed XML object is returned, or `null` if there was an error while parsing the data.
 *
 * @function Phaser.DOM.ParseXML
 * @since 3.0.0
 *
 * @param {string} data - The XML source stored in a string.
 *
 * @return {?(DOMParser|ActiveXObject)} The parsed XML data, or `null` if the data could not be parsed.
 */
export const ParseXML = (data: string) =>
{
    let xml: Document | null = null;

    try
    {
        if (window['DOMParser'])
        {
            var domparser = new DOMParser();
            xml = domparser.parseFromString(data, 'text/xml');
        }
        else
        {
            // TODO: [DEPRECATED]
            // @ts-ignore
            xml = new ActiveXObject('Microsoft.XMLDOM');
            // @ts-ignore
            xml.loadXML(data);
        }
    }
    catch (e)
    {
        xml = null;
    }

    if (!xml || !xml.documentElement || xml.getElementsByTagName('parsererror').length)
    {
        return null;
    }
    else
    {
        return xml;
    }
};

module.exports = ParseXML;
