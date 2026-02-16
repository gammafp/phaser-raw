/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import EventEmitter from 'eventemitter3';
import * as Events from '../../events';

import { BaseFilter } from './filters/BaseFilter';
import { BaseFilterShader } from './filters/BaseFilterShader';

import { BatchHandlerPointLight } from './BatchHandlerPointLight';
import { BatchHandlerQuad } from './BatchHandlerQuad';
import { BatchHandlerQuadSingle } from './BatchHandlerQuadSingle';
import { BatchHandlerStrip } from './BatchHandlerStrip';
import { BatchHandlerTileSprite } from './BatchHandlerTileSprite';
import { BatchHandlerTriFlat } from './BatchHandlerTriFlat';

import { Camera } from './Camera';
import { DrawLine } from './DrawLine';
import { DynamicTextureHandler } from './DynamicTextureHandler';
import { FillCamera } from './FillCamera';
import { FillPath } from './FillPath';
import { FillRect } from './FillRect';
import { FillTri } from './FillTri';

import { FilterBarrel } from './filters/FilterBarrel';
import { FilterBlend } from './filters/FilterBlend';
import { FilterBlocky } from './filters/FilterBlocky';
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

import { ListCompositor } from './ListCompositor';
import { RebindContext } from './RebindContext';
import { StrokePath } from './StrokePath';
import { SubmitterQuad } from './submitter/SubmitterQuad';
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

export interface DebugGraphNode {
    name: string;
    children: DebugGraphNode[];
    parent: DebugGraphNode | null;
}

/**
 * Provides and manages the nodes in the rendering graph.
 *
 * @class RenderNodeManager
 * @memberof Phaser.Renderer.WebGL.RenderNodes
 * @constructor
 * @since 4.0.0
 * @param {Phaser.Renderer.WebGL.WebGLRenderer} renderer - The renderer that owns this manager.
 */
export class RenderNodeManager extends EventEmitter {

    renderer: any;
    maxParallelTextureUnits: number;
    _nodes: Record<string, any>;
    _nodeConstructors: Record<string, new (manager: any) => any>;
    currentBatchNode: any;
    currentBatchDrawingContext: any;
    debug: boolean;
    debugGraph: DebugGraphNode | null;
    currentDebugNode: DebugGraphNode | null;

    constructor(renderer: any)
    {
        super();

        this.renderer = renderer;

        const game = renderer.game;

        this.maxParallelTextureUnits = (game.config.autoMobileTextures && !game.device.os.desktop) ? 1 : renderer.maxTextures;

        this._nodes = {};

        this._nodeConstructors = {
            BaseFilter: BaseFilter as any,
            BaseFilterShader: BaseFilterShader as any,

            BatchHandlerPointLight: BatchHandlerPointLight as any,
            BatchHandlerQuad: BatchHandlerQuad as any,
            BatchHandlerQuadSingle: BatchHandlerQuadSingle as any,
            BatchHandlerStrip: BatchHandlerStrip as any,
            BatchHandlerTileSprite: BatchHandlerTileSprite as any,
            BatchHandlerTriFlat: BatchHandlerTriFlat as any,

            Camera: Camera as any,
            DrawLine: DrawLine as any,
            DynamicTextureHandler: DynamicTextureHandler as any,
            FillCamera: FillCamera as any,
            FillPath: FillPath as any,
            FillRect: FillRect as any,
            FillTri: FillTri as any,

            FilterBarrel: FilterBarrel as any,
            FilterBlend: FilterBlend as any,
            FilterBlocky: FilterBlocky as any,
            FilterBlur: FilterBlur as any,
            FilterBlurHigh: FilterBlurHigh as any,
            FilterBlurLow: FilterBlurLow as any,
            FilterBlurMed: FilterBlurMed as any,
            FilterBokeh: FilterBokeh as any,
            FilterColorMatrix: FilterColorMatrix as any,
            FilterCombineColorMatrix: FilterCombineColorMatrix as any,
            FilterDisplacement: FilterDisplacement as any,
            FilterGlow: FilterGlow as any,
            FilterImageLight: FilterImageLight as any,
            FilterKey: FilterKey as any,
            FilterMask: FilterMask as any,
            FilterNormalTools: FilterNormalTools as any,
            FilterPanoramaBlur: FilterPanoramaBlur as any,
            FilterParallelFilters: FilterParallelFilters as any,
            FilterPixelate: FilterPixelate as any,
            FilterSampler: FilterSampler as any,
            FilterShadow: FilterShadow as any,
            FilterThreshold: FilterThreshold as any,
            FilterVignette: FilterVignette as any,
            FilterWipe: FilterWipe as any,

            ListCompositor: ListCompositor as any,
            RebindContext: RebindContext as any,
            StrokePath: StrokePath as any,
            SubmitterQuad: SubmitterQuad as any,
            SubmitterTile: SubmitterTile as any,
            SubmitterTilemapGPULayer: SubmitterTilemapGPULayer as any,
            SubmitterTileSprite: SubmitterTileSprite as any,
            TexturerImage: TexturerImage as any,
            TexturerTileSprite: TexturerTileSprite as any,
            TransformerImage: TransformerImage as any,
            TransformerStamp: TransformerStamp as any,
            TransformerTile: TransformerTile as any,
            TransformerTileSprite: TransformerTileSprite as any,
            YieldContext: YieldContext as any
        };

        Object.entries(game.config.renderNodes).forEach((entry: [string, any]) =>
        {
            const name = entry[0];
            const constructor = entry[1];

            this.addNodeConstructor(name, constructor);
        });

        this.currentBatchNode = null;

        this.currentBatchDrawingContext = null;

        this.debug = false;

        this.debugGraph = null;

        this.currentDebugNode = null;
    }

    addNode(name: string, node: any): void
    {
        if (this._nodes[name])
        {
            throw new Error('node ' + name + ' already exists.');
        }
        this._nodes[name] = node;

        if (this.debug)
        {
            node.setDebug(true);
        }
    }

    addNodeConstructor(name: string, constructor: any): void
    {
        if (this._nodeConstructors[name])
        {
            throw new Error('node constructor ' + name + ' already exists.');
        }
        this._nodeConstructors[name] = constructor;
    }

    getNode(name: string): any
    {
        if (this._nodes[name])
        {
            return this._nodes[name];
        }
        if (this._nodeConstructors[name])
        {
            const node = new this._nodeConstructors[name](this);
            this.addNode(name, node);
            return node;
        }
        return null;
    }

    hasNode(name: string, constructed?: boolean): boolean
    {
        return !!this._nodes[name] || (!constructed && !!this._nodeConstructors[name]);
    }

    setCurrentBatchNode(node: any, drawingContext?: any): void
    {
        if (this.currentBatchNode !== node)
        {
            if (this.currentBatchNode !== null)
            {
                this.currentBatchNode.run(
                    this.currentBatchDrawingContext
                );
            }

            this.currentBatchNode = node;

            this.currentBatchDrawingContext = node ? drawingContext : null;
        }
    }

    setMaxParallelTextureUnits(value?: number): void
    {
        if (value === undefined)
        {
            value = this.renderer.maxTextures;
        }
        this.maxParallelTextureUnits = Math.max(1, Math.min(value, this.renderer.maxTextures));

        this.emit(Events.SET_PARALLEL_TEXTURE_UNITS, this.maxParallelTextureUnits);
    }

    finishBatch(): void
    {
        if (this.currentBatchNode !== null)
        {
            this.setCurrentBatchNode(null);
        }
    }

    startStandAloneRender(): void
    {
        this.finishBatch();
    }

    setDebug(value: boolean): void
    {
        this.debug = value;

        for (const key in this._nodes)
        {
            this._nodes[key].setDebug(value);
        }

        if (value)
        {
            this.debugGraph = null;
            this.currentDebugNode = null;

            this.pushDebug('[Render Tree Root]');

            this.renderer.once(
                Events.POST_RENDER,
                () =>
                {
                    this.setDebug(false);
                }
            );
        }
    }

    pushDebug(name: string): void
    {
        if (!this.debug)
        {
            return;
        }

        const node: DebugGraphNode = {
            name: name,
            children: [],
            parent: this.currentDebugNode
        };

        if (this.debugGraph)
        {
            this.currentDebugNode!.children.push(node);
        }
        else
        {
            this.debugGraph = node;
        }

        this.currentDebugNode = node;
    }

    popDebug(): void
    {
        if (!this.debug)
        {
            return;
        }

        if (this.currentDebugNode!.parent)
        {
            this.currentDebugNode = this.currentDebugNode!.parent;
        }
        else
        {
            this.currentDebugNode = null;
        }
    }

    debugToString(): string
    {
        let output = '';
        const indent = 0;
        const node = this.debugGraph;

        function indentString(ind: number): string
        {
            return '  '.repeat(ind);
        }

        function formatNode(n: DebugGraphNode, ind: number): string
        {
            let str = indentString(ind) + n.name + '\n';

            for (let i = 0; i < n.children.length; i++)
            {
                str += formatNode(n.children[i], ind + 1);
            }

            return str;
        }

        output = formatNode(node!, indent);

        return output;
    }
}
