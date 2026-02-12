/**
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { GetFastValue } from '../utils/object/GetFastValue';

import { Rectangle } from '../geom/rectangle/Rectangle';
import type { FitToRegionItemCoverage } from './typedefs/FitToRegionItemCoverage';

/**
 * Fit a GameObject to a region.
 *
 * This is a quick way to fit a background to a scene,
 * move an object without worrying about origins,
 * or cover a hole of known size.
 *
 * This will transform the object to fit into a rectangular region.
 * Rotation is ignored, but translation and scale are changed.
 * Note that negative scale will become positive; use flip to resolve this.
 * The object must support transformation.
 *
 * The fit can scale proportionally, to touch the inside or outside of the region;
 * but by default it scales both axes independently to touch all sides.
 *
 * The region is an axis-aligned bounding box (AABB).
 * By default, it is derived from the object, via the scene scale properties,
 * i.e. `{ x: 0, y: 0, width: scene.scale.width, height: scene.scale.height }`.
 *
 * If the game object has no size or origin, e.g. a Container,
 * then it is tricky to figure out how to resize it to fit.
 * The `itemCoverage` parameter allows you to set `width`, `height`, `originX`
 * and/or `originY` properties to supplement available data.
 * These settings take precedence over original item properties, even if they exist.
 *
 * @function Phaser.Actions.FitToRegion
 * @since 4.0.0
 *
 * @param {Phaser.GameObjects.GameObject & Phaser.GameObjects.Components.Transform} item - The GameObject to fit to the region. It must have transforms.
 * @param {number} [scaleMode=0] - The scale mode. 0 sets each axis to fill the region independently. -1 scales both axes uniformly so the item touches the _inside_ of the region. 1 scales both axes uniformly so the item touches the _outside_ of the region.
 * @param {Phaser.Geom.Rectangle} [region] - The region to fit. If not defined, it will be inferred from the item's scene scale.
 * @param {Phaser.Types.Actions.FitToRegionItemCoverage} [itemCoverage] - Override or define the region covered by the item.
 *
 * @returns {Phaser.GameObjects.GameObject & Phaser.GameObjects.Components.Transform} - The item that was fitted.
 */
export const FitToRegion = (
    item: any,
    scaleMode: number = 0,
    region?: any,
    itemCoverage?: FitToRegionItemCoverage
): any => {
    if (!region) {
        const scene = item.scene;
        region = new Rectangle(0, 0, scene.scale.width, scene.scale.height);
    }
    if (!itemCoverage) { itemCoverage = {}; }

    const itemWidth = GetFastValue(itemCoverage, 'width', GetFastValue(item, 'width', 1));
    const itemHeight = GetFastValue(itemCoverage, 'height', GetFastValue(item, 'height', 1));
    const itemOriginX = GetFastValue(itemCoverage, 'originX', GetFastValue(item, 'originX', 0.5));
    const itemOriginY = GetFastValue(itemCoverage, 'originY', GetFastValue(item, 'originY', 0.5));

    // Reposition item.
    item.x = region.x + region.width * itemOriginX;
    item.y = region.y + region.height * itemOriginY;

    // Compute relative scales.
    const itemScaleXToRegion = region.width / itemWidth;
    const itemScaleYToRegion = region.height / itemHeight;
    switch (scaleMode) {
        case -1:
            item.setScale(Math.min(itemScaleXToRegion, itemScaleYToRegion));
            break;
        case 0:
            item.setScale(itemScaleXToRegion, itemScaleYToRegion);
            break;
        case 1:
            item.setScale(Math.max(itemScaleXToRegion, itemScaleYToRegion));
            break;
    }

    return item;
};
