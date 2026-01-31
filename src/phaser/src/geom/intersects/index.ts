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
export { RectangleToRectangle } from './RectangleToRectangle';
export { RectangleToValues } from './RectangleToValues';

// Export complex functions (still in JS)
export {
    GetCircleToCircle,
    GetCircleToRectangle,
    GetLineToCircle,
    GetLineToLine,
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
