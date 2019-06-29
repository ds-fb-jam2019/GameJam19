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


@ccclass
export default class Ship extends cc.Component {

    @property()
    public fuel:number = 100;

    private _activeLaunching:boolean = false;
    private _traveling: boolean = false;

    private _lm:LaunchManager;
    private _canvas: cc.Canvas;
    private _launchPower: number;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {
      this._lm = cc.find("Canvas/LaunchManager").getComponent("LaunchManager");
      this._canvas = cc.Canvas.instance;
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
      console.log("Power", this._launchPower);
    }

    calcTravel(dt) {
      let angle = (this.node.angle+90) * (Math.PI /180);
      let displacement = dt * this._launchPower * 100;
      let x = this.node.position.x + Math.cos(angle) * displacement;
      let y = this.node.position.y + Math.sin(angle) * displacement;

      this.node.position = new cc.Vec2(x,y);
      this.fuel -= 10*dt;

      if(this.fuel <= 0) {
        this._traveling = false;
      }

      console.log("displacement", displacement);
      console.log("angle", Math.sin(angle));
      console.log("fuel", this.fuel);
      console.log("position", this.node.position.toString());
    }
}
