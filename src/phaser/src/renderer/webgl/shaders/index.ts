/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2013-2023 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * @namespace Phaser.Renderer.WebGL.Shaders
 */

import { ApplyLighting } from './ApplyLighting-glsl';
import { ApplyTint } from './ApplyTint-glsl';
import { BoundedSampler } from './BoundedSampler-glsl';
import { ColorMatrixFrag } from './ColorMatrix-frag';
import { DefineBlockyTexCoord } from './DefineBlockyTexCoord-glsl';
import { DefineLights } from './DefineLights-glsl';
import { DefineTexCoordFrameClamp } from './DefineTexCoordFrameClamp-glsl';
import { FilterBarrelFrag } from './FilterBarrel-frag';
import { FilterBlendFrag } from './FilterBlend-frag';
import { FilterBlockyFrag } from './FilterBlocky-frag';
import { FilterBlurHighFrag } from './FilterBlurHigh-frag';
import { FilterBlurLowFrag } from './FilterBlurLow-frag';
import { FilterBlurMedFrag } from './FilterBlurMed-frag';
import { FilterBokehFrag } from './FilterBokeh-frag';
import { FilterColorMatrixFrag } from './FilterColorMatrix-frag';
import { FilterCombineColorMatrixFrag } from './FilterCombineColorMatrix-frag';
import { FilterDisplacementFrag } from './FilterDisplacement-frag';
import { FilterGlowFrag } from './FilterGlow-frag';
import { FilterImageLightFrag } from './FilterImageLight-frag';
import { FilterKeyFrag } from './FilterKey-frag';
import { FilterMaskFrag } from './FilterMask-frag';
import { FilterNormalToolsFrag } from './FilterNormalTools-frag';
import { FilterPanoramaBlurFrag } from './FilterPanoramaBlur-frag';
import { FilterPixelateFrag } from './FilterPixelate-frag';
import { FilterShadowFrag } from './FilterShadow-frag';
import { FilterThresholdFrag } from './FilterThreshold-frag';
import { FilterVignetteFrag } from './FilterVignette-frag';
import { FilterWipeFrag } from './FilterWipe-frag';
import { FlatFrag } from './Flat-frag';
import { FlatVert } from './Flat-vert';
import { GetNormalFromMap } from './GetNormalFromMap-glsl';
import { GetTexRes } from './GetTexRes-glsl';
import { GetTexture } from './GetTexture-glsl';
import { MultiFrag } from './Multi-frag';
import { MultiVert } from './Multi-vert';
import { OutInverseRotation } from './OutInverseRotation-glsl';
import { PointLightFrag } from './PointLight-frag';
import { PointLightVert } from './PointLight-vert';
import { ShaderQuadFrag } from './ShaderQuad-frag';
import { ShaderQuadVert } from './ShaderQuad-vert';
import { SimpleTextureVert } from './SimpleTexture-vert';
import { SpriteGPULayerFrag } from './SpriteGPULayer-frag';
import { SpriteGPULayerVert } from './SpriteGPULayer-vert';
import { TilemapGPULayerFrag } from './TilemapGPULayer-frag';
import { TilemapGPULayerVert } from './TilemapGPULayer-vert';

export {
    ApplyLighting,
    ApplyTint,
    BoundedSampler,
    ColorMatrixFrag,
    DefineBlockyTexCoord,
    DefineLights,
    DefineTexCoordFrameClamp,
    FilterBarrelFrag,
    FilterBlendFrag,
    FilterBlockyFrag,
    FilterBlurHighFrag,
    FilterBlurLowFrag,
    FilterBlurMedFrag,
    FilterBokehFrag,
    FilterColorMatrixFrag,
    FilterCombineColorMatrixFrag,
    FilterDisplacementFrag,
    FilterGlowFrag,
    FilterImageLightFrag,
    FilterKeyFrag,
    FilterMaskFrag,
    FilterNormalToolsFrag,
    FilterPanoramaBlurFrag,
    FilterPixelateFrag,
    FilterShadowFrag,
    FilterThresholdFrag,
    FilterVignetteFrag,
    FilterWipeFrag,
    FlatFrag,
    FlatVert,
    GetNormalFromMap,
    GetTexRes,
    GetTexture,
    MultiFrag,
    MultiVert,
    OutInverseRotation,
    PointLightFrag,
    PointLightVert,
    ShaderQuadFrag,
    ShaderQuadVert,
    SimpleTextureVert,
    SpriteGPULayerFrag,
    SpriteGPULayerVert,
    TilemapGPULayerFrag,
    TilemapGPULayerVert
};
