import { Scene } from 'phaser';
export class Target extends Phaser.Physics.Arcade.Sprite
{
    locaton:Phaser.Math.Vector2;
    constructor (scene:Scene, x:number, y:number)
    {
        super(scene, x, y, 'target');
        scene.add.existing(this)
        scene.physics.add.existing(this);
        this.locaton = new Phaser.Math.Vector2(x,y);
    }

    public hasExploded:boolean = false;
    public explode(){
        this.hasExploded = true;
        this.play('explode');
     

        this.once(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {

            this.destroy();
            
        });
    }

    public getLocation():Phaser.Math.Vector2{
        return this.locaton;
    }

}