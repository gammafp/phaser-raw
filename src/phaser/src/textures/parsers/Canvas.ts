/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import type { Texture } from '../Texture';

/**
 * Adds a Canvas Element to a Texture.
 *
 * @function Phaser.Textures.Parsers.Canvas
 * @memberof Phaser.Textures.Parsers
 * @private
 * @since 3.0.0
 *
 * @param {Phaser.Textures.Texture} texture - The Texture to add the Frames to.
 * @param {number} sourceIndex - The index of the TextureSource.
 *
 * @return {Phaser.Textures.Texture} The Texture modified by this parser.
 */
export const Canvas = (texture: Texture, sourceIndex: number): Texture => {
    const source = texture.source[sourceIndex];

    texture.add('__BASE', sourceIndex, 0, 0, source.width, source.height);

    return texture;
};
