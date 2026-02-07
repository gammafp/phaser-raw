/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { SpliceOne } from '../../utils/array/SpliceOne';

const Effects = require('../../fx/');

/**
 * @classdesc
 * The FX Component features a set of methods used for applying a range of special built-in effects to a Game Object.
 *
 * The effects include the following:
 *
 * * Barrel Distortion
 * * Bloom
 * * Blur
 * * Bokeh / Tilt Shift
 * * Circle Outline
 * * Color Matrix
 * * Glow
 * * Displacement
 * * Gradient
 * * Pixelate
 * * Shine
 * * Shadow
 * * Vignette
 * * Wipe / Reveal
 *
 * All Game Objects support Post FX. These are effects applied after the Game Object has been rendered.
 *
 * Texture-based Game Objects also support Pre FX, including:
 *
 * * Image
 * * Sprite
 * * TileSprite
 * * Text
 * * RenderTexture
 * * Video
 *
 * And any Game Object that extends the above.
 *
 * The difference between Pre FX and Post FX are that all Post FX take place in a canvas (renderer) sized frame buffer,
 * after the Game Object has been rendered. Pre FX, however, take place in a texture sized frame buffer, which is sized
 * based on the Game Object itself. The end result is then composited back to the main game canvas. For intensive effects,
 * such as blur, bloom or glow, which can require many iterations, this is a much more efficient way to apply the effect,
 * as only it only has to work on a Game Object sized texture and not all pixels in the canvas.
 *
 * In short, you should always try and use a Pre FX if you can.
 *
 * Due to the way that FX work they can be stacked-up. For example, you can apply a blur to a Game Object, then apply
 * a bloom effect to the same Game Object. The bloom effect will be applied to the blurred texture, not the original.
 * Keep the order in mind when stacking effects.
 *
 * All effects are WebGL only and do not have canvas counterparts.
 *
 * As you can appreciate, some effects are more expensive than others. For example, a bloom effect is going to be more
 * expensive than a simple color matrix effect, so please consider using them wisely and performance test your target
 * platforms early on in production.
 *
 * This component is created automatically by the `PostPipeline` class and does not need to be instantiated directly.
 *
 * @class FX
 * @memberof Phaser.GameObjects.Components
 * @constructor
 * @since 3.60.0
 * @webglOnly
 *
 * @param {Phaser.GameObjects.GameObject} gameObject - A reference to the Game Object that owns this FX Component.
 * @param {boolean} isPost - Is this a Pre or Post FX Component?
 */
export class FX {

    readonly gameObject: any;
    readonly isPost: boolean;
    enabled: boolean;
    list: any[];
    padding: number;

    constructor(gameObject: any, isPost: boolean)
    {
        this.gameObject = gameObject;
        this.isPost = isPost;
        this.enabled = false;
        this.list = [];
        this.padding = 0;
    }

    setPadding(padding: number = 0): any
    {
        this.padding = padding;
        return this.gameObject;
    }

    onFXCopy(pipeline?: any): void
    {
    }

    onFX(pipeline?: any): void
    {
    }

    enable(padding?: number): void
    {
        if (this.isPost)
        {
            return;
        }

        const renderer = this.gameObject.scene.sys.renderer;

        if (renderer && renderer.pipelines)
        {
            this.gameObject.pipeline = renderer.pipelines.FX_PIPELINE;

            if (padding !== undefined)
            {
                this.padding = padding;
            }

            this.enabled = true;
        }
        else
        {
            this.enabled = false;
        }
    }

    clear(): any
    {
        if (this.isPost)
        {
            this.gameObject.resetPostPipeline(true);
        }
        else
        {
            const list = this.list;

            for (let i = 0; i < list.length; i++)
            {
                list[i].destroy();
            }

            this.list = [];
        }

        this.enabled = false;

        return this.gameObject;
    }

    remove(fx: any): any
    {
        if (this.isPost)
        {
            let pipelines = this.gameObject.getPostPipeline(String(fx.type));

            if (!Array.isArray(pipelines))
            {
                pipelines = [pipelines];
            }

            for (let i = 0; i < pipelines.length; i++)
            {
                const pipeline = pipelines[i];

                if (pipeline.controller === fx)
                {
                    this.gameObject.removePostPipeline(pipeline);
                    fx.destroy();
                    break;
                }
            }
        }
        else
        {
            const list = this.list;

            for (let i = 0; i < list.length; i++)
            {
                if (list[i] === fx)
                {
                    SpliceOne(list, i);
                    fx.destroy();
                }
            }
        }

        return this.gameObject;
    }

    disable(clear: boolean = false): any
    {
        if (!this.isPost)
        {
            this.gameObject.resetPipeline();
        }

        this.enabled = false;

        if (clear)
        {
            this.clear();
        }

        return this.gameObject;
    }

    add(fx: any, config?: Record<string, any>): any
    {
        if (this.isPost)
        {
            const type = String(fx.type);

            this.gameObject.setPostPipeline(type, config);

            let pipeline = this.gameObject.getPostPipeline(type);

            if (pipeline)
            {
                if (Array.isArray(pipeline))
                {
                    pipeline = pipeline.pop();
                }

                if (pipeline)
                {
                    pipeline.controller = fx;
                }

                return fx;
            }
        }
        else
        {
            if (!this.enabled)
            {
                this.enable();
            }

            this.list.push(fx);

            return fx;
        }
    }

    addGlow(color?: number, outerStrength?: number, innerStrength?: number, knockout?: boolean, quality?: number, distance?: number): any
    {
        return this.add(new Effects.Glow(this.gameObject, color, outerStrength, innerStrength, knockout), { quality, distance });
    }

    addShadow(x?: number, y?: number, decay?: number, power?: number, color?: number, samples?: number, intensity?: number): any
    {
        return this.add(new Effects.Shadow(this.gameObject, x, y, decay, power, color, samples, intensity));
    }

    addPixelate(amount?: number): any
    {
        return this.add(new Effects.Pixelate(this.gameObject, amount));
    }

    /**
     * Adds a Vignette effect.
     *
     * The vignette effect is a visual technique where the edges of the screen, or a Game Object, gradually darken or blur,
     * creating a frame-like appearance. This effect is used to draw the player's focus towards the central action or subject,
     * enhance immersion, and provide a cinematic or artistic quality to the game's visuals.
     *
     * @method Phaser.GameObjects.Components.FX#addVignette
     * @since 3.60.0
     *
     * @param {number} [x=0.5] - The horizontal offset of the vignette effect. This value is normalized to the range 0 to 1.
     * @param {number} [y=0.5] - The vertical offset of the vignette effect. This value is normalized to the range 0 to 1.
     * @param {number} [radius=0.5] - The radius of the vignette effect. This value is normalized to the range 0 to 1.
     * @param {number} [strength=0.5] - The strength of the vignette effect.
     *
     * @return {Phaser.FX.Vignette} The Vignette FX Controller.
     */
    addVignette(x?: number, y?: number, radius?: number, strength?: number): any
    {
        return this.add(new Effects.Vignette(this.gameObject, x, y, radius, strength));
    }

    addShine(speed?: number, lineWidth?: number, gradient?: number, reveal?: boolean): any
    {
        return this.add(new Effects.Shine(this.gameObject, speed, lineWidth, gradient, reveal));
    }

    addBlur(quality?: number, x?: number, y?: number, strength?: number, color?: number, steps?: number): any
    {
        return this.add(new Effects.Blur(this.gameObject, quality, x, y, strength, color, steps));
    }

    addGradient(color1?: number, color2?: number, alpha?: number, fromX?: number, fromY?: number, toX?: number, toY?: number, size?: number): any
    {
        return this.add(new Effects.Gradient(this.gameObject, color1, color2, alpha, fromX, fromY, toX, toY, size));
    }

    addBloom(color?: number, offsetX?: number, offsetY?: number, blurStrength?: number, strength?: number, steps?: number): any
    {
        return this.add(new Effects.Bloom(this.gameObject, color, offsetX, offsetY, blurStrength, strength, steps));
    }

    addColorMatrix(): any
    {
        return this.add(new Effects.ColorMatrix(this.gameObject));
    }

    addCircle(thickness?: number, color?: number, backgroundColor?: number, scale?: number, feather?: number): any
    {
        return this.add(new Effects.Circle(this.gameObject, thickness, color, backgroundColor, scale, feather));
    }

    addBarrel(amount?: number): any
    {
        return this.add(new Effects.Barrel(this.gameObject, amount));
    }

    addDisplacement(texture?: string, x?: number, y?: number): any
    {
        return this.add(new Effects.Displacement(this.gameObject, texture, x, y));
    }

    addWipe(wipeWidth?: number, direction?: number, axis?: number): any
    {
        return this.add(new Effects.Wipe(this.gameObject, wipeWidth, direction, axis));
    }

    addReveal(wipeWidth?: number, direction?: number, axis?: number): any
    {
        return this.add(new Effects.Wipe(this.gameObject, wipeWidth, direction, axis, true));
    }

    addBokeh(radius?: number, amount?: number, contrast?: number): any
    {
        return this.add(new Effects.Bokeh(this.gameObject, radius, amount, contrast));
    }

    addTiltShift(radius?: number, amount?: number, contrast?: number, blurX?: number, blurY?: number, strength?: number): any
    {
        return this.add(new Effects.Bokeh(this.gameObject, radius, amount, contrast, true, blurX, blurY, strength));
    }

    destroy(): void
    {
        this.clear();
        this.gameObject = null;
    }

}
