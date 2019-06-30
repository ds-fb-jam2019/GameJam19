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
import { Ship } from './Ship/Ship';

@ccclass
export default class FollowShip extends cc.Component {

    @property(Ship)
    ship: Ship = null;

    private _timeA:number = 0;
    private _timeB:number = 0;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {
    }

    update (dt) {
      if (!this.ship.planet) {
          if (this._timeB<1) {
              this.node.position = this.node.position.lerp(new cc.Vec2(this.ship.node.position.x, this.ship.node.position.y), (5+this._timeB*50)*dt);
          } else {
              this.node.position = new cc.Vec2(this.ship.node.position.x, this.ship.node.position.y);
          }
          // console.log("Acompanhando nave");
          this._timeA = 0;
          this._timeB += dt;
      } else {
          this._timeB = 0;
          this._timeA += dt;
          if (this._timeA<1) {
              this.node.position = this.node.position.lerp(new cc.Vec2(this.ship.planet.node.position.x, this.ship.planet.node.position.y), (5 + this._timeA*50 )*dt);
          } else {
              this.node.position = new cc.Vec2(this.ship.planet.node.position.x, this.ship.planet.node.position.y);
          }
      }
    }
}
