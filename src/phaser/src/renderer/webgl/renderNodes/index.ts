/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * @namespace Phaser.Renderer.WebGL.RenderNodes
 */

import { BaseFilter } from './filters/BaseFilter';
import { BaseFilterShader } from './filters/BaseFilterShader';
import { BatchHandler } from './BatchHandler';
import { BatchHandlerPointLight } from './BatchHandlerPointLight';
import { BatchHandlerQuad } from './BatchHandlerQuad';
import { BatchHandlerQuadSingle } from './BatchHandlerQuadSingle';
import { BatchHandlerStrip } from './BatchHandlerStrip';
import { BatchHandlerTileSprite } from './BatchHandlerTileSprite';
import { BatchHandlerTriFlat } from './BatchHandlerTriFlat';
import { Camera } from './Camera';
import { Defaults } from './defaults';
import { DrawLine } from './DrawLine';
import { DynamicTextureHandler } from './DynamicTextureHandler';
import { FillCamera } from './FillCamera';
import { FillPath } from './FillPath';
import { FillRect } from './FillRect';
import { FillTri } from './FillTri';
import { FilterBarrel } from './filters/FilterBarrel';
import { FilterBlend } from './filters/FilterBlend';
import { FilterBlur } from './filters/FilterBlur';
import { FilterBlurHigh } from './filters/FilterBlurHigh';
import { FilterBlurLow } from './filters/FilterBlurLow';
import { FilterBlurMed } from './filters/FilterBlurMed';
import { FilterBokeh } from './filters/FilterBokeh';
import { FilterColorMatrix } from './filters/FilterColorMatrix';
import { FilterCombineColorMatrix } from './filters/FilterCombineColorMatrix';
import { FilterDisplacement } from './filters/FilterDisplacement';
import { FilterGlow } from './filters/FilterGlow';
import { FilterImageLight } from './filters/FilterImageLight';
import { FilterKey } from './filters/FilterKey';
import { FilterMask } from './filters/FilterMask';
import { FilterNormalTools } from './filters/FilterNormalTools';
import { FilterPanoramaBlur } from './filters/FilterPanoramaBlur';
import { FilterParallelFilters } from './filters/FilterParallelFilters';
import { FilterPixelate } from './filters/FilterPixelate';
import { FilterSampler } from './filters/FilterSampler';
import { FilterShadow } from './filters/FilterShadow';
import { FilterThreshold } from './filters/FilterThreshold';
import { FilterVignette } from './filters/FilterVignette';
import { FilterWipe } from './filters/FilterWipe';
import { ShaderQuad } from './ShaderQuad';
import { ListCompositor } from './ListCompositor';
import { RebindContext } from './RebindContext';
import { RenderNode } from './RenderNode';
import { StrokePath } from './StrokePath';
import { SubmitterQuad } from './submitter/SubmitterQuad';
import { SubmitterSpriteGPULayer } from './submitter/SubmitterSpriteGPULayer';
import { SubmitterTile } from './submitter/SubmitterTile';
import { SubmitterTilemapGPULayer } from './submitter/SubmitterTilemapGPULayer';
import { SubmitterTileSprite } from './submitter/SubmitterTileSprite';
import { TexturerImage } from './texturer/TexturerImage';
import { TexturerTileSprite } from './texturer/TexturerTileSprite';
import { TransformerImage } from './transformer/TransformerImage';
import { TransformerStamp } from './transformer/TransformerStamp';
import { TransformerTile } from './transformer/TransformerTile';
import { TransformerTileSprite } from './transformer/TransformerTileSprite';
import { YieldContext } from './YieldContext';

export const RenderNodes = {
    BaseFilter,
    BaseFilterShader,
    BatchHandler,
    BatchHandlerPointLight,
    BatchHandlerQuad,
    BatchHandlerQuadSingle,
    BatchHandlerStrip,
    BatchHandlerTileSprite,
    BatchHandlerTriFlat,
    Camera,
    Defaults,
    DrawLine,
    DynamicTextureHandler,
    FillCamera,
    FillPath,
    FillRect,
    FillTri,
    FilterBarrel,
    FilterBlend,
    FilterBlur,
    FilterBlurHigh,
    FilterBlurLow,
    FilterBlurMed,
    FilterBokeh,
    FilterColorMatrix,
    FilterCombineColorMatrix,
    FilterDisplacement,
    FilterGlow,
    FilterImageLight,
    FilterKey,
    FilterMask,
    FilterNormalTools,
    FilterPanoramaBlur,
    FilterParallelFilters,
    FilterPixelate,
    FilterSampler,
    FilterShadow,
    FilterThreshold,
    FilterVignette,
    FilterWipe,
    ShaderQuad,
    ListCompositor,
    RebindContext,
    RenderNode,
    StrokePath,
    SubmitterQuad,
    SubmitterSpriteGPULayer,
    SubmitterTile,
    SubmitterTilemapGPULayer,
    SubmitterTileSprite,
    TexturerImage,
    TexturerTileSprite,
    TransformerImage,
    TransformerStamp,
    TransformerTile,
    TransformerTileSprite,
    YieldContext
};
