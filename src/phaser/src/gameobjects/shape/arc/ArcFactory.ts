/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { Arc } from './Arc';

import { GameObjectFactory } from '../../GameObjectFactory';

export const ArcFactory = function (this: any, x: number, y: number, radius: number, startAngle: number, endAngle: number, anticlockwise: boolean, fillColor: number, fillAlpha: number): any
{
    return this.displayList.add(new Arc(this.scene, x, y, radius, startAngle, endAngle, anticlockwise, fillColor, fillAlpha));
};

GameObjectFactory.register('arc', ArcFactory);

export const CircleFactory = function (this: any, x: number, y: number, radius: number, fillColor: number, fillAlpha: number): any
{
    return this.displayList.add(new Arc(this.scene, x, y, radius, 0, 360, false, fillColor, fillAlpha));
};

GameObjectFactory.register('circle', CircleFactory);
