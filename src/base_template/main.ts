// import { Start } from './scenes/Start';
import { OnlyTextures } from './scenes/OnlyTextures';

import Phaser from '../phaser/src/phaser';
// import * as Phaser from 'phaser';

const config = {
    type: Phaser.WEBGPU,
    title: 'Overlord Rising',
    description: '',
    parent: 'game-container',
    width: 1280,
    height: 720,
    backgroundColor: '#000000',
    pixelArt: false,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    },
    scene: [
        OnlyTextures
    ],
    scale: {
        // mode: Phaser.Scale.FIT,
        // autoCenter: Phaser.Scale.CENTER_BOTH
    },
}


new Phaser.Game(config);
            