/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */


import { AddToDOM } from '../dom/AddToDOM';

// TODO: Fix type
export const CreateDOMContainer = (game: Phaser.Game): void =>
{
    const config = game.config;

    if (!config.parent || !config.domCreateContainer)
    {
        return;
    }

    //  DOM Element Container
    const div = document.createElement('div');

    div.style.cssText = [
        'display: block;',
        'width: ' + game.scale.width + 'px;',
        'height: ' + game.scale.height + 'px;',
        'padding: 0; margin: 0;',
        'position: absolute;',
        'overflow: hidden;',
        'pointer-events: ' + config.domPointerEvents + ';',
        'transform: scale(1);',
        'transform-origin: left top;'
    ].join(' ');

    game.domContainer = div;

    AddToDOM(div, config.parent);
}
