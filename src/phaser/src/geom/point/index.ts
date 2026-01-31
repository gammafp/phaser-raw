/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

// Export Point class (still in JS)
const Point = require('./Point');

// Export all point functions for tree-shaking
export { Ceil } from './Ceil';
export { Clone } from './Clone';
export { CopyFrom } from './CopyFrom';
export { Equals } from './Equals';
export { Floor } from './Floor';
export { GetCentroid } from './GetCentroid';
export { GetMagnitude } from './GetMagnitude';
export { GetMagnitudeSq } from './GetMagnitudeSq';
export { GetRectangleFromPoints } from './GetRectangleFromPoints';
export { Interpolate } from './Interpolate';
export { Invert } from './Invert';
export { Negative } from './Negative';
export { Project } from './Project';
export { ProjectUnit } from './ProjectUnit';
export { SetMagnitude } from './SetMagnitude';

// Export Point class
export { Point };
