/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { PHASER_CONST as CONST } from '../const';
import type { Game } from './Game';

/**
 * Called automatically by Phaser.Game and responsible for creating the console.log debug header.
 *
 * You can customize or disable the header via the Game Config object.
 *
 * @function Phaser.Core.DebugHeader
 * @since 3.0.0
 *
 * @param {Phaser.Game} game - The Phaser.Game instance which will output this debug header.
 */
export const DebugHeader = (game: Game): void =>
{
    const config = game.config;

    if (config.hideBanner)
    {
        return;
    }

    let renderType = 'WebGL';

    if (config.renderType === CONST.CANVAS)
    {
        renderType = 'Canvas';
    }
    else if (config.renderType === CONST.HEADLESS)
    {
        renderType = 'Headless';
    }

    const audioConfig = config.audio;
    const deviceAudio = game.device.audio;

    let audioType: string;

    if (deviceAudio.webAudio && !audioConfig.disableWebAudio)
    {
        audioType = 'Web Audio';
    }
    else if (audioConfig.noAudio || (!deviceAudio.webAudio && !deviceAudio.audioData))
    {
        audioType = 'No Audio';
    }
    else
    {
        audioType = 'HTML5 Audio';
    }

    if (!game.device.browser.ie)
    {
        let c = '';
        const args: any[] = [ c ];

        if (Array.isArray(config.bannerBackgroundColor))
        {
            let lastColor: string;

            config.bannerBackgroundColor.forEach((color: string) =>
            {
                c = c.concat('%c ');

                args.push('background: ' + color);

                lastColor = color;
            });

            //  inject the text color
            args[args.length - 1] = 'color: ' + config.bannerTextColor + '; background: ' + lastColor;
        }
        else
        {
            c = c.concat('%c ');

            args.push('color: ' + config.bannerTextColor + '; background: ' + config.bannerBackgroundColor);
        }

        args.push('background: transparent');

        if (config.gameTitle)
        {
            c = c.concat(config.gameTitle);

            if (config.gameVersion)
            {
                c = c.concat(' v' + config.gameVersion);
            }

            if (!config.hidePhaser)
            {
                c = c.concat(' / ');
            }
        }

        const fb = (typeof PLUGIN_FBINSTANT) ? '-FB' : '';

        if (!config.hidePhaser)
        {
            c = c.concat('Phaser v' + CONST.VERSION + fb + ' (' + renderType + ' | ' + audioType + ')');
        }

        c = c.concat(' %c ' + config.gameURL);

        //  Inject the new string back into the args array
        args[0] = c;

        console.log.apply(console, args);
    }
    else if (window['console'])
    {
        console.log('Phaser v' + CONST.VERSION + ' / https://phaser.io');
    }
};
