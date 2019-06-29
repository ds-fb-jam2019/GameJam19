const {ccclass, property} = cc._decorator;

@ccclass
export default class MenuPlanetOrbit extends cc.Component {

    @property
    public rX: number = 0;
    @property
    public rY: number = 0;
    time: number = 0;



    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {

    }

    update (dt) {

    	this.time+=dt;
    	let x = (Math.cos(this.time) * this.rX);
    	let y = (Math.sin(this.time) * this.rY);

    	this.node.position = new cc.Vec2(x,y);
    	// console.log("TIME: ",this.rX);
    }
}
