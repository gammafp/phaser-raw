import Phaser from '../../phaser/src/phaser';
// import * as Phaser from 'phaser';
    
export class OnlyTextures extends Phaser.Scene {

    logo!: Phaser.GameObjects.Image;

    constructor() {
        super('OnlyTextures');
    }

    preload() {
        this.load.image('background', 'assets/space.png');
        this.load.image('logo', 'assets/phaser.png');

        this.load.spritesheet('ship', 'assets/spaceship.png', { frameWidth: 176, frameHeight: 96 });

        this.load.audio('music', 'assets/banjo.mp3');

    }

    create() {
        // Posiciones separadas para que logo y naves no se solapen
        const logo = this.logo = this.add.image(640, 120, 'logo');
        logo.setScale(0.2);
        logo.setTint(0xff0000);

        const ship = this.add.sprite(640, 360, 'ship');
        const ship2 = this.add.sprite(640, 600, 'ship');

        // Cada uno se mueve en su propio rango para no solaparse
        this.tweens.add({
            targets: logo,
            y: 150,
            duration: 1500,
            ease: 'Sine.inOut',
            yoyo: true,
            loop: -1
        });
        this.tweens.add({
            targets: ship,
            y: 400,
            duration: 1500,
            ease: 'Sine.inOut',
            yoyo: true,
            loop: -1
        });
        this.tweens.add({
            targets: ship2,
            y: 550,
            duration: 1500,
            ease: 'Sine.inOut',
            yoyo: true,
            loop: -1
        });
    }

}
