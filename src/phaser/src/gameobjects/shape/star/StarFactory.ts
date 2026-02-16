import { Star } from './Star';

var GameObjectFactory = require('../../GameObjectFactory');

export const StarFactory = function (this: any, x: number, y: number, points: number, innerRadius: number, outerRadius: number, fillColor: number, fillAlpha: number): any
{
    return this.displayList.add(new Star(this.scene, x, y, points, innerRadius, outerRadius, fillColor, fillAlpha));
};

GameObjectFactory.register('star', StarFactory);
