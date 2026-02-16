/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

export const RENDER = 'render';
export const REDRAW = 'redraw';
export const ALL = 'all';

export const RenderTextureRenderModes = {
    RENDER,
    REDRAW,
    ALL
} as const;

export type RenderTextureRenderMode = (typeof RenderTextureRenderModes)[keyof typeof RenderTextureRenderModes];
