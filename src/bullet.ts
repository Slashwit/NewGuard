
import { Scene } from 'phaser';
export class Bullet extends Phaser.Physics.Arcade.Sprite
{
    constructor (scene:Scene, x:number, y:number)
    {
        super(scene, x, y, 'pbullet');
    }

    fire (x:number, y:number,velocity:Phaser.Math.Vector2,rotation:number)
    {
        this.body.reset(x, y);
        this.setScale(0.5,0.5);
        this.setActive(true);
        this.setVisible(true);
        let forcex = 500* Math.cos(rotation) + velocity.x; 
        let forcey = 500* Math.sin(rotation) + velocity.y;
        this.setVelocity( forcex,  forcey);
        
    }

    preUpdate (time:number, delta:number)
    {
        super.preUpdate(time, delta);
        //Destroy bullet if it made it beyond the
        //game screen.
        if (this.y > this.scene.scale.gameSize.height+20 || 
            this.y < -20 ||
            this.x < -20 ||
            this.x >this.scene.scale.gameSize.width )
        {

            this.setActive(false);
            this.setVisible(false);
           
        }
    }

    explode(){
    
        this.setActive(false);
       this.setVisible(false);
    }
}



export class Bullets extends Phaser.Physics.Arcade.Group
{
    constructor (scene:Scene)
    {
        super(scene.physics.world, scene);

        this.createMultiple({
            frameQuantity: 10,
            key: 'bullet',
            active: false,
            visible: false,
            classType: Bullet
        });
    }

    fireBullet (x:number, y:number,velocity:Phaser.Math.Vector2,rotation:number)
    {
        const bullet = this.getFirstDead(false);

        if (bullet)
        {
            bullet.fire(x, y,velocity,rotation);
        }
    }
}