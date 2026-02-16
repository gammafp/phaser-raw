/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { Ellipse } from './Ellipse';

import { GameObjectFactory } from '../../GameObjectFactory';

export const EllipseFactory = function (this: any, x: number, y: number, width: number, height: number, fillColor: number, fillAlpha: number): any
{
    return this.displayList.add(new Ellipse(this.scene, x, y, width, height, fillColor, fillAlpha));
};

GameObjectFactory.register('ellipse', EllipseFactory);
