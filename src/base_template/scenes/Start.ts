import Phaser from '../../phaser/src/phaser';
// import * as Phaser from 'phaser';
    
export class Start extends Phaser.Scene {

    background!: Phaser.GameObjects.TileSprite;
    logo!: Phaser.GameObjects.Image;
    ship!: Phaser.GameObjects.Sprite;
    bitmapText!: Phaser.GameObjects.BitmapText;

    constructor() {
        super('Start');
    }

    preload() {
        this.load.image('background', 'assets/space.png');
        this.load.image('logo', 'assets/phaser.png');

        //  The ship sprite is CC0 from https://ansimuz.itch.io - check out his other work!
        this.load.spritesheet('ship', 'assets/spaceship.png', { frameWidth: 176, frameHeight: 96 });

        this.load.audio('music', 'assets/banjo.mp3');

        this.load.image('star', 'star3.png');

        // Load 3D OBJ model for the Mesh example
        // this.load.obj('skull', 'skull.obj');
        
        // Note: For better mesh visualization, you can use any texture.
        // The Phaser logo works as the base texture.

        // ============================================================
        // WORKING EXAMPLE: Create a bitmap font from the logo
        // ============================================================
        // We use the Phaser logo image to create a RetroFont
        // that generates bitmap characters programmatically
    }

    create() {
        // const music = this.sound.add('music');
        // music.play();

        this.background = this.add.tileSprite(640, 360, 1280, 720, 'background');

        const logo = this.add.image(640, 200, 'logo');

        // Test Lights - 2D lighting
        this.lights.enable();
        this.lights.setAmbientColor(0xff0000);
        
        // logo.setPipeline('Light2D');

        // Luz que sigue al puntero
        const light = this.lights.addLight(640, 360, 300, 0x0000ff, 2);
        
        this.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {
            light.x = pointer.x;
            light.y = pointer.y;
        });

        this.tweens.add({
            targets: logo,
            y: 400,
            duration: 1500,
            ease: 'Sine.inOut',
            yoyo: true,
            loop: -1
        });

        // Shake camera 
        setTimeout(() => {
            // this.cameras.main.shake(1000, 0.05);
        }, 1000);


        this.add.particles(400, 200, 'ship', {
            speed: 10,
            lifespan: 3000,
            gravityY: 200
        });
        // ============================================================
        // EXAMPLE: BitmapText (COMMENTED - Requires full conversion)
        // ============================================================
        // BitmapText.js has instanceof issues because it uses require()
        // for TypeScript components. It requires BitmapText conversion to TypeScript.
        
        // const textureKey = 'retroFont';
        // const graphics = this.make.graphics({ x: 0, y: 0, add: false });
        // const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ!?.,: ';
        // ... RetroFont code ...
        // this.bitmapText = this.add.bitmapText(640, 550, 'retroFont', 'HELLO', 16);

        // ============================================================
        // EXAMPLE: PathFollower - Object that follows a path
        // ============================================================
        
        // Create a path with curves
        const path = this.add.path(100, 300);
        
        // Add path segments
        path.lineTo(300, 300);
        path.lineTo(300, 500);
        path.lineTo(500, 500);
        path.lineTo(500, 300);
        path.lineTo(700, 300);
        path.lineTo(700, 500);
        path.lineTo(900, 500);
        path.lineTo(900, 300);
        path.lineTo(1100, 300);
        
        // Crear un PathFollower (sprite que sigue el path)
        const follower = this.add.follower(path, 100, 300, 'logo');
        follower.setScale(0.3);
        
        // Hacer que el follower siga el path
        follower.startFollow({
            duration: 8000,        // Duration in milliseconds
            repeat: -1,            // Repeat forever
            rotateToPath: true,    // Rotate sprite based on path direction
            yoyo: false            // Do not move backward
        });
        
        // EXAMPLE 2: PathFollower with smooth curves
        const curvedPath = this.add.path(640, 100);
        curvedPath.splineTo([
            { x: 740, y: 200 },
            { x: 640, y: 300 },
            { x: 540, y: 200 },
            { x: 640, y: 100 }
        ]);
        
        const curvedFollower = this.add.follower(curvedPath, 640, 100, 'logo');
        curvedFollower.setScale(0.2).setTint(0xff00ff);
        
        curvedFollower.startFollow({
            duration: 3000,
            repeat: -1,
            rotateToPath: false
        });

        // ============================================================
        // EXAMPLE: Zone - Invisible detection areas
        // ============================================================
        
        // EXAMPLE 1: Rectangular Zone for drag & drop
        const dropZone = this.add.zone(400, 300, 200, 150);
        dropZone.setRectangleDropZone(200, 150);
        
        // Visual debug for the zone
        const dropGraphics = this.add.graphics();
        dropGraphics.lineStyle(2, 0x00ff00);
        dropGraphics.strokeRect(300, 225, 200, 150);
        
        const dropText = this.add.text(400, 300, 'Drop Zone\n(Rectangle)', { 
            fontSize: '14px', 
            color: '#00ff00',
            align: 'center'
        }).setOrigin(0.5);
        
        // EXAMPLE 2: Interactive Zone (hover)
        const interactiveZone = this.add.zone(900, 300, 150, 150)
            .setInteractive();
        
        // Visual debug
        const zoneGraphics = this.add.graphics();
        zoneGraphics.lineStyle(2, 0xff0000);
        zoneGraphics.strokeRect(825, 225, 150, 150);
        
        const zoneText = this.add.text(900, 300, 'Hover me!', { 
            fontSize: '16px', 
            color: '#ffffff' 
        }).setOrigin(0.5);
        
        interactiveZone.on('pointerover', () => {
            zoneGraphics.clear();
            zoneGraphics.lineStyle(2, 0x00ff00);
            zoneGraphics.fillStyle(0x00ff00, 0.2);
            zoneGraphics.fillRect(825, 225, 150, 150);
            zoneGraphics.strokeRect(825, 225, 150, 150);
            zoneText.setText('Inside!');
        });
        
        interactiveZone.on('pointerout', () => {
            zoneGraphics.clear();
            zoneGraphics.lineStyle(2, 0xff0000);
            zoneGraphics.strokeRect(825, 225, 150, 150);
            zoneText.setText('Hover me!');
        });
        
        interactiveZone.on('pointerdown', () => {
            zoneText.setText('Clicked!');
        });
        
        // EXAMPLE 3: Circular Zone for drag & drop
        const circularZone = this.add.zone(1100, 500, 100, 100);
        circularZone.setCircleDropZone(50);
        
        // Circle visual debug
        const circleGraphics = this.add.graphics();
        circleGraphics.lineStyle(2, 0x0000ff);
        circleGraphics.strokeCircle(1100, 500, 50);
        
        const circleText = this.add.text(1100, 500, 'Drop Zone\n(Circle)', { 
            fontSize: '14px', 
            color: '#0000ff',
            align: 'center'
        }).setOrigin(0.5);
        
        // ============================================================
        // EXAMPLE 4: Draggable objects for drop zones
        // ============================================================
        
        // Crear sprites arrastrables
        const draggable1 = this.add.image(200, 500, 'logo').setScale(0.15);
        const draggable2 = this.add.image(250, 500, 'logo').setScale(0.15).setTint(0xff0000);
        const draggable3 = this.add.image(300, 500, 'logo').setScale(0.15).setTint(0x00ff00);
        
        // Hacer que sean arrastrables
        draggable1.setInteractive({ draggable: true });
        draggable2.setInteractive({ draggable: true });
        draggable3.setInteractive({ draggable: true });
        
        // Texto de instrucciones
        this.add.text(250, 450, 'Drag the logos into the zones!', { 
            fontSize: '16px', 
            color: '#ffffff' 
        }).setOrigin(0.5);
        
        // Eventos de drag
        this.input.on('dragstart', (pointer: any, gameObject: any) => {
            gameObject.setTint(0xffff00); // Amarillo al arrastrar
        });
        
        this.input.on('drag', (pointer: any, gameObject: any, dragX: number, dragY: number) => {
            gameObject.x = dragX;
            gameObject.y = dragY;
        });
        
        this.input.on('dragend', (pointer: any, gameObject: any) => {
        // Restore original tint
            if (gameObject === draggable1) gameObject.setTint(0xffffff);
            if (gameObject === draggable2) gameObject.setTint(0xff0000);
            if (gameObject === draggable3) gameObject.setTint(0x00ff00);
        });
        
        // Event fired when dropped on a drop zone
        this.input.on('drop', (pointer: any, gameObject: any, dropZone: any) => {
            gameObject.x = dropZone.x;
            gameObject.y = dropZone.y;
            
            // Visual feedback
            if (dropZone === dropZone) {
                dropGraphics.clear();
                dropGraphics.lineStyle(2, 0x00ff00);
                dropGraphics.fillStyle(0x00ff00, 0.3);
                dropGraphics.fillRect(300, 225, 200, 150);
                dropGraphics.strokeRect(300, 225, 200, 150);
                dropText.setText('Drop Zone\n✓ Dropped!');
                
                this.time.delayedCall(1000, () => {
                    dropGraphics.clear();
                    dropGraphics.lineStyle(2, 0x00ff00);
                    dropGraphics.strokeRect(300, 225, 200, 150);
                    dropText.setText('Drop Zone\n(Rectangle)');
                });
            }
            
            if (dropZone === circularZone) {
                circleGraphics.clear();
                circleGraphics.lineStyle(2, 0x0000ff);
                circleGraphics.fillStyle(0x0000ff, 0.3);
                circleGraphics.fillCircle(1100, 500, 50);
                circleGraphics.strokeCircle(1100, 500, 50);
                circleText.setText('Drop Zone\n✓ Dropped!');
                
                this.time.delayedCall(1000, () => {
                    circleGraphics.clear();
                    circleGraphics.lineStyle(2, 0x0000ff);
                    circleGraphics.strokeCircle(1100, 500, 50);
                    circleText.setText('Drop Zone\n(Circle)');
                });
            }
        });
        
        // NOTE: Zone is useful for:
        // - Drop areas (drag and drop) ✓
        // - Trigger zones (detect enter/exit) ✓
        // - Interaction areas without a visible sprite ✓
        // - Optimization (no rendering, logic only) ✓

        // ============================================================
        // EXAMPLE: PointLight - Fast lights without expensive shaders
        // ============================================================
        
        // EXAMPLE 1: Basic static PointLight
        const pointLight1 = this.add.pointlight(200, 600, 0xffffff, 128, 1, 0.1);
        
        // EXAMPLE 2: Colored PointLight with higher intensity
        const pointLight2 = this.add.pointlight(400, 600, 0xff0000, 150, 2, 0.05);
        
        // EXAMPLE 3: Animated PointLight (flickering)
        const flickeringLight = this.add.pointlight(600, 600, 0xffaa00, 100, 1.5, 0.1);
        
        this.tweens.add({
            targets: flickeringLight,
            intensity: 0.3,
            duration: 500,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.inOut'
        });
        
        // EXAMPLE 4: PointLight that follows the cursor
        const cursorLight = this.add.pointlight(0, 0, 0x00ffff, 200, 2, 0.08);
        
        this.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {
            cursorLight.x = pointer.x;
            cursorLight.y = pointer.y;
        });
        
        // EXAMPLE 5: Moving animated PointLight
        const movingLight = this.add.pointlight(800, 600, 0xff00ff, 120, 1.8, 0.1);
        
        this.tweens.add({
            targets: movingLight,
            x: 1000,
            y: 400,
            duration: 2000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.inOut'
        });
        
        // EXAMPLE 6: PointLight with color changes
        const colorLight = this.add.pointlight(1000, 600, 0xff0000, 130, 1.5, 0.1);
        
        let colorIndex = 0;
        const colors = [0xff0000, 0x00ff00, 0x0000ff, 0xffff00, 0xff00ff, 0x00ffff];
        
        this.time.addEvent({
            delay: 1000,
            callback: () => {
                colorIndex = (colorIndex + 1) % colors.length;
                // colorLight.setColor(colors[colorIndex]);
            },
            loop: true
        });
        
        // Texto informativo
        this.add.text(640, 650, 'PointLights: Static | Red | Flicker | Cursor | Moving | Color cycle', {
            fontSize: '14px',
            color: '#ffffff'
        }).setOrigin(0.5);
        
        // NOTE: PointLight is ideal for:
        // - Fast lighting effects without expensive shaders ✓
        // - Antorchas parpadeantes, disparos, explosiones ✓
        // - Mejor rendimiento que Light normal ✓
        // - No afecta otros GameObjects (solo efecto visual) ✓

        // ============================================================
        // EXAMPLE: Mesh - Render 3D models (.obj)
        // ============================================================
        
        // Create 3D mesh with the skull (using the Phaser logo as texture)
        // const mesh = this.add.mesh(640, 360, 'logo');
        
        // Load vertices from OBJ file (scale 0.1 as in the official example)
        // mesh.addVerticesFromObj('skull', 0.1);
        
        // Set Z position and initial rotation
        // mesh.panZ(7); // Zoom out (mismo valor que ejemplo oficial)
        // mesh.modelRotation.y += 0.5; // Initial rotation
        
        // Graphics for debug (optional)
        const debugGraphics = this.add.graphics();
        
        // Mouse controls
        const rotateRate = 1;
        const panRate = 1;
        const zoomRate = 4;
        
        // Rotate with mouse (dragging)
        this.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {
            if (!pointer.isDown) return;
            
            if (!pointer.event?.shiftKey)
            {
                // Rotate model
                // mesh.modelRotation.y += pointer.velocity.x * (rotateRate / 800);
                // mesh.modelRotation.x += pointer.velocity.y * (rotateRate / 600);
            }
            else
            {
                // Pan while holding Shift
                // mesh.panX(pointer.velocity.x * (panRate / 800));
                // mesh.panY(pointer.velocity.y * (panRate / 600));
            }
        });
        
        // Zoom with mouse wheel
        this.input.on('wheel', (pointer: any, gameObjects: any, deltaX: number, deltaY: number, deltaZ: number) => {
            // mesh.panZ(deltaY * (zoomRate / 600));
        });
        
        // Toggle debug with D key
        this.input.keyboard?.on('keydown-D', () => {
            // if (mesh.debugCallback)
            // {
            //     mesh.setDebug();
            // }
            // else
            // {
            //     mesh.setDebug(debugGraphics);
            // }
        });
        
        // Informational text
        this.add.text(640, 680, 'Mesh 3D: Drag to rotate | Shift+Drag to pan | Wheel to zoom | D for debug', {
            fontSize: '14px',
            color: '#ffffff',
            align: 'center'
        }).setOrigin(0.5);
        
        // NOTE: Mesh is ideal for:
        // - Renderizar modelos 3D (.obj) en WebGL ✓
        // - Custom geometry with vertices ✓
        // - Texturas aplicadas a modelos 3D ✓
        // - Rotaciones 3D (modelRotation.x, .y, .z) ✓
        // - Pan (panX, panY, panZ) y perspectiva ✓
    
    }

    update() {
        this.background.tilePositionX += 2;
    }
    
}
