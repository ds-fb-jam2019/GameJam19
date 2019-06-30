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
export default class Estrela extends cc.Component {

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    @property([cc.SpriteFrame])
    public estrelas:cc.SpriteFrame[] = [];

    @property()
    public size:number = 20;
    public originalPos:cc.Vec2 = cc.Vec2.ZERO;


    private cam:cc.Node;

    start () {

      this.cam = cc.find("Canvas/Main Camera");
      let sprite = this.getComponent(cc.Sprite);
      sprite.spriteFrame = this.estrelas[Math.round(Math.random()*(this.estrelas.length-1))];
      this.originalPos = this.node.position;
      // this.size = this.node.scale*30;
    }

    update (dt) {

      // let vec = this.originalPos.sub(this.cam.position);
      // let force = vec.mag() * (this.size*this.size) / (900);

      // console.log("Forca cam",force);
      // let ang = Math.atan2(this.cam.position.y - this.originalPos.y, this.cam.position.x - this.originalPos.x) ;

      // this.node.position = new cc.Vec2(
      //   this.originalPos.x + Math.cos(ang) * force,
      //   this.originalPos.y + Math.sin(ang) * force
      // );

    }
}
