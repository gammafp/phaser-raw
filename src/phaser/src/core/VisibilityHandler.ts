/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import * as Events from './events';
import type { Game } from './Game';

/**
 * The Visibility Handler is responsible for listening out for document level visibility change events.
 * This includes `visibilitychange` if the browser supports it, and blur and focus events. It then uses
 * the provided Event Emitter and fires the related events.
 *
 * @function Phaser.Core.VisibilityHandler
 * @fires Phaser.Core.Events#BLUR
 * @fires Phaser.Core.Events#FOCUS
 * @fires Phaser.Core.Events#HIDDEN
 * @fires Phaser.Core.Events#VISIBLE
 * @since 3.0.0
 *
 * @param {Phaser.Game} game - The Game instance this Visibility Handler is working on.
 */
export const VisibilityHandler = (game: Game): void =>
{
    let hiddenVar: string | undefined;
    const eventEmitter = game.events;

    if (document.hidden !== undefined)
    {
        hiddenVar = 'visibilitychange';
    }
    else
    {
        const vendors = [ 'webkit', 'moz', 'ms' ];

        vendors.forEach((prefix) =>
        {
            if ((document as any)[prefix + 'Hidden'] !== undefined)
            {
                (document as any).hidden = () =>
                {
                    return (document as any)[prefix + 'Hidden'];
                };

                hiddenVar = prefix + 'visibilitychange';
            }

        });
    }

    const onChange = (event: any): void =>
    {
        if (document.hidden || event.type === 'pause')
        {
            eventEmitter.emit(Events.HIDDEN);
        }
        else
        {
            eventEmitter.emit(Events.VISIBLE);
        }
    };

    if (hiddenVar)
    {
        document.addEventListener(hiddenVar, onChange, false);
    }

    window.onblur = function ()
    {
        eventEmitter.emit(Events.BLUR);
    };

    window.onfocus = function ()
    {
        eventEmitter.emit(Events.FOCUS);
    };

    //  Automatically give the window focus unless config says otherwise
    if (window.focus && game.config.autoFocus)
    {
        window.focus();
    }
};
