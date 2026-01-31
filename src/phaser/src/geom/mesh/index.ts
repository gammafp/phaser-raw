/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

// Mesh classes and complex generators (still in JS)
const Face = require('./Face');
const GenerateGridVerts = require('./GenerateGridVerts');
const GenerateObjVerts = require('./GenerateObjVerts');
const GenerateVerts = require('./GenerateVerts');
const ParseObj = require('./ParseObj');
const ParseObjMaterial = require('./ParseObjMaterial');
const RotateFace = require('./RotateFace');
const Vertex = require('./Vertex');

// Export all mesh components
export {
    Face,
    GenerateGridVerts,
    GenerateObjVerts,
    GenerateVerts,
    ParseObj,
    ParseObjMaterial,
    RotateFace,
    Vertex
};
