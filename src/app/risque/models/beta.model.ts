// import {BaseModel} from "./base.model";


import {BaseModel} from "../../crm/models/base.model";

export interface BetaModel extends BaseModel{
  dateFermeture:Date;
  vl:number;
  nav:number;
  performancePortefeuille:number;
  performanceBenchMark:number;
  volatiliteAnnualiseeOpcvm:number;
  volatiliteAnnualiseeBenchMark:number;
  beta:number;

}
