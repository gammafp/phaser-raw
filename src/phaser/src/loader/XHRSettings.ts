/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Creates an XHRSettings Object with default values.
 *
 * @function Phaser.Loader.XHRSettings
 * @since 3.0.0
 *
 * @param {XMLHttpRequestResponseType} [responseType=''] - The responseType, such as 'text'.
 * @param {boolean} [async=true] - Should the XHR request use async or not?
 * @param {string} [user=''] - Optional username for the XHR request.
 * @param {string} [password=''] - Optional password for the XHR request.
 * @param {number} [timeout=0] - Optional XHR timeout value.
 * @param {boolean} [withCredentials=false] - Optional XHR withCredentials value.
 *
 * @return {Phaser.Types.Loader.XHRSettingsObject} The XHRSettings object as used by the Loader.
 */
export const XHRSettings = (
    responseType: XMLHttpRequestResponseType = '',
    async: boolean = true,
    user: string = '',
    password: string = '',
    timeout: number = 0,
    withCredentials: boolean = false
): any => {
    // Before sending a request, set the xhr.responseType to "text",
    // "arraybuffer", "blob", or "document", depending on your data needs.
    // Note, setting xhr.responseType = '' (or omitting) will default the response to "text".

    return {

        //  Ignored by the Loader, only used by File.
        responseType: responseType,

        async: async,

        //  credentials
        user: user,
        password: password,

        //  timeout in ms (0 = no timeout)
        timeout: timeout,

        //  setRequestHeader
        headers: undefined,
        header: undefined,
        headerValue: undefined,
        requestedWith: false,

        //  overrideMimeType
        overrideMimeType: undefined,

        //  withCredentials
        withCredentials: withCredentials

    };
};
