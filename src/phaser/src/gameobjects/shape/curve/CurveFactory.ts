/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { Curve } from './Curve';

import { GameObjectFactory } from '../../GameObjectFactory';

export const CurveFactory = function (this: any, x: number, y: number, curve: any, fillColor: number, fillAlpha: number): any
{
    return this.displayList.add(new Curve(this.scene, x, y, curve, fillColor, fillAlpha));
};

GameObjectFactory.register('curve', CurveFactory);
