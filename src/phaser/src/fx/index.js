/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

// TODO: Convert this file to TypeScript

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

/**
 * @namespace Phaser.FX
 */

var FX = {

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

FX = Extend(false, FX, FX_CONST);

module.exports = FX;
