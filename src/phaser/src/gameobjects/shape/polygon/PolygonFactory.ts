import { Polygon } from './Polygon';

var GameObjectFactory = require('../../GameObjectFactory');

export const PolygonFactory = function (this: any, x: number, y: number, points: any, fillColor: number, fillAlpha: number): any
{
    return this.displayList.add(new Polygon(this.scene, x, y, points, fillColor, fillAlpha));
};

GameObjectFactory.register('polygon', PolygonFactory);
