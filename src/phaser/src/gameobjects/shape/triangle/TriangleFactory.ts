import { Triangle } from './Triangle';

import { GameObjectFactory } from '../../GameObjectFactory';

export const TriangleFactory = function (this: any, x: number, y: number, x1: number, y1: number, x2: number, y2: number, x3: number, y3: number, fillColor: number, fillAlpha: number): any
{
    return this.displayList.add(new Triangle(this.scene, x, y, x1, y1, x2, y2, x3, y3, fillColor, fillAlpha));
};

GameObjectFactory.register('triangle', TriangleFactory);
