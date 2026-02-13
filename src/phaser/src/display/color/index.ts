/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
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
import * as HSVToRGB from './HSVToRGB';
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

(Color as any).ColorSpectrum = ColorSpectrum;
(Color as any).ColorToRGBA = ColorToRGBA;
(Color as any).ComponentToHex = ComponentToHex;
(Color as any).GetColor = GetColor;
(Color as any).GetColor32 = GetColor32;
(Color as any).HexStringToColor = HexStringToColor;
(Color as any).HSLToColor = HSLToColor;
(Color as any).HSVColorWheel = HSVColorWheel;
(Color as any).HSVToRGB = HSVToRGB;
(Color as any).HueToComponent = HueToComponent;
(Color as any).IntegerToColor = IntegerToColor;
(Color as any).IntegerToRGB = IntegerToRGB;
(Color as any).Interpolate = Interpolate;
(Color as any).ObjectToColor = ObjectToColor;
(Color as any).RandomRGB = RandomRGB;
(Color as any).RGBStringToColor = RGBStringToColor;
(Color as any).RGBToHSV = RGBToHSV;
(Color as any).RGBToString = RGBToString;
(Color as any).ValueToColor = ValueToColor;

export { Color };
