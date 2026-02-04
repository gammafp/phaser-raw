/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * @namespace Phaser.FX
 */

import { Extend } from '../utils/object/Extend';
import { Barrel } from './Barrel';
import { Controller } from './Controller';
import { Bloom } from './Bloom';
import { Blur } from './Blur';
import { Bokeh } from './Bokeh';
import { Circle } from './Circle';
import { ColorMatrix } from './ColorMatrix';
import { Displacement } from './Displacement';
import { Glow } from './Glow';
import { Gradient } from './Gradient';
import { Pixelate } from './Pixelate';
import { Shadow } from './Shadow';
import { Shine } from './Shine';
import { Vignette } from './Vignette';
import { Wipe } from './Wipe';
import { FX_CONST } from './const';

const FX: any = {
    Barrel,
    Controller,
    Bloom,
    Blur,
    Bokeh,
    Circle,
    ColorMatrix,
    Displacement,
    Glow,
    Gradient,
    Pixelate,
    Shadow,
    Shine,
    Vignette,
    Wipe
};

// Merge FX_CONST into FX namespace
Extend(false, FX, FX_CONST);

export default FX;

// Also export individual classes for tree-shaking
export {
    Barrel,
    Controller,
    Bloom,
    Blur,
    Bokeh,
    Circle,
    ColorMatrix,
    Displacement,
    Glow,
    Gradient,
    Pixelate,
    Shadow,
    Shine,
    Vignette,
    Wipe,
    FX_CONST
};
