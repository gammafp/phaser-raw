/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

// Complex intersection functions (still in JS)
const GetCircleToCircle = require('./GetCircleToCircle');
const GetCircleToRectangle = require('./GetCircleToRectangle');
const GetLineToCircle = require('./GetLineToCircle');
const GetLineToLine = require('./GetLineToLine');
const GetLineToPoints = require('./GetLineToPoints');
const GetLineToPolygon = require('./GetLineToPolygon');
const GetLineToRectangle = require('./GetLineToRectangle');
const GetRaysFromPointToPolygon = require('./GetRaysFromPointToPolygon');
const GetRectangleIntersection = require('./GetRectangleIntersection');
const GetRectangleToRectangle = require('./GetRectangleToRectangle');
const GetRectangleToTriangle = require('./GetRectangleToTriangle');
const GetTriangleToCircle = require('./GetTriangleToCircle');
const GetTriangleToLine = require('./GetTriangleToLine');
const GetTriangleToTriangle = require('./GetTriangleToTriangle');
const LineToCircle = require('./LineToCircle');
const LineToRectangle = require('./LineToRectangle');
const PointToLine = require('./PointToLine');
const PointToLineSegment = require('./PointToLineSegment');
const RectangleToTriangle = require('./RectangleToTriangle');
const TriangleToCircle = require('./TriangleToCircle');
const TriangleToLine = require('./TriangleToLine');
const TriangleToTriangle = require('./TriangleToTriangle');

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
export { GetTriangleToTriangle } from './GetTriangleToTriangle';

// Export complex functions (still in JS)
const GetTriangleToLine = require('./GetTriangleToLine');

export {
    GetTriangleToLine,
    GetLineToPoints,
    GetLineToPolygon,
    GetLineToRectangle,
    GetRaysFromPointToPolygon,
    GetRectangleIntersection,
    GetRectangleToRectangle,
    GetRectangleToTriangle,
    GetTriangleToCircle,
    GetTriangleToLine,
    GetTriangleToTriangle,
    LineToCircle,
    LineToRectangle,
    PointToLine,
    PointToLineSegment,
    RectangleToTriangle,
    TriangleToCircle,
    TriangleToLine,
    TriangleToTriangle
};
