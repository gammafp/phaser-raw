/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { GameObjectFactory } from '../GameObjectFactory';
import { PointLight } from './PointLight';

GameObjectFactory.register('pointlight', function (this: any, x: number, y: number, color?: number, radius?: number, intensity?: number, attenuation?: number): PointLight
{
    return this.displayList.add(new PointLight(this.scene, x, y, color, radius, intensity, attenuation));
});

