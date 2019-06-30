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

@ccclass
export class Colonizador extends cc.Component {

  @property(cc.Node)
  public target:cc.Node;

  // LIFE-CYCLE CALLBACKS:

  // onLoad () {}

  start () {

  }

  update (dt) {
    try {

      if (this.target && this.node.parent!=this.target) {
        this.node.position = this.node.position.lerp(this.target.position, 15*dt);
        if (this.node.position.sub(this.target.position).mag() < 10) {
          this.node.parent = this.target;
          this.node.position = cc.Vec2.ZERO;
          this.enabled = false;
        }
      }
    }catch(e) {
      this.enabled = false;
      this.node.active = false;
      console.log("nem ligo", e);
    }


  }
}
