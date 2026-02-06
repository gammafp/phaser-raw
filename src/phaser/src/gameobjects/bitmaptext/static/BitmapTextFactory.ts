/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { BitmapText } from './BitmapText';
import { GameObjectFactory } from '../../GameObjectFactory';

GameObjectFactory.register('bitmapText', function (this: any, x: number, y: number, font: string, text?: string | string[], size?: number, align?: number): BitmapText
{
    return this.displayList.add(new BitmapText(this.scene, x, y, font, text, size, align));
});

