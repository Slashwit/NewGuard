
import './style.css'
import '../textures/BossFighter.png';
import '../textures/starfield_1.png';
import '../textures/earth.png';
import '../textures/moon_small.png';
import '../textures/playerBullet.png';
import '../textures/Missile.png';
import '../textures/smoke.png';
import '../textures/explosion.png';

import { Scene, Game, WEBGL } from 'phaser';
import { Player } from './player';
import { Missile } from './missle';
import { Bullet } from './bullet';
import { Target } from './target';
import { Level } from './level';

const canvas = document.getElementById('game') as HTMLCanvasElement;

class GameScene extends Scene {

  constructor() {
    super('game-scene');
  }

  player: Player;
  keys: any;
  missiles: Missile[] = [];
  targets: Target[] = [];
  currentLevel: Level;
  gameStarted: boolean = false;

  playButton: Phaser.GameObjects.Sprite;
  retryButton: Phaser.GameObjects.Sprite;

  preload() {
    this.load.image('starfield_1', 'textures/starfield_1.png');
    this.load.image('earth', 'textures/earth.png');
    this.load.image('moon', 'textures/moon_small.png');
    this.load.image('ship', 'textures/BossFighter.png');
    this.load.image('pbullet', 'textures/playerBullet.png');
    this.load.image('missile', 'textures/Missile.png');
    this.load.image('smoke', 'textures/smoke.png');
    this.load.image('target', 'textures/target.png');
    this.load.image('play', 'textures/PlayButton.png');
    this.load.image('retry', 'textures/RetryButton.png');
    this.load.spritesheet('explosion', 'textures/explosion.png', { frameWidth: 64, frameHeight: 64 });
  }


  create() {

    this.currentLevel = new Level();
    this.currentLevel.levelNumber = 1;
    this.currentLevel.missileCount = 2;
    this.currentLevel.missileSpeed = 60;
    // this.scale.displaySize.setAspectRatio( window.innerWidth/window.innerHeight );
    // this.scale.refresh();

    this.add.image(1024, 1024, 'starfield_1');
    const earth = this.add.image(2400, 640, 'earth');
    earth.setScale(1.5, 1.5);
    earth.rotation = -0.5;
    const moon = this.add.image(150, 150, 'moon');
    moon.setScale(0.50, 0.50);


    this.anims.create({
      key: 'explode',
      frames: 'explosion',
      frameRate: 20,
      repeat: 0
    });


    this.playButton = this.add.sprite(1024, 700, 'play').setInteractive();

    this.playButton.on('pointerdown', () => {
      this.startGame();
      this.playButton.setActive(false);
      this.playButton.setVisible(false);
    });

    this.retryButton = this.add.sprite(1024, 700, 'retry').setInteractive();
    this.retryButton.setActive(false);
    this.retryButton.setVisible(false);
    this.retryButton.on('pointerdown', () => {

      this.startGame();
      this.retryButton.setActive(false);
      this.retryButton.setVisible(false);
    });


  }


  startGame() {


    this.targets.push(new Target(this, 1900, 100));
    this.targets.push(new Target(this, 1800, 200));
    this.targets.push(new Target(this, 1880, 300));
    this.targets.push(new Target(this, 1720, 350));
    this.targets.push(new Target(this, 1720, 450));
    this.targets.push(new Target(this, 1860, 480));
    this.targets.push(new Target(this, 1720, 640));
    this.targets.push(new Target(this, 1860, 730));
    this.targets.push(new Target(this, 1960, 850));

    this.player = new Player(this, 1900, 600, 'ship');

    this.spawnMissiles(this.currentLevel);



    this.gameStarted = true;

  }

  spawnMissiles(level: Level) {

    let tindex = 0;

    for (let i = 0; i < level.missileCount; i++) {
      this.missiles.push(new Missile(this, -120, Math.random() * 1000 + 100, this.targets[tindex].locaton, level.missileSpeed, 'missile'));
      tindex++;
      if (tindex === this.targets.length) {
        tindex = 0
      }
    }

    this.physics.add.overlap(this.player.bullets, this.missiles, (missile, bullet) => {

      let miss = (missile as Missile);
      let bull = (bullet as Bullet);
      let index = this.missiles.indexOf(miss);

      if (index >= 0 && bull.active) {

        miss.explode();
        bull.explode();
        this.missiles.splice(index, 1);
      }

    });

    this.physics.add.overlap(this.targets, this.missiles, (target, missile) => {

      let missl = (missile as Missile);
      let targt = (target as Target);


      if (!missl.hasExploded) {
        let mindex = this.missiles.indexOf(missl);
        let tindex = this.targets.indexOf(targt);

        if (mindex >= 0 && tindex >= 0) {


          this.missiles.splice(mindex, 1);
          this.targets.splice(tindex, 1);
          missl.explode();
          targt.explode();
        }
      }

    });

    this.physics.add.overlap(this.player, this.missiles, (player, missile) => {

      let missl = (missile as Missile);
      let playr = (player as Player);

      //TODO: Add damage overlay to player'
      //If player is hit by 3 missiles, then game over.
      if (!missl.hasExploded) {
        let mindex = this.missiles.indexOf(missl);


        if (mindex >= 0 && tindex >= 0) {


          this.missiles.splice(mindex, 1);

          missl.explode();

        }
      }

    });
  }

  update(time: number, delta: number): void {

    if (this.gameStarted) {


      this.player.update(time, delta);

      for (let i = this.missiles.length - 1; i >= 0; i--) {
        this.missiles[i].update(time, delta);

        //remove missiles that have left the screen
        if (!this.missiles[i].active) {
          this.missiles[i].explode();
          this.missiles.splice(i, 1);

        }
      }

      if (this.missiles.length === 0 && this.targets.length > 0) {

        this.currentLevel.levelNumber++;
        this.currentLevel.missileSpeed += 5;
        this.currentLevel.missileCount++;
        this.spawnMissiles(this.currentLevel);

      }

      if (this.targets.length === 0) {

        this.gameStarted = false;
        this.player.destroy();
        this.currentLevel.levelNumber = 1;
        this.currentLevel.missileCount = 2;
        this.currentLevel.missileSpeed = 60;
        this.retryButton.setActive(true);
        this.retryButton.setVisible(true);
      }
    }





  }

 
}

const config = {
  type: WEBGL,
  width: 2048,
  height: 1280,
  scale: {
    mode: Phaser.Scale.FIT,
    // fits to game screen to the window 
  },
  canvas,
  physics: {
    default: 'arcade',
    arcade: { debug: false }
  },
  scene: GameScene
}

new Game(config);