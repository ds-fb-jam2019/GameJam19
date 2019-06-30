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

import {GameManager} from '../Game Manager/GameManager';

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Label)
    planetas: cc.Label = null;

    @property(cc.Label)
    distancia: cc.Label = null;

    @property(cc.Label)
    galaxias: cc.Label = null;

    private _gm;
    private _info;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {
      this._gm = cc.find("GameManager").getComponent("GameManager");
      this.setInfo();
    }

    // update (dt) {}

    setInfo() {
      this._info = this._gm.getRunInfo();
      this.planetas.string = "PLANETAS COLONIZADOS      X"+this._info.planetas;
      this.distancia.string = "DISTANCIA VIAJADA      X"+this._info.distancia;
      this.galaxias.string = "GALÁXIAS FUNDADAS      X"+this._info.galaxias;
    }

    gotoStart() {
      this._gm.restartGame();
    }
}
