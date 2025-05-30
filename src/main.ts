import Phaser from './phaser/src/phaser';

class SceneA extends Phaser.Scene {
    constructor() {
        super({ key: 'SceneA' });
    }

    create() {
        this.add.text(100, 100, 'Scene A', {
            fontSize: '32px',
            color: '#eeeeee'
        }).setOrigin(0.5);

        // setTimeout(() => {
        //     this.scene.start('SceneB');
        // }, 2000);
        console.log(this)

        // Click to switch to SceneB
        this.input.on('pointerdown', () => {
            console.log('SceneA: pointerdown');
            this.scene.start('SceneB');
        });
    }
}

class SceneB extends Phaser.Scene {
    constructor() {
        super({ key: 'SceneB' });
    }

    create() {
        this.add.text(400, 300, 'Scene B', {
            fontSize: '32px',
            color: '#ffffff'
        }).setOrigin(0.5);

        setTimeout(() => {
            this.scene.start('SceneA');
        }, 2000);

        // Click to switch to SceneA
        this.input.on('pointerdown', () => {
            console.log('SceneB: pointerdown');
            this.scene.start('SceneA');
        });
    }
}

const start_game = () => {
    const phaser_config = {
        type: Phaser.AUTO,
        width: 800,
        height: 600,
        // backgroundColor skyblue
        backgroundColor: '#87ceeb',
        parent: 'game-container',
        scene: [SceneA, SceneB],
    }

    const game = new Phaser.Game(phaser_config);

    return game;
}

document.addEventListener('DOMContentLoaded', () => {
    start_game();
});
