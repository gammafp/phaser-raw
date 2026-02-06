/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { GetCalcMatrix } from '../GetCalcMatrix';

/**
 * Renders this Game Object with the WebGL Renderer to the given Camera.
 * The object will not render if any of its renderFlags are set or it is being actively filtered out by the Camera.
 * This method should not be called directly. It is a utility function of the Render module.
 *
 * @method Phaser.GameObjects.Mesh#renderWebGL
 * @since 3.0.0
 * @private
 *
 * @param {Phaser.Renderer.WebGL.WebGLRenderer} renderer - A reference to the current active WebGL renderer.
 * @param {Phaser.GameObjects.Mesh} src - The Game Object being rendered in this call.
 * @param {Phaser.Cameras.Scene2D.Camera} camera - The Camera that is rendering the Game Object.
 * @param {Phaser.GameObjects.Components.TransformMatrix} parentMatrix - This transform matrix is defined if the game object is nested
 */
export const MeshWebGLRenderer = (renderer: any, src: any, camera: any, parentMatrix: any): void =>
{
    const faces = src.faces;
    const totalFaces = faces.length;

    if (totalFaces === 0)
    {
        return;
    }

    camera.addToRenderList(src);

    const pipeline = renderer.pipelines.set(src.pipeline, src);

    const calcMatrix = GetCalcMatrix(src, camera, parentMatrix).calc;

    //  This causes a flush if the Mesh has a Post Pipeline
    renderer.pipelines.preBatch(src);

    let textureUnit = pipeline.setGameObject(src);

    const F32 = pipeline.vertexViewF32;
    const U32 = pipeline.vertexViewU32;

    let vertexOffset = (pipeline.vertexCount * pipeline.currentShader.vertexComponentCount) - 1;

    const tintEffect = src.tintFill;

    const debugFaces: any[] = [];
    const debugCallback = src.debugCallback;

    const a = calcMatrix.a;
    const b = calcMatrix.b;
    const c = calcMatrix.c;
    const d = calcMatrix.d;
    const e = calcMatrix.e;
    const f = calcMatrix.f;

    const z = src.viewPosition.z;

    const hideCCW = src.hideCCW;
    const roundPixels = camera.roundPixels;
    const alpha = camera.alpha * src.alpha;

    let totalFacesRendered = 0;

    for (let i = 0; i < totalFaces; i++)
    {
        const face = faces[i];

        //  If face has alpha <= 0, or hideCCW + clockwise, or isn't in camera view, then don't draw it
        if (!face.isInView(camera, hideCCW, z, alpha, a, b, c, d, e, f, roundPixels))
        {
            continue;
        }

        if (pipeline.shouldFlush(3))
        {
            pipeline.flush();

            textureUnit = pipeline.setGameObject(src);

            vertexOffset = (pipeline.vertexCount * pipeline.currentShader.vertexComponentCount) - 1;
        }

        vertexOffset = face.load(F32, U32, vertexOffset, textureUnit, tintEffect);

        totalFacesRendered++;

        pipeline.vertexCount += 3;

        pipeline.currentBatch.count = (pipeline.vertexCount - pipeline.currentBatch.start);

        if (debugCallback)
        {
            debugFaces.push(face);
        }
    }

    src.totalFrame += totalFacesRendered;

    if (debugCallback)
    {
        debugCallback.call(src, src, debugFaces);
    }

    renderer.pipelines.postBatch(src);
};

