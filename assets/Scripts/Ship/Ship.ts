// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

import {LaunchManager} from './LaunchManager'
import {ChunkGenerator} from '../chunkGen/ChunkGenerator'
import {Planet} from '../Planet'
import {Station} from '../Station'
import {MenuControl} from '../Menu/MenuControl'
import {GameManager} from '../Game Manager/GameManager';
import {FriendManager} from '../FriendManager';



@ccclass
export class Ship extends cc.Component {

    @property(Planet)
    public planet:Planet;

    @property()
    public orbitRadiusOffset:number = 20;


    @property()
    public fuelTransferRate:number = 25;
    @property()
    public maxFuel:number = 300;
    public fuel:number = 300;

    @property()
    public imuneTime:number = 1;
    public currentImuneTime:number = 0;

    @property([Planet])
    public planetTest: Planet[] = [];

    @property(MenuControl)
    public menuControl: MenuControl = null;
    @property(cc.Graphics)
    public gfx:cc.Graphics = null;
    @property(cc.Node)
    public nodeDirection:cc.Node = null;

    @property(cc.AudioSource)
    public launch_sound:cc.AudioSource = null;
    @property(cc.AudioSource)
    public planet_orbit:cc.AudioSource = null;
    @property(cc.AudioSource)
    public fill_looping:cc.AudioSource = null;
    @property([cc.AudioSource])
    public terraform_sound:cc.AudioSource[] = [];


    @property(FriendManager)
    public friendManager:FriendManager = null;

    @property(cc.Node)
    public launchTuto:cc.Node = null;

    private _activeLaunching:boolean = false;
    private _traveling: boolean = false;
    private _orbiting: boolean = false;

    private _lm:LaunchManager;
    private _canvas: cc.Canvas;
    private _launchPower: number;
    private _launchAcc: cc.Vec2 = cc.Vec2.ZERO;
    private _chunks:ChunkGenerator;
    private _time:number = 0;
    private orbitDirection:number = 0;
    private orbitOffset:number = 0;

    private _maxTravelDistance:number = 0;
    private _planetCount:number = 0;
    private _gm:GameManager;


private count:number = 0;
    // private _planetTest: Planet;


    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {
      this._gm = cc.find("GameManager").getComponent("GameManager");
      this._lm = cc.find("Canvas/Main Camera/LaunchManager").getComponent("LaunchManager");
      this._chunks = cc.find("Canvas").getComponent("ChunkGenerator");
      this._canvas = cc.Canvas.instance;
      this.menuControl.setDistancia(0);
      this.menuControl.setPlanetas(0);
      this.menuControl.setGalaxias(0);
      this.fuel = this.maxFuel;
      // this.launch_sound = this.getComponent(cc.AudioSource);
      // this._planetTest = this.planetTest.getComponent("Planet");
    }

    update (dt) {
      if(this._lm.isLaunching && !this._traveling) {
        this.nodeDirection.active = true;
        this._activeLaunching = true;
      }

      if(this._activeLaunching) {


        this.showPowerBubble();
        if(this._lm.isLaunching == false) {
          this.launchTuto.active = false;
          this.nodeDirection.active = false;
          this.gfx.clear();
          console.log("Launch!")
          this._activeLaunching = false;
          this.launch();
        }
      }

      if(this._traveling) {
        this.calcTravel(dt);
      }

      if (this.planet) {
        if(!this._orbiting) {
          this.launchTuto.active = true;
          this._orbiting = true;
          if(this.menuControl)
          this.menuControl.createOrbit(0);
        }
        this.orbitPlanet(dt);
      }
    }

    showPowerBubble() {
      let result = this._lm.touchLastPoint.sub(this._lm.touchStartPoint);
      let screenSize = this._canvas.designResolution.height;
      let powerPercent = ( result.mag() / (screenSize * 0.8)) ;
      if (powerPercent>1) {
        powerPercent = 1;
      }

      let bubbleSize = 20+ (powerPercent*80);

      this.gfx.clear();
      this.gfx.strokeColor = cc.color(255,255,255,70);
      this.gfx.lineWidth = 2;
      this.gfx.fillColor = cc.color(255,255,255,30);
      this.gfx.ellipse(this.node.position.x, this.node.position.y, bubbleSize, bubbleSize);
      this.gfx.stroke();
      this.gfx.fill();
    }

    launch() {
      this._traveling = true;
      this.currentImuneTime = 0;
      if (this.planet) {
        // this.planet.node.destroy();
        this._orbiting = false;
      }
      this.launch_sound.play();
      this.menuControl.setTraveling(true);
      this.menuControl.setStatus("VIAJANDO");
      this.planet = null;
      this._lm.canLaunch = false;
      this.calcLaunchVector();
    }

    calcLaunchVector() {
      let result = this._lm.touchLastPoint.sub(this._lm.touchStartPoint);
      let screenSize = this._canvas.designResolution.height;
      let powerPercent = ( result.mag() / (screenSize * 0.8)) * 100;
      if (powerPercent>100) {
        powerPercent = 100;
      }
      if (powerPercent > this.fuel) {
        powerPercent = this.fuel;
      }
      this._launchPower = powerPercent * 6;
      this.fuel -= powerPercent;
      console.log("PowerPercent:", powerPercent);
      console.log("Fuel:", this.fuel);
      this.menuControl.setCombustivel(this.fuel/this.maxFuel);


      let rad = (this.node.angle+90) *Math.PI/180;

      this._launchAcc = new cc.Vec2(
        Math.cos(rad)*this._launchPower,
        Math.sin(rad)*this._launchPower);

      console.log("Power", this._launchPower);
      console.log("Launch vec:", this._launchAcc);
    }

    calcTravel(dt) {
      let atraction = cc.Vec2.ZERO;
      if (this.currentImuneTime > this.imuneTime ) {
        this.imuneTime = 1;
        atraction = this.getPlanetsAtraction();
        this.gatherFuel(dt);
      } else {
        this.currentImuneTime += dt;
      }
      // Entrou numa orbita
      if (this.planet) {
        this.fill_looping.stop();
        this._traveling = false;
        this.menuControl.setTraveling(false);
        this.menuControl.setStatus("ORBITANDO");
        return;

      }

      let pos = this.node.position;
      // let angle = (this.node.angle+90) * (Math.PI /180);
      // let displacement = dt * this._launchPower * 1000;

      this._launchAcc.x -= atraction.x;
      this._launchAcc.y -= atraction.y;

      let x = pos.x + (this._launchAcc.x * dt);
      let y = pos.y + (this._launchAcc.y * dt);

      let newPos = new cc.Vec2(x,y);
      let travelDistance = newPos.mag();
      if (travelDistance > this._maxTravelDistance) {
        this._maxTravelDistance = travelDistance;
        this.friendManager.findFriendsForDistance(this._maxTravelDistance);
        this.menuControl.setDistancia(Math.floor(this._maxTravelDistance));
      }

      this.node.position = new cc.Vec2(x,y);
      if (this.count++ > 60) {
        this._chunks.chunksForPosition(x, y);
        this.count = 0;
      }

      let diff = pos.sub(newPos);

      let angle = Math.atan2(newPos.y - pos.y, newPos.x - pos.x) * 180 / Math.PI;

      let newAngle = angle - 90;// * 180/Math.PI;
      // this.fuel -= 10*dt;

      this.node.angle = newAngle;

    }

    getPlanetsAtraction() {
      let resultAtraction = new cc.Vec2(0,0);
      let planets = this.planetTest;
      if (this.planetTest.length == 0) {
        planets = this._chunks.getAllPlanets();
      }

      planets.forEach((p:Planet) => {
        let atractionRadius = 300; //p.radius * 5;
        let diff = this.node.position.sub(p.node.position);
        let distance = diff.mag();

        if(!this.planet) {
          if (distance < p.radius ) {

            this._time = 0;
            this.orbitDirection = Math.random()<0.5?-1:1;
            this.orbitOffset = Math.random()*360;
            this.planet = p;
            this.planet_orbit.play();

            this._lm.canLaunch = true;

            if (this.fuel == 0) {
              //GameOver;
              // console.log("gameObver");
              this._gm.gameOver();
            }

            if (this.planetTest.length == 0) {
              this._chunks.removePlanet(p);
            } else {
              this.planetTest.splice(this.planetTest.indexOf(this.planet),1);
            }

          }

          if(distance < atractionRadius) {
            // let angle = cc.v2(this.node.position).angle(p.node.position) + Math.PI/2;
            resultAtraction.x += (p.radius/100) * diff.x/ distance;
            resultAtraction.y += (p.radius/100) * diff.y/ distance;
          }

          if (!p.terraformed && distance < p.radius + (60 * (p.radius/100))) {
            p.terraformed = true;
            this.menuControl.setPlanetas(++this._planetCount);
            this.playRand(this.terraform_sound);
          }
        }
      });

      return resultAtraction;
    }

    playRand(sounds:cc.AudioSource[]) {
      let idx = Math.round(Math.random() * (sounds.length-1));
      sounds[idx].play();
    }

    orbitPlanet(dt) {
      this._time += dt;
      let x = this.planet.node.position.x + (Math.cos((this._time+this.orbitOffset) * this.orbitDirection) * this.planet.radius )
      let y = this.planet.node.position.y + (Math.sin((this._time+this.orbitOffset) * this.orbitDirection) * this.planet.radius )

      let angle = Math.atan2(this.planet.node.position.y - y, this.planet.node.position.x - x) * 180 / Math.PI;

      this.node.angle = angle+ (this.orbitDirection<0?0:180);
      // this.node.angle = 0;

      // this.node.position = ;
      if (this._time<1) {
        this.node.position = this.node.position.lerp(new cc.Vec2(x, y), (5 + this._time * 10)*dt);
      } else {
        this.node.position = new cc.Vec2(x, y);
      }
    }

    gatherFuel(dt) {
      let stationsP:Planet[] = this._chunks.getAllStations();
      let gotFuel:boolean = false;
      stationsP.forEach((p) => {

        let dist = p.node.position.sub(this.node.position).mag();
        if (dist < 250) {

          let station = p.getComponent(Station);
          if (station.fuel <= 0) return;

          let fuelRecharge = this.fuelTransferRate*dt;
          if (station.fuel < fuelRecharge) {
            fuelRecharge = station.fuel;
          }

          if (fuelRecharge > 0) {
            if (!this.fill_looping.isPlaying) { this.fill_looping.play(); }
            gotFuel = true;
          }
          station.updateFuel();
          station.fuel -= fuelRecharge;
          this.fuel += fuelRecharge;
          if (this.fuel > this.maxFuel)
            this.fuel = this.maxFuel;
          this.menuControl.setCombustivel(this.fuel/this.maxFuel);
        }


      });

      if (!gotFuel) {
        this.fill_looping.stop();
      }
    }

    throwAtBubble(bubblePos:cc.Vec2) {
      this.currentImuneTime = 0;
      this.imuneTime = 4;
      if (this.planet) {
        // this.planet.node.destroy();
        this._orbiting = false;
      }
      this.launch_sound.play();
      this.menuControl.traveling = true;
      this.menuControl.setStatus("VIAJANDO");
      this.planet = null;
      this._lm.canLaunch = false;

      let pos:cc.Vec2 = this.node.position;

      let angle = Math.atan2(bubblePos.y, bubblePos.x);

      this._launchAcc.x = Math.cos(angle)*1200;
      this._launchAcc.y = Math.sin(angle)*1200;

      this.fuel = this.maxFuel;
      this.menuControl.setCombustivel(1);
      this._traveling = true;

    }
}
