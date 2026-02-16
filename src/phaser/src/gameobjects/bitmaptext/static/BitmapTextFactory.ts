/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { BitmapText } from './BitmapText';

var GameObjectFactory = require('../../GameObjectFactory');

/**
 * Creates a new Bitmap Text Game Object and adds it to the Scene.
 *
 * @method Phaser.GameObjects.GameObjectFactory#bitmapText
 * @since 3.0.0
 *
 * @param {number} x - The x position of the Game Object.
 * @param {number} y - The y position of the Game Object.
 * @param {string} font - The key of the font to use from the BitmapFont cache.
 * @param {(string|string[])} [text] - The string, or array of strings, to be set as the content of this Bitmap Text.
 * @param {number} [size] - The font size to set.
 * @param {number} [align=0] - The alignment of the text in a multi-line BitmapText object.
 *
 * @return {Phaser.GameObjects.BitmapText} The Game Object that was created.
 */
export const BitmapTextFactory = function (this: any, x: number, y: number, font: string, text?: string | string[], size?: number, align?: number): any
{
    return this.displayList.add(new BitmapText(this.scene, x, y, font, text, size, align));
};

GameObjectFactory.register('bitmapText', BitmapTextFactory);
