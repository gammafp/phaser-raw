/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { GameObject } from '../GameObject';

export const DOMElementCSSRenderer = (renderer: any, src: any, camera: any, parentMatrix: any): void =>
{
    const parent = src.parentContainer;

    if (!parent && GameObject.RENDER_MASK !== src.renderFlags || (src.cameraFilter !== 0 && (src.cameraFilter & camera.id)))
    {
        return;
    }

    if (src.node)
    {
        renderer.postPass(src);
    }

    camera.addToRenderList(src);
};

