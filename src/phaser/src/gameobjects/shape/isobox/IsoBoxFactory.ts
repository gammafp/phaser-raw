import { IsoBox } from './IsoBox';

import { GameObjectFactory } from '../../GameObjectFactory';

export const IsoBoxFactory = function (this: any, x: number, y: number, size: number, height: number, fillTop: number, fillLeft: number, fillRight: number): any
{
    return this.displayList.add(new IsoBox(this.scene, x, y, size, height, fillTop, fillLeft, fillRight));
};

GameObjectFactory.register('isobox', IsoBoxFactory);
