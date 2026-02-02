import { Start } from './scenes/Start';

import Phaser from '../phaser/src/phaser';

const config = {
    type: Phaser.AUTO,
    title: 'Overlord Rising',
    description: '',
    parent: 'game-container',
    width: 800,
    height: 600,
    backgroundColor: '#000000',
    pixelArt: false,
    scene: [
        Start
    ],
    scale: {
        // mode: Phaser.Scale.FIT,
        // autoCenter: Phaser.Scale.CENTER_BOTH
    },
}

new Phaser.Game(config);
            