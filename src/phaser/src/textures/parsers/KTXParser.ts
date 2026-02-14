/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2021 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Parses a KTX format Compressed Texture file and generates texture data suitable for WebGL from it.
 *
 * @function Phaser.Textures.Parsers.KTXParser
 * @memberof Phaser.Textures.Parsers
 * @since 3.60.0
 *
 * @param {ArrayBuffer} data - The data object created by the Compressed Texture File Loader.
 *
 * @return {Phaser.Types.Textures.CompressedTextureData} The Compressed Texture data.
 */
export const KTXParser = (data: ArrayBuffer): any | undefined => {
    const idCheck = [ 0xab, 0x4b, 0x54, 0x58, 0x20, 0x31, 0x31, 0xbb, 0x0d, 0x0a, 0x1a, 0x0a ];

    let i;
    const id = new Uint8Array(data, 0, 12);

    for (i = 0; i < id.length; i++)
    {
        if (id[i] !== idCheck[i])
        {
            console.warn('KTXParser - Invalid file format');

            return;
        }
    }

    const size = Uint32Array.BYTES_PER_ELEMENT;

    const head = new DataView(data, 12, 13 * size);

    const littleEndian = (head.getUint32(0, true) === 0x04030201);

    const glType = head.getUint32(1 * size, littleEndian);

    if (glType !== 0)
    {
        console.warn('KTXParser - Only compressed formats supported');

        return;
    }

    const internalFormat = head.getUint32(4 * size, littleEndian);
    const width = head.getUint32(6 * size, littleEndian);
    const height = head.getUint32(7 * size, littleEndian);

    const mipmapLevels = Math.max(1, head.getUint32(11 * size, littleEndian));

    const bytesOfKeyValueData = head.getUint32(12 * size, littleEndian);

    const mipmaps = new Array(mipmapLevels);

    let offset = 12 + 13 * 4 + bytesOfKeyValueData;
    let levelWidth = width;
    let levelHeight = height;

    for (i = 0; i < mipmapLevels; i++)
    {
        const levelSize = new Int32Array(data, offset, 1)[0];

        // levelSize field
        offset += 4;

        mipmaps[i] = {
            data: new Uint8Array(data, offset, levelSize),
            width: levelWidth,
            height: levelHeight
        };

        // add padding for odd sized image
        // offset += 3 - ((levelSize + 3) % 4);

        levelWidth = Math.max(1, levelWidth >> 1);
        levelHeight = Math.max(1, levelHeight >> 1);

        offset += levelSize;
    }

    return {
        mipmaps: mipmaps,
        width: width,
        height: height,
        internalFormat: internalFormat,
        compressed: true,
        generateMipmap: false
    };
};
