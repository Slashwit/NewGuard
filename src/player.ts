import { Scene } from "phaser";
import { Bullets } from "./bullet";



export class Player extends Phaser.Physics.Arcade.Sprite {

    bullets: Bullets;
    keys: any;
    lastFireTime: number = 0;
    thrustEmitter:Phaser.GameObjects.Particles.ParticleEmitter;
    constructor(scene: Scene, x: number, y: number, texture: string) {
        super(scene, x, y, texture);

        // const lineObj = new Phaser.Geom.Line(0,-10,0,10);
        // const emitZone1 = { type: 'edge', source:lineObj, quantity: 4 };

        this.thrustEmitter= this.scene.add.particles(0, 0, 'pbullet', {
            speed: 50,
            lifespan: 50,
            quantity: 10,
            scale: { start: 1.0, end: 0 },
            alpha: { start: 1, end: 0 },
            emitting: false,
            blendMode: 'ADD'
        });

        scene.add.existing(this)
        scene.physics.add.existing(this);

        this.setVelocity(0, 0);
        this.setBounce(0.25, 0.25)
        this.setDrag(0.5, 0.5)
        this.setCollideWorldBounds(true);
        this.setMass(1);
        this.setScale(0.4, 0.4);
        this.setMaxVelocity(300,300);
        this.bullets = new Bullets(scene);

        this.keys = this.scene.input.keyboard.addKeys({
            left: Phaser.Input.Keyboard.KeyCodes.LEFT,
            right: Phaser.Input.Keyboard.KeyCodes.RIGHT,
            up: Phaser.Input.Keyboard.KeyCodes.UP,
            fire: Phaser.Input.Keyboard.KeyCodes.SPACE,
        });

        this.scene.input.keyboard.on('keyup-SPACE', () => {
            //Rest the last fire time so if the 
            //space bar is pressed a bullet is fired immediately.
            this.lastFireTime = 0;
        });
        
       this.thrustEmitter.startFollow(this);
       this.thrustEmitter.followOffset = new Phaser.Math.Vector2 (-50,0);

       this.rotation = -1.5709;
       this.thrustEmitter.followOffset = new Phaser.Math.Vector2 (-40*Math.cos(this.rotation),-40*Math.sin(this.rotation));
 
        
    }

    /**
     * When firing a bullet, the following must be considered:
     * 1. The rotation of the space craft
     * 2. The velocity of the space craft
     * 3. The offset of the front from the center
     */
    private fireBullet() {

        this.bullets.fireBullet(
            this.x + Math.cos(this.rotation) * 40, //x offset position
            this.y + Math.sin(this.rotation) * 40, //y offset position
            this.body.velocity,
            this.rotation);
    }

    update(...args:any[]): void {

        let time = args[0];
        if (this.keys.left.isDown) { // rotate left
            this.rotation -= 0.02;
        }
        else if (this.keys.right.isDown) { // rotate right
            this.rotation += 0.02;
        }
       
        this.thrustEmitter.followOffset = new Phaser.Math.Vector2 (-40*Math.cos(this.rotation),-40*Math.sin(this.rotation));

        if (this.keys.up.isDown) {
            this.thrustEmitter.emitting = true;
            this.applyForce();
        }else{
            this.thrustEmitter.emitting = false;
        }
       

        if (this.keys.fire.isDown && (this.lastFireTime === 0 || time - this.lastFireTime > 300)) {
            this.fireBullet();
            this.lastFireTime = time;
           
        }

    }

    private applyForce() {
        const force = new Phaser.Math.Vector2();

      
        force.x = Math.cos(this.rotation) * 5;//Math.min(Math.max(Math.cos(this.rotation) * 20, -minMax), minMax);
        force.y = Math.sin(this.rotation) * 5;//Math.min(Math.max(Math.sin(this.rotation) * 20, -minMax), minMax);
       
        this.body.velocity.x += force.x;
        this.body.velocity.y += force.y;
       
        //max velocity is set in constructor

    }

    
}