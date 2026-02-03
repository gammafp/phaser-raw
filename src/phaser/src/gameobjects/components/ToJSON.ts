/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Build a JSON representation of the given Game Object.
 *
 * This is typically extended further by Game Object specific implementations.
 */
export const ToJSON = function (gameObject: any): any
{
    const out = {
        name: gameObject.name,
        type: gameObject.type,
        x: gameObject.x,
        y: gameObject.y,
        depth: gameObject.depth,
        scale: {
            x: gameObject.scaleX,
            y: gameObject.scaleY
        },
        origin: {
            x: gameObject.originX,
            y: gameObject.originY
        },
        flipX: gameObject.flipX,
        flipY: gameObject.flipY,
        rotation: gameObject.rotation,
        alpha: gameObject.alpha,
        visible: gameObject.visible,
        blendMode: gameObject.blendMode,
        textureKey: '',
        frameKey: '',
        data: {}
    };

    if (gameObject.texture) {
        out.textureKey = gameObject.texture.key;
        out.frameKey = gameObject.frame.name;
    }

    return out;
};
