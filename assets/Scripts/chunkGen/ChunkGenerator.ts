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
import { Planet } from './../Planet';

@ccclass
export class ChunkGenerator extends cc.Component {

  @property()
  public canvas:cc.Canvas;
  @property(cc.Prefab)
  public planetBase:cc.Prefab;


  /* Planet gen props */
    @property()
    public minPlanetsPerChunk:number = 1;
    @property()
    public maxPlanetsPerChunk:number = 3;

    @property()
    public minPlanetsRadius:number = 20;
    @property()
    public maxPlanetsRadius:number = 100;

    @property()
    public minPlanetOrbit:number = 50;
    @property()
    public maxPlanetOrbit:number = 500;

    @property()
    public minPlanetsSpeedMod:number = 0.3;
    @property()
    public maxPlanetsSpeedMod:number = 3;
  /* End Planet gen props */

  @property()
  public minStationsPerChunk:number = 0;
  @property()
  public maxStationsPerChunk:number = 1;

  public chunks:any = {};

  private _maxDistance:number;
  private screenH:number;
  private screenW:number;

  start () {
    this.canvas = cc.Canvas.instance;
    this.screenH = this.canvas.designResolution.height;
    this.screenW = this.canvas.designResolution.width;


    this.chunksForPosition(0,0);


  }

  chunksForPosition(x, y) {

    let distance = Math.sqrt(x*x+y*y);
    if (distance < this._maxDistance) return;
    this._maxDistance = distance;


    let idxX = x/this.screenW;
    let idxY = y/this.screenH;

    let activeChunks:string[] = [];
    for(let i = idxX-1; i<=idxX+1; ++i) {
      for(let j = idxX-1; j<=idxX+1; ++j) {
        let chunkLabel = i+"_"+j;
        activeChunks.push(chunkLabel);
        if (!this.chunks[chunkLabel]) {
          this.chunks[chunkLabel] = this.generatePlanets(i, j);
        }
      }
    }

    for(let atr in this.chunks) {
      if (activeChunks.indexOf(atr) == -1 ){
        this.removePlanets(this.chunks[atr] as Planet[]);
        delete this.chunks[atr];
      }
    }

  }

  generatePlanets(idxX, idxY):Planet[] {
    if (idxX==0 && idxY == 0) return [];
    let planetsToCreate = this.randRange(this.minPlanetsPerChunk, this.maxPlanetsPerChunk);
    let newPlanets = [];

    for (let i=0; i<planetsToCreate; ++i) {
      newPlanets.push(this.createPlanet(idxX, idxY, i));
    }

    return newPlanets;
  }

  createPlanet(x:number, y:number, idx:number):Planet {

    // let node = new cc.Node('Planet_'+x+"_"+y+"_"+idx);
    let node = cc.instantiate(this.planetBase);
    let planet = node.addComponent(Planet);
    let orbitCenter = new cc.Vec2();

    orbitCenter.x = this.randRange(this.screenW*x, this.screenW*(x+1));
    orbitCenter.y = this.randRange(this.screenH*y, this.screenH*(y+1));
    
    planet.orbitCenter = orbitCenter;

    planet.radius = this.randRange(this.minPlanetsRadius, this.maxPlanetsRadius);
    planet.orbitRadius = this.randRange(this.minPlanetOrbit, this.maxPlanetOrbit);
    planet.speedMod = this.randRangef(this.minPlanetsSpeedMod, this.maxPlanetsSpeedMod);

    console.log("Gerando raio: ", planet.radius);

    node.scale = (planet.radius/this.maxPlanetsRadius);

    node.parent = this.node;

    return planet;
  }

  removePlanets(planets:Planet[]) {
    planets.forEach(
      (planet) => {
        planet.destroy();
      })
  }

  getAllPlanets():Planet[] {
    return []
  }


  randRange(min:number, max:number):number {

    return  Math.round(this.randRangef(min, max));

  }

  randRangef(min, max):number {
    return (Math.random() * (max - min)) + min;
  }

}
