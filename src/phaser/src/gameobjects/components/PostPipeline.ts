/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { DeepCopy } from '../../utils/object/DeepCopy';
import { SpliceOne } from '../../utils/array/SpliceOne';
import { FX } from './FX';

/**
 * Provides methods used for setting the WebGL rendering post pipeline of a Game Object.
 */
export interface PostPipeline {
    hasPostPipeline: boolean;
    postPipelines: any[] | null;
    postPipelineData: Record<string, any> | null;
    preFX: any;
    postFX: any;
    scene: any;
    initPostPipeline(preFX?: boolean): void;
    setPostPipeline(pipelines: string | string[] | any | any[], pipelineData?: Record<string, any>, copyData?: boolean): this;
    setPostPipelineData(key: string, value?: any): this;
    getPostPipeline(pipeline: string | any): any | any[];
    resetPostPipeline(resetData?: boolean): void;
    removePostPipeline(pipeline: string | any): this;
    clearFX(): this;
}

export const PostPipeline = {

    hasPostPipeline: false,
    postPipelines: null,
    postPipelineData: null,
    preFX: null,
    postFX: null,

    initPostPipeline(this: any, preFX: boolean = false): void {
        this.postPipelines = [];
        this.postPipelineData = {};
        this.postFX = new FX(this, true);

        if (preFX) {
            this.preFX = new FX(this, false);
        }
    },

    setPostPipeline(this: any, pipelines: string | string[] | any | any[], pipelineData?: Record<string, any>, copyData: boolean = true): any {
        const renderer = this.scene.sys.renderer;

        if (!renderer) {
            return this;
        }

        const pipelineManager = renderer.pipelines;

        if (pipelineManager) {
            if (!Array.isArray(pipelines)) {
                pipelines = [pipelines];
            }

            for (let i = 0; i < pipelines.length; i++) {
                const instance = pipelineManager.getPostPipeline(pipelines[i], this, pipelineData);

                if (instance) {
                    this.postPipelines.push(instance);
                }
            }

            if (pipelineData) {
                this.postPipelineData = copyData ? DeepCopy(pipelineData) : pipelineData;
            }
        }

        this.hasPostPipeline = (this.postPipelines.length > 0);

        return this;
    },

    setPostPipelineData(this: any, key: string, value?: any): any {
        const data = this.postPipelineData;

        if (value === undefined) {
            delete data[key];
        } else {
            data[key] = value;
        }

        return this;
    },

    getPostPipeline(this: any, pipeline: string | any): any | any[] {
        const isString = (typeof pipeline === 'string');
        const pipelines = this.postPipelines;
        const results: any[] = [];

        for (let i = 0; i < pipelines.length; i++) {
            const instance = pipelines[i];

            if ((isString && instance.name === pipeline) || (!isString && instance instanceof pipeline)) {
                results.push(instance);
            }
        }

        return (results.length === 1) ? results[0] : results;
    },

    resetPostPipeline(this: any, resetData: boolean = false): void {
        const pipelines = this.postPipelines;

        for (let i = 0; i < pipelines.length; i++) {
            pipelines[i].destroy();
        }

        this.postPipelines = [];
        this.hasPostPipeline = false;

        if (resetData) {
            this.postPipelineData = {};
        }
    },

    removePostPipeline(this: any, pipeline: string | any): any {
        const isString = (typeof pipeline === 'string');
        const pipelines = this.postPipelines;

        for (let i = pipelines.length - 1; i >= 0; i--) {
            const instance = pipelines[i];

            if ((isString && instance.name === pipeline) || (!isString && instance === pipeline)) {
                instance.destroy();
                SpliceOne(pipelines, i);
            }
        }

        this.hasPostPipeline = (this.postPipelines.length > 0);

        return this;
    },

    clearFX(this: any): any {
        if (this.preFX) {
            this.preFX.clear();
        }

        if (this.postFX) {
            this.postFX.clear();
        }

        return this;
    }
};
