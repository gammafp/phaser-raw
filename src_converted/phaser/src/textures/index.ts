/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { Extend } from '../utils/object/Extend';
import { FilterMode } from './const';
import { CanvasTexture } from './CanvasTexture';
import { DynamicTexture } from './DynamicTexture';
import * as Events from './events';
import { Frame } from './Frame';
import * as Parsers from './parsers';
import { Texture } from './Texture';
import { TextureManager } from './TextureManager';
import { TextureSource } from './TextureSource';

/**
 * @namespace Phaser.Textures
 */

const Textures = {
    CanvasTexture,
    DynamicTexture,
    Events,
    FilterMode,
    Frame,
    Parsers,
    Texture,
    TextureManager,
    TextureSource
};

export default Extend(false, Textures, FilterMode);
