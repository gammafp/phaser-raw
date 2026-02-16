/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { Extend } from '../../utils/object/Extend';
import { CONST } from './const';

import { ArcadePhysics } from './ArcadePhysics';
import { Body } from './Body';
import { Collider } from './Collider';
import * as Components from './components';
import * as Events from './events';
import { Factory } from './Factory';
import { GetCollidesWith } from './GetCollidesWith';
import { GetOverlapX } from './GetOverlapX';
import { GetOverlapY } from './GetOverlapY';
import { SeparateX } from './SeparateX';
import { SeparateY } from './SeparateY';
import { PhysicsGroup } from './PhysicsGroup';
import { ArcadeImage } from './ArcadeImage';
import { ArcadeSprite } from './ArcadeSprite';
import { StaticBody } from './StaticBody';
import { StaticPhysicsGroup } from './StaticPhysicsGroup';
import * as Tilemap from './tilemap';
import { World } from './World';

let Arcade: any = {

    ArcadePhysics: ArcadePhysics,
    Body: Body,
    Collider: Collider,
    Components: Components,
    Events: Events,
    Factory: Factory,
    GetCollidesWith: GetCollidesWith,
    GetOverlapX: GetOverlapX,
    GetOverlapY: GetOverlapY,
    SeparateX: SeparateX,
    SeparateY: SeparateY,
    Group: PhysicsGroup,
    Image: ArcadeImage,
    Sprite: ArcadeSprite,
    StaticBody: StaticBody,
    StaticGroup: StaticPhysicsGroup,
    Tilemap: Tilemap,
    World: World

};

//   Merge in the consts
Arcade = Extend(false, Arcade, CONST);

module.exports = Arcade;
