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


@ccclass
export class Ship extends cc.Component {

    @property()
    public planet:Planet = null;

    @property()
    public orbitRadiusOffset:number = 20;

    @property()
    public fuel:number = 100;

    @property()
    public imuneTime:number = 1;
    public currentImuneTime:number = 0;

    @property([Planet])
    public planetTest: Planet[] = [];

    private _activeLaunching:boolean = false;
    private _traveling: boolean = false;

    private _lm:LaunchManager;
    private _canvas: cc.Canvas;
    private _launchPower: number;
    private _launchAcc: cc.Vec2;
    private _chunks:ChunkGenerator;
    private _time:number = 0;


private count:number = 0;
    // private _planetTest: Planet;


    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {
      this._lm = cc.find("Canvas/Main Camera/LaunchManager").getComponent("LaunchManager");
      this._chunks = cc.find("Canvas").getComponent("ChunkGenerator");
      this._canvas = cc.Canvas.instance;
      // this._planetTest = this.planetTest.getComponent("Planet");
    }

    update (dt) {
      if(this._lm.isLaunching && !this._traveling)
        this._activeLaunching = true;

      if(this._activeLaunching) {
        if(this._lm.isLaunching == false) {
          console.log("Launch!")
          this._activeLaunching = false;
          this.launch();
        }
      }

      if(this._traveling) {
        this.calcTravel(dt);
      }

      if (this.planet) {
        this.orbitPlanet(dt);
      }
    }

    launch() {
      this._traveling = true;
      this.currentImuneTime = 0;
      if (this.planet) {
        // this.planet.node.destroy();
      }
      this.planet = null;
      this.calcLaunchVector();
    }

    calcLaunchVector() {
      let result = this._lm.touchLastPoint.sub(this._lm.touchStartPoint);
      let screenSize = this._canvas.designResolution.height;
      this._launchPower = (result.mag()/screenSize) * 300;


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
        atraction = this.getPlanetsAtraction();
      } else {
        console.log("imune", this.currentImuneTime);
        this.currentImuneTime += dt;
      }
      // Entrou numa orbita
      if (this.planet) {

        this._traveling = false;
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

      this.node.position = new cc.Vec2(x,y);
      if (this.count++ > 100) {
        this._chunks.chunksForPosition(x, y);
        this.count = 0;
      }

      let diff = pos.sub(newPos);

      let angle = Math.atan2(newPos.y - pos.y, newPos.x - pos.x) * 180 / Math.PI;

      let newAngle = angle - 90;// * 180/Math.PI;
      this.fuel -= 10*dt;

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
            console.log("In orbit");
            this.planet = p;
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
        }
      });

      return resultAtraction;
    }

    orbitPlanet(dt) {
      this._time += dt;
      let x = this.planet.node.position.x + (Math.cos(this._time) * this.planet.radius )
      let y = this.planet.node.position.y + (Math.sin(this._time) * this.planet.radius )

      let angle = Math.atan2(this.planet.node.position.y - y, this.planet.node.position.x - x) * 180 / Math.PI;

      this.node.angle = angle+180;
      // this.node.angle = 0;

      // this.node.position = ;
      if (this._time<1) {
        this.node.position = this.node.position.lerp(new cc.Vec2(x, y), (5 + this._time * 10)*dt);
      } else {
        this.node.position = new cc.Vec2(x, y);
      }
    }
}
