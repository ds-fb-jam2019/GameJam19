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
export default class GameManager extends cc.Component {

   private _galaxias: number;
   private _planetas: number;
   private _distancia: number;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {
      cc.game.addPersistRootNode(this.node);
    }

    // update (dt) {}

    startGame() {
      this.resetGameValues();
      cc.director.loadScene("Main");
    }

    gameOver() {
      console.log("gameOver");
      cc.director.loadScene("GameOver");
    }

    restartGame() {
      this.resetGameValues();
      cc.director.loadScene("Start");
    }

    resetGameValues() {
      this._galaxias = 0;
      this._planetas = 0;
      this._distancia = 0;
    }

    getRunInfo() {
      return {
        galaxias: this._galaxias,
        planetas: this._planetas,
        distancia: this._distancia
      };
    }


}
