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
    public maxPlanetsRadius:number = 90;

    @property()
    public minPlanetOrbit:number = 90;
    @property()
    public maxPlanetOrbit:number = 200;

    // @property()
    // public minPlanetsMass:number = 90;
    // @property()
    // public maxPlanetsMass:number = 200;
  /* End Planet gen props */

  @property()
  public minStationsPerChunk:number = 0;
  @property()
  public maxStationsPerChunk:number = 1;

  public chunks:any = {};

  private screenH:number;
  private screenW:number;

  start () {
    this.screenH = this.canvas.designResolution.height;
    this.screenW = this.canvas.designResolution.width;


    this.chunksForPosition(0,0);


  }

  chunksForPosition(x, y) {
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
    planet.orbitCenter.x = this.randRange(this.screenW*x, this.screenW*(x+1));
    planet.orbitCenter.y = this.randRange(this.screenH*y, this.screenH*(y+1));

    planet.radius = this.randRange(this.minPlanetsRadius, this.maxPlanetsRadius);
    planet.orbitRadius = this.randRange(this.minPlanetOrbit, this.maxPlanetOrbit);

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

    return  Math.round((Math.random() * (max - min))+ min);

  }

}
