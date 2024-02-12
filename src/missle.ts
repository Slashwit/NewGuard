
import { Scene } from "phaser";




export class Missile extends Phaser.Physics.Arcade.Sprite {

    private target: Phaser.Math.Vector2;
    thrustEmitter: Phaser.GameObjects.Particles.ParticleEmitter;
    speed: number = 100;
    turnPoint: number = 100;
    public hasExploded:boolean = false;
    constructor(scene: Scene, x: number, y: number, target: Phaser.Math.Vector2,speed:number, texture: string) {
        super(scene, x, y, texture);
        this.target = target;
        this.speed = speed;
        //adding the emitter first mades it render under the sprite
        this.thrustEmitter = this.scene.add.particles(0, 0, 'smoke', {
            speed: 10,
            lifespan: 2000,
            quantity: 1,
            scale: { start: 1, end: 0 },
            alpha: { start: 1, end: 0 },
            emitting: true,

        });

        scene.add.existing(this)
        scene.physics.add.existing(this);

        this.turnPoint = Math.random() * 300 + 100;

        this.speed = this.speed + Math.random() * 20;
        this.setVelocity(this.speed, 0);

        this.setMass(2);
        this.setScale(0.6, 0.6);

        this.thrustEmitter.startFollow(this);
        this.thrustEmitter.followOffset = new Phaser.Math.Vector2(-30, 0);

    }

    /**
     * Set the speed of the missle. Should be between 60 and 300
     * @param speed the value of the speed
     */
    public setSpeed(speed:number){
        this.speed = speed;
    }

    public explode() {
       this.hasExploded = true;
        //play explosion
        this.setScale(1.5, 1.5);
        this.play('explode');
        this.thrustEmitter.stop();

        this.once(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {

            this.destroy();
            this.thrustEmitter.destroy();
        });

    }
 
    public update(...args: any[]): void {
       
        let distance = this.body.position.distance(this.target);
        if (distance > 0) {
            let dir = new Phaser.Math.Vector2(this.target.x - this.body.position.x, this.target.y - this.body.position.y);

            let diffangle = Math.atan2(dir.y, dir.x);

            // let diffRad = this.rotation - diffangle;

            //the missile will fly a ways and then begin turning
            //towards the target
            if (this.body.x > this.turnPoint) {
                //1.57079
                if (this.rotation < diffangle) {
                    this.rotation += 0.002;
                }
                if (this.rotation > diffangle) {
                    this.rotation -= 0.002;
                }
                this.thrustEmitter.followOffset = new Phaser.Math.Vector2(-30 * Math.cos(this.rotation), -30 * Math.sin(this.rotation));


                this.body.velocity.x = Math.cos(this.rotation) * this.speed;
                this.body.velocity.y = Math.sin(this.rotation) * this.speed;
            }

        }

        if (this.x >this.scene.scale.gameSize.width + 100 )
        {

            this.setActive(false);
            this.setVisible(false);
           
        }
    }


}