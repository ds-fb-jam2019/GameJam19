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

    @property([cc.Prefab])
    planets: cc.Prefab[] = [];

    @property()
    radius: number = 0;
    @property()
    mass: number = 0;

    // @property()
    // position: cc.Vec2;


    @property()
    public orbitRadius:number = 90;

    @property(cc.Vec2)
    public orbitCenter:cc.Vec2 = new cc.Vec2(0,0);

    @property()
    public speedMod:number = 1;


    private time:number = 0;
    private _direction:number = 1;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {
      this._direction = (Math.random()<0.5)?-1:1;
      let idx = Math.round(Math.random() * (this.planets.length-1));
      let node = cc.instantiate( this.planets[idx] );
      node.parent = this.node;
      this.time += Math.random() * 20;
      // console.log("start?", idx);
    }

    update (dt) {
      if (this.orbitCenter) {
        this.time += (dt * this._direction) * this.speedMod;

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
