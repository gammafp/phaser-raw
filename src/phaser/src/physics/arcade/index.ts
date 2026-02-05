/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { Extend } from '../../utils/object/Extend';
import { CONST } from './const';
import { ArcadePhysics } from './ArcadePhysics';
import { Body } from './Body';
const Collider = require('./Collider');
import * as Components from './components';
import * as Events from './events';
const Factory = require('./Factory');
import { GetCollidesWith } from './GetCollidesWith';
import { GetOverlapX } from './GetOverlapX';
import { GetOverlapY } from './GetOverlapY';
const SeparateX = require('./SeparateX');
const SeparateY = require('./SeparateY');
import { PhysicsGroup } from './PhysicsGroup';
import { ArcadeImage } from './ArcadeImage';
import { ArcadeSprite } from './ArcadeSprite';
import { StaticBody } from './StaticBody';
import { StaticPhysicsGroup } from './StaticPhysicsGroup';
const Tilemap = require('./tilemap/');
import { World } from './World';

/**
 * @namespace Phaser.Physics.Arcade
 */

const Arcade = {
    ArcadePhysics,
    Body,
    Collider,
    Components,
    Events,
    Factory,
    GetCollidesWith,
    GetOverlapX,
    GetOverlapY,
    SeparateX,
    SeparateY,
    Group: PhysicsGroup,
    Image: ArcadeImage,
    Sprite: ArcadeSprite,
    StaticBody,
    StaticGroup: StaticPhysicsGroup,
    Tilemap,
    World
};

//   Merge in the consts
export default Extend(false, Arcade, CONST);
