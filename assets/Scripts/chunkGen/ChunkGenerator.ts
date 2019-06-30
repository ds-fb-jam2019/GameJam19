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
  public _canvas:cc.Canvas = null;
  @property(cc.Prefab)
  public planetBase:cc.Prefab = null;
  @property(cc.Prefab)
  public stationBase:cc.Prefab = null;
  @property()
  public spawnRadius:number = 1;


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
  public stationSpawnChance:number = 0.3;

  @property()
  public minStationOrbit:number = 50;
  @property()
  public maxStationOrbit:number = 250;

  public chunks:any = {};
  public stations:any = {};

  private _maxDistance:number = 0;
  private screenH:number = 0;
  private screenW:number = 0;
  private offset:cc.Vec2 = cc.Vec2.ZERO;

  start () {
    this._canvas = cc.Canvas.instance;
    this.screenH = this._canvas.designResolution.height;
    this.screenW = this._canvas.designResolution.width;
    this.offset = new cc.Vec2(this.screenW/2, this.screenH/2);

    this.chunksForPosition(0,0);


  }

  chunksForPosition(x, y) {

    // let distance = Math.sqrt(x*x+y*y);
    // if (distance < this._maxDistance) return;
    // this._maxDistance = distance;


    let idxX = Math.floor((x-this.offset.x)/this.screenW)+1;
    let idxY = Math.floor((y-this.offset.y)/this.screenH)+1;

    let activeChunks:string[] = [];
    for(let i = idxX-this.spawnRadius; i<=idxX+this.spawnRadius; ++i) {
      for(let j = idxY-this.spawnRadius; j<=idxY+this.spawnRadius; ++j) {
        let chunkLabel = i+"_"+j;
        activeChunks.push(chunkLabel);
        if (!this.chunks[chunkLabel]) {
          // console.log("Gerando planetas para: ", chunkLabel);
          this.chunks[chunkLabel] = this.generatePlanets(i, j);
          this.stations[chunkLabel] = this.generateStations(i, j);
        }
      }
    }

    for(let atr in this.chunks) {
      if (activeChunks.indexOf(atr) == -1 ){
        // console.log("removendo o chunk:"+atr);
        this.removePlanets(this.chunks[atr] as Planet[]);
        this.removePlanets(this.stations[atr] as Planet[]);
        delete this.chunks[atr];
        delete this.stations[atr];
      }
    }

  }

  generatePlanets(idxX, idxY):Planet[] {
    if (idxX==0 && idxY == 0) return [];
    let planetsToCreate = this.randRange(this.minPlanetsPerChunk, this.maxPlanetsPerChunk);
    let newPlanets = [];

    for (let i=0; i<planetsToCreate; ++i) {
      newPlanets.push(this.createPlanet(idxX, idxY));
    }

    return newPlanets;
  }

  createPlanet(x:number, y:number):Planet {

    // let node = new cc.Node('Planet_'+x+"_"+y+"_"+idx);
    let node = cc.instantiate(this.planetBase);
    let planet = node.getComponent(Planet);
    let orbitCenter = new cc.Vec2();

    orbitCenter.x = this.randRangef(this.screenW*x, this.screenW*(x+1)) - this.offset.x;
    orbitCenter.y = this.randRangef(this.screenH*y, this.screenH*(y+1)) - this.offset.y;
    
    planet.orbitCenter = orbitCenter;

    planet.radius = this.randRangef(this.minPlanetsRadius, this.maxPlanetsRadius);
    planet.orbitRadius = this.randRangef(this.minPlanetOrbit, this.maxPlanetOrbit);
    planet.speedMod = this.randRangef(this.minPlanetsSpeedMod, this.maxPlanetsSpeedMod);

    // console.log("Gerando raio: ", planet.radius);

    planet.fixScale();
    node.parent = this.node;

    return planet;
  }

  removePlanets(planets:Planet[]) {
    planets.forEach(
      (planet) => {
        if(planet.orbitGfx !=null) {
          planet.orbitGfx.node.destroy();
        }
        planet.node.destroy();
      })
  }

  removePlanet(planet:Planet) {
    for(let chunk in this.chunks) {
      let idx = this.chunks[chunk].indexOf(planet);
      if (idx != -1) {
        this.chunks[chunk].splice(idx,1);
      }
    }
  }

  getAllPlanets():Planet[] {
    let planets = [];
    for(let chunk in this.chunks) {
      planets = planets.concat(this.chunks[chunk]);
    }
    return planets;
  }

  getAllStations():Planet[] {
    let planets = [];
    for(let chunk in this.stations) {
      planets = planets.concat(this.stations[chunk]);
    }
    return planets;
  }

  generateStations(idxX, idxY):Planet[] {
    if (idxX==0 && idxY == 0) return [];
    
    let chance = Math.random();
    let newStations = [];
    

    if (chance < this.stationSpawnChance) {
      console.log("Station created");
      newStations.push(this.createStation(idxX, idxY));
    }

    return newStations;
  }

  createStation(x:number, y:number):Planet {

    // let node = new cc.Node('Planet_'+x+"_"+y+"_"+idx);
    let node = cc.instantiate(this.stationBase);
    let planet = node.getComponent(Planet);
    let orbitCenter = new cc.Vec2();

    orbitCenter.x = this.randRange(this.screenW*x, this.screenW*(x+1)) - this.offset.x;
    orbitCenter.y = this.randRange(this.screenH*y, this.screenH*(y+1)) - this.offset.y;
    
    planet.orbitCenter = orbitCenter;

    planet.orbitRadius = this.randRange(this.minStationOrbit, this.maxStationOrbit);
    planet.speedMod = 0.5;

    node.scale = 1;

    node.parent = this.node;

    return planet;
  }

  randRange(min:number, max:number):number {

    return  Math.round(this.randRangef(min, max));

  }

  randRangef(min, max):number {
    return (Math.random() * (max - min)) + min;
  }

}
