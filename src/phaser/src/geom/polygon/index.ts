/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

// Export Polygon class and complex algorithms
import { Polygon } from './Polygon';
import { Earcut } from './Earcut';
import { Simplify } from './Simplify';
import { Smooth } from './Smooth';

// Export all polygon functions for tree-shaking
export { Clone } from './Clone';
export { Contains } from './Contains';
export { ContainsPoint } from './ContainsPoint';
export { GetAABB } from './GetAABB';
export { GetNumberArray } from './GetNumberArray';
export { GetPoints } from './GetPoints';
export { Perimeter } from './Perimeter';
export { Reverse } from './Reverse';
export { Translate } from './Translate';

// Export Polygon class and complex algorithms
export { Polygon, Earcut, Simplify, Smooth };
