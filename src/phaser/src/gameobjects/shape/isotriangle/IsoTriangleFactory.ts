import { IsoTriangle } from './IsoTriangle';

var GameObjectFactory = require('../../GameObjectFactory');

export const IsoTriangleFactory = function (this: any, x: number, y: number, size: number, height: number, reversed: boolean, fillTop: number, fillLeft: number, fillRight: number): any
{
    return this.displayList.add(new IsoTriangle(this.scene, x, y, size, height, reversed, fillTop, fillLeft, fillRight));
};

GameObjectFactory.register('isotriangle', IsoTriangleFactory);
