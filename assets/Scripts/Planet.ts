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
export class Planet extends cc.Component {

    @property(cc.Label)
    label: cc.Label = null;

    @property()
    radius: number = 0;
    @property()
    mass: number = 0;

    // @property()
    // position: cc.Vec2;


    @property()
    public orbitRadius:number = 90;

    @property(cc.Vec2)
    public orbitCenter:cc.Vec2;

    @property()
    public speedMod:number = 1;


    private time:number = 0;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {
    }

    update (dt) {
      if (this.orbitCenter) {
        this.time += dt*this.speedMod;

        let x = Math.round(this.orbitCenter.x + (Math.cos(this.time)*this.orbitRadius));
        let y = this.orbitCenter.y + (Math.sin(this.time)*this.orbitRadius);
        
        this.node.position = new cc.Vec2(x,y);
        // let angle = this.orbitCenter.signAngle(this.orbitCenter.sub(this.node.position));
        // this.node.angle = (angle*180)/Math.PI + 90;
        // console.log("rotation", this.node.angle);

        // console.log("this.time:", this.time, this.node.position);
        
      }

    }
}
