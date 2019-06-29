const {ccclass, property} = cc._decorator;

@ccclass
export default class MenuControl extends cc.Component {

    @property([cc.Prefab])
    public planet: cc.Prefab[] = [];

    @property(cc.Node)
    public ship: cc.Node = null;

    @property(cc.Label)
    public status: cc.Label;

    @property(cc.Label)
    public planetas: cc.Label;

    @property(cc.Label)
    public galaxias: cc.Label;

    @property(cc.Label)
    public distancia: cc.Label;

    planetCounter: number = 0;
    travelingDistance: number = 1;
    reset: number = 0;
    travelingSpeed: number = 10;
    maxPlanets: number = 10;
    traveling: boolean = true;
    planetList: cc.Node[] = [];

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {
    	this.setStatus("PARADO");
    	this.setPlanetas(14);
    	this.setGalaxias(5);
    	this.setDistancia(378);
    }

    update (dt) {
    	if( this.traveling ) {
	    	this.travelingDistance += dt*this.travelingSpeed;
	    	this.moveShip();
    	}
    }

    clickButton() {
    	this.createOrbit(0);
    }

    createOrbit(i) {
    	if(this.planetCounter >= this.maxPlanets)
    		this.resetPlanets();
    	var ctx = this.node.getComponent(cc.Graphics);
		ctx.ellipse(this.node.x,this.node.y, this.travelingDistance,this.planetCounter*5);
		cc.log("node x: "+this.node.x);
		ctx.stroke();
    	this.planetCounter++;
    	var node = cc.instantiate(this.planet[i]);
		console.log("I: : ",i,);
	    this.planetList.push(node);
    	var planetScript = node.getComponent("MenuPlanetOrbit");
    	if(planetScript) {
    		cc.log("Entrou: ",planetScript,);
	    	planetScript.rX = this.travelingDistance;
	    	planetScript.rY = this.planetCounter*5;
	    	node.parent = this.node;
    		console.log("x e y : ",planetScript.rX,planetScript.rY);
    	} else
    		cc.log(" NÂO Entrou: ",planetScript);
    }

    resetPlanets() {
    	this.planetList.forEach(planet => {
    		planet.destroy();
    	})
    	this.planetList = [];
    	var ctx = this.node.getComponent(cc.Graphics);
    	ctx.clear();

    	this.planetCounter = 1;
    	this.travelingDistance = 15;
    	this.reset++;
    	this.maxPlanets++;

    	for (var i = this.reset - 1; i >= 0; i--) {
    		this.createOrbit(1);
    		this.travelingDistance+=15;
    	}
    }


    moveShip() {

    	let x = this.travelingDistance;

    	this.ship.position = new cc.Vec2(x,0);
    }

    setStatus(s) {
    	this.status.string = s+"...";
    }

    setPlanetas(s) {
    	this.planetas.string = "Planetas x "+s;
    }

    setGalaxias(s) {
    	this.galaxias.string = "Galaxias x "+s;
    }

    setDistancia(s) {
    	this.distancia.string = "Distância x"+s;
    }
}
