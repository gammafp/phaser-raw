import { Rectangle } from './Rectangle';

import { GameObjectFactory } from '../../GameObjectFactory';

export const RectangleFactory = function (this: any, x: number, y: number, width: number, height: number, fillColor: number, fillAlpha: number): any
{
    return this.displayList.add(new Rectangle(this.scene, x, y, width, height, fillColor, fillAlpha));
};

GameObjectFactory.register('rectangle', RectangleFactory);
