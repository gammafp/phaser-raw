/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * @namespace Phaser.Math
 */

import { Between } from './Between';
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
import { Average } from './Average';
import { Bernstein } from './Bernstein';
import { CatmullRom } from './CatmullRom';
import { CeilTo } from './CeilTo';
import { Clamp } from './Clamp';
import { DegToRad } from './DegToRad';
import { Difference } from './Difference';
import { Factorial } from './Factorial';
import { FloatBetween } from './FloatBetween';
import { FloorTo } from './FloorTo';
import { FromPercent } from './FromPercent';
import { GetCentroid } from './GetCentroid';
import { GetSpeed } from './GetSpeed';
import { GetVec2Bounds } from './GetVec2Bounds';
import { IsEven } from './IsEven';
import { IsEvenStrict } from './IsEvenStrict';
import { Linear } from './Linear';
import { LinearXY } from './LinearXY';
import { MaxAdd } from './MaxAdd';
import { Median } from './Median';
import { MinSub } from './MinSub';
import { Percent } from './Percent';
import { RadToDeg } from './RadToDeg';
import { RandomXY } from './RandomXY';
import { RandomXYZ } from './RandomXYZ';
import { RandomXYZW } from './RandomXYZW';
import { Rotate } from './Rotate';
import { RotateAround } from './RotateAround';
import { RotateAroundDistance } from './RotateAroundDistance';
import { RotateTo } from './RotateTo';
import { RoundAwayFromZero } from './RoundAwayFromZero';
import { RoundTo } from './RoundTo';
import { SmootherStep } from './SmootherStep';
import { SmoothStep } from './SmoothStep';
import { Within } from './Within';
import { Wrap } from './Wrap';
import { MATH_CONST } from './const';
// TODO: Fix this import
// import { Extend } from '../utils/object/Extend';
import { Extend } from '../utils/object/Extend';

const Angle = require('./angle');
const Distance = require('./distance');
const Easing = require('./easing');
const Fuzzy = require('./fuzzy');
const Interpolation = require('./interpolation');
const Pow2 = require('./pow2');
const Snap = require('./snap');

const PhaserMath = {
    Average,
    Bernstein,
    Between,
    CatmullRom,
    CeilTo,
    Clamp,
    DegToRad,
    Difference,
    Euler,
    Factorial,
    FloatBetween,
    FloorTo,
    FromPercent,
    GetCentroid,
    GetSpeed,
    GetVec2Bounds,
    IsEven,
    IsEvenStrict,
    Linear,
    LinearXY,
    Matrix3,
    Matrix4,
    MaxAdd,
    Median,
    MinSub,
    Percent,
    Quaternion,
    RadToDeg,
    RandomDataGenerator,
    RandomXY,
    RandomXYZ,
    RandomXYZW,
    Rotate,
    RotateAround,
    RotateAroundDistance,
    RotateTo,
    RotateVec3,
    RoundAwayFromZero,
    RoundTo,
    SmootherStep,
    SmoothStep,
    ToXY,
    TransformXY,
    Vector2,
    Vector3,
    Vector4,
    Within,
    Wrap,
    Angle,
    Distance,
    Easing,
    Fuzzy,
    Interpolation,
    Pow2,
    Snap,
    ...MATH_CONST
};

export default PhaserMath;