/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * @namespace Phaser.Math
 */

import { Euler } from './Euler';
import { Matrix3 } from './Matrix3';
import { Matrix4 } from './Matrix4';
import { Quaternion } from './Quaternion';
import { RotateVec3 } from './RotateVec3';
import { ToXY } from './ToXY';
import { TransformXY } from './TransformXY';
import { Vector2 } from './Vector2';
import { Vector3 } from './Vector3';
import { Vector4 } from './Vector4';
import { RandomDataGenerator } from './random-data-generator/RandomDataGenerator';

export { Euler };
export { Matrix3 };
export { Matrix4 };
export { Quaternion };
export { RotateVec3 };
export { ToXY };
export { TransformXY };
export { Vector2 };
export { Vector3 };
export { Vector4 };
export { RandomDataGenerator };

const Angle = require('./angle');
const Distance = require('./distance');
const Easing = require('./easing');
const Fuzzy = require('./fuzzy');
const Interpolation = require('./interpolation');
const Pow2 = require('./pow2');
const Snap = require('./snap');

export default {
    Euler,
    Matrix3,
    Matrix4,
    Quaternion,
    RotateVec3,
    ToXY,
    TransformXY,
    Vector2,
    Vector3,
    Vector4,
    RandomDataGenerator,
    Angle,
    Distance,
    Easing,
    Fuzzy,
    Interpolation,
    Pow2,
    Snap
};
