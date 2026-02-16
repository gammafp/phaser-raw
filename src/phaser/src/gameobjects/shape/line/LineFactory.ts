import { Line } from './Line';

import { GameObjectFactory } from '../../GameObjectFactory';

export const LineFactory = function (this: any, x: number, y: number, x1: number, y1: number, x2: number, y2: number, strokeColor: number, strokeAlpha: number): any
{
    return this.displayList.add(new Line(this.scene, x, y, x1, y1, x2, y2, strokeColor, strokeAlpha));
};

GameObjectFactory.register('line', LineFactory);
