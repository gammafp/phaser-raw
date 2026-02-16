import { Grid } from './Grid';

var GameObjectFactory = require('../../GameObjectFactory');

export const GridFactory = function (this: any, x: number, y: number, width: number, height: number, cellWidth: number, cellHeight: number, fillColor: number, fillAlpha: number, outlineFillColor: number, outlineFillAlpha: number): any
{
    return this.displayList.add(new Grid(this.scene, x, y, width, height, cellWidth, cellHeight, fillColor, fillAlpha, outlineFillColor, outlineFillAlpha));
};

GameObjectFactory.register('grid', GridFactory);
