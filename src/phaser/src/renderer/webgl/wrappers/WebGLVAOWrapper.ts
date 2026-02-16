/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * @classdesc
 * Wrapper for a WebGL Vertex Array Object (VAO).
 *
 * A WebGLVertexArrayObject should never be exposed outside the WebGLRenderer,
 * so the WebGLRenderer can handle context loss and other events without other
 * systems having to be aware of it. Always use WebGLVAOWrapper instead.
 *
 * @class WebGLVAOWrapper
 * @memberof Phaser.Renderer.WebGL.Wrappers
 * @constructor
 * @since 4.0.0
 * @param {Phaser.Renderer.WebGL.WebGLRenderer} renderer - The WebGLRenderer instance that owns this wrapper.
 * @param {Phaser.Renderer.WebGL.Wrappers.WebGLProgramWrapper} program - The shader program that this VAO is associated with.
 * @param {?Phaser.Renderer.WebGL.Wrappers.WebGLBufferWrapper} indexBuffer - The index buffer used in this VAO, if any.
 * @param {Phaser.Renderer.WebGL.Wrappers.WebGLVertexBufferLayoutWrapper[]} attributeBufferLayouts - The vertex buffers containing attribute data for this VAO, alongside the relevant attribute layout.
 */
export class WebGLVAOWrapper {

    renderer: any;
    program: any;
    vertexArrayObject: WebGLVertexArrayObject | null;
    indexBuffer: any;
    attributeBufferLayouts: any[] | null;
    glState: any;

    constructor(renderer: any, program: any, indexBuffer: any, attributeBufferLayouts: any[])
    {
        /**
         * The WebGLRenderer instance that owns this wrapper.
         *
         * @name Phaser.Renderer.WebGL.Wrappers.WebGLVAOWrapper#renderer
         * @type {Phaser.Renderer.WebGL.WebGLRenderer}
         * @since 4.0.0
         */
        this.renderer = renderer;

        /**
         * The shader program that this VAO is associated with.
         *
         * @name Phaser.Renderer.WebGL.Wrappers.WebGLVAOWrapper#program
         * @type {Phaser.Renderer.WebGL.Wrappers.WebGLProgramWrapper}
         * @since 4.0.0
         */
        this.program = program;

        /**
         * The WebGLVertexArrayObject being wrapped by this class.
         *
         * This property could change at any time.
         * Therefore, you should never store a reference to this value.
         * It should only be passed directly to the WebGL API for drawing.
         *
         * @name Phaser.Renderer.WebGL.Wrappers.WebGLVAOWrapper#vertexArrayObject
         * @type {?WebGLVertexArrayObject}
         * @default null
         * @since 4.0.0
         */
        this.vertexArrayObject = null;

        /**
         * The element array buffer used in this VAO, if any.
         *
         * @name Phaser.Renderer.WebGL.Wrappers.WebGLVAOWrapper#indexBuffer
         * @type {?Phaser.Renderer.WebGL.Wrappers.WebGLBufferWrapper}
         * @default null
         * @since 4.0.0
         */
        this.indexBuffer = indexBuffer;

        /**
         * The vertex buffers containing attribute data for this VAO,
         * alongside the relevant attribute layout.
         *
         * @name Phaser.Renderer.WebGL.Wrappers.WebGLVAOWrapper#attributeBufferLayouts
         * @type {Phaser.Renderer.WebGL.Wrappers.WebGLVertexBufferLayoutWrapper[]}
         * @since 4.0.0
         */
        this.attributeBufferLayouts = attributeBufferLayouts;

        /**
         * The state object used to bind this VAO.
         *
         * @name Phaser.Renderer.WebGL.Wrappers.WebGLVAOWrapper#glState
         * @type {object}
         * @since 4.0.0
         */
        this.glState = {
            vao: this
        };

        this.createResource();
    }

    createResource(): void
    {
        const gl = this.renderer.gl;

        this.vertexArrayObject = gl.createVertexArray();

        this.bind();

        if (this.indexBuffer)
        {
            this.indexBuffer.bind();
        }

        const program = this.program;
        const glAttributes = program.glAttributes;
        const glAttributeNames = program.glAttributeNames;

        for (let i = 0; i < this.attributeBufferLayouts.length; i++)
        {
            const attributeBufferLayout = this.attributeBufferLayouts[i];

            attributeBufferLayout.buffer.bind();
            const stride = attributeBufferLayout.layout.stride;
            const instanceDivisor = attributeBufferLayout.layout.instanceDivisor;

            for (let j = 0; j < attributeBufferLayout.layout.layout.length; j++)
            {
                const layout = attributeBufferLayout.layout.layout[j];

                // Connect attribute locations from program.
                const attributeIndex = glAttributeNames.get(layout.name);
                if (attributeIndex === undefined)
                {
                    // This attribute is not used in the shader, so skip it.
                    continue;
                }
                const attributeInfo = glAttributes[attributeIndex];
                layout.location = attributeInfo.location;

                // Create attribute pointers.

                const location = layout.location;

                const bytes = layout.bytes || 4;
                const columns = layout.columns || 1;
                const normalized = layout.normalized;
                const offset = layout.offset;
                const size = layout.size;
                const type = layout.type;

                for (let column = 0; column < columns; column++)
                {
                    gl.enableVertexAttribArray(location + column);

                    gl.vertexAttribPointer(
                        location + column,
                        size,
                        type,
                        normalized,
                        stride,
                        offset + bytes * column * size
                    );

                    if (!isNaN(instanceDivisor))
                    {
                        gl.vertexAttribDivisor(
                            location + column,
                            instanceDivisor
                        );
                    }
                }
            }
        }

        // Finalize VAO.
        this.renderer.glWrapper.updateVAO({
            vao: null
        });

        // Force unbind buffers, as they may have been unbound by the VAO
        // without syncing state management.
        this.renderer.glWrapper.updateBindings({
            bindings: {
                arrayBuffer: null,
                elementArrayBuffer: null
            }
        });
    }

    bind(): void
    {
        this.renderer.glWrapper.updateVAO(this.glState);
    }

    destroy(): void
    {
        const gl = this.renderer.gl;

        if (this.vertexArrayObject)
        {
            gl.deleteVertexArray(this.vertexArrayObject);
            this.vertexArrayObject = null;
        }

        this.indexBuffer = null;
        this.attributeBufferLayouts = null;
        this.glState = null;
        this.renderer = null;
    }
}
