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
export class LaunchManager extends cc.Component {

    @property(cc.Camera)
    camera: cc.Camera = null;

    @property(cc.Vec2)
    public touchStartPoint: cc.Vec2 = null;

    @property(cc.Vec2)
    public touchLastPoint: cc.Vec2 = null;

    @property()
    public isLaunching:boolean = false;
    public canLaunch:boolean = true;

    @property(cc.AudioSource)
    public charging:cc.AudioSource = null;
    @property(cc.AudioSource)
    public chargeLoop:cc.AudioSource = null;

    private _timer:number = 0;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {
      this.node.on('touchstart', (event:cc.Event.EventTouch)=>{
        if (!this.canLaunch) return;
        console.log("touchstart");
        let touch = event.getTouches()[0];
        let location:cc.Vec2 = touch.getLocation();
        this.touchStartPoint = new cc.Vec2(location.x, location.y);
        this.touchLastPoint = new cc.Vec2(location.x, location.y);
        this.isLaunching = true;
        this._timer = 0;
        this.charging.play();
      }, this);

      this.node.on('touchmove', (event:cc.Event.EventTouch) => {
        if (!this.canLaunch) return;
        let touch = event.getTouches()[0];
        let location :cc.Vec2 = touch.getLocation();
        this.touchLastPoint = new cc.Vec2(location.x, location.y);
      }, this);

      this.node.on('touchend', (event:cc.Event.EventTouch) => {
        if (!this.canLaunch) return;
        console.log("touchend");
        let touch = event.getTouches()[0];
        let location :cc.Vec2 = touch.getLocation();
        this.touchLastPoint = new cc.Vec2(location.x, location.y);
        this.isLaunching = false;
        console.log("Launch", this.touchStartPoint, this.touchLastPoint);
        this.chargeLoop.stop();
        this.charging.stop();
        this._timer = -1;
      }, this);
    }

    update (dt) {
        if (this._timer > 2.461) {
            this.chargeLoop.play();
            this._timer = -1;
        } else if(this._timer >= 0){
            this._timer += dt;
        }
    }
}
