/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

const errors: Record<number, string> = {
    36054: 'Incomplete Attachment',
    36055: 'Missing Attachment',
    36057: 'Incomplete Dimensions',
    36061: 'Framebuffer Unsupported'
};

export interface Attachment {
    attachmentPoint: number;
    texture?: any;
    renderbuffer?: WebGLRenderbuffer;
    internalFormat?: number;
}

/**
 * @classdesc
 * Wrapper for a WebGL frame buffer,
 * containing all the information that was used to create it.
 *
 * @class WebGLFramebufferWrapper
 * @memberof Phaser.Renderer.WebGL.Wrappers
 * @constructor
 * @since 3.80.0
 */
export class WebGLFramebufferWrapper {

    webGLFramebuffer: WebGLFramebuffer | null;
    renderer: any;
    useCanvas: boolean;
    width: number;
    height: number;
    attachments: Attachment[];
    renderTexture: any;

    constructor(renderer: any, colorAttachments?: any[] | null, addStencilBuffer?: boolean, addDepthBuffer?: boolean)
    {
        const gl = renderer.gl;

        this.webGLFramebuffer = null;
        this.renderer = renderer;
        this.useCanvas = !colorAttachments || colorAttachments.length === 0;
        this.width = 0;
        this.height = 0;
        this.attachments = [];

        if (!this.useCanvas)
        {
            for (let i = 0; i < colorAttachments!.length; i++)
            {
                this.attachments.push({
                    texture: colorAttachments![i],
                    attachmentPoint: gl.COLOR_ATTACHMENT0 + i
                });

                if (i === 0)
                {
                    this.width = colorAttachments![i].width;
                    this.height = colorAttachments![i].height;
                }
                else if (colorAttachments![i].width !== this.width || colorAttachments![i].height !== this.height)
                {
                    throw new Error('Color attachments must have the same dimensions');
                }
            }

            if (addDepthBuffer && addStencilBuffer)
            {
                this.attachments.push({
                    attachmentPoint: gl.DEPTH_STENCIL_ATTACHMENT,
                    internalFormat: gl.DEPTH_STENCIL
                });
            }
            else if (addDepthBuffer)
            {
                this.attachments.push({
                    attachmentPoint: gl.DEPTH_ATTACHMENT,
                    internalFormat: gl.DEPTH_COMPONENT16
                });
            }
            else if (addStencilBuffer)
            {
                this.attachments.push({
                    attachmentPoint: gl.STENCIL_ATTACHMENT,
                    internalFormat: gl.STENCIL_INDEX8
                });
            }
        }

        this.renderTexture = null;

        if (this.attachments[0])
        {
            this.renderTexture = this.attachments[0].texture;
        }

        this.createResource();
    }

    createResource(): void
    {
        if (this.useCanvas) { return; }

        const renderer = this.renderer;
        const glWrapper = renderer.glWrapper;
        const gl = renderer.gl;

        if (this.webGLFramebuffer)
        {
            gl.deleteFramebuffer(this.webGLFramebuffer);
            for (let i = 0; i < this.attachments.length; i++)
            {
                const attachment = this.attachments[i];
                if (!attachment.texture)
                {
                    gl.deleteRenderbuffer(attachment.renderbuffer!);
                }
            }
        }

        const framebuffer = gl.createFramebuffer();
        this.webGLFramebuffer = framebuffer;
        glWrapper.updateBindingsFramebuffer({
            bindings:
            {
                framebuffer: this
            }
        }, true);

        for (let i = 0; i < this.attachments.length; i++)
        {
            const attachment = this.attachments[i];
            const attachmentPoint = attachment.attachmentPoint;
            const texture = attachment.texture;

            if (texture)
            {
                texture.isRenderTexture = true;
                gl.framebufferTexture2D(gl.FRAMEBUFFER, attachmentPoint, gl.TEXTURE_2D, texture.webGLTexture, 0);
            }
            else
            {
                const complete = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
                if (complete !== gl.FRAMEBUFFER_COMPLETE)
                {
                    throw new Error('Framebuffer status: ' + (errors[complete] || complete));
                }

                const renderbuffer = gl.createRenderbuffer();
                glWrapper.updateBindingsRenderbuffer({
                    bindings:
                    {
                        renderbuffer: renderbuffer
                    }
                });
                gl.renderbufferStorage(gl.RENDERBUFFER, attachment.internalFormat!, this.width, this.height);
                gl.framebufferRenderbuffer(gl.FRAMEBUFFER, attachmentPoint, gl.RENDERBUFFER, renderbuffer);

                attachment.renderbuffer = renderbuffer;
            }
        }
    }

    resize(width: number, height: number): void
    {
        if (this.useCanvas)
        {
            return;
        }

        this.width = width;
        this.height = height;

        this.renderTexture.resize(width, height);

        this.createResource();
    }

    destroy(): void
    {
        if (this.renderer === null)
        {
            return;
        }

        const renderer = this.renderer;
        const gl = renderer.gl;

        for (let i = 0; i < this.attachments.length; i++)
        {
            const attachment = this.attachments[i];
            if (attachment.texture)
            {
                renderer.glWrapper.updateBindingsFramebuffer({
                    bindings:
                    {
                        framebuffer: this
                    }
                });
                gl.framebufferTexture2D(gl.FRAMEBUFFER, attachment.attachmentPoint, gl.TEXTURE_2D, null, 0);
                renderer.deleteTexture(attachment.texture);
            }
            else
            {
                gl.deleteRenderbuffer(attachment.renderbuffer!);
            }
        }

        gl.deleteFramebuffer(this.webGLFramebuffer);

        renderer.glWrapper.updateBindingsFramebuffer({
            bindings:
            {
                framebuffer: null,
                renderbuffer: null
            }
        });

        this.attachments.length = 0;
        this.renderTexture = null;
        this.webGLFramebuffer = null;
        this.renderer = null;
    }
}
