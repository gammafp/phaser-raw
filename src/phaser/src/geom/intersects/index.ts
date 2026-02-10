/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

// Complex intersection functions (still in JS)
import { GetLineToPolygon } from './GetLineToPolygon';
import { GetRaysFromPointToPolygon } from './GetRaysFromPointToPolygon';
import { LineToCircle } from './LineToCircle';

// Export simple intersection functions for tree-shaking
export { CircleToCircle } from './CircleToCircle';
export { CircleToRectangle } from './CircleToRectangle';
export { LineToLine } from './LineToLine';
export { LineToRectangle } from './LineToRectangle';
export { PointToLine } from './PointToLine';
export { PointToLineSegment } from './PointToLineSegment';
export { RectangleToRectangle } from './RectangleToRectangle';
export { RectangleToTriangle } from './RectangleToTriangle';
export { RectangleToValues } from './RectangleToValues';
export { TriangleToCircle } from './TriangleToCircle';
export { TriangleToLine } from './TriangleToLine';
export { TriangleToTriangle } from './TriangleToTriangle';

// Export converted Get* functions  
export { GetCircleToCircle } from './GetCircleToCircle';
export { GetCircleToRectangle } from './GetCircleToRectangle';
export { GetLineToCircle } from './GetLineToCircle';
export { GetLineToLine } from './GetLineToLine';
export { GetLineToPoints } from './GetLineToPoints';
export { GetLineToRectangle } from './GetLineToRectangle';
export { GetRectangleIntersection } from './GetRectangleIntersection';
export { GetRectangleToRectangle } from './GetRectangleToRectangle';
export { GetRectangleToTriangle } from './GetRectangleToTriangle';
export { GetTriangleToCircle } from './GetTriangleToCircle';
export { GetTriangleToLine } from './GetTriangleToLine';
export { GetTriangleToTriangle } from './GetTriangleToTriangle';

// Export complex functions (still in JS)
export {
    GetLineToPolygon,
    GetRaysFromPointToPolygon,
    LineToCircle
};
