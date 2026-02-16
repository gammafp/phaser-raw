/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { TransformMatrix } from '../components/TransformMatrix';
import { CSSBlendModes } from './CSSBlendModes';

import { GameObject } from '../GameObject';

const tempMatrix1 = new TransformMatrix();
const tempMatrix2 = new TransformMatrix();
const tempMatrix3 = new TransformMatrix();

/**
 * Renders this Game Object with the WebGL Renderer to the given Camera.
 * The object will not render if any of its renderFlags are set or it is being actively filtered out by the Camera.
 * This method should not be called directly. It is a utility function of the Render module.
 *
 * @method Phaser.GameObjects.DOMElement#renderWebGL
 * @since 3.17.0
 * @private
 *
 * @param {Phaser.Renderer.WebGL.WebGLRenderer} renderer - A reference to the current active renderer.
 * @param {Phaser.GameObjects.DOMElement} src - The Game Object being rendered in this call.
 * @param {Phaser.Cameras.Scene2D.Camera} camera - The Camera that is rendering the Game Object.
 * @param {Phaser.GameObjects.Components.TransformMatrix} parentMatrix - This transform matrix is defined if the game object is nested
 */
export const DOMElementCSSRenderer = function (renderer: any, src: any, camera: any, parentMatrix: any): void
{
    if (!src.node)
    {
        return;
    }

    if (camera.camera)
    {
        // `camera` is really a DrawingContext object, used in WebGL rendering.
        camera = camera.camera;
    }

    const style = src.node.style;
    const settings = src.scene.sys.settings;

    if (!style || !settings.visible || GameObject.RENDER_MASK !== src.renderFlags || (src.cameraFilter !== 0 && (src.cameraFilter & camera.id)) || (src.parentContainer && !src.parentContainer.willRender()))
    {
        style.display = 'none';

        return;
    }

    const parent = src.parentContainer;
    let alpha = camera.alpha * src.alpha;

    if (parent)
    {
        alpha *= parent.alpha;
    }

    const camMatrix = tempMatrix1;
    const srcMatrix = tempMatrix2;
    const calcMatrix = tempMatrix3;

    let dx = src.width * src.originX;
    let dy = src.height * src.originY;

    let tx = '0%';
    let ty = '0%';

    camMatrix.copyWithScrollFactorFrom(
        camera.matrix,
        camera.scrollX, camera.scrollY,
        src.scrollFactorX, src.scrollFactorY
    );

    if (parentMatrix)
    {
        camMatrix.multiply(parentMatrix);
        dx *= src.scaleX;
        dy *= src.scaleY;
    }
    else
    {
        tx = (100 * src.originX) + '%';
        ty = (100 * src.originY) + '%';
    }

    camMatrix.translate(-dx, -dy);

    srcMatrix.applyITRS(
        src.x, src.y,
        src.rotation,
        src.scaleX, src.scaleY
    );

    camMatrix.multiply(srcMatrix, calcMatrix);

    if (!src.transformOnly)
    {
        style.display = 'block';
        style.opacity = alpha;
        style.zIndex = src._depth;
        style.pointerEvents = src.pointerEvents;
        style.mixBlendMode = CSSBlendModes[src._blendMode];
    }

    // https://developer.mozilla.org/en-US/docs/Web/CSS/transform

    style.transform =
        calcMatrix.getCSSMatrix() +
        ' skew(' + src.skewX + 'rad, ' + src.skewY + 'rad)' +
        ' rotate3d(' + src.rotate3d.x + ',' + src.rotate3d.y + ',' + src.rotate3d.z + ',' + src.rotate3d.w + src.rotate3dAngle + ')';

    style.transformOrigin = tx + ' ' + ty;
};
