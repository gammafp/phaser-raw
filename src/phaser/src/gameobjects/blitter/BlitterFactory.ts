/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { Blitter } from './Blitter';
import { GameObjectFactory } from '../GameObjectFactory';

GameObjectFactory.register('blitter', function (this: any, x?: number, y?: number, texture?: string, frame?: string | number): Blitter
{
    return this.displayList.add(new Blitter(this.scene, x, y, texture, frame));
});

