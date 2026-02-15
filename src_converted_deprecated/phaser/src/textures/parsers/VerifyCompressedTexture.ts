/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2021 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Verify whether the given compressed texture format is supported, based on the current browser/device.
 *
 * @function Phaser.Textures.Parsers.VerifyCompressedTexture
 * @memberof Phaser.Textures.Parsers
 * @since 3.60.0
 *
 * @param {Phaser.Types.Textures.CompressedTextureData} data - The compressed texture data.
 *
 * @return {boolean} `true` if this compressed texture is support, otherwise `false`.
 */
export const VerifyCompressedTexture = (data: any): boolean =>
{
    if (!data || data.format === undefined || !data.mipmaps || data.mipmaps.length === 0)
    {
        console.warn('VerifyCompressedTexture: Invalid compressed texture data');

        return false;
    }

    return true;
};
