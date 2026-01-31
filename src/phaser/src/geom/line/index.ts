/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

// Export Line class and complex algorithms (still in JS)
const Line = require('./Line');
const BresenhamPoints = require('./BresenhamPoints');
const GetEasedPoints = require('./GetEasedPoints');

// Export all line functions for tree-shaking
export { Angle } from './Angle';
export { CenterOn } from './CenterOn';
export { Clone } from './Clone';
export { CopyFrom } from './CopyFrom';
export { Equals } from './Equals';
export { Extend } from './Extend';
export { GetMidPoint } from './GetMidPoint';
export { GetNearestPoint } from './GetNearestPoint';
export { GetNormal } from './GetNormal';
export { GetPoint } from './GetPoint';
export { GetPoints } from './GetPoints';
export { GetShortestDistance } from './GetShortestDistance';
export { Height } from './Height';
export { Length } from './Length';
export { NormalAngle } from './NormalAngle';
export { NormalX } from './NormalX';
export { NormalY } from './NormalY';
export { Offset } from './Offset';
export { PerpSlope } from './PerpSlope';
export { Random } from './Random';
export { ReflectAngle } from './ReflectAngle';
export { Rotate } from './Rotate';
export { RotateAroundPoint } from './RotateAroundPoint';
export { RotateAroundXY } from './RotateAroundXY';
export { SetToAngle } from './SetToAngle';
export { Slope } from './Slope';
export { Width } from './Width';

// Export Line class and complex algorithms
export { Line, BresenhamPoints, GetEasedPoints };
