/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * @namespace Phaser.Renderer.Snapshot
 */

const CanvasSnapshot = require('./CanvasSnapshot');
import { WebGLSnapshot } from './WebGLSnapshot';

module.exports = {

    Canvas: CanvasSnapshot,
    WebGL: WebGLSnapshot

};
