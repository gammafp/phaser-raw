/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { Extend } from '../../utils/object/Extend';

import { WEBGL_CONST } from './const';
import * as Shaders from './shaders';
import * as ShaderAdditionMakers from './shaders/additionMakers';
import { DrawingContext } from './DrawingContext';
import { DrawingContextPool } from './DrawingContextPool';
import { ProgramManager } from './ProgramManager';
import { RenderNodes } from './renderNodes';
import { ShaderProgramFactory } from './ShaderProgramFactory';
import { Utils } from './Utils';
import { WebGLRenderer } from './WebGLRenderer';
import { Wrappers } from './wrappers';

/**
 * @namespace Phaser.Renderer.WebGL
 */

let WebGL: any = {

    Shaders,
    ShaderAdditionMakers,

    DrawingContext,
    DrawingContextPool,
    ProgramManager,
    RenderNodes,
    ShaderProgramFactory,
    Utils,
    WebGLRenderer,
    Wrappers

};

//   Merge in the consts

WebGL = Extend(false, WebGL, WEBGL_CONST);

//  Export it

module.exports = WebGL;
