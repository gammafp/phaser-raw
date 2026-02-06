/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { DynamicBitmapText } from './DynamicBitmapText';
import { GameObjectFactory } from '../../GameObjectFactory';

GameObjectFactory.register('dynamicBitmapText', function (this: any, x: number, y: number, font: string, text?: string | string[], size?: number): DynamicBitmapText
{
    return this.displayList.add(new DynamicBitmapText(this.scene, x, y, font, text, size));
});

