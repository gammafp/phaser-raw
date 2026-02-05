/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { PathFollower } from './PathFollower';
const BuildGameObject = require('../BuildGameObject');
const GameObjectFactory = require('../GameObjectFactory');

GameObjectFactory.register('follower', function (this: any, path: any, x: number, y: number, key: string, frame?: string | number): PathFollower
{
    var sprite = new PathFollower(this.scene, path, x, y, key, frame);

    this.displayList.add(sprite);
    this.updateList.add(sprite);

    return sprite;
});
