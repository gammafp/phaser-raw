/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */


import { GetAdvancedValue } from '../utils/object/GetAdvancedValue';

/**
 * Adds an Animation component to a Sprite and populates it based on the given config.
 *
 * @function Phaser.GameObjects.BuildGameObjectAnimation
 * @since 3.0.0
 *
 * @param {Phaser.GameObjects.Sprite} sprite - The sprite to add an Animation component to.
 * @param {object} config - The animation config.
 *
 * @return {Phaser.GameObjects.Sprite} The updated Sprite.
 */
export const BuildGameObjectAnimation = function (sprite: any, config: any): any
{
    const animConfig = GetAdvancedValue(config, 'anims', null);

    if (animConfig === null)
    {
        return sprite;
    }

    if (typeof animConfig === 'string')
    {
        //  { anims: 'key' }
        sprite.anims.play(animConfig);
    }
    else if (typeof animConfig === 'object')
    {
        //  { anims: {
        //              key: string
        //              startFrame: [string|number]
        //              delay: [float]
        //              repeat: [integer]
        //              repeatDelay: [float]
        //              yoyo: [boolean]
        //              play: [boolean]
        //              delayedPlay: [boolean]
        //           }
        //  }

        const anims = sprite.anims;

        const key = GetAdvancedValue(animConfig, 'key', undefined);

        if (key)
        {
            const startFrame = GetAdvancedValue(animConfig, 'startFrame', undefined);

            const delay = GetAdvancedValue(animConfig, 'delay', 0);
            const repeat = GetAdvancedValue(animConfig, 'repeat', 0);
            const repeatDelay = GetAdvancedValue(animConfig, 'repeatDelay', 0);
            const yoyo = GetAdvancedValue(animConfig, 'yoyo', false);

            const play = GetAdvancedValue(animConfig, 'play', false);
            const delayedPlay = GetAdvancedValue(animConfig, 'delayedPlay', 0);

            const playConfig = {
                key: key,
                delay: delay,
                repeat: repeat,
                repeatDelay: repeatDelay,
                yoyo: yoyo,
                startFrame: startFrame
            };

            if (play)
            {
                anims.play(playConfig);
            }
            else if (delayedPlay > 0)
            {
                anims.playAfterDelay(playConfig, delayedPlay);
            }
            else
            {
                anims.load(playConfig);
            }
        }
    }

    return sprite;
};
