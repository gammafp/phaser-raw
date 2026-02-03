/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { DeepCopy } from '../../utils/object/DeepCopy';

/**
 * Provides methods used for setting the WebGL rendering pipeline of a Game Object.
 */
export interface Pipeline {
    defaultPipeline: any;
    pipeline: any;
    pipelineData: Record<string, any> | null;
    scene: any;
    initPipeline(pipeline?: string | any): boolean;
    setPipeline(pipeline: string | any, pipelineData?: Record<string, any>, copyData?: boolean): this;
    setPipelineData(key: string, value?: any): this;
    resetPipeline(resetData?: boolean): boolean;
    getPipelineName(): string | null;
}

export const Pipeline = {

    defaultPipeline: null,
    pipeline: null,
    pipelineData: null,

    initPipeline(this: any, pipeline?: string | any): boolean {
        this.pipelineData = {};

        const renderer = this.scene.sys.renderer;

        if (!renderer) {
            return false;
        }

        const pipelines = renderer.pipelines;

        if (pipelines) {
            if (pipeline === undefined) {
                pipeline = pipelines.default;
            }

            const instance = pipelines.get(pipeline);

            if (instance) {
                this.defaultPipeline = instance;
                this.pipeline = instance;
                return true;
            }
        }

        return false;
    },

    setPipeline(this: any, pipeline: string | any, pipelineData?: Record<string, any>, copyData: boolean = true): any {
        const renderer = this.scene.sys.renderer;

        if (!renderer) {
            return this;
        }

        const pipelines = renderer.pipelines;

        if (pipelines) {
            const instance = pipelines.get(pipeline);

            if (instance) {
                this.pipeline = instance;
            }

            if (pipelineData) {
                this.pipelineData = copyData ? DeepCopy(pipelineData) : pipelineData;
            }
        }

        return this;
    },

    setPipelineData(this: any, key: string, value?: any): any {
        const data = this.pipelineData;

        if (value === undefined) {
            delete data[key];
        } else {
            data[key] = value;
        }

        return this;
    },

    resetPipeline(this: any, resetData: boolean = false): boolean {
        this.pipeline = this.defaultPipeline;

        if (resetData) {
            this.pipelineData = {};
        }

        return (this.pipeline !== null);
    },

    getPipelineName(this: any): string | null {
        return (this.pipeline === null) ? null : this.pipeline.name;
    }
};
