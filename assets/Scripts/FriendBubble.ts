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

import {Ship} from './Ship/Ship'


@ccclass
export default class FriendBubble extends cc.Component {


  private _ship:Ship;
  private vel:cc.Vec2 = cc.Vec2.ZERO;

  private w = 0;
  private h = 0;
  private screenW = 0;
  private screenH = 0;

  start () {
    this._ship = cc.find('Canvas/Ship').getComponent(Ship);

      this.node.on('touchstart', (event:cc.Event.EventTouch)=>{
        console.log("Sim, tocou aqui!");
        let touch = event.getTouches()[0];
        event.stopPropagation();
        this.popBubble();

      }, this);

      this.vel = new cc.Vec2(
          150 * ((Math.random()>0.5)?-1:1),
          150 * ((Math.random()>0.5)?-1:1),
        )

      this.w = this.node.getContentSize().width;
      this.h = this.node.getContentSize().height;
      let canvas = cc.Canvas.instance;
      this.screenW = canvas.designResolution.width;
      this.screenH = canvas.designResolution.height;

  }

  popBubble() {
    this._ship.throwAtBubble(new cc.Vec2(this.node.position.x, this.node.position.y - 60));

    this.node.destroy();
    
  }

  update (dt) {

    // this.node.position = this.node.position.add(this.vel.mulSelf(dt));

    let newX = this.node.position.x + (this.vel.x*dt);
    let newY = this.node.position.y + (this.vel.y*dt);


    if (this.node.position.x > this.screenW-(this.w/1.5)) {
      // this.node.position = new cc.Vec2(, this.node.position.y);
      newX = this.screenW-(this.w/1.5)-1;
      this.vel.x *=-1;
    }
    if (this.node.position.y > this.screenH-this.h) {
      // this.node.position = new cc.Vec2(this.node.position.x, );
      newY = this.screenH-this.h-1;
      this.vel.y *=-1;
    }
    if (this.node.position.x < -this.w/3) {
      // this.node.position = new cc.Vec2(this.screenW-this.w/2-1, this.node.position.y);
      newX = -this.w/3+1;
      this.vel.x *=-1;
    }

    if (this.node.position.y < -this.h/2) {
      newY = -this.h/2+1;
      this.vel.y *=-1;
    }

    console.log("valores novos", newX, newY);
    console.log("Velocidade", this.vel);

    this.node.position = new cc.Vec2(newX, newY);
  }
}
