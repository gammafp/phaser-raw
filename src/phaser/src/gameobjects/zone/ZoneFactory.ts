/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { Zone } from './Zone';
const GameObjectFactory = require('../GameObjectFactory');

GameObjectFactory.register('zone', function (this: any, x: number, y: number, width?: number, height?: number): Zone
{
    return this.displayList.add(new Zone(this.scene, x, y, width, height));
});
