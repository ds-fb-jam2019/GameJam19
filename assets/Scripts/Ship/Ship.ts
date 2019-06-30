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
export default class Ship extends cc.Component {

    @property()
    public fuel:number = 100;

    @property([Planet])
    public planetTest: Planet[] = [];

    private _activeLaunching:boolean = false;
    private _traveling: boolean = false;

    private _lm:LaunchManager;
    private _canvas: cc.Canvas;
    private _launchPower: number;
    private _launchAcc: cc.Vec2;
    private _chunks:ChunkGenerator;

    // private _planetTest: Planet;


    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {
      this._lm = cc.find("Canvas/LaunchManager").getComponent("LaunchManager");
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
    }

    launch() {
      this._traveling = true;
      this.calcLaunchVector();
    }

    calcLaunchVector() {
      let result = this._lm.touchLastPoint.sub(this._lm.touchStartPoint);
      let screenSize = this._canvas.designResolution.height;
      this._launchPower = result.mag()/screenSize;

      this._launchAcc = new cc.Vec2(0, this._launchPower);

      console.log("Power", this._launchPower);
    }

    calcTravel(dt) {
      let atraction = this.getPlanetsAtraction();


      let pos = this.node.position;
      let angle = (this.node.angle+90) * (Math.PI /180);
      let displacement = dt * this._launchPower * 100;
      // let x = pos.x + atraction.x + Math.cos(angle) * displacement;
      // let y = pos.y + atraction.y + Math.sin(angle) * displacement;
      this._launchAcc.x -= atraction.x;
      this._launchAcc.y -= atraction.y;

      // console.log("atraction", atraction);
      // console.log("LACC", this._launchAcc);
      let x = pos.x + (this._launchAcc.x * dt);
      let y = pos.y + (this._launchAcc.y * dt);

      let newPos = new cc.Vec2(x,y);

      this.node.position = new cc.Vec2(x,y);
      // this._chunks.chunksForPosition(x,y);

      let diff = pos.sub(newPos);
      // console.log("diff", diff.mag());

      // angle = Math.acos( cc.v2(pos).dot(newPos) / (pos.mag()*newPos.mag()));
      // console.log("angle", angle);

      angle = Math.atan2(newPos.y - pos.y, newPos.x - pos.x) * 180 / Math.PI;
      // console.log("angle", angle);

      let newAngle = angle - 90;// * 180/Math.PI;
      this.fuel -= 10*dt;

      this.node.angle = newAngle;

      // console.log("newAngle", this.node.angle);

      // this.node.lookAt(new cc.Vec3(atraction.x, atraction.y, 0), cc.Vec3.UP);

      // if(this.fuel <= 0) {
      //   this._traveling = false;
      // }


      // console.log("displacement", displacement);
      // console.log("angle", Math.sin(angle));
      // console.log("fuel", this.fuel);
      // console.log("position", this.node.position.toString());
    }

    getPlanetsAtraction() {
      let resultAtraction = new cc.Vec2(0,0);
      let planets = this._chunks.getAllPlanets();

      // let planets:Planet[] = []; planets.push(this._planetTest);
      planets.forEach((p:Planet) => {
        let atractionRadius = p.radius * 10;
        let diff = this.node.position.sub(p.node.position);
        let distance = diff.mag();

        // console.log("planet pos x", p.node.position);
        // console.log("ship pos x", this.node.position);
        // console.log("planet pos y", p.node.position.y);

        // console.log("distance", distance);
        // console.log("attractionRadius", atractionRadius);

        if(distance < atractionRadius && distance > p.radius) {
          // console.log("distance", distance);
          let angle = cc.v2(this.node.position).angle(p.node.position) + Math.PI/2;
          // let displacement = 1/(distance) * 50;
          // let displacement = 1/distanc;)

          // console.log("angle", angle);
          // console.log("dif", diff);
          // console.log("displacement", displacement);

          // if (diff.x < 1 && diff.x > -1) {
          //   if (diff.x<0) diff.x = -1;
          //   else diff.x = 1
          // }
          resultAtraction.x += (p.radius/100) * diff.x/ distance;
          ;//(1*p.radius)/(diff.x*diff.x);
          resultAtraction.y += (p.radius/100) * diff.y/ distance;//(1*p.radius)/(diff.y*diff.y);
          // console.log("Result Atraction x", resultAtraction);
          // console.log("sin Ang", Math.sin(angle));
          // console.log("Result Atraction x", resultAtraction.y);
        }
      });


      // console.log("Result Atraction", resultAtraction);
      return resultAtraction;
    }
}
