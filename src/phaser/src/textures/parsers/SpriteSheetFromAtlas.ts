/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */


import { GetFastValue } from '../../utils/object/GetFastValue';
import type { Texture } from '../Texture';
import type { Frame } from '../Frame';

/**
 * Parses a Sprite Sheet and adds the Frames to the Texture, where the Sprite Sheet is stored as a frame within an Atlas.
 *
 * In Phaser terminology a Sprite Sheet is a texture containing different frames, but each frame is the exact
 * same size and cannot be trimmed or rotated.
 *
 * @function Phaser.Textures.Parsers.SpriteSheetFromAtlas
 * @memberof Phaser.Textures.Parsers
 * @private
 * @since 3.0.0
 *
 * @param {Phaser.Textures.Texture} texture - The Texture to add the Frames to.
 * @param {Phaser.Textures.Frame} frame - The Frame that contains the Sprite Sheet.
 * @param {object} config - An object describing how to parse the Sprite Sheet.
 * @param {number} config.frameWidth - Width in pixels of a single frame in the sprite sheet.
 * @param {number} [config.frameHeight] - Height in pixels of a single frame in the sprite sheet. Defaults to frameWidth if not provided.
 * @param {number} [config.startFrame=0] - Index of the start frame in the sprite sheet
 * @param {number} [config.endFrame=-1] - Index of the end frame in the sprite sheet. -1 mean all the rest of the frames
 * @param {number} [config.margin=0] - If the frames have been drawn with a margin, specify the amount here.
 * @param {number} [config.spacing=0] - If the frames have been drawn with spacing between them, specify the amount here.
 *
 * @return {Phaser.Textures.Texture} The Texture modified by this parser.
 */
export const SpriteSheetFromAtlas = (texture: Texture, frame: Frame, config: any): Texture => {
    const frameWidth = GetFastValue(config, 'frameWidth', null);
    const frameHeight = GetFastValue(config, 'frameHeight', frameWidth);

    //  If missing we can't proceed
    if (!frameWidth)
    {
        throw new Error('TextureManager.SpriteSheetFromAtlas: Invalid frameWidth given.');
    }

    //  Add in a __BASE entry (for the entire atlas frame)
    const source = texture.source[0];
    texture.add('__BASE', 0, 0, 0, source.width, source.height);

    let startFrame = GetFastValue(config, 'startFrame', 0);
    let endFrame = GetFastValue(config, 'endFrame', -1);
    const margin = GetFastValue(config, 'margin', 0);
    const spacing = GetFastValue(config, 'spacing', 0);

    const x = frame.cutX;
    const y = frame.cutY;

    const cutWidth = frame.cutWidth;
    const cutHeight = frame.cutHeight;
    const sheetWidth = frame.realWidth;
    const sheetHeight = frame.realHeight;

    const row = Math.floor((sheetWidth - margin + spacing) / (frameWidth + spacing));
    const column = Math.floor((sheetHeight - margin + spacing) / (frameHeight + spacing));
    let total = row * column;

    //  trim offsets

    const leftPad = frame.x;
    const leftWidth = frameWidth - leftPad;

    const rightWidth = frameWidth - ((sheetWidth - cutWidth) - leftPad);

    const topPad = frame.y;
    const topHeight = frameHeight - topPad;

    const bottomHeight = frameHeight - ((sheetHeight - cutHeight) - topPad);

    if (startFrame > total || startFrame < -total)
    {
        startFrame = 0;
    }

    if (startFrame < 0)
    {
        //  Allow negative skipframes.
        startFrame = total + startFrame;
    }

    if (endFrame !== -1)
    {
        total = startFrame + (endFrame + 1);
    }

    let sheetFrame;
    let frameX = margin;
    let frameY = margin;
    let frameIndex = 0;
    const sourceIndex = 0;

    for (let sheetY = 0; sheetY < column; sheetY++)
    {
        const topRow = (sheetY === 0);
        const bottomRow = (sheetY === column - 1);

        for (let sheetX = 0; sheetX < row; sheetX++)
        {
            const leftRow = (sheetX === 0);
            const rightRow = (sheetX === row - 1);

            sheetFrame = texture.add(frameIndex, sourceIndex, x + frameX, y + frameY, frameWidth, frameHeight);

            if (leftRow || topRow || rightRow || bottomRow)
            {
                const destX = (leftRow) ? leftPad : 0;
                const destY = (topRow) ? topPad : 0;

                let trimWidth = 0;
                let trimHeight = 0;

                if (leftRow)
                {
                    trimWidth += (frameWidth - leftWidth);
                }

                if (rightRow)
                {
                    trimWidth += (frameWidth - rightWidth);
                }

                if (topRow)
                {
                    trimHeight += (frameHeight - topHeight);
                }

                if (bottomRow)
                {
                    trimHeight += (frameHeight - bottomHeight);
                }

                const destWidth = frameWidth - trimWidth;
                const destHeight = frameHeight - trimHeight;

                sheetFrame.cutWidth = destWidth;
                sheetFrame.cutHeight = destHeight;

                sheetFrame.setTrim(frameWidth, frameHeight, destX, destY, destWidth, destHeight);
            }

            frameX += spacing;

            if (leftRow)
            {
                frameX += leftWidth;
            }
            else if (rightRow)
            {
                frameX += rightWidth;
            }
            else
            {
                frameX += frameWidth;
            }

            frameIndex++;
        }

        frameX = margin;
        frameY += spacing;

        if (topRow)
        {
            frameY += topHeight;
        }
        else if (bottomRow)
        {
            frameY += bottomHeight;
        }
        else
        {
            frameY += frameHeight;
        }
    }

    return texture;
};
