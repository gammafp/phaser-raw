/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { Color } from './Color';

import { ColorSpectrum } from './ColorSpectrum';
import { ColorToRGBA } from './ColorToRGBA';
import { ComponentToHex } from './ComponentToHex';
import { GetColor } from './GetColor';
import { GetColor32 } from './GetColor32';
import { HexStringToColor } from './HexStringToColor';
import { HSLToColor } from './HSLToColor';
import { HSVColorWheel } from './HSVColorWheel';
import { HSVToRGB } from './HSVToRGB';
import { HueToComponent } from './HueToComponent';
import { IntegerToColor } from './IntegerToColor';
import { IntegerToRGB } from './IntegerToRGB';
import * as Interpolate from './Interpolate';
import { ObjectToColor } from './ObjectToColor';
import { RandomRGB } from './RandomRGB';
import { RGBStringToColor } from './RGBStringToColor';
import { RGBToHSV } from './RGBToHSV';
import { RGBToString } from './RGBToString';
import { ValueToColor } from './ValueToColor';

Color.ColorSpectrum = ColorSpectrum;
Color.ColorToRGBA = ColorToRGBA;
Color.ComponentToHex = ComponentToHex;
Color.GetColor = GetColor;
Color.GetColor32 = GetColor32;
Color.HexStringToColor = HexStringToColor;
Color.HSLToColor = HSLToColor;
Color.HSVColorWheel = HSVColorWheel;
Color.HSVToRGB = HSVToRGB;
Color.HueToComponent = HueToComponent;
Color.IntegerToColor = IntegerToColor;
Color.IntegerToRGB = IntegerToRGB;
Color.Interpolate = Interpolate;
Color.ObjectToColor = ObjectToColor;
Color.RandomRGB = RandomRGB;
Color.RGBStringToColor = RGBStringToColor;
Color.RGBToHSV = RGBToHSV;
Color.RGBToString = RGBToString;
Color.ValueToColor = ValueToColor;

console.log(Color)

export default Color;
